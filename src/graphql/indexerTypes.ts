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
  /** DateTime */
  DateTimeUtc: any;
  /** Lamports */
  Lamports: any;
  /** PublicKey */
  PublicKey: any;
  /** Volume */
  Volume: any;
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

export type AuctionHouse = {
  __typename?: 'AuctionHouse';
  address: Scalars['String'];
  auctionHouseFeeAccount: Scalars['String'];
  auctionHouseTreasury: Scalars['String'];
  authority: Scalars['String'];
  bump: Scalars['Int'];
  canChangeSalePrice: Scalars['Boolean'];
  creator: Scalars['String'];
  feePayerBump: Scalars['Int'];
  feeWithdrawalDestination: Scalars['String'];
  requiresSignOff: Scalars['Boolean'];
  sellerFeeBasisPoints: Scalars['Int'];
  stats?: Maybe<MintStats>;
  treasuryBump: Scalars['Int'];
  treasuryMint: Scalars['String'];
  treasuryWithdrawalDestination: Scalars['String'];
};

export type Bid = {
  __typename?: 'Bid';
  bidderAddress: Scalars['String'];
  cancelled: Scalars['Boolean'];
  lastBidAmount: Scalars['Lamports'];
  lastBidTime: Scalars['String'];
  listing?: Maybe<Listing>;
  listingAddress: Scalars['String'];
};

/** auction house bid receipt */
export type BidReceipt = {
  __typename?: 'BidReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  buyer: Scalars['String'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  tokenAccount?: Maybe<Scalars['String']>;
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type ConnectionCounts = {
  __typename?: 'ConnectionCounts';
  fromCount: Scalars['Int'];
  toCount: Scalars['Int'];
};

export type Creator = {
  __typename?: 'Creator';
  address: Scalars['String'];
  attributeGroups: Array<AttributeGroup>;
  counts: CreatorCounts;
  profile?: Maybe<TwitterProfile>;
  stats: Array<MintStats>;
};


export type CreatorStatsArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
};

export type CreatorCounts = {
  __typename?: 'CreatorCounts';
  creations: Scalars['Int'];
};

export type Denylist = {
  __typename?: 'Denylist';
  listings: Array<Scalars['PublicKey']>;
  storefronts: Array<Scalars['PublicKey']>;
};

export type GraphConnection = {
  __typename?: 'GraphConnection';
  address: Scalars['String'];
  from: Wallet;
  to: Wallet;
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String'];
  bids: Array<Bid>;
  cacheAddress: Scalars['String'];
  ended: Scalars['Boolean'];
  endsAt?: Maybe<Scalars['DateTimeUtc']>;
  extAddress: Scalars['String'];
  nfts: Array<Nft>;
  storeAddress: Scalars['String'];
  storefront?: Maybe<Storefront>;
};

