import { Solana } from "@/modules/solana/types";
import { Formatter } from '@/modules/notary/common';
import { notarize, signPhantom, stringifyNotarized, Notarized } from '@/modules/notary';
import { Marketplace } from './types';

type PutMarketplaceParams = Notarized<Marketplace>;

interface MarketplaceResult {
  marketplace: Marketplace;
  txt: string;
}

interface MarketplaceClient {
  uploadManifest: (values: Marketplace, solana: Solana) => Promise<MarketplaceResult>;
};

export const formatMessage: Formatter = (bytes) =>
  `Marketplace: ${bytes.toString('base64')}`;

const MarketplaceSDK = {
  uploadManifest: async (values, solana) => {
    const notarized: PutMarketplaceParams = await notarize(values, signPhantom(solana), {
      format: (bytes) => `Marketplace: ${bytes.toString('base64')}`,
    });

    const putResp = await fetch('/api/marketplaces', {
      method: 'PUT',
      body: stringifyNotarized(notarized),
    });

    if (!putResp.ok) {
      let json;

      try {
        json = await putResp.json();
      } catch {
        json = { message: 'An error occurred' };
      }

      throw new Error(`Store upload failed: ${json.message ?? JSON.stringify(json)}`);
    }

    const result: MarketplaceResult = await putResp.json();

    return result;
  }
} as MarketplaceClient;

export default MarketplaceSDK;