import { ApolloClient, InMemoryCache } from '@apollo/client';

export const indexerGraphqlClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_INDEXER_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export const hasuraGraphqlClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
  cache: new InMemoryCache(),
});