/** An NFT listing receipt */
export type ListingReceipt = {
  __typename?: 'ListingReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  bookkeeper: Scalars['String'];
  bump: Scalars['Int'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  purchaseReceipt?: Maybe<Scalars['String']>;
  seller: Scalars['String'];
  tokenSize: Scalars['Int'];
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type MarketStats = {
  __typename?: 'MarketStats';
  nfts?: Maybe<Scalars['Volume']>;
};

export type Marketplace = {
  __typename?: 'Marketplace';
  auctionHouse?: Maybe<AuctionHouse>;
  auctionHouseAddress: Scalars['String'];
  bannerUrl: Scalars['String'];
  configAddress: Scalars['String'];
  creators: Array<StoreCreator>;
  description: Scalars['String'];
  logoUrl: Scalars['String'];
  name: Scalars['String'];
  ownerAddress: Scalars['String'];
  stats?: Maybe<MarketStats>;
  storeAddress?: Maybe<Scalars['String']>;
  subdomain: Scalars['String'];
};

export type MintStats = {
  __typename?: 'MintStats';
  auctionHouse: Scalars['String'];
  average?: Maybe<Scalars['Volume']>;
  floor?: Maybe<Scalars['Volume']>;
  mint: Scalars['String'];
  volume24hr?: Maybe<Scalars['Volume']>;
};

export type Nft = {
  __typename?: 'Nft';
  activities: Array<NftActivity>;
  address: Scalars['String'];
  attributes: Array<NftAttribute>;
  creators: Array<NftCreator>;
  description: Scalars['String'];
  image: Scalars['String'];
  listings: Array<ListingReceipt>;
  mintAddress: Scalars['String'];
  name: Scalars['String'];
  offers: Array<BidReceipt>;
  owner?: Maybe<NftOwner>;
  primarySaleHappened: Scalars['Boolean'];
  purchases: Array<PurchaseReceipt>;
  sellerFeeBasisPoints: Scalars['Int'];
};


export type NftImageArgs = {
  width?: InputMaybe<Scalars['Int']>;
};

export type NftActivity = {
  __typename?: 'NftActivity';
  activityType: Scalars['String'];
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  wallets: Array<Scalars['String']>;
};

export type NftAttribute = {
  __typename?: 'NftAttribute';
  metadataAddress: Scalars['String'];
  traitType: Scalars['String'];
  value: Scalars['String'];
};

export type NftCount = {
  __typename?: 'NftCount';
  listed: Scalars['Int'];
  total: Scalars['Int'];
};


export type NftCountListedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type NftCreator = {
  __typename?: 'NftCreator';
  address: Scalars['String'];
  metadataAddress: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  profile?: Maybe<TwitterProfile>;
  share: Scalars['Int'];
  twitterHandle?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
};

export type NftOwner = {
  __typename?: 'NftOwner';
  address: Scalars['String'];
  associatedTokenAccountAddress: Scalars['String'];
  profile?: Maybe<TwitterProfile>;
  twitterHandle?: Maybe<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  bannerImageUrl: Scalars['String'];
  handle: Scalars['String'];
  profileImageUrlHighres: Scalars['String'];
  profileImageUrlLowres: Scalars['String'];
  walletAddress?: Maybe<Scalars['String']>;
};

/** auction house bid receipt */
export type PurchaseReceipt = {
  __typename?: 'PurchaseReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  buyer: Scalars['String'];
  createdAt: Scalars['DateTimeUtc'];
  price: Scalars['Lamports'];
  seller: Scalars['String'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  connections: Array<GraphConnection>;
  creator: Creator;
  denylist: Denylist;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  nft?: Maybe<Nft>;
  nftCounts: NftCount;
  nfts: Array<Nft>;
  profile?: Maybe<Profile>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  wallet: Wallet;
};


export type QueryRootConnectionsArgs = {
  from?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  to?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootCreatorArgs = {
  address: Scalars['String'];
};


export type QueryRootMarketplaceArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootNftArgs = {
  address: Scalars['String'];
};


export type QueryRootNftCountsArgs = {
  creators: Array<Scalars['PublicKey']>;
};


export type QueryRootNftsArgs = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  listed?: InputMaybe<Array<Scalars['PublicKey']>>;
  offerers?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootProfileArgs = {
  handle: Scalars['String'];
};


export type QueryRootStorefrontArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootWalletArgs = {
  address: Scalars['PublicKey'];
};

export type StoreCreator = {
  __typename?: 'StoreCreator';
  creatorAddress: Scalars['String'];
  preview: Array<Nft>;
  storeConfigAddress: Scalars['String'];
};

/** A Metaplex storefront */
export type Storefront = {
  __typename?: 'Storefront';
  address: Scalars['String'];
  bannerUrl: Scalars['String'];
  description: Scalars['String'];
  faviconUrl: Scalars['String'];
  logoUrl: Scalars['String'];
  ownerAddress: Scalars['String'];
  subdomain: Scalars['String'];
  title: Scalars['String'];
};

export type TwitterProfile = {
  __typename?: 'TwitterProfile';
  bannerImageUrl: Scalars['String'];
  description: Scalars['String'];
  handle: Scalars['String'];
  profileImageUrl: Scalars['String'];
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['PublicKey'];
  bids: Array<Bid>;
  connectionCounts: ConnectionCounts;
  nftCounts: WalletNftCount;
  profile?: Maybe<TwitterProfile>;
};


export type WalletNftCountsArgs = {
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type WalletNftCount = {
  __typename?: 'WalletNftCount';
  listed: Scalars['Int'];
  offered: Scalars['Int'];
  owned: Scalars['Int'];
};


export type WalletNftCountListedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type WalletNftCountOfferedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type ActivityPageQueryVariables = Exact<{
  address: Scalars['PublicKey'];
}>;


export type ActivityPageQuery = { __typename?: 'QueryRoot', wallet: { __typename: 'Wallet', address: any, bids: Array<{ __typename: 'Bid', listingAddress: string, bidderAddress: string, lastBidTime: string, lastBidAmount: any, cancelled: boolean, listing?: { __typename?: 'Listing', address: string, ended: boolean, storefront?: { __typename: 'Storefront', ownerAddress: string, subdomain: string, title: string, description: string, faviconUrl: string, logoUrl: string, bannerUrl: string } | null, nfts: Array<{ __typename: 'Nft', address: string, name: string, description: string, image: string }>, bids: Array<{ __typename?: 'Bid', bidderAddress: string, lastBidTime: string, lastBidAmount: any, cancelled: boolean, listingAddress: string }> } | null }> } };

export type OwnedNfTsQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type OwnedNfTsQuery = { __typename?: 'QueryRoot', nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number }> }> };

export type WalletProfileQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type WalletProfileQuery = { __typename?: 'QueryRoot', profile?: { __typename?: 'Profile', handle: string, profileImageUrlLowres: string, profileImageUrlHighres: string, bannerImageUrl: string } | null };

export type NftMarketplaceQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;


export type NftMarketplaceQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null, nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, attributes: Array<{ __typename?: 'NftAttribute', metadataAddress: string, value: string, traitType: string }>, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: string, auctionHouse: string, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null };

export type NftPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type NftPageQuery = { __typename?: 'QueryRoot', nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, attributes: Array<{ __typename?: 'NftAttribute', metadataAddress: string, value: string, traitType: string }>, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: string, auctionHouse: string, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null };

export type ConnectionNodeFragment = { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null };

export type AllConnectionsFromQueryVariables = Exact<{
  from: Scalars['PublicKey'];
}>;


export type AllConnectionsFromQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', to: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null } }> };

export type AllConnectionsToQueryVariables = Exact<{
  to: Scalars['PublicKey'];
}>;


export type AllConnectionsToQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null } }> };

export type GetProfileFollowerOverviewQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;


export type GetProfileFollowerOverviewQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', connectionCounts: { __typename?: 'ConnectionCounts', fromCount: number, toCount: number } }, connections: Array<{ __typename?: 'GraphConnection', from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string, bannerImageUrl: string } | null } }> };

export type GetProfileInfoFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;


export type GetProfileInfoFromPubKeyQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string, bannerImageUrl: string } | null } };

export type GetProfileInfoFromTwitterHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetProfileInfoFromTwitterHandleQuery = { __typename?: 'QueryRoot', profile?: { __typename?: 'Profile', walletAddress?: string | null, handle: string, profileImageUrl: string, bannerImageUrl: string } | null };

export type IsXFollowingYQueryVariables = Exact<{
  xPubKey: Scalars['PublicKey'];
  yPubKey: Scalars['PublicKey'];
}>;


export type IsXFollowingYQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', address: string }> };

export const ConnectionNodeFragmentDoc = gql`
    fragment ConnectionNode on Wallet {
  address
  profile {
    handle
    profileImageUrl
  }
}
    `;
export const ActivityPageDocument = gql`
    query activityPage($address: PublicKey!) {
  wallet(address: $address) {
    __typename
    address
    bids {
      __typename
      listingAddress
      bidderAddress
      lastBidTime
      lastBidAmount
      cancelled
      listing {
        address
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
        bids {
          bidderAddress
          lastBidTime
          lastBidAmount
          cancelled
          listingAddress
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
export const OwnedNfTsDocument = gql`
    query ownedNFTs($address: PublicKey!, $limit: Int!, $offset: Int!) {
  nfts(owners: [$address], limit: $limit, offset: $offset) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    image
    primarySaleHappened
    creators {
      address
      share
    }
  }
}
    `;

/**
 * __useOwnedNfTsQuery__
 *
 * To run a query within a React component, call `useOwnedNfTsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOwnedNfTsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOwnedNfTsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useOwnedNfTsQuery(baseOptions: Apollo.QueryHookOptions<OwnedNfTsQuery, OwnedNfTsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OwnedNfTsQuery, OwnedNfTsQueryVariables>(OwnedNfTsDocument, options);
      }
export function useOwnedNfTsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OwnedNfTsQuery, OwnedNfTsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OwnedNfTsQuery, OwnedNfTsQueryVariables>(OwnedNfTsDocument, options);
        }
