import { GraphQLClient } from 'graphql-request';

export const graphqlRequestClient = new GraphQLClient(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!);
