import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/v0', // TODO: Pull from env var,
  cache: new InMemoryCache(),
});
