import { notarize, Notarized, signPhantom, stringifyNotarized } from '../notary';
import { Solana } from '../solana/types';
import { Storefront } from './types';

export type PutStorefrontParams = Notarized<Storefront>;

export interface PutStorefrontResult {
  storefront: Storefront;
}

export const putStorefront = async ({
  solana,
  storefront,
  onProgress,
  onComplete,
  onError,
}: {
  solana: Solana | undefined;
  storefront: Storefront;
  onProgress?: (
    status: 'connecting-wallet' | 'signing' | 'uploading' | 'uploaded' | 'failed'
  ) => void;
  onComplete?: (result: PutStorefrontResult) => void;
  onError?: (msg: string) => void;
}): Promise<PutStorefrontResult> => {
  try {
    if (!onProgress) onProgress = () => {};

    if (!solana) throw new Error('Could not connect to Solana');

    if (!solana.isConnected) {
      onProgress('connecting-wallet');

      await Promise.all([new Promise<void>((ok) => solana.once('connect', ok)), solana.connect()]);
    }

    onProgress('signing');

    const notarized: PutStorefrontParams = await notarize(storefront, signPhantom(solana));

    onProgress('uploading');

    const postResp = await fetch('/api/storefronts', {
      method: 'PUT',
      body: stringifyNotarized(notarized),
    });

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

    const result = { storefront: (await postResp.json()).storefront };
    if (onComplete) onComplete(result);
    return result;
  } catch (e) {
    if (onProgress) onProgress('failed');
    if (onError && e instanceof Error) onError(e.message);

    throw e;
  }
};
