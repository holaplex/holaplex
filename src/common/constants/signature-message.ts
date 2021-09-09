import { Buffer } from 'buffer';
import { sha256 } from 'crypto-hash';

export const FINGERPRINT_PREFIX = 'Your transaction fingerprint is: ';

export const formatFingerprint = async (payload: Buffer): Promise<Buffer> => {
  // passing a buffer directly results in inconsistent behavior on the server
  const payloadArr = new Uint8Array(
    payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength)
  );
  const bytes = Buffer.from(await sha256(payloadArr, { outputFormat: 'buffer' }));

  return Buffer.from(`${FINGERPRINT_PREFIX}${bytes.toString('base64')}`, 'utf-8');
};
