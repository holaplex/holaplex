import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

/**
 * Custom SSR Apollo client.
 * Extracted from: https://github.com/vercel/next.js/blob/canary/examples/api-routes-apollo-server-and-client/apollo/client.js
 */

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = () =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
  });

export const initializeApollo = (initialState: NormalizedCacheObject | null = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export const useApollo = (initialState: NormalizedCacheObject | null = null) => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
