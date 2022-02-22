import ArweaveSDK from '../src/modules/arweave/client';
import singletons from '../src/modules/singletons';
import type { Storefront } from '../src/modules/storefront/types';
import { stylesheet } from '../src/modules/theme';
import fs from 'fs';

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
  const storefrontJSON = JSON.parse(
    fs.readFileSync('./hacks/storefront.json', 'utf-8')
  ) as Storefront;

  console.log('storefront JSON:', storefrontJSON);

  await postArweaveStorefront(storefrontJSON);
})();