export type OwnedNfTsQueryHookResult = ReturnType<typeof useOwnedNfTsQuery>;
export type OwnedNfTsLazyQueryHookResult = ReturnType<typeof useOwnedNfTsLazyQuery>;
export type OwnedNfTsQueryResult = Apollo.QueryResult<OwnedNfTsQuery, OwnedNfTsQueryVariables>;
export const WalletProfileDocument = gql`
    query walletProfile($handle: String!) {
  profile(handle: $handle) {
    handle
    profileImageUrlLowres
    profileImageUrlHighres
    bannerImageUrl
  }
}
    `;

/**
 * __useWalletProfileQuery__
 *
 * To run a query within a React component, call `useWalletProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalletProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalletProfileQuery({
 *   variables: {
 *      handle: // value for 'handle'
 *   },
 * });
 */
export function useWalletProfileQuery(baseOptions: Apollo.QueryHookOptions<WalletProfileQuery, WalletProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WalletProfileQuery, WalletProfileQueryVariables>(WalletProfileDocument, options);
      }
export function useWalletProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalletProfileQuery, WalletProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WalletProfileQuery, WalletProfileQueryVariables>(WalletProfileDocument, options);
        }
export type WalletProfileQueryHookResult = ReturnType<typeof useWalletProfileQuery>;
export type WalletProfileLazyQueryHookResult = ReturnType<typeof useWalletProfileLazyQuery>;
export type WalletProfileQueryResult = Apollo.QueryResult<WalletProfileQuery, WalletProfileQueryVariables>;
export const NftMarketplaceDocument = gql`
    query nftMarketplace($subdomain: String!, $address: String!) {
  marketplace(subdomain: $subdomain) {
    subdomain
    name
    description
    logoUrl
    bannerUrl
    ownerAddress
    creators {
      creatorAddress
      storeConfigAddress
    }
    auctionHouse {
      address
      treasuryMint
      auctionHouseTreasury
      treasuryWithdrawalDestination
      feeWithdrawalDestination
      authority
      creator
      auctionHouseFeeAccount
      bump
      treasuryBump
      feePayerBump
      sellerFeeBasisPoints
      requiresSignOff
      canChangeSalePrice
    }
  }
  nft(address: $address) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    image
    primarySaleHappened
    attributes {
      metadataAddress
      value
      traitType
    }
    creators {
      address
      verified
    }
    owner {
      address
      associatedTokenAccountAddress
    }
    purchases {
      address
      buyer
      auctionHouse
      price
      createdAt
    }
    listings {
      address
      tradeState
      seller
      metadata
      auctionHouse
      price
      tradeStateBump
      createdAt
      canceledAt
    }
    offers {
      address
      tradeState
      buyer
      metadata
      auctionHouse
      price
      tradeStateBump
      tokenAccount
      createdAt
      canceledAt
    }
  }
}
    `;

/**
 * __useNftMarketplaceQuery__
 *
 * To run a query within a React component, call `useNftMarketplaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftMarketplaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftMarketplaceQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useNftMarketplaceQuery(baseOptions: Apollo.QueryHookOptions<NftMarketplaceQuery, NftMarketplaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftMarketplaceQuery, NftMarketplaceQueryVariables>(NftMarketplaceDocument, options);
      }
export function useNftMarketplaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftMarketplaceQuery, NftMarketplaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftMarketplaceQuery, NftMarketplaceQueryVariables>(NftMarketplaceDocument, options);
        }
export type NftMarketplaceQueryHookResult = ReturnType<typeof useNftMarketplaceQuery>;
export type NftMarketplaceLazyQueryHookResult = ReturnType<typeof useNftMarketplaceLazyQuery>;
export type NftMarketplaceQueryResult = Apollo.QueryResult<NftMarketplaceQuery, NftMarketplaceQueryVariables>;
export const NftPageDocument = gql`
    query nftPage($address: String!) {
  nft(address: $address) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    image
    primarySaleHappened
    attributes {
      metadataAddress
      value
      traitType
    }
    creators {
      address
      verified
    }
    owner {
      address
    }
    purchases {
      address
      buyer
      auctionHouse
      price
      createdAt
    }
    listings {
      address
      tradeState
      seller
      metadata
      auctionHouse
      price
      tradeStateBump
      createdAt
      canceledAt
    }
    offers {
      address
      tradeState
      buyer
      metadata
      auctionHouse
      price
      tradeStateBump
      tokenAccount
      createdAt
      canceledAt
    }
  }
}
    `;

/**
 * __useNftPageQuery__
 *
 * To run a query within a React component, call `useNftPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftPageQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useNftPageQuery(baseOptions: Apollo.QueryHookOptions<NftPageQuery, NftPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftPageQuery, NftPageQueryVariables>(NftPageDocument, options);
      }
export function useNftPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftPageQuery, NftPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftPageQuery, NftPageQueryVariables>(NftPageDocument, options);
        }
export type NftPageQueryHookResult = ReturnType<typeof useNftPageQuery>;
export type NftPageLazyQueryHookResult = ReturnType<typeof useNftPageLazyQuery>;
export type NftPageQueryResult = Apollo.QueryResult<NftPageQuery, NftPageQueryVariables>;
export const AllConnectionsFromDocument = gql`
    query allConnectionsFrom($from: PublicKey!) {
  connections(from: [$from], limit: 1000, offset: 0) {
    to {
      ...ConnectionNode
    }
  }
}
    ${ConnectionNodeFragmentDoc}`;

/**
 * __useAllConnectionsFromQuery__
 *
 * To run a query within a React component, call `useAllConnectionsFromQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllConnectionsFromQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllConnectionsFromQuery({
 *   variables: {
 *      from: // value for 'from'
 *   },
 * });
 */
