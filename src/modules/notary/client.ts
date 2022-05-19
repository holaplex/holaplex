import { WalletSignMessageError } from '@solana/wallet-adapter-base';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';
import { JsonString, jsonStringify } from '../utils/json';
import {
  createMessage,
  defaultFormat,
  Formatter,
  Notarized,
  NotarizedStr,
  Signature,
  SignatureStr,
  Signer,
} from './common';

/**
 * Create a signer using the Phantom browser extension.
 * @param solana the Phantom wallet's API
 * @returns a function for signing data with Phantom
 */
export const signPhantom =
  (solana: WalletContextState): Signer =>
  async (utf8) => {
    if (!solana.signMessage) {
      throw new WalletSignMessageError('sign message not supported');
    }

    return (await solana.signMessage(utf8)) as Signature;
  };

/**
 * Create a signer using a known Ed25519 private key.
 * @param secret the secret key to sign with
 * @returns a function for signing data with `secret`
 */
export const signNacl =
  (secret: Uint8Array): Signer =>
  async (utf8) =>
    Buffer.from(nacl.sign.detached(utf8, secret)) as Signature;

/**
 * Notarize an object.
 * @param payload the data to notarize
 * @param sign signer to create an attached signature
 * @param options additional options for notarizing
 * @returns a `Notarized<T>` containing `payload`
 */
export const notarize = async <T>(
  payload: T,
  sign: Signer,
  options?: {
    /** Format function for the message to be signed */
    format?: Formatter;
  }
): Promise<Notarized<T>> => {
  const payloadStr = jsonStringify(payload);
  const msg = await createMessage(payloadStr, options?.format ?? defaultFormat);
  const signature = await sign(msg);

  return { payload: payloadStr, signature };
};

/**
 * Stringify a `Notarized<T>` object.
 * @param notarized the `Notarized<T>` to stringify
 * @returns a concise string representation of the data
 */
export const stringifyNotarized = <T>({
  payload,
  signature,
}: Notarized<T>): JsonString<NotarizedStr<T>> =>
  jsonStringify({ payload, signature: Buffer.from(signature).toString('base64') as SignatureStr });
