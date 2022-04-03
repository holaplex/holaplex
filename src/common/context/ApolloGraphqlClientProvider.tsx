import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createContext, FC, useContext } from 'react';

const ApolloGraphqlClientContext = createContext<ApolloClient<NormalizedCacheObject>>(null!);

export const ApolloGraphqlClientProvider: FC<{ client: ApolloClient<NormalizedCacheObject> }> = ({
  children,
  client,
}) => (
  <ApolloGraphqlClientContext.Provider value={client}>
    {children}
  </ApolloGraphqlClientContext.Provider>
);

export const useApolloGraphqlClient = () => {
  const client = useContext(ApolloGraphqlClientContext);
  if (!client) {
    throw new Error('useApolloGraphqlClient must be used within a ApolloGraphqlClientProvider');
  }
  return client;
};
