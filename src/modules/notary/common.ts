import { sha256 } from 'crypto-hash';
import { JsonString } from '../utils/json';

// Tagged type hack
declare const signature: unique symbol;
/** A buffer representing an Ed25519 signature */
export type Signature = Buffer & { readonly [signature]: typeof signature };
/** A base64 string representing an Ed25519 signature */
export type SignatureStr = string & { readonly [signature]: typeof signature };

/** Function for formatting bytes of a SHA-256 hash into a message */
export type Formatter = (bytes: Buffer) => string;
/** Function for creating an Ed25519 signature from a byte array */
export type Signer = (utf8: Buffer) => Promise<Signature>;
/** Verifies an Ed25519 signature against a message, possibly using the unverified data */
export type Verifier<T> = (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>;

/** Notarized, verifiable representation of some data and an attached Ed25519 signature */
export interface Notarized<T, S extends { [signature]: typeof signature } = Signature> {
  /** The stringified JSON representation of the data */
  payload: JsonString<T>;
  /** The attached Ed25519 signature to verify the data with */
  signature: S;
}
/** Wire-friendly representation of `Notarized<T>` */
export type NotarizedStr<T> = Notarized<T, SignatureStr>;

/** Default message formatter for notarizing objects */
export const defaultFormat: Formatter = (hash: Buffer) =>
  `Your transaction fingerprint is: ${hash.toString('base64')}`;

/**
 * Format a string for signing.
 * @param payloadStr string representation of the payload JSON
 * @param format formatter for producing a string message
 * @returns a UTF-8 encoded message to be signed
 */
export const createMessage = async (payloadStr: string, format: Formatter): Promise<Buffer> => {
  const payloadBuf = Buffer.from(payloadStr, 'utf-8');

  // This fixes a bug with sha256 and Buffer on the server that produces inconsistent hashes.
  const payloadArr = new Uint8Array(
    payloadBuf.buffer.slice(payloadBuf.byteOffset, payloadBuf.byteOffset + payloadBuf.byteLength)
  );

  const bytes = Buffer.from(await sha256(payloadArr, { outputFormat: 'buffer' }));
  return Buffer.from(format(bytes), 'utf-8');
};
