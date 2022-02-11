import ArweaveSDK from '../src/modules/arweave/client';
import singletons from '../src/modules/singletons';
import { ajvParse } from '../src/modules/utils/json';
import { SCHEMAS } from '../src/modules/singletons/json-schemas';
import { resultThenAsync } from '../src/modules/utils/result';
import {
  parseNotarized,
  unpackNotarized,
  verifyNaclSelfContained,
} from '../src/modules/notary/server';
import { PublicKey } from '@solana/web3.js';
import { formatMessage } from '../src/modules/storefront/put-storefront';
import type { Storefront } from '../src/modules/storefront/types';
import { stylesheet } from '../src/modules/theme';
import fs from 'fs';

const storefrontJSON = fs.readFileSync('./hacks/storefront.json', 'utf-8');

console.log('storefront JSON:', storefrontJSON);

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
    throw new Error(`Invalid request parameters: ${payloadRes.err}`);
  }
  const { ok: storefront } = payloadRes;

  return { storefront };
};

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
  tx.addTag('Arweave-App', 'holaplex');

  if (storefront.theme.banner) {
    tx.addTag('holaplex:theme:banner:url', storefront.theme.banner.url);
    tx.addTag('holaplex:theme:banner:name', storefront.theme.banner.name);
    tx.addTag('holaplex:theme:banner:type', storefront.theme.banner.type);
  }

  await arweave.transactions.sign(tx, jwk);

  if (!arweaveClient.wallet.canAfford(address, tx.data.byteLength)) {
    throw new Error('Holaplex account needs more AR');
  }

  const { status } = await arweave.transactions.post(tx);

  if (status < 200 || status >= 300) throw new Error('Arweave transaction failed');
};

(async () => {
  const { storefront } = await verifyPutParams(storefrontJSON);

  await postArweaveStorefront(storefront);

  return storefront;
})();
