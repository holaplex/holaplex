import nacl from 'tweetnacl';
import singletons from '../singletons';
import { SCHEMAS } from '../singletons/json-schemas';
import { ajvParse, ajvValidate, jsonParse, JsonString, Parser, Validator } from '../utils/json';
import { Result } from '../utils/result';
import {
  createMessage,
  defaultFormat,
  Notarized,
  NotarizedStr,
  Signature,
  Verifier,
} from './common';

export const verifyNacl =
  (pubkey: Uint8Array): Verifier<unknown> =>
  async (utf8, sig) =>
    nacl.sign.detached.verify(utf8, sig, pubkey);

export const verifyNaclSelfContained =
  <T>(pubkey: (val: T) => Uint8Array): Verifier<T> =>
  async (utf8, sig, payload) =>
    nacl.sign.detached.verify(utf8, sig, pubkey(payload));

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

  const schemas = singletons.jsonSchemas;
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
