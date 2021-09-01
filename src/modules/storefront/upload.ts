import { formatFingerprint } from '@/common/constants/signature-message';
import {
  Connection,
  PublicKey, SystemProgram,
  Transaction
} from '@solana/web3.js';
import nacl from 'tweetnacl';
import { Solana } from '../solana/types';
import { AnonStorefront } from './types';

export const PAYLOAD_FORM_NAME = 'payload';
export const SIGNATURE_FORM_NAME = 'signature';
export const LOGO_FORM_NAME = 'logo'
export const FAVICON_FORM_NAME = 'favicon';

export interface UploadPayload {
  depositTransaction: string;
  storefront: AnonStorefront<string>;
  css: string;
  nonce: string;
}

export interface UploadResult {
  depositTransaction: string;
}

export const uploadStorefront = async ({
  solana,
  depositTransaction,
  storefront,
  css,
  logo,
  logoName,
  favicon,
  faviconName,
  onProgress,
  onComplete,
  onError,
}: {
  solana: Solana | undefined;
  depositTransaction?: string;
  storefront: AnonStorefront<string>;
  css: string;
  logo: Blob;
  logoName: string;
  favicon: Blob;
  faviconName: string;
  onProgress?: (
    status:
      | 'connecting-wallet'
      | 'setup'
      | 'creating-deposit'
      | 'sending-deposit'
      | 'confirming-deposit'
      | 'signing'
      | 'uploading'
      | 'uploaded'
      | 'failed'
  ) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (msg: string) => void;
}): Promise<UploadResult> => {
  try {
    if (!onProgress) onProgress = () => {};

    if (!solana) throw new Error('Could not connect to Solana');

    if (!solana.isConnected) {
      onProgress('connecting-wallet');

      await Promise.all([new Promise<void>((ok) => solana.once('connect', ok)), solana.connect()]);
    }

    onProgress('setup');

    const infoResp = await fetch('/api/upload-store', { method: 'GET' });
    if (!infoResp.ok) throw new Error('Could not get upload information');

    const info = await infoResp.json();
    if (!(typeof info === 'object' && info)) throw new Error('Invalid upload information received');

    const { uploadFee, depositKey: depositKeyStr, solanaEndpoint } = info;

    if (
      !(
        typeof uploadFee === 'number' &&
        typeof depositKeyStr === 'string' &&
        typeof solanaEndpoint === 'string'
      )
    )
      throw new Error('Invalid upload information received');

    const depositKey = new PublicKey(depositKeyStr);
    const connection = new Connection(solanaEndpoint);
    const payer = new PublicKey(solana.publicKey);

    if (depositTransaction === undefined) {
      onProgress('creating-deposit');

      const tx = new Transaction();

      tx.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: depositKey,
          lamports: uploadFee,
        })
      );

      tx.feePayer = payer;
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      const signed = await solana.signTransaction(tx);

      onProgress('sending-deposit');

      const signature = await connection.sendRawTransaction(tx.serialize());

      onProgress('confirming-deposit');

      const status = (await connection.confirmTransaction(signature)).value;
      const err = status.err;

      if (err !== null) {
        throw new Error(
          `Deposit transaction failed: ${typeof err === 'string' ? err : JSON.stringify(err)}`
        );
      }

      depositTransaction = signature;
    }

    onProgress('signing');

    const nonceBytes = Buffer.from(nacl.randomBytes(4));
    const payload: UploadPayload = {
      depositTransaction,
      storefront,
      css,
      nonce: nonceBytes.toString('base64'),
    };
    const payloadBuf = Buffer.from(JSON.stringify(payload), 'utf-8');
    const { publicKey, signature } = await solana.signMessage(
      await formatFingerprint(payloadBuf),
      'utf-8'
    );

    onProgress('uploading');

    const body = new FormData();

    body.append(PAYLOAD_FORM_NAME, new Blob([payloadBuf], { type: 'application/json' }));
    body.append(SIGNATURE_FORM_NAME, signature.toString('base64'));
    body.append(LOGO_FORM_NAME, logo, logoName);
    body.append(FAVICON_FORM_NAME, favicon, faviconName);

    const postResp = await fetch('/api/upload-store', { method: 'POST', body });

    if (!postResp.ok) {
      let json;

      try {
        json = await postResp.json();
      } catch {
        json = { message: 'An error occurred' };
      }

      throw new Error(`Store upload failed: ${json.message ?? JSON.stringify(json)}`);
    }

    onProgress('uploaded');

    const result = { depositTransaction };
    if (onComplete) onComplete(result);
    return result;
  } catch (e) {
    if (onProgress) onProgress('failed');
    if (onError && e instanceof Error) onError(e.message);

    throw e;
  }
};
