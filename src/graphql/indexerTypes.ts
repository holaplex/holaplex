import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Filter on NFT attributes */
export type AttributeFilter = {
  traitType: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type AttributeGroup = {
  __typename?: 'AttributeGroup';
  name: Scalars['String'];
  variants: Array<AttributeVariant>;
};

export type AttributeVariant = {
  __typename?: 'AttributeVariant';
  count: Scalars['Int'];
  name: Scalars['String'];
};

export type Bid = {
  __typename?: 'Bid';
  bidderAddress: Scalars['String'];
  cancelled: Scalars['Boolean'];
  lastBidTime: Scalars['String'];
  listing?: Maybe<Listing>;
  listingAddress: Scalars['String'];
};

export type Creator = {
  __typename?: 'Creator';
  address: Scalars['String'];
  attributeGroups: Array<AttributeGroup>;
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String'];
  ended: Scalars['Boolean'];
  nfts: Array<Nft>;
  storeOwner: Scalars['String'];
  storefront?: Maybe<Storefront>;
};

export type Nft = {
  __typename?: 'Nft';
  address: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  bannerUrl: Scalars['String'];
  handle: Scalars['String'];
  imageUrl: Scalars['String'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  creator: Creator;
  nft?: Maybe<Nft>;
  nfts: Array<Nft>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  wallet?: Maybe<Wallet>;
};


export type QueryRootCreatorArgs = {
  address: Scalars['String'];
};


export type QueryRootNftArgs = {
  address: Scalars['String'];
};


export type QueryRootNftsArgs = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  creators: Array<Scalars['String']>;
};


export type QueryRootStorefrontArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootWalletArgs = {
  address: Scalars['String'];
};

/** A Metaplex storefront */
export type Storefront = {
  __typename?: 'Storefront';
  bannerUrl: Scalars['String'];
  description: Scalars['String'];
  faviconUrl: Scalars['String'];
  logoUrl: Scalars['String'];
  ownerAddress: Scalars['String'];
  subdomain: Scalars['String'];
  title: Scalars['String'];
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  bids: Array<Bid>;
  profile?: Maybe<Profile>;
};

export type ActivityPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ActivityPageQuery = { __typename?: 'QueryRoot', wallet?: { __typename: 'Wallet', profile?: { __typename: 'Profile', handle: string, imageUrl: string, bannerUrl: string } | null, bids: Array<{ __typename: 'Bid', listingAddress: string, bidderAddress: string, lastBidTime: string, cancelled: boolean, listing?: { __typename?: 'Listing', address: string, storeOwner: string, ended: boolean, storefront?: { __typename: 'Storefront', ownerAddress: string, subdomain: string, title: string, description: string, faviconUrl: string, logoUrl: string, bannerUrl: string } | null, nfts: Array<{ __typename: 'Nft', address: string, name: string, description: string, image: string }> } | null }> } | null };


export const ActivityPageDocument = gql`
    query activityPage($address: String!) {
  wallet(address: $address) {
    __typename
    profile {
      __typename
      handle
      imageUrl
      bannerUrl
    }
    bids {
      __typename
      listingAddress
      bidderAddress
      lastBidTime
      cancelled
      listing {
        address
        storeOwner
        ended
        storefront {
          __typename
          ownerAddress
          subdomain
          title
          description
          faviconUrl
          logoUrl
          bannerUrl
        }
        nfts {
          __typename
          address
          name
          description
          image
        }
      }
    }
  }
}
    `;

/**
 * __useActivityPageQuery__
 *
 * To run a query within a React component, call `useActivityPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityPageQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useActivityPageQuery(baseOptions: Apollo.QueryHookOptions<ActivityPageQuery, ActivityPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActivityPageQuery, ActivityPageQueryVariables>(ActivityPageDocument, options);
      }
export function useActivityPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivityPageQuery, ActivityPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActivityPageQuery, ActivityPageQueryVariables>(ActivityPageDocument, options);
        }
export type ActivityPageQueryHookResult = ReturnType<typeof useActivityPageQuery>;
export type ActivityPageLazyQueryHookResult = ReturnType<typeof useActivityPageLazyQuery>;
export type ActivityPageQueryResult = Apollo.QueryResult<ActivityPageQuery, ActivityPageQueryVariables>;