export function useAllConnectionsFromQuery(baseOptions: Apollo.QueryHookOptions<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>(AllConnectionsFromDocument, options);
      }
export function useAllConnectionsFromLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>(AllConnectionsFromDocument, options);
        }
export type AllConnectionsFromQueryHookResult = ReturnType<typeof useAllConnectionsFromQuery>;
export type AllConnectionsFromLazyQueryHookResult = ReturnType<typeof useAllConnectionsFromLazyQuery>;
export type AllConnectionsFromQueryResult = Apollo.QueryResult<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>;
export const AllConnectionsToDocument = gql`
    query allConnectionsTo($to: PublicKey!) {
  connections(to: [$to], limit: 1000, offset: 0) {
    from {
      ...ConnectionNode
    }
  }
}
    ${ConnectionNodeFragmentDoc}`;

/**
 * __useAllConnectionsToQuery__
 *
 * To run a query within a React component, call `useAllConnectionsToQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllConnectionsToQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllConnectionsToQuery({
 *   variables: {
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAllConnectionsToQuery(baseOptions: Apollo.QueryHookOptions<AllConnectionsToQuery, AllConnectionsToQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllConnectionsToQuery, AllConnectionsToQueryVariables>(AllConnectionsToDocument, options);
      }
export function useAllConnectionsToLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllConnectionsToQuery, AllConnectionsToQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllConnectionsToQuery, AllConnectionsToQueryVariables>(AllConnectionsToDocument, options);
        }
export type AllConnectionsToQueryHookResult = ReturnType<typeof useAllConnectionsToQuery>;
export type AllConnectionsToLazyQueryHookResult = ReturnType<typeof useAllConnectionsToLazyQuery>;
export type AllConnectionsToQueryResult = Apollo.QueryResult<AllConnectionsToQuery, AllConnectionsToQueryVariables>;
export const GetProfileFollowerOverviewDocument = gql`
    query getProfileFollowerOverview($pubKey: PublicKey!) {
  wallet(address: $pubKey) {
    connectionCounts {
      fromCount
      toCount
    }
  }
  connections(to: [$pubKey], limit: 4, offset: 0) {
    from {
      address
      profile {
        handle
        profileImageUrl
        bannerImageUrl
      }
    }
  }
}
    `;

/**
 * __useGetProfileFollowerOverviewQuery__
 *
 * To run a query within a React component, call `useGetProfileFollowerOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileFollowerOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileFollowerOverviewQuery({
 *   variables: {
 *      pubKey: // value for 'pubKey'
 *   },
 * });
 */
export function useGetProfileFollowerOverviewQuery(baseOptions: Apollo.QueryHookOptions<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>(GetProfileFollowerOverviewDocument, options);
      }
export function useGetProfileFollowerOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>(GetProfileFollowerOverviewDocument, options);
        }
export type GetProfileFollowerOverviewQueryHookResult = ReturnType<typeof useGetProfileFollowerOverviewQuery>;
export type GetProfileFollowerOverviewLazyQueryHookResult = ReturnType<typeof useGetProfileFollowerOverviewLazyQuery>;
export type GetProfileFollowerOverviewQueryResult = Apollo.QueryResult<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>;
export const GetProfileInfoFromPubKeyDocument = gql`
    query getProfileInfoFromPubKey($pubKey: PublicKey!) {
  wallet(address: $pubKey) {
    profile {
      handle
      profileImageUrl
      bannerImageUrl
    }
  }
}
    `;

