import { sha256 } from 'crypto-hash';
import { JsonString } from '../utils/json';

// Tagged type hack
declare const signature: unique symbol;
export type Signature = Buffer & { readonly [signature]: typeof signature };
export type SignatureStr = string & { readonly [signature]: typeof signature };

export type Formatter = (bytes: Buffer) => string;
export type Signer = (utf8: Buffer) => Promise<Signature>;
export type Verifier<T> = (utf8: Buffer, signature: Signature, payload: T) => Promise<boolean>;

export interface Notarized<T, S extends { [signature]: typeof signature } = Signature> {
  payload: JsonString<T>;
  signature: S;
}
export type NotarizedStr<T> = Notarized<T, SignatureStr>;

export const defaultFormat = (hash: Buffer) =>
  `Your transaction fingerprint is: ${hash.toString('base64')}`;

export const createMessage = async (payloadStr: string, format: Formatter): Promise<Buffer> => {
  const payloadBuf = Buffer.from(payloadStr, 'utf-8');
  const payloadArr = new Uint8Array(
    payloadBuf.buffer.slice(payloadBuf.byteOffset, payloadBuf.byteOffset + payloadBuf.byteLength)
  );
  const bytes = Buffer.from(await sha256(payloadArr, { outputFormat: 'buffer' }));

  return Buffer.from(format(bytes), 'utf-8');
};
