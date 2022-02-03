import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_INDEXER_RPC_URL, // TODO: Pull from env var,
  cache: new InMemoryCache(),
});
