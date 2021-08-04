import Arweave from 'arweave';
import fetch from 'isomorphic-unfetch'
import { Storefront } from '@/modules/storefront/types'
import { isEmpty, isNil, map, reduce, pipe, addIndex, concat, last, prop, uniqBy, view, lensPath } from 'ramda'

interface StorefrontEdge {
  cursor: string;
  storefront: Storefront | string;
}

interface StorefrontConnection {
  hasNextPage: boolean;
  edges: StorefrontEdge[];
}

interface ArweaveResponseTransformer {
  storefronts: (arweave: Arweave) => Promise<StorefrontConnection>;
  json: () => Promise<any>;
}

interface ArweaveObjectInteraction {
  find: (tag: string, value: string) => Promise<Storefront | null>;
  upsert: (storefront: Storefront) => Promise<Storefront>
  list: (batch?: number, start?: string) => Promise<StorefrontEdge[]>
}

interface ArweaveScope {
  storefront: ArweaveObjectInteraction;
}

const transformer = (response: Response): ArweaveResponseTransformer => {
  return {
    json: response.json,
<<<<<<< HEAD
    storefronts: async () => {
      const { data: { transactions: { pageInfo: { hasNextPage }, edges }}} = await response.json()

=======
    storefronts: async (arweave) => {
      const { data: { transactions: { hasNextPage, edges } } } = await response.json()
>>>>>>> feat: save storefront manifst as json to arweave
      if (isEmpty(edges)) {
        return {
          hasNextPage: false,
          edges: []
        }
      }

      const results = await Promise.all(map(pipe(view(lensPath(['node', 'id'])), (id) => arweave.transactions.getData(id, { decode: true, string: true })), edges))
      return { 
        hasNextPage,
        edges: addIndex(map)((result: any, index: number) => {
          const storefront = JSON.parse(result)
          return {
            cursor: edges[index].cursor,
            storefront
          }
        }, results)
      }

    }
  } as ArweaveResponseTransformer
}


const query = async (arweave: Arweave, query: string, variables: object): Promise<any> => {
  const { api } = arweave.getConfig()

  const response = await fetch(
    `${api.protocol}://${api.host}:${api.port}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      })
    })


  return transformer(response)
}

const using = (arweave: Arweave): ArweaveScope => ({
  storefront: {
    list: async (batch: number = 1000, start: string = "") => {
      let after = start
      let next = true
      let storefronts = [] as StorefrontEdge[]

      while (next) {
        const response = await query(
          arweave,
          `query GetStorefronts($after: String, $first: Int) {
            transactions(tags:[{ name: "Arweave-App", values: ["holaplex"]}], first: $first , after: $after) {
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
          { after, first: batch }
        )

        const { hasNextPage, edges } = await response.storefronts()

        storefronts = concat(storefronts, edges)
        //@ts-ignore
        after = pipe(last, prop('cursor'))(edges)
        next = hasNextPage
      }

      return uniqBy(view(lensPath(['storefront', 'subdomain'])), storefronts)
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
      )

      const { edges } = await response.storefronts(arweave)

      if (isEmpty(edges)) {
        return null
      }

      return edges[0].storefront
    },
    upsert: async (storefront: Storefront): Promise<Storefront> => {
      const transaction = await arweave.createTransaction({ data: JSON.stringify(storefront) })

      transaction.addTag("Content-Type", "application/json")
      transaction.addTag("solana:pubkey", storefront.pubkey)
      transaction.addTag("holaplex:metadata:subdomain", storefront.subdomain)
      transaction.addTag("holaplex:metadata:domain", storefront.domain as string)
      transaction.addTag("Arweave-App", "holaplex")
      transaction.addTag("Holaplex-Version", "0.1")

      await arweave.transactions.sign(transaction)

      await arweave.transactions.post(transaction)

      return storefront
    }
  }
})

export default {
  using,
}
