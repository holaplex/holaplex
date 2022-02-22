import { WalletContextState } from '@solana/wallet-adapter-react';
import { sha256 } from 'crypto-hash';
import { notarize, signPhantom, stringifyNotarized } from '../notary/client';
import { Formatter, Notarized } from '../notary/common';
import { ArweaveFile } from './types';

export const PAYLOAD_FORM_NAME = 'payload';
export const FILE_FORM_NAME = 'file';

export interface ArweaveUploadPayload {
  pubkey: string;
  fileHash: string;
}

export type ArweaveUploadParams = Notarized<ArweaveUploadPayload>;

export type ArweaveUploadResult = ArweaveFile;

export const formatMessage: Formatter = (bytes) =>
  `Your file upload fingerprint is ${bytes.toString('base64')}`;

export const uploadFile = async ({
  solana,
  file,
  onProgress,
  onComplete,
  onError,
}: {
  solana: WalletContextState | undefined;
  file: File;
  onProgress?: (
    status: 'connecting-wallet' | 'signing' | 'uploading' | 'uploaded' | 'failed',
    pct?: number
  ) => void;
  onComplete?: (result: ArweaveUploadResult) => void;
  onError?: (msg: string) => void;
}): Promise<ArweaveUploadResult> => {
  try {
    if (!onProgress) onProgress = () => {};

    if (!solana?.publicKey || !solana) throw new Error('solana wallet not connected');

    onProgress('signing');

    const hash = Buffer.from(await sha256(await file.arrayBuffer(), { outputFormat: 'buffer' }));

    const payload: ArweaveUploadPayload = {
      fileHash: hash.toString('base64'),
      pubkey: solana.publicKey.toBase58(),
    };

    const notarized: ArweaveUploadParams = await notarize(payload, signPhantom(solana), {
      format: formatMessage,
    });

    // TODO: the fetch API does not provide a progress event handler yet
    onProgress('uploading', 0.15);

    const body = new FormData();

    body.append(PAYLOAD_FORM_NAME, stringifyNotarized(notarized));
    body.append(FILE_FORM_NAME, file, file.name);

    const postResp = await fetch('/api/arweave/upload', {
      method: 'POST',
      body,
    });

    if (!postResp.ok) {
      let json;

      try {
        json = await postResp.json();
      } catch {
        json = { message: 'An error occurred' };
      }

      throw new Error(`File upload failed: ${json.message ?? JSON.stringify(json)}`);
    }

    onProgress('uploaded');

    const result: ArweaveFile = await postResp.json();
    if (onComplete) onComplete(result);
    return result;
  } catch (e) {
    if (onProgress) onProgress('failed');
    if (onError && e instanceof Error) onError(e.message);

    throw e;
  }
};
