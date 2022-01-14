import { initArweave } from '@/modules/arweave';
import ArweaveSDK from '@/modules/arweave/client';
import { parseNotarized, unpackNotarized, verifyNaclSelfContained } from '@/modules/notary/server';
import singletons from '@/modules/singletons';
import { SCHEMAS } from '@/modules/singletons/json-schemas';
import { formatMessage } from '@/modules/storefront/put-storefront';
import type { Storefront } from '@/modules/storefront/types';
import { stylesheet } from '@/modules/theme';
import { ApiError } from '@/modules/utils';
import { ajvParse } from '@/modules/utils/json';
import { resultThenAsync } from '@/modules/utils/result';
import { PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';

/** Verify a notarized put request, returning the storefront to upload. */
const verifyPutParams = async (params: any) => {
  const schemas = singletons.jsonSchemas;
  const parseStorefront = ajvParse(schemas.parser(SCHEMAS.storefront));

  const payloadRes = await resultThenAsync(parseNotarized<Storefront>(params), (params) =>
    unpackNotarized(
      params,
      verifyNaclSelfContained((s) => new PublicKey(s.pubkey).toBuffer()),
      { parse: parseStorefront, format: formatMessage }
    )
  );

  if (payloadRes.err !== undefined) {
    throw new ApiError(400, `Invalid request parameters: ${payloadRes.err}`);
  }
  const { ok: storefront } = payloadRes;

  return { storefront };
};

/** Upload a storefront to Arweave. */
const postArweaveStorefront = async (storefront: Storefront) => {
  const { arweave, jwk, address } = await singletons.arweave;
  const arweaveClient = ArweaveSDK.using(arweave);

  const tx = await arweave.createTransaction({ data: stylesheet(storefront.theme) });

  tx.addTag('Content-Type', 'text/css');
  tx.addTag('solana:pubkey', storefront.pubkey);
  tx.addTag('holaplex:metadata:subdomain', storefront.subdomain);
  tx.addTag('holaplex:metadata:favicon:url', storefront.meta.favicon.url);
  tx.addTag('holaplex:metadata:favicon:name', storefront.meta.favicon.name);
  tx.addTag('holaplex:metadata:favicon:type', storefront.meta.favicon.type);
  tx.addTag('holaplex:metadata:page:title', storefront.meta.title);
  tx.addTag('holaplex:metadata:page:description', storefront.meta.description);
  tx.addTag('holaplex:theme:logo:url', storefront.theme.logo.url);
  tx.addTag('holaplex:theme:logo:name', storefront.theme.logo.name);
  tx.addTag('holaplex:theme:logo:type', storefront.theme.logo.type);
  tx.addTag('holaplex:theme:color:primary', storefront.theme.primaryColor);
  tx.addTag('holaplex:theme:color:background', storefront.theme.backgroundColor);
  tx.addTag('holaplex:theme:font:title', storefront.theme.titleFont);
  tx.addTag('holaplex:theme:font:text', storefront.theme.textFont);
  tx.addTag('crossmint:clientId', storefront.integrations?.crossmintClientId);
  tx.addTag('Arweave-App', 'holaplex');

  if (storefront.theme.banner) {
    tx.addTag('holaplex:theme:banner:url', storefront.theme.banner.url);
    tx.addTag('holaplex:theme:banner:name', storefront.theme.banner.name);
    tx.addTag('holaplex:theme:banner:type', storefront.theme.banner.type);
  }

  await arweave.transactions.sign(tx, jwk);

  if (!arweaveClient.wallet.canAfford(address, tx.data.byteLength)) {
    throw new ApiError(400, 'Holaplex account needs more AR');
  }

  const { status } = await arweave.transactions.post(tx);

  if (status < 200 || status >= 300) throw new ApiError(400, 'Arweave transaction failed');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront[] | object>
) {
  try {
    switch (req.method) {
      case 'GET': {
        const arweave = initArweave();
        const storefronts = await ArweaveSDK.using(arweave).storefront.list();

        return res.status(200).json(storefronts);
      }
      case 'PUT': {
        res.setHeader('Connection', 'Keep-Alive');
        res.setHeader('Keep-Alive', `timeout=60`);

        const { storefront } = await verifyPutParams(req.body);
        await postArweaveStorefront(storefront);

        return res.status(200).json({ storefront });
      }
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json(e.json);
    } else {
      console.error(e);

      return res.status(500).end();
    }
  }
}
