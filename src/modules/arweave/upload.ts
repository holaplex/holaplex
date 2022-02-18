import { sha256 } from 'crypto-hash';
import { isNil } from 'ramda';
import { notarize, stringifyNotarized } from '../notary/client';
import { Formatter, Notarized, Signer } from '../notary/common';
import { ArweaveFile } from './types';
import { WalletContextState } from '@solana/wallet-adapter-react';

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
  wallet,
  file,
  onProgress,
  onComplete,
  onError,
}: {
  wallet:
    | Pick<
        WalletContextState,
        | 'signTransaction'
        | 'signMessage'
        | 'signAllTransactions'
        | 'connect'
        | 'connected'
        | 'wallet'
        | 'publicKey'
      >
    | undefined;
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

    if (
      isNil(wallet) ||
      isNil(wallet.wallet?.adapter) ||
      wallet?.wallet?.readyState === 'Unsupported'
    )
      throw new Error('Could not connect to Solana');

    if (!wallet.connected) {
      onProgress('connecting-wallet');
      wallet?.connect();
    }

    onProgress('signing');

    const hash = Buffer.from(await sha256(await file.arrayBuffer(), { outputFormat: 'buffer' }));

    const payload: ArweaveUploadPayload = {
      fileHash: hash.toString('base64'),
      pubkey: wallet.publicKey?.toString() || '',
    };

    const notarized: ArweaveUploadParams = await notarize(payload, wallet.signMessage as Signer, {
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
