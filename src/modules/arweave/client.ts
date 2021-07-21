import Arweave from 'arweave';
import { ArweaveTransaction } from './types';
import { Storefront } from '@/modules/storefront/types'
import { isEmpty, isNil, map, reduce } from 'ramda'


interface ArweaveResponseTransformer {
  storefronts: () => Promise<Storefront[]>;
}

interface ArweaveQuery {
  storefront: (tag: string, value: string) => Promise<Storefront | null>;
}

const transformer = (response: Response): ArweaveResponseTransformer => {
  return {
    storefronts: async () => {
      const json = await response.json()
      
      if (isEmpty(json.data.transactions.edges)) {
        return []
      }

      const storefronts = map(
        (edge: any) => {
          const transaction = edge.node as ArweaveTransaction

          const tags = reduce(
            (acc: any, { name, value }) => {
              acc[name] = value
      
              return acc
            },
            {},
            transaction.tags,
          )

          const storefront = {
            pubkey: tags["solana:pubkey"],
            subdomain: tags["holaplex:metadata:subdomain"],
            theme: {
              primaryColor: tags["holaplex:theme:color:primary"],
              backgroundColor: tags["holaplex:theme:color:background"],
              titleFont: tags["holaplex:theme:font:title"],
              textFont: tags["holaplex:theme:font:text"],
              logo: {
                url: tags["holaplex:theme:logo:url"],
                name: tags["holaplex:theme:logo:name"],
                type: tags["holaplex:theme:logo:type"]
              }
            },
          } as Storefront
      
          return storefront
        },
        json.data.transactions.edges
      ) as Storefront[]

      console.log(storefronts)

      return storefronts

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

const search = (arweave: Arweave): ArweaveQuery => ({
  storefront: async (name: string, value: string): Promise<Storefront | null> => {
    const response = await query(
      arweave,
      `query GetStorefrontByTag($name: String!, $value: String!) {
        transactions(tags:[{ name: $name, values: [$value]}], first: 1) {
          edges {
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

    const storefronts = await response.storefronts()

    if (isEmpty(storefronts)) {
      return null
    }

    return storefronts[0]
  },
})

export default {
  search,
}
