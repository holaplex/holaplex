import listingsAndStorefronts from 'fixtures/demo-listings-and-storefronts.json';
import { Listing } from '../components/elements/ListingPreview';

export function generateListingShell(id: string): Listing {
  return {
    address: id,
    metadata: [
      {
        name: '',
        description: '',
        creators: [],
        uri: '',
      },
    ],
    storefrontSubdomain: '',
    ownerAddress: '',
    createdAt: new Date().toISOString(),
    bids: [],
  };
}

const allListings: Listing[] & { [key: string]: any } = listingsAndStorefronts.listings.map(
  (l) => ({
    ...l,
    metadata: [
      {
        name: l.title,
        description: '',
        uri: l.previewImageURL,
        creators: [],
      },
    ],
    bids: [],
    ownerAddress: '',
  })
);
export const demoListings = allListings.slice(2);
export const demoFeaturedListings = allListings.slice(0, 2);

export const demoStorefronts = listingsAndStorefronts.storefronts;

export interface DemoStorefront {
  [key: string]: any;
}

const F = {
  name: 'arweave file',
  type: 'f',
  url: '',
};

export const allDemoStorefronts: { [subdomain: string]: DemoStorefront } = {
  kristianeboe: {
    theme: {
      banner: F,
      primaryColor: '#FFF',
      backgroundColor: '#000',
      textFont: 'Lato',
      titleFont: 'Lato',
      logo: F,
    },
    meta: {
      title: 'Non fungible 🍪s',
      description: 'hehehe',
      favicon: F,
    },
    subdomain: 'kristianeboe',
    pubkey: 'NnXxp3aUTbD3bxWnXSR95zsiav54XDAWkespqJP1obh',
  },
};

export const demoStorefrontFeatures = {
  boogle: {
    metadata: [
      'https://bafkreiadugayzqlaxsmnwfhvbfgnebezuhg7wqibdbt3rbf44mxw5f6e6y.ipfs.dweb.link',
      'https://bafkreihuzg4bjl3k4h3idi2rgpzgn6vkt463jexd5kslhuazsdgt4mack4.ipfs.dweb.link',
    ],
    storefront: {
      meta: {
        description:
          'The BOOGLE are a proud faction of ghosts, combining the ancient lore of the Bogle man with the cheeky charm of Casper the friendly ghost.',
        favicon: {
          url: 'https://arweave.net:443/3UGRJwonS4LWicl5RbU9Kqs4a27AA_k0y-98-EoH2G0',
          name: 'logo-holaplex.jpg',
          type: 'image/jpeg',
        },
        title: 'BOOGLE',
      },

      pubkey: 'J2AQypFpiKeDnp8feiVDptnyjcEsb4noPudcjGmnp6XB',
      subdomain: 'boogle',
      theme: {
        backgroundColor: '#2e3c4a',
        banner: {
          name: null,
          type: null,
          url: null,
        },
        logo: {
          name: 'logo-holaplex.jpg',
          type: 'image/jpeg',
          url: 'https://arweave.net:443/4egsFzPXqnX0KlSBFKiNMxB_KZDSSlvdoBTj2MqSY4s',
        },
        primaryColor: '#e3dcdc',
        textFont: 'Roboto',
        titleFont: 'Roboto',
      },
    },
  },
};
