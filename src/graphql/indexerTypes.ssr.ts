import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type CreatedNfTsQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  subdomain: Scalars['String'];
}>;


export type CreatedNfTsQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null, nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: string, auctionHouse: string, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }> };

export type OwnedNfTsQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  subdomain: Scalars['String'];
}>;


export type OwnedNfTsQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null, nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: string, auctionHouse: string, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }> };

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
export const CreatedNfTsDocument = gql`
    query createdNFTs($creator: PublicKey!, $limit: Int!, $offset: Int!, $subdomain: String!) {
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
  nfts(creators: [$creator], limit: $limit, offset: $offset) {
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
export const OwnedNfTsDocument = gql`
    query ownedNFTs($address: PublicKey!, $limit: Int!, $offset: Int!, $subdomain: String!) {
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    activityPage(variables: ActivityPageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivityPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivityPageQuery>(ActivityPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'activityPage', 'query');
    },
    createdNFTs(variables: CreatedNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatedNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatedNfTsQuery>(CreatedNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createdNFTs', 'query');
    },
    ownedNFTs(variables: OwnedNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OwnedNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OwnedNfTsQuery>(OwnedNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ownedNFTs', 'query');
    },
    walletProfile(variables: WalletProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WalletProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WalletProfileQuery>(WalletProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'walletProfile', 'query');
    },
    nftMarketplace(variables: NftMarketplaceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NftMarketplaceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NftMarketplaceQuery>(NftMarketplaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'nftMarketplace', 'query');
    },
    nftPage(variables: NftPageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NftPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NftPageQuery>(NftPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'nftPage', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;