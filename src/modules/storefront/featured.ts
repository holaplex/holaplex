import { find, map, prop, compose, pipe, view, lensPath, equals, isNil } from 'ramda';
import { Storefront } from './types';
import { initArweave } from '../arweave';
import arweaveSDK, { StorefrontEdge } from '@/modules/arweave/client';
import featuredStoresStub from './../../../fixtures/featured-storefronts.json';

export interface StorefrontFeature {
  storefront: Storefront;
  metadata: string[];
}

interface StoreFeatureParam {
  subdomain: string;
  metadata: string[];
}

interface FeaturedStoreFinder {
  lookup: (url: string) => Promise<StorefrontFeature[]>;
}
const FeaturedStoreSDK = {
  lookup: async (url) => {
    const featureStorefrontParams = await retrieve(url);
    const featuredStorefronts = await process(featureStorefrontParams);

    return featuredStorefronts;
  },
} as FeaturedStoreFinder;

const retrieve = async (url: string): Promise<StoreFeatureParam[]> => {
  if (isNil(url)) {
    return Promise.resolve(featuredStoresStub);
  }

  const response = await fetch(url);

  const payload = await response.json();

  return payload;
};

const process = async (params: StoreFeatureParam[]): Promise<StorefrontFeature[]> => {
  const arweave = initArweave();
  const ar = arweaveSDK.using(arweave);

  const subdomains = map(prop('subdomain'))(params);
  const storefronts = await ar.storefront.list([
    {
      name: 'holaplex:metadata:subdomain',
      values: subdomains,
    },
  ]);

  return params.map(({ subdomain, metadata }) => {
    const { storefront } = find(
      pipe(view(lensPath(['storefront', 'subdomain'])), equals(subdomain))
    )(storefronts) as StorefrontEdge;

    return {
      storefront,
      metadata,
    };
  });
};

export default FeaturedStoreSDK;
