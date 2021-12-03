// import listingsAndStorefronts from 'fixtures/demo-listings-and-storefronts.json';
import listingsRPC from 'fixtures/listings.json';
import { Listing } from '../components/elements/ListingPreview';

export function generateListingShell(id: string): Listing {
  const now = new Date().toISOString();
  const nextWeek = new Date(now).toISOString();

  return {
    address: id,
    ended: false,
    items: [
      {
        address: '',
        name: '',
        uri: '',
      },
    ],
    created_at: now,
    ends_at: nextWeek,
    subdomain: '',
    storeTitle: '',
  };
}

// const allListings: Listing[] & { [key: string]: any } = listingsAndStorefronts.listings.map(
//   (l) => ({
//     ...l,
//     metadata: [
//       {
//         name: l.title,
//         description: '',
//         uri: l.previewImageURL,
//         creators: [],
//       },
//     ],
//     bids: [],
//     ownerAddress: '',
//   })
// );

const allListings: Listing[] = listingsRPC.result;
const hotListings = allListings.sort((a, b) => {
  if (!a.last_bid || !b.last_bid) return -1;
  return b.last_bid - a.last_bid;
});
// price high - low
// .sort((a, b) => {
//   if (a.ended) return -1;
//   const aPrice = a.price_floor || a.instant_sale_price || 0;
//   const bPrice = b.price_floor || b.instant_sale_price || 0;
//   return aPrice - bPrice;
// });

export const demoFeaturedListings = hotListings.slice(0, 4);
export const demoListings = hotListings.slice(4);

// export const demoStorefronts = listingsAndStorefronts.storefronts;

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
