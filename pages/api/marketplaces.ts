import ArweaveSDK from '@/modules/arweave/client';
import { Marketplace } from '@/modules/marketplace';
import { SCHEMAS } from '@/modules/singletons/json-schemas';
import { parseNotarized, unpackNotarized, verifyNaclSelfContained } from '@/modules/notary/server';
import singletons from '@/modules/singletons';
import { ApiError } from '@/modules/utils';
import { ajvParse } from '@/modules/utils/json';
import { formatMessage } from '@/modules/marketplace/client';
import { resultThenAsync } from '@/modules/utils/result';
import { PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';

/** Verify a notarized put request, returning the storefront to upload. */
const verifyPutParams = async (params: any) => {
  const schemas = singletons.jsonSchemas;
  const parseMarketplace = ajvParse(schemas.parser(SCHEMAS.marketplace));

  const payloadRes = await resultThenAsync(parseNotarized<Marketplace>(params), (params) =>
    unpackNotarized(
      params,
      verifyNaclSelfContained((s) => new PublicKey(s.address.owner).toBuffer()),
      { parse: parseMarketplace, format: formatMessage }
    )
  );

  if (payloadRes.err !== undefined) {
    throw new ApiError(400, `Invalid request parameters: ${payloadRes.err}`);
  }

  const { ok: marketplace } = payloadRes;

  return { marketplace };
};

/** Upload a marketplace to Arweave. */
const uploadMarketplace = async (marketplace: Marketplace): Promise<string> => {
  const { arweave, jwk, address } = await singletons.arweave;
  const arweaveClient = ArweaveSDK.using(arweave);

  const tx = await arweave.createTransaction({ data: JSON.stringify(marketplace) });

  tx.addTag('Content-Type', 'application/json');
  tx.addTag('address:owner', marketplace.address.owner);
  tx.addTag('address:auctionHouse', marketplace.address.auctionHouse);
  tx.addTag('holaplex:metadata:subdomain', marketplace.subdomain)
  tx.addTag('Arweave-App', 'holaplex-marketplace');
  tx.addTag('Arweave-Version', '0.1.0');

  await arweave.transactions.sign(tx, jwk);

  if (!arweaveClient.wallet.canAfford(address, tx.data.byteLength)) {
    throw new ApiError(400, 'Holaplex account needs more AR');
  }

  const { status } = await arweave.transactions.post(tx);

  if (status < 200 || status >= 300) {
    throw new ApiError(400, 'Arweave transaction failed');
  };

  return tx.id;
};

export interface PutMarketplaceResponse {
  marketplace: Marketplace;
  txt: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PutMarketplaceResponse | object>
) {
  try {
    switch (req.method) {
      case 'PUT': {
        res.setHeader('Connection', 'Keep-Alive');
        res.setHeader('Keep-Alive', `timeout=60`);

        const { marketplace } = await verifyPutParams(req.body);
        const txt = await uploadMarketplace(marketplace);

        return res.status(200).json({ marketplace, txt });
      }
      default:
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status).json(e.json);
    } else {
      console.error(e);

      return res.status(500).end();
    }
  }
}
