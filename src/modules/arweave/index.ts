import Arweave from 'arweave';

export const initArweave  = () => {
  const arweave = Arweave.init({
    host: process.env.NEXT_PUBLIC_ARWEAVE_HOST,
    port: process.env.NEXT_PUBLIC_ARWEAVE_PORT,
    protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL,
    logging: true,
  })

  return arweave
}

export const lookupTransactionsBySubdomain = async (arweave: Arweave, subdomain: string) => {
  const { api } = arweave.getConfig()

  try {
    const response = await fetch(`${api.protocol}://${api.host}:${api.port}/graphql`, 
    { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      query: `
          query GetStorefrontTheme($subdomain: String!) {
            transactions(tags:[{ name: "holaplex:metadata:subdomain", values: [$subdomain]}], sort: HEIGHT_ASC, first: 1) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }
        `,
        variables: {
          subdomain,
        },
      })
    })
    const result = await response.json()
  
    return result.data.transactions.edges
  }catch {
    return []
  }
}