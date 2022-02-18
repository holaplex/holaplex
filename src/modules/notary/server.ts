import nacl from 'tweetnacl';
import singletons from '../singletons';
import { SCHEMAS } from '../singletons/json-schemas';
import { ajvParse, ajvValidate, jsonParse, JsonString, Parser, Validator } from '../utils/json';
import { Result } from '../utils/result';
import {
  createMessage,
  defaultFormat,
  Formatter,
  Notarized,
  NotarizedStr,
  Signature,
  Verifier,
} from './common';

/**
 * Create a verifier function using an already known public key.
 * @param pubkey the public key to verify the data against
 * @returns a verifier function to check signatures against `pubkey`
 */
export const verifyNacl =
  (pubkey: Uint8Array): Verifier<unknown> =>
  async (utf8, sig) =>
    nacl.sign.detached.verify(utf8, sig, pubkey);

/**
 * Create a verifier function that extracts an embedded public key from the data being verified.
 * @param pubkey function to retrieve the public key from the data to be verified
 * @returns a verifier function to check signatures using `pubkey`
 */
export const verifyNaclSelfContained =
  <T>(pubkey: (val: T) => Uint8Array): Verifier<T> =>
  async (utf8, sig, payload) =>
    {
      return nacl.sign.detached.verify(utf8, sig, pubkey(payload));
    };

/**
 * Unpack and verify the inner value of a `Notarized<T>`.
 * @param notarized the notarized data to unpack
 * @param verify verifier function to check the embedded signature
 * @param options additional options for unpacking
 * @returns the unpacked data, or a verification error
 */
export const unpackNotarized = async <T>(
  notarized: Notarized<T>,
  verify: Verifier<T>,
  options: {
    /**
     * Format function for the message.
     * **NOTE:** Must be the same function used when creating the message.
     */
    format?: Formatter;
  } & (
    | { parse?: undefined; /** Function to validate the parsed JSON with */ validate: Validator<T> }
    | { /** Function to parse and validate the JSON with */ parse: Parser<T> }
  )
): Promise<Result<T>> => {
  const { payload, signature } = notarized;
  const parse = options.parse ?? jsonParse(options.validate);
  const payloadRes = parse(payload);

  console.log(payloadRes);

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

/**
 * Parses and/or validates a serialized representation of `Notarized<T>`.
 * @param val the data to parse
 * @returns a valid `Notarized<T>` object
 */
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
