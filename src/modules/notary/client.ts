import { Buffer } from 'buffer';
import nacl from 'tweetnacl';
import { Solana } from '../solana/types';
import { JsonString, jsonStringify } from '../utils/json';
import {
  createMessage,
  defaultFormat,
  Notarized,
  NotarizedStr,
  Signature,
  SignatureStr,
  Signer,
} from './common';

export const signPhantom =
  (solana: Solana): Signer =>
  async (utf8) =>
    (await solana.signMessage(utf8, 'utf-8')).signature as Signature;

export const signNacl =
  (secret: Uint8Array): Signer =>
  async (utf8) =>
    Buffer.from(nacl.sign.detached(utf8, secret)) as Signature;

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
