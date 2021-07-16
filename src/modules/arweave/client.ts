import Arweave from 'arweave';
import queries from './queries'

const query = async (arweave: Arweave, query: string, variables: object):Promise<any> => {
  const { api } = arweave.getConfig()

  const response = await fetch(`${api.protocol}://${api.host}:${api.port}/graphql`,
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
  const result = await response.json()

  return result 
}

export default {
  query,
  queries,
}