/**
 * __useGetProfileInfoFromPubKeyQuery__
 *
 * To run a query within a React component, call `useGetProfileInfoFromPubKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileInfoFromPubKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileInfoFromPubKeyQuery({
 *   variables: {
 *      pubKey: // value for 'pubKey'
 *   },
 * });
 */
export function useGetProfileInfoFromPubKeyQuery(baseOptions: Apollo.QueryHookOptions<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>(GetProfileInfoFromPubKeyDocument, options);
      }
export function useGetProfileInfoFromPubKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>(GetProfileInfoFromPubKeyDocument, options);
        }
export type GetProfileInfoFromPubKeyQueryHookResult = ReturnType<typeof useGetProfileInfoFromPubKeyQuery>;
export type GetProfileInfoFromPubKeyLazyQueryHookResult = ReturnType<typeof useGetProfileInfoFromPubKeyLazyQuery>;
export type GetProfileInfoFromPubKeyQueryResult = Apollo.QueryResult<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>;
export const GetProfileInfoFromTwitterHandleDocument = gql`
    query getProfileInfoFromTwitterHandle($handle: String!) {
  profile(handle: $handle) {
    walletAddress
    handle
    profileImageUrl: profileImageUrlHighres
    bannerImageUrl: bannerImageUrl
  }
}
    `;

/**
 * __useGetProfileInfoFromTwitterHandleQuery__
 *
 * To run a query within a React component, call `useGetProfileInfoFromTwitterHandleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileInfoFromTwitterHandleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileInfoFromTwitterHandleQuery({
 *   variables: {
 *      handle: // value for 'handle'
 *   },
 * });
 */
export function useGetProfileInfoFromTwitterHandleQuery(baseOptions: Apollo.QueryHookOptions<GetProfileInfoFromTwitterHandleQuery, GetProfileInfoFromTwitterHandleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileInfoFromTwitterHandleQuery, GetProfileInfoFromTwitterHandleQueryVariables>(GetProfileInfoFromTwitterHandleDocument, options);
      }
export function useGetProfileInfoFromTwitterHandleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileInfoFromTwitterHandleQuery, GetProfileInfoFromTwitterHandleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileInfoFromTwitterHandleQuery, GetProfileInfoFromTwitterHandleQueryVariables>(GetProfileInfoFromTwitterHandleDocument, options);
        }
export type GetProfileInfoFromTwitterHandleQueryHookResult = ReturnType<typeof useGetProfileInfoFromTwitterHandleQuery>;
export type GetProfileInfoFromTwitterHandleLazyQueryHookResult = ReturnType<typeof useGetProfileInfoFromTwitterHandleLazyQuery>;
export type GetProfileInfoFromTwitterHandleQueryResult = Apollo.QueryResult<GetProfileInfoFromTwitterHandleQuery, GetProfileInfoFromTwitterHandleQueryVariables>;
export const IsXFollowingYDocument = gql`
    query isXFollowingY($xPubKey: PublicKey!, $yPubKey: PublicKey!) {
  connections(from: [$xPubKey], to: [$yPubKey], limit: 1, offset: 0) {
    address
  }
}
    `;

/**
 * __useIsXFollowingYQuery__
 *
 * To run a query within a React component, call `useIsXFollowingYQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsXFollowingYQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsXFollowingYQuery({
 *   variables: {
 *      xPubKey: // value for 'xPubKey'
 *      yPubKey: // value for 'yPubKey'
 *   },
 * });
 */
export function useIsXFollowingYQuery(baseOptions: Apollo.QueryHookOptions<IsXFollowingYQuery, IsXFollowingYQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsXFollowingYQuery, IsXFollowingYQueryVariables>(IsXFollowingYDocument, options);
      }
export function useIsXFollowingYLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsXFollowingYQuery, IsXFollowingYQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsXFollowingYQuery, IsXFollowingYQueryVariables>(IsXFollowingYDocument, options);
        }
export type IsXFollowingYQueryHookResult = ReturnType<typeof useIsXFollowingYQuery>;
export type IsXFollowingYLazyQueryHookResult = ReturnType<typeof useIsXFollowingYLazyQuery>;
export type IsXFollowingYQueryResult = Apollo.QueryResult<IsXFollowingYQuery, IsXFollowingYQueryVariables>;