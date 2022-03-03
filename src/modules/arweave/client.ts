import Arweave from 'arweave';
import { ArweaveTransaction, AreweaveTagFilter } from './types';
import { Storefront } from '@/modules/storefront/types';
import { isEmpty, reduce, concat, pipe, last, prop, uniqBy, view, lensPath } from 'ramda';

export interface StorefrontEdge {
  cursor: string;
  storefront: Storefront;
}
export interface MarketplaceEdge {
  cursor: string;
}

interface StorefrontConnection {
  hasNextPage: boolean;
  edges: StorefrontEdge[];
}

interface ArweaveResponseTransformer {
  storefronts: () => Promise<StorefrontConnection>;
  json: () => Promise<any>;
}

interface ArweaveObjectInteraction<T, U> {
  find: (tag: string, value: string) => Promise<T | null>;
  upsert: (record: T, css: string) => Promise<T>;
  list: (tags?: AreweaveTagFilter[], batch?: number, start?: string) => Promise<U[]>;
}

interface ArweaveWalletHelpers {
  canAfford: (address: string, bytes: number) => Promise<boolean>;
}

export interface ArweaveScope {
  storefront: ArweaveObjectInteraction<Storefront, StorefrontEdge>;
  wallet: ArweaveWalletHelpers;
}

const transformer = (response: Response): ArweaveResponseTransformer => {
  return {
    json: response.json,
    storefronts: async () => {
      const {
        data: {
          transactions: {
            pageInfo: { hasNextPage },
            edges,
          },
        },
      } = await response.json();

      if (isEmpty(edges)) {
        return {
          hasNextPage: false,
          edges: [],
        };
      }

      const storefronts = reduce(
        (acc: StorefrontEdge[], { cursor, node }: any) => {
          const transaction = node as ArweaveTransaction;

          const tags = reduce(
            (acc: any, { name, value }) => {
              acc[name] = value || null;

              return acc;
            },
            {},
            transaction.tags
          );

          const edge = {
            cursor: cursor,
            storefront: {
              pubkey: tags['solana:pubkey'],
              subdomain: tags['holaplex:metadata:subdomain'],
              theme: {
                primaryColor: tags['holaplex:theme:color:primary'],
                backgroundColor: tags['holaplex:theme:color:background'],
                titleFont: tags['holaplex:theme:font:title'],
                textFont: tags['holaplex:theme:font:text'],
                banner: {
                  url: tags['holaplex:theme:banner:url'] || null,
                  name: tags['holaplex:theme:banner:name'] || null,
                  type: tags['holaplex:theme:banner:type'] || null,
                },
                logo: {
                  url: tags['holaplex:theme:logo:url'],
                  name: tags['holaplex:theme:logo:name'],
                  type: tags['holaplex:theme:logo:type'],
                },
              },
              meta: {
                description: tags['holaplex:metadata:page:description'],
                title: tags['holaplex:metadata:page:title'],
                favicon: {
                  url: tags['holaplex:metadata:favicon:url'],
                  name: tags['holaplex:metadata:favicon:name'],
                  type: tags['holaplex:metadata:favicon:type'],
                },
              },
              integrations: {
                crossmintClientId: tags['crossmint:clientId'] || null,
              },
            },
          };

          if (edge.storefront.subdomain) {
            return [...acc, edge];
          }

          return acc;
        },
        [],
        edges
      );

      return { hasNextPage, edges: storefronts };
    },
  } as ArweaveResponseTransformer;
};

const query = async (arweave: Arweave, query: string, variables: object): Promise<any> => {
  const { api } = arweave.getConfig();

  const response = await fetch(`${api.protocol}://${api.host}:${api.port}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return transformer(response);
};

const using = (arweave: Arweave): ArweaveScope => ({
  wallet: {
    canAfford: async (address: string, bytes: number) => {
      const balance = await arweave.wallets.getBalance(address);

      const cost = await arweave.transactions.getPrice(bytes);

      return arweave.ar.isGreaterThan(balance, cost);
    },
  },
  storefront: {
    list: async (tags = [], batch = 1000, start = '') => {
      let after = start;
      let next = true;
      let storefronts = [] as StorefrontEdge[];

      while (next) {
        const response = await query(
          arweave,
          `query GetStorefronts($after: String, $first: Int, $tags: [TagFilter!]) {
            transactions(tags: $tags, first: $first , after: $after) {
              pageInfo {
                hasNextPage
              }
              edges {
                cursor
                node {
                  id
                  owner {
                    address
                  }
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }`,
          {
            after,
            first: batch,
            tags: [{ name: 'Arweave-App', values: ['holaplex'] }, ...tags],
          }
        );

        const { hasNextPage, edges } = await response.storefronts();

        storefronts = concat(storefronts, edges);
        //@ts-ignore
        after = pipe(last, prop('cursor'))(edges);
        next = hasNextPage;
      }

      return uniqBy(view(lensPath(['storefront', 'pubkey'])), storefronts);
    },
    find: async (name: string, value: string): Promise<Storefront | null> => {
      const response = await query(
        arweave,
        `query GetStorefrontByTag($name: String!, $value: String!) {
          transactions(tags:[{ name: $name, values: [$value]}], first: 1) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                owner {
                  address
                }
                tags {
                  name
                  value
                }
              }
            }
          }
        }`,
        { name, value }
      );

      const { edges } = await response.storefronts();

      if (isEmpty(edges)) {
        return null;
      }

      return edges[0].storefront;
    },
    upsert: async (storefront: Storefront, css: string): Promise<Storefront> => {
      const transaction = await arweave.createTransaction({ data: css });

      transaction.addTag('Content-Type', 'text/css');
      transaction.addTag('solana:pubkey', storefront.pubkey);
      transaction.addTag('holaplex:metadata:subdomain', storefront.subdomain);
      transaction.addTag('holaplex:metadata:favicon:url', storefront.meta.favicon.url);
      transaction.addTag('holaplex:metadata:favicon:name', storefront.meta.favicon.name);
      transaction.addTag('holaplex:metadata:favicon:type', storefront.meta.favicon.type);
      transaction.addTag('holaplex:metadata:page:title', storefront.meta.title);
      transaction.addTag('holaplex:metadata:page:description', storefront.meta.description);
      transaction.addTag('holaplex:theme:logo:url', storefront.theme.logo.url);
      transaction.addTag('holaplex:theme:logo:name', storefront.theme.logo.name);
      transaction.addTag('holaplex:theme:logo:type', storefront.theme.logo.type);
      transaction.addTag('holaplex:theme:color:primary', storefront.theme.primaryColor);
      transaction.addTag('holaplex:theme:color:background', storefront.theme.backgroundColor);
      transaction.addTag('holaplex:theme:font:title', storefront.theme.titleFont);
      transaction.addTag('holaplex:theme:font:text', storefront.theme.textFont);
      transaction.addTag('crossmint:clientId', storefront.integrations.crossmintClientId);
      transaction.addTag('Arweave-App', 'holaplex');

      if (storefront.theme.banner) {
        transaction.addTag('holaplex:theme:banner:url', storefront.theme.banner.url);
        transaction.addTag('holaplex:theme:banner:name', storefront.theme.banner.name);
        transaction.addTag('holaplex:theme:banner:type', storefront.theme.banner.type);
      }

      await arweave.transactions.sign(transaction);

      await arweave.transactions.post(transaction);

      return storefront;
    },
  },
});

const client = {
  using,
};

export default client;
