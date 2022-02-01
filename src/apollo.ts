import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // TODO: Pull from env var,
  cache: new InMemoryCache(),
});
