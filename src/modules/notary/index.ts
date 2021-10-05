import { Buffer } from 'buffer';
import { sha256 } from 'crypto-hash';
import nacl from 'tweetnacl';
import { getJsonSchemas, SCHEMAS } from '../next/plugins/json-schemas';
import { Solana } from '../solana/types';
import {
  ajvParse,
  ajvValidate,
  jsonParse,
  JsonString,
  jsonStringify,
  Parser,
  Validator,
} from '../utils/json';
import { Result } from '../utils/result';

// Tagged type hack
declare const signature: unique symbol;
export type Signature = Buffer & { readonly [signature]: typeof signature };
type SignatureStr = string & { readonly [signature]: typeof signature };

export type Formatter = (bytes: Buffer) => string;
export type Signer = (utf8: Buffer) => Promise<Signature>;
export type Verifier<T> = (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>;

export interface Notarized<T, S extends { [signature]: typeof signature } = Signature> {
  payload: JsonString<T>;
  signature: S;
}
export type NotarizedStr<T> = Notarized<T, SignatureStr>;

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

export const stringifyNotarized = <T>({
  payload,
  signature,
}: Notarized<T>): JsonString<NotarizedStr<T>> =>
  jsonStringify({ payload, signature: signature.toString('base64') as SignatureStr });

export const unpackNotarized = async <T>(
  notarized: Notarized<T>,
  verify: (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>,
  options: {
    format?: (bytes: Buffer) => string;
  } & ({ parse?: undefined; validate: Validator<T> } | { parse: Parser<T> })
): Promise<Result<T>> => {
  const { payload, signature } = notarized;
  const parse = options.parse ?? jsonParse(options.validate);
  const payloadRes = parse(payload);

  if (payloadRes.err !== undefined) return payloadRes;
  const { ok: payloadDec } = payloadRes;

  const msg = await createMessage(payload, options.format ?? defaultFormat);

  let verified: boolean;
  try {
    verified = await verify(msg, signature, payloadDec);
  } catch (e) {
    return { err: e instanceof Error ? e.message : 'Verifier failed' };
  }

  return verified ? payloadRes : { err: 'Verification failed' };
};

export const parseNotarized = <T>(
  val: JsonString<NotarizedStr<T>> | object
): Result<Notarized<T>> => {
  if (!val && typeof val !== 'string') return { err: 'Invalid input type' };

  const schemas = getJsonSchemas();
  const validate = ajvValidate(schemas.validator(SCHEMAS.notarized));
  const parse = ajvParse(schemas.parser(SCHEMAS.notarized));
  const res: Result<NotarizedStr<unknown>> = typeof val === 'string' ? parse(val) : validate(val);

  if (res.err !== undefined) return res;
  const {
    ok: { payload, signature },
  } = res;

  return {
    ok: {
      payload: payload as JsonString<T>,
      signature: Buffer.from(signature, 'base64') as Signature,
    },
  };
};
