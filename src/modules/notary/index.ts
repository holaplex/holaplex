import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { Buffer } from 'buffer';
import { sha256 } from 'crypto-hash';
import { any } from 'ramda';
import nacl from 'tweetnacl';
import { Solana } from '../solana/types';

// Tagged type hack
declare const jsonStr: unique symbol;
declare const signature: unique symbol;
export type JsonString<T> = string & { readonly [jsonStr]: T };
export type Signature = Buffer & { readonly [signature]: unique symbol };

export type Validator<T> = (val: any) => val is T;
export type Parser<T> = (str: JsonString<T>) => T | undefined;
export type Formatter = (bytes: Buffer) => string;
export type Signer = (utf8: Buffer) => Promise<Signature>;
export type Verifier<T> = (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>;

export const jsonStringify = <T>(value: T): JsonString<T> => JSON.stringify(value) as JsonString<T>;

export const jsonParse =
  <T>(validate: Validator<T>): Parser<T> =>
  (string: JsonString<T>) => {
    const ret = JSON.parse(string);

    if (validate(ret)) return ret;

    return undefined;
  };

export interface Notarized<T> {
  payload: JsonString<T>;
  signature: Signature;
}

const defaultFormat = (hash: Buffer) =>
  `Your transaction fingerprint is: ${hash.toString('base64')}`;

const createMessage = async (payloadStr: string, format: Formatter): Promise<Buffer> => {
  const payloadBuf = Buffer.from(payloadStr, 'utf-8');
  const payloadArr = new Uint8Array(
    payloadBuf.buffer.slice(payloadBuf.byteOffset, payloadBuf.byteOffset + payloadBuf.byteLength)
  );
  const bytes = Buffer.from(await sha256(payloadArr, { outputFormat: 'buffer' }));

  return Buffer.from(format(bytes), 'utf-8');
};

export const signPhantom =
  (solana: Solana): Signer =>
  async (utf8) =>
    (await solana.signMessage(utf8, 'utf-8')).signature as Signature;

export const signNacl =
  (secret: Uint8Array): Signer =>
  async (utf8) =>
    Buffer.from(nacl.sign.detached(utf8, secret)) as Signature;

export const verifyNacl =
  (pubkey: Uint8Array): Verifier<unknown> =>
  async (utf8, sig) =>
    nacl.sign.detached.verify(utf8, sig, pubkey);

export const verifyNaclSelfContained =
  <T>(pubkey: (val: T) => Uint8Array): Verifier<T> =>
  async (utf8, sig, payload) =>
    nacl.sign.detached.verify(utf8, sig, pubkey(payload));

// TODO: nonce
const nonceBytes = Buffer.from(nacl.randomBytes(4));

export const notarize = async <T>(
  payload: T,
  sign: (utf8: Buffer) => Promise<Signature>,
  options?: {
    format?: (bytes: Buffer) => string;
  }
): Promise<Notarized<T>> => {
  const payloadStr = jsonStringify(payload);
  const msg = await createMessage(payloadStr, options?.format ?? defaultFormat);
  const signature = await sign(msg);

  return { payload: payloadStr, signature };
};

export const unpackNotarized = async <T>(
  notarized: Notarized<T> | undefined,
  verify: (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>,
  options: {
    format?: (bytes: Buffer) => string;
  } & ({ parse?: undefined; validate: Validator<T> } | { parse: Parser<T> })
): Promise<T | undefined> => {
  // For easy composability with parseNotarized
  if (notarized === undefined) return undefined;

  const { payload, signature } = notarized;
  const parse = options?.parse ?? jsonParse(options.validate);
  const payloadDec = parse(payload);

  if (payloadDec === undefined) return undefined;

  const msg = await createMessage(payload, options?.format ?? defaultFormat);

  try {
    if (!(await verify(msg, signature, payloadDec))) return undefined;
  } catch (e) {
    // TODO: remove
    console.warn('Notarized verification failed: ', e);
    return undefined;
  }

  return payloadDec;
};

const SCHEMA = (() => {
  const ajv = new Ajv();

  const schema: JTDSchemaType<Notarized<unknown>> = {
    properties: {
      payload: { type: 'string' } as unknown as JTDSchemaType<JsonString<unknown>>,
      signature: { type: 'string' } as unknown as JTDSchemaType<Signature>,
    },
    additionalProperties: true,
  };

  return { validate: ajv.compile(schema), parse: ajv.compileParser(schema) };
})();

export const parseNotarized = <T>(val: any): Notarized<T> | undefined => {
  const { validate, parse } = SCHEMA;
  const notarized: Notarized<unknown> | undefined = validate(val) ? val : parse(val);

  if (notarized === undefined) return undefined;

  return val as Notarized<T>;
};
