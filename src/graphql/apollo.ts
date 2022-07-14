import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { asBN } from '../modules/utils';

export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_INDEXER_GRAPHQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Offer: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      AhListing: {
        keyFields: ['id'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      BidReceipt: {
        keyFields: ['address'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      ListingReceipt: {
        keyFields: ['address'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
      NftActivity: {
        keyFields: ['address'],
        fields: {
          price: {
            read: asBN,
          },
        },
      },
    },
  }),
});
