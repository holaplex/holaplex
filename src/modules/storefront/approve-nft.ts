import { PublicKey } from '@solana/web3.js';

export interface ApproveNFTParams {
  metadata: string;
  metaProgramId: string;
}

export const approveNFT = async ({
  metadata,
  metaProgramId,
  onProgress,
  onComplete,
  onError,
}: {
  metadata: PublicKey;
  metaProgramId: PublicKey;
  onProgress?: (status: 'setup' | 'approving' | 'approved' | 'failed') => void;
  onComplete?: () => void;
  onError?: (msg: string) => void;
}) => {
  try {
    if (!onProgress) onProgress = () => {};

    onProgress('setup');

    const params: ApproveNFTParams = {
      metadata: metadata.toBase58(),
      metaProgramId: metaProgramId.toBase58(),
    };

    onProgress('approving');

    const resp = await fetch('/api/approve-nft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!resp.ok) {
      let json;

      try {
        json = await resp.json();
      } catch {
        json = { message: 'An error occurred' };
      }

      throw new Error(`Store upload failed: ${json.message ?? JSON.stringify(json)}`);
    }

    onProgress('approved');

    if (onComplete) onComplete();
  } catch (e) {
    if (onProgress) onProgress('failed');
    if (onError && e instanceof Error) onError(e.message);

    throw e;
  }
};
