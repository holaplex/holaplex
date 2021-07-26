import Arweave from 'arweave';
import { ArweaveTransaction } from './types';
import { Storefront } from '@/modules/storefront/types'
import { isEmpty, isNil, map, reduce } from 'ramda'


interface ArweaveResponseTransformer {
  storefronts: () => Promise<Storefront[]>;
}

interface ArweaveObjectInteraction {
  find: (tag: string, value: string) => Promise<Storefront | null>;
  upsert: (storefront: Storefront, css: string) => Promise<Storefront>
}

interface ArweaveScope {
  storefront: ArweaveObjectInteraction;
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
            meta: {
              description: tags["holaplex:metadata:page:description"],
              title: tags["holaplex:metadata:page:title"],
              favicon: {
                url: tags["holaplex:metadata:favicon:url"],
                name: tags["holaplex:metadata:favicon:name"],
                type: tags["holaplex:metadata:favicon:type"]
              }
            }
          } as Storefront

          return storefront
        },
        json.data.transactions.edges
      ) as Storefront[]

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

const using = (arweave: Arweave): ArweaveScope => ({
  storefront: {
    find: async (name: string, value: string): Promise<Storefront | null> => {
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
    upsert: async (storefront: Storefront, css: string): Promise<Storefront> => {
      const transaction = await arweave.createTransaction({ data: css })
  
      transaction.addTag("Content-Type", "text/css")
      transaction.addTag("solana:pubkey", storefront.pubkey)
      transaction.addTag("holaplex:metadata:subdomain", storefront.subdomain)
      transaction.addTag("holaplex:metadata:favicon:url", storefront.meta.favicon.url)
      transaction.addTag("holaplex:metadata:favicon:name", storefront.meta.favicon.name)
      transaction.addTag("holaplex:metadata:favicon:type", storefront.meta.favicon.type)
      transaction.addTag("holaplex:metadata:page:title", storefront.meta.title)
      transaction.addTag("holaplex:metadata:page:description", storefront.meta.description)
      transaction.addTag("holaplex:theme:logo:url", storefront.theme.logo.url)
      transaction.addTag("holaplex:theme:logo:name", storefront.theme.logo.name)
      transaction.addTag("holaplex:theme:logo:type", storefront.theme.logo.type)
      transaction.addTag("holaplex:theme:color:primary", storefront.theme.primaryColor)
      transaction.addTag("holaplex:theme:color:background", storefront.theme.backgroundColor)
      transaction.addTag("holaplex:theme:font:title", storefront.theme.titleFont)
      transaction.addTag("holaplex:theme:font:text", storefront.theme.textFont)
      transaction.addTag("Arweave-App", "holaplex")
  
      await arweave.transactions.sign(transaction)
  
      await arweave.transactions.post(transaction)

      return storefront
    }
  }
})

export default {
  using,
}
