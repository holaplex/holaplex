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
  /** I64 */
  I64: any;
  /** NaiveDateTime */
  NaiveDateTime: any;
  /** PublicKey */
  PublicKey: any;
  /** U64 */
  U64: any;
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
  lastBidAmount: Scalars['U64'];
  lastBidTime: Scalars['String'];
  listing?: Maybe<Listing>;
  listingAddress: Scalars['String'];
};

export type BidReceipt = {
  __typename?: 'BidReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['PublicKey'];
  bookkeeper: Scalars['PublicKey'];
  bump: Scalars['Int'];
  buyer: Scalars['PublicKey'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  purchaseReceipt?: Maybe<Scalars['PublicKey']>;
  tokenAccount?: Maybe<Scalars['String']>;
  tokenSize: Scalars['Int'];
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

/** Bonding change enriched with reserve change and supply change */
export type EnrichedBondingChange = {
  __typename?: 'EnrichedBondingChange';
  address: Scalars['String'];
  insertTs: Scalars['NaiveDateTime'];
  reserveChange: Scalars['I64'];
  slot: Scalars['U64'];
  supplyChange: Scalars['I64'];
};

export type FeedEvent = FollowEvent | ListingEvent | MintEvent | OfferEvent | PurchaseEvent;

export type FollowEvent = {
  __typename?: 'FollowEvent';
  connection?: Maybe<GraphConnection>;
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  graphConnectionAddress: Scalars['PublicKey'];
  profile?: Maybe<TwitterProfile>;
  walletAddress: Scalars['String'];
};

export type GraphConnection = {
  __typename?: 'GraphConnection';
  address: Scalars['String'];
  connectedAt: Scalars['DateTimeUtc'];
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

export type ListingEvent = {
  __typename?: 'ListingEvent';
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  lifecycle: Scalars['String'];
  listing?: Maybe<ListingReceipt>;
  listingReceiptAddress: Scalars['PublicKey'];
  profile?: Maybe<TwitterProfile>;
  walletAddress: Scalars['String'];
};

export type ListingReceipt = {
  __typename?: 'ListingReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['PublicKey'];
  bookkeeper: Scalars['PublicKey'];
  bump: Scalars['Int'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  purchaseReceipt?: Maybe<Scalars['PublicKey']>;
  seller: Scalars['PublicKey'];
  tokenSize: Scalars['Int'];
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type MarketStats = {
  __typename?: 'MarketStats';
  nfts?: Maybe<Scalars['U64']>;
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

export type MetadataJson = {
  __typename?: 'MetadataJson';
  address: Scalars['String'];
  creatorAddress: Scalars['String'];
  creatorTwitterHandle?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  mintAddress: Scalars['String'];
  name: Scalars['String'];
};

export type MintEvent = {
  __typename?: 'MintEvent';
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  metadataAddress: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  profile?: Maybe<TwitterProfile>;
  walletAddress: Scalars['String'];
};

export type MintStats = {
  __typename?: 'MintStats';
  auctionHouse: Scalars['String'];
  average?: Maybe<Scalars['U64']>;
  floor?: Maybe<Scalars['U64']>;
  mint: Scalars['String'];
  volume24hr?: Maybe<Scalars['U64']>;
  volumeTotal?: Maybe<Scalars['U64']>;
};

export type Nft = {
  __typename?: 'Nft';
  activities: Array<NftActivity>;
  address: Scalars['String'];
  attributes: Array<NftAttribute>;
  category: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTimeUtc']>;
  creators: Array<NftCreator>;
  description: Scalars['String'];
  files: Array<NftFile>;
  image: Scalars['String'];
  listings: Array<ListingReceipt>;
  mintAddress: Scalars['String'];
  name: Scalars['String'];
  offers: Array<BidReceipt>;
  owner?: Maybe<NftOwner>;
  /**
   * The JSON parser with which the NFT was processed by the indexer
   *
   * - `"full"` indicates the full Metaplex standard-compliant parser was
   *   used.
   * - `"minimal"` (provided with an optional description of an error)
   *   indicates the full model failed to parse and a more lenient fallback
   *   parser with fewer fields was used instead.
   */
  parser?: Maybe<Scalars['String']>;
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
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  wallets: Array<Wallet>;
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

export type NftFile = {
  __typename?: 'NftFile';
  fileType: Scalars['String'];
  metadataAddress: Scalars['String'];
  uri: Scalars['String'];
};

export type NftOwner = {
  __typename?: 'NftOwner';
  address: Scalars['String'];
  associatedTokenAccountAddress: Scalars['String'];
  profile?: Maybe<TwitterProfile>;
  twitterHandle?: Maybe<Scalars['String']>;
};

export type OfferEvent = {
  __typename?: 'OfferEvent';
  bidReceiptAddress: Scalars['PublicKey'];
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  lifecycle: Scalars['String'];
  offer?: Maybe<BidReceipt>;
  profile?: Maybe<TwitterProfile>;
  walletAddress: Scalars['String'];
};

export type PriceChart = {
  __typename?: 'PriceChart';
  listingFloor: Array<PricePoint>;
  salesAverage: Array<PricePoint>;
  totalVolume: Array<PricePoint>;
};

export type PricePoint = {
  __typename?: 'PricePoint';
  date: Scalars['DateTimeUtc'];
  price: Scalars['U64'];
};

export type PurchaseEvent = {
  __typename?: 'PurchaseEvent';
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  profile?: Maybe<TwitterProfile>;
  purchase?: Maybe<PurchaseReceipt>;
  purchaseReceiptAddress: Scalars['PublicKey'];
  walletAddress: Scalars['String'];
};

export type PurchaseReceipt = {
  __typename?: 'PurchaseReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['PublicKey'];
  buyer: Scalars['PublicKey'];
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  seller: Scalars['PublicKey'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  activities: Array<NftActivity>;
  charts: PriceChart;
  connections: Array<GraphConnection>;
  creator: Creator;
  denylist: Denylist;
  enrichedBondingChanges: Array<EnrichedBondingChange>;
  featuredListings: Array<ListingReceipt>;
  /** Returns events for the wallets the user is following using the graph_program. */
  feedEvents: Array<FeedEvent>;
  /** Recommend wallets to follow. */
  followWallets: Array<Wallet>;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  /** returns metadata_jsons matching the term */
  metadataJsons: Array<MetadataJson>;
  nft?: Maybe<Nft>;
  nftCounts: NftCount;
  nfts: Array<Nft>;
  offer?: Maybe<BidReceipt>;
  profile?: Maybe<TwitterProfile>;
  /** returns profiles matching the search term */
  profiles: Array<Wallet>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  wallet: Wallet;
};


export type QueryRootActivitiesArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootChartsArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  endDate: Scalars['DateTimeUtc'];
  startDate: Scalars['DateTimeUtc'];
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


export type QueryRootEnrichedBondingChangesArgs = {
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  startUnixTime: Scalars['NaiveDateTime'];
  stopUnixTime: Scalars['NaiveDateTime'];
};


export type QueryRootFeaturedListingsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryRootFeedEventsArgs = {
  excludeTypes?: InputMaybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  wallet: Scalars['PublicKey'];
};


export type QueryRootFollowWalletsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  wallet?: InputMaybe<Scalars['PublicKey']>;
};


export type QueryRootMarketplaceArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootMetadataJsonsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  term: Scalars['String'];
};


export type QueryRootNftArgs = {
  address: Scalars['String'];
};


export type QueryRootNftCountsArgs = {
  creators: Array<Scalars['PublicKey']>;
};


export type QueryRootNftsArgs = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
  collection?: InputMaybe<Scalars['PublicKey']>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  listed?: InputMaybe<Scalars['Boolean']>;
  offerers?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootOfferArgs = {
  address: Scalars['String'];
};


export type QueryRootProfileArgs = {
  handle: Scalars['String'];
};


export type QueryRootProfilesArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  term: Scalars['String'];
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
  nftCount?: Maybe<Scalars['Int']>;
  preview: Array<Nft>;
  profile?: Maybe<TwitterProfile>;
  storeConfigAddress: Scalars['String'];
  twitterHandle?: Maybe<Scalars['String']>;
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
  /** @deprecated Use profileImageUrlLowres instead. */
  profileImageUrl: Scalars['String'];
  profileImageUrlHighres: Scalars['String'];
  profileImageUrlLowres: Scalars['String'];
  walletAddress?: Maybe<Scalars['String']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['PublicKey'];
  bids: Array<Bid>;
  connectionCounts: ConnectionCounts;
  nftCounts: WalletNftCount;
  profile?: Maybe<TwitterProfile>;
  twitterHandle?: Maybe<Scalars['String']>;
};


export type WalletNftCountsArgs = {
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type WalletNftCount = {
  __typename?: 'WalletNftCount';
  created: Scalars['Int'];
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


export type CreatedNfTsQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null, nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }> };

export type OwnedNfTsQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  subdomain: Scalars['String'];
}>;


export type OwnedNfTsQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean, stats?: { __typename?: 'MintStats', floor?: any | null, average?: any | null, volume24hr?: any | null } | null } | null } | null, nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }> };

export type WalletProfileQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type WalletProfileQuery = { __typename?: 'QueryRoot', profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string, profileImageUrlHighres: string, bannerImageUrl: string } | null };

export type FeedQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  excludeTypes?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type FeedQuery = { __typename?: 'QueryRoot', feedEvents: Array<{ __typename: 'FollowEvent', feedEventId: string, createdAt: any, walletAddress: string, graphConnectionAddress: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null, connection?: { __typename?: 'GraphConnection', address: string, from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null }, to: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null } } | null } | { __typename: 'ListingEvent', feedEventId: string, createdAt: any, walletAddress: string, lifecycle: string, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null, listing?: { __typename?: 'ListingReceipt', address: string, bookkeeper: any, seller: any, price: any, nft?: { __typename?: 'Nft', name: string, image: string, description: string, sellerFeeBasisPoints: number, primarySaleHappened: boolean, address: string, mintAddress: string, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string, twitterHandle?: string | null } | null, creators: Array<{ __typename?: 'NftCreator', address: string, position?: number | null, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null }> } | null } | null } | { __typename: 'MintEvent', feedEventId: string, createdAt: any, walletAddress: string, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null, nft?: { __typename?: 'Nft', name: string, image: string, description: string, sellerFeeBasisPoints: number, primarySaleHappened: boolean, address: string, mintAddress: string, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string, twitterHandle?: string | null } | null, creators: Array<{ __typename?: 'NftCreator', address: string, position?: number | null, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null }> } | null } | { __typename: 'OfferEvent', feedEventId: string, createdAt: any, walletAddress: string, lifecycle: string, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null, offer?: { __typename?: 'BidReceipt', address: string, buyer: any, price: any, nft?: { __typename?: 'Nft', name: string, image: string, description: string, sellerFeeBasisPoints: number, primarySaleHappened: boolean, address: string, mintAddress: string, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string, twitterHandle?: string | null } | null, creators: Array<{ __typename?: 'NftCreator', address: string, position?: number | null, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null }> } | null } | null } | { __typename: 'PurchaseEvent', feedEventId: string, createdAt: any, walletAddress: string, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null, purchase?: { __typename?: 'PurchaseReceipt', address: string, buyer: any, seller: any, price: any, nft?: { __typename?: 'Nft', name: string, image: string, description: string, sellerFeeBasisPoints: number, primarySaleHappened: boolean, address: string, mintAddress: string, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string, twitterHandle?: string | null } | null, creators: Array<{ __typename?: 'NftCreator', address: string, position?: number | null, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string } | null }> } | null } | null }> };

export type WhoToFollowQueryVariables = Exact<{
  wallet: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type WhoToFollowQuery = { __typename?: 'QueryRoot', followWallets: Array<{ __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null }> };

export type FeaturedBuyNowListingsQueryVariables = Exact<{
  marketplace: Scalars['String'];
  limit: Scalars['Int'];
}>;


export type FeaturedBuyNowListingsQuery = { __typename?: 'QueryRoot', featuredListings: Array<{ __typename?: 'ListingReceipt', address: string, metadata: any, nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null }>, marketplace?: { __typename?: 'Marketplace', auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null };

export type FeaturedProfilesQueryVariables = Exact<{
  userWallet?: InputMaybe<Scalars['PublicKey']>;
  limit: Scalars['Int'];
}>;


export type FeaturedProfilesQuery = { __typename?: 'QueryRoot', followWallets: Array<{ __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlHighres: string, bannerImageUrl: string } | null, nftCounts: { __typename?: 'WalletNftCount', owned: number, created: number } }> };

export type MarketplacePreviewQueryVariables = Exact<{
  subdomain: Scalars['String'];
}>;


export type MarketplacePreviewQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, bannerUrl: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlHighres: string } | null }>, auctionHouse?: { __typename?: 'AuctionHouse', stats?: { __typename?: 'MintStats', floor?: any | null } | null } | null, stats?: { __typename?: 'MarketStats', nfts?: any | null } | null } | null };

export type ProfilePreviewQueryVariables = Exact<{
  address: Scalars['PublicKey'];
}>;


export type ProfilePreviewQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlHighres: string, bannerImageUrl: string } | null, nftCounts: { __typename?: 'WalletNftCount', owned: number, created: number } } };

export type NftMarketplaceQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;


export type NftMarketplaceQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean, stats?: { __typename?: 'MintStats', floor?: any | null, average?: any | null, volume24hr?: any | null } | null } | null } | null, nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, category: string, image: string, primarySaleHappened: boolean, files: Array<{ __typename?: 'NftFile', uri: string, fileType: string }>, attributes: Array<{ __typename?: 'NftAttribute', metadataAddress: string, value: string, traitType: string }>, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null };

export type OffersPageQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type OffersPageQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, ownerAddress: string, creators: Array<{ __typename?: 'StoreCreator', creatorAddress: string, storeConfigAddress: string }>, auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean, stats?: { __typename?: 'MintStats', floor?: any | null, average?: any | null, volume24hr?: any | null } | null } | null } | null, sentOffers: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }>, receivedOffers: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> }> };

export type NftCardQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;


export type NftCardQuery = { __typename?: 'QueryRoot', nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null, marketplace?: { __typename?: 'Marketplace', auctionHouse?: { __typename?: 'AuctionHouse', address: string, treasuryMint: string, auctionHouseTreasury: string, treasuryWithdrawalDestination: string, feeWithdrawalDestination: string, authority: string, creator: string, auctionHouseFeeAccount: string, bump: number, treasuryBump: number, feePayerBump: number, sellerFeeBasisPoints: number, requiresSignOff: boolean, canChangeSalePrice: boolean } | null } | null };

export type NftPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type NftPageQuery = { __typename?: 'QueryRoot', nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, attributes: Array<{ __typename?: 'NftAttribute', metadataAddress: string, value: string, traitType: string }>, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, auctionHouse: any, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: any, metadata: any, auctionHouse: any, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null };

export type ShareNftQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;


export type ShareNftQuery = { __typename?: 'QueryRoot', marketplace?: { __typename?: 'Marketplace', subdomain: string, name: string, description: string, logoUrl: string, bannerUrl: string, auctionHouse?: { __typename?: 'AuctionHouse', address: string, stats?: { __typename?: 'MintStats', floor?: any | null, average?: any | null, volume24hr?: any | null } | null } | null } | null, nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string, associatedTokenAccountAddress: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: any, price: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, price: any }>, offers: Array<{ __typename?: 'BidReceipt', address: string, buyer: any, price: any }> } | null };

export type ConnectionNodeFragment = { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null };

export type AllConnectionsFromQueryVariables = Exact<{
  from: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AllConnectionsFromQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', to: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null } }> };

export type AllConnectionsToQueryVariables = Exact<{
  to: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type AllConnectionsToQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null } }> };

export type GetCollectedByQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
}>;


export type GetCollectedByQuery = { __typename?: 'QueryRoot', nfts: Array<{ __typename?: 'Nft', address: string, owner?: { __typename?: 'NftOwner', profile?: { __typename?: 'TwitterProfile', walletAddress?: string | null, profileImageUrlLowres: string, handle: string } | null } | null }> };

export type GetConnectedWalletProfileDataQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetConnectedWalletProfileDataQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', address: any, nftCounts: { __typename?: 'WalletNftCount', owned: number, created: number, offered: number, listed: number }, connectionCounts: { __typename?: 'ConnectionCounts', fromCount: number, toCount: number }, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string, profileImageUrlHighres: string } | null }, followers: Array<{ __typename?: 'GraphConnection', from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null } }>, following: Array<{ __typename?: 'GraphConnection', to: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string } | null } }> };

export type GetProfileFollowerOverviewQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;


export type GetProfileFollowerOverviewQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', connectionCounts: { __typename?: 'ConnectionCounts', fromCount: number, toCount: number } }, connections: Array<{ __typename?: 'GraphConnection', from: { __typename?: 'Wallet', address: any, profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrl: string, bannerImageUrl: string } | null } }> };

export type GetProfileInfoFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;


export type GetProfileInfoFromPubKeyQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', profile?: { __typename?: 'TwitterProfile', handle: string, profileImageUrlLowres: string, bannerImageUrl: string } | null } };

export type GetProfileInfoFromTwitterHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetProfileInfoFromTwitterHandleQuery = { __typename?: 'QueryRoot', profile?: { __typename?: 'TwitterProfile', walletAddress?: string | null, handle: string, profileImageUrl: string, bannerImageUrl: string } | null };

export type IsXFollowingYQueryVariables = Exact<{
  xPubKey: Scalars['PublicKey'];
  yPubKey: Scalars['PublicKey'];
}>;


export type IsXFollowingYQuery = { __typename?: 'QueryRoot', connections: Array<{ __typename?: 'GraphConnection', address: string }> };

export type TwitterHandleFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;


export type TwitterHandleFromPubKeyQuery = { __typename?: 'QueryRoot', wallet: { __typename?: 'Wallet', profile?: { __typename?: 'TwitterProfile', handle: string } | null } };

export type MetadataSearchQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type MetadataSearchQuery = { __typename?: 'QueryRoot', metadataJsons: Array<{ __typename?: 'MetadataJson', name: string, address: string, image?: string | null, creatorAddress: string, creatorTwitterHandle?: string | null }> };

export type ProfileSearchQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type ProfileSearchQuery = { __typename?: 'QueryRoot', profiles: Array<{ __typename?: 'Wallet', address: any, twitterHandle?: string | null, profile?: { __typename?: 'TwitterProfile', profileImageUrl: string } | null }> };

export type SearchQueryVariables = Exact<{
  term: Scalars['String'];
  walletAddress: Scalars['PublicKey'];
}>;


export type SearchQuery = { __typename?: 'QueryRoot', metadataJsons: Array<{ __typename?: 'MetadataJson', name: string, address: string, image?: string | null, creatorAddress: string, creatorTwitterHandle?: string | null }>, profiles: Array<{ __typename?: 'Wallet', address: any, twitterHandle?: string | null, profile?: { __typename?: 'TwitterProfile', profileImageUrl: string, handle: string } | null }>, wallet: { __typename?: 'Wallet', address: any, twitterHandle?: string | null, profile?: { __typename?: 'TwitterProfile', profileImageUrl: string, handle: string } | null } };

export const ConnectionNodeFragmentDoc = gql`
    fragment ConnectionNode on Wallet {
  address
  profile {
    handle
    profileImageUrlLowres
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

/**
 * __useCreatedNfTsQuery__
 *
 * To run a query within a React component, call `useCreatedNfTsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreatedNfTsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreatedNfTsQuery({
 *   variables: {
 *      creator: // value for 'creator'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      subdomain: // value for 'subdomain'
 *   },
 * });
 */
export function useCreatedNfTsQuery(baseOptions: Apollo.QueryHookOptions<CreatedNfTsQuery, CreatedNfTsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CreatedNfTsQuery, CreatedNfTsQueryVariables>(CreatedNfTsDocument, options);
      }
export function useCreatedNfTsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CreatedNfTsQuery, CreatedNfTsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CreatedNfTsQuery, CreatedNfTsQueryVariables>(CreatedNfTsDocument, options);
        }
export type CreatedNfTsQueryHookResult = ReturnType<typeof useCreatedNfTsQuery>;
export type CreatedNfTsLazyQueryHookResult = ReturnType<typeof useCreatedNfTsLazyQuery>;
export type CreatedNfTsQueryResult = Apollo.QueryResult<CreatedNfTsQuery, CreatedNfTsQueryVariables>;
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
      stats {
        floor
        average
        volume24hr
      }
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
      profile {
        handle
        profileImageUrlLowres
      }
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
 *      subdomain: // value for 'subdomain'
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
export const FeedDocument = gql`
    query feed($address: PublicKey!, $limit: Int = 25, $offset: Int = 0, $excludeTypes: [String!]) {
  feedEvents(
    wallet: $address
    limit: $limit
    offset: $offset
    excludeTypes: $excludeTypes
  ) {
    __typename
    ... on MintEvent {
      feedEventId
      createdAt
      walletAddress
      profile {
        handle
        profileImageUrl
      }
      nft {
        name
        image(width: 600)
        description
        owner {
          address
          associatedTokenAccountAddress
          twitterHandle
        }
        sellerFeeBasisPoints
        primarySaleHappened
        creators {
          address
          position
          profile {
            handle
            profileImageUrl
          }
        }
        address
        mintAddress
      }
    }
    ... on FollowEvent {
      feedEventId
      createdAt
      walletAddress
      profile {
        handle
        profileImageUrl
      }
      graphConnectionAddress
      connection {
        address
        from {
          address
          profile {
            handle
            profileImageUrl
          }
        }
        to {
          address
          profile {
            handle
            profileImageUrl
          }
        }
      }
    }
    ... on PurchaseEvent {
      feedEventId
      createdAt
      walletAddress
      profile {
        handle
        profileImageUrl
      }
      purchase {
        address
        buyer
        seller
        price
        nft {
          name
          image(width: 600)
          description
          owner {
            address
            associatedTokenAccountAddress
            twitterHandle
          }
          sellerFeeBasisPoints
          primarySaleHappened
          creators {
            address
            position
            profile {
              handle
              profileImageUrl
            }
          }
          address
          mintAddress
        }
      }
    }
    ... on ListingEvent {
      feedEventId
      createdAt
      walletAddress
      profile {
        handle
        profileImageUrl
      }
      lifecycle
      listing {
        address
        bookkeeper
        seller
        price
        nft {
          name
          image(width: 600)
          description
          owner {
            address
            associatedTokenAccountAddress
            twitterHandle
          }
          sellerFeeBasisPoints
          primarySaleHappened
          creators {
            address
            position
            profile {
              handle
              profileImageUrl
            }
          }
          address
          mintAddress
        }
      }
    }
    ... on OfferEvent {
      feedEventId
      createdAt
      walletAddress
      profile {
        handle
        profileImageUrl
      }
      lifecycle
      offer {
        address
        buyer
        price
        nft {
          name
          image(width: 600)
          description
          owner {
            address
            associatedTokenAccountAddress
            twitterHandle
          }
          sellerFeeBasisPoints
          primarySaleHappened
          creators {
            address
            position
            profile {
              handle
              profileImageUrl
            }
          }
          address
          mintAddress
        }
      }
    }
  }
}
    `;

/**
 * __useFeedQuery__
 *
 * To run a query within a React component, call `useFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      excludeTypes: // value for 'excludeTypes'
 *   },
 * });
 */
export function useFeedQuery(baseOptions: Apollo.QueryHookOptions<FeedQuery, FeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
      }
export function useFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedQuery, FeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
        }
export type FeedQueryHookResult = ReturnType<typeof useFeedQuery>;
export type FeedLazyQueryHookResult = ReturnType<typeof useFeedLazyQuery>;
export type FeedQueryResult = Apollo.QueryResult<FeedQuery, FeedQueryVariables>;
export const WhoToFollowDocument = gql`
    query whoToFollow($wallet: PublicKey!, $limit: Int!, $offset: Int = 0) {
  followWallets(wallet: $wallet, limit: $limit, offset: $offset) {
    address
    profile {
      handle
      profileImageUrlLowres
    }
  }
}
    `;

/**
 * __useWhoToFollowQuery__
 *
 * To run a query within a React component, call `useWhoToFollowQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhoToFollowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhoToFollowQuery({
 *   variables: {
 *      wallet: // value for 'wallet'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useWhoToFollowQuery(baseOptions: Apollo.QueryHookOptions<WhoToFollowQuery, WhoToFollowQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WhoToFollowQuery, WhoToFollowQueryVariables>(WhoToFollowDocument, options);
      }
export function useWhoToFollowLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhoToFollowQuery, WhoToFollowQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WhoToFollowQuery, WhoToFollowQueryVariables>(WhoToFollowDocument, options);
        }
export type WhoToFollowQueryHookResult = ReturnType<typeof useWhoToFollowQuery>;
export type WhoToFollowLazyQueryHookResult = ReturnType<typeof useWhoToFollowLazyQuery>;
export type WhoToFollowQueryResult = Apollo.QueryResult<WhoToFollowQuery, WhoToFollowQueryVariables>;
export const FeaturedBuyNowListingsDocument = gql`
    query featuredBuyNowListings($marketplace: String!, $limit: Int!) {
  featuredListings(limit: $limit, offset: 0) {
    address
    metadata
    nft {
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
  marketplace(subdomain: $marketplace) {
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
}
    `;

/**
 * __useFeaturedBuyNowListingsQuery__
 *
 * To run a query within a React component, call `useFeaturedBuyNowListingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeaturedBuyNowListingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeaturedBuyNowListingsQuery({
 *   variables: {
 *      marketplace: // value for 'marketplace'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useFeaturedBuyNowListingsQuery(baseOptions: Apollo.QueryHookOptions<FeaturedBuyNowListingsQuery, FeaturedBuyNowListingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeaturedBuyNowListingsQuery, FeaturedBuyNowListingsQueryVariables>(FeaturedBuyNowListingsDocument, options);
      }
export function useFeaturedBuyNowListingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeaturedBuyNowListingsQuery, FeaturedBuyNowListingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeaturedBuyNowListingsQuery, FeaturedBuyNowListingsQueryVariables>(FeaturedBuyNowListingsDocument, options);
        }
export type FeaturedBuyNowListingsQueryHookResult = ReturnType<typeof useFeaturedBuyNowListingsQuery>;
export type FeaturedBuyNowListingsLazyQueryHookResult = ReturnType<typeof useFeaturedBuyNowListingsLazyQuery>;
export type FeaturedBuyNowListingsQueryResult = Apollo.QueryResult<FeaturedBuyNowListingsQuery, FeaturedBuyNowListingsQueryVariables>;
export const FeaturedProfilesDocument = gql`
    query featuredProfiles($userWallet: PublicKey, $limit: Int!) {
  followWallets(wallet: $userWallet, limit: $limit, offset: 0) {
    address
    profile {
      handle
      profileImageUrlHighres
      bannerImageUrl
    }
    nftCounts {
      owned
      created
    }
  }
}
    `;

/**
 * __useFeaturedProfilesQuery__
 *
 * To run a query within a React component, call `useFeaturedProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeaturedProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeaturedProfilesQuery({
 *   variables: {
 *      userWallet: // value for 'userWallet'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useFeaturedProfilesQuery(baseOptions: Apollo.QueryHookOptions<FeaturedProfilesQuery, FeaturedProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeaturedProfilesQuery, FeaturedProfilesQueryVariables>(FeaturedProfilesDocument, options);
      }
export function useFeaturedProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeaturedProfilesQuery, FeaturedProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeaturedProfilesQuery, FeaturedProfilesQueryVariables>(FeaturedProfilesDocument, options);
        }
export type FeaturedProfilesQueryHookResult = ReturnType<typeof useFeaturedProfilesQuery>;
export type FeaturedProfilesLazyQueryHookResult = ReturnType<typeof useFeaturedProfilesLazyQuery>;
export type FeaturedProfilesQueryResult = Apollo.QueryResult<FeaturedProfilesQuery, FeaturedProfilesQueryVariables>;
export const MarketplacePreviewDocument = gql`
    query marketplacePreview($subdomain: String!) {
  marketplace(subdomain: $subdomain) {
    subdomain
    name
    bannerUrl
    creators {
      creatorAddress
      profile {
        handle
        profileImageUrlHighres
      }
    }
    auctionHouse {
      stats {
        floor
      }
    }
    stats {
      nfts
    }
  }
}
    `;

/**
 * __useMarketplacePreviewQuery__
 *
 * To run a query within a React component, call `useMarketplacePreviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketplacePreviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketplacePreviewQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *   },
 * });
 */
export function useMarketplacePreviewQuery(baseOptions: Apollo.QueryHookOptions<MarketplacePreviewQuery, MarketplacePreviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketplacePreviewQuery, MarketplacePreviewQueryVariables>(MarketplacePreviewDocument, options);
      }
export function useMarketplacePreviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketplacePreviewQuery, MarketplacePreviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketplacePreviewQuery, MarketplacePreviewQueryVariables>(MarketplacePreviewDocument, options);
        }
export type MarketplacePreviewQueryHookResult = ReturnType<typeof useMarketplacePreviewQuery>;
export type MarketplacePreviewLazyQueryHookResult = ReturnType<typeof useMarketplacePreviewLazyQuery>;
export type MarketplacePreviewQueryResult = Apollo.QueryResult<MarketplacePreviewQuery, MarketplacePreviewQueryVariables>;
export const ProfilePreviewDocument = gql`
    query profilePreview($address: PublicKey!) {
  wallet(address: $address) {
    profile {
      handle
      profileImageUrlHighres
      bannerImageUrl
    }
    address
    nftCounts {
      owned
      created
    }
  }
}
    `;

/**
 * __useProfilePreviewQuery__
 *
 * To run a query within a React component, call `useProfilePreviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePreviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePreviewQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useProfilePreviewQuery(baseOptions: Apollo.QueryHookOptions<ProfilePreviewQuery, ProfilePreviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfilePreviewQuery, ProfilePreviewQueryVariables>(ProfilePreviewDocument, options);
      }
export function useProfilePreviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePreviewQuery, ProfilePreviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfilePreviewQuery, ProfilePreviewQueryVariables>(ProfilePreviewDocument, options);
        }
export type ProfilePreviewQueryHookResult = ReturnType<typeof useProfilePreviewQuery>;
export type ProfilePreviewLazyQueryHookResult = ReturnType<typeof useProfilePreviewLazyQuery>;
export type ProfilePreviewQueryResult = Apollo.QueryResult<ProfilePreviewQuery, ProfilePreviewQueryVariables>;
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
      stats {
        floor
        average
        volume24hr
      }
    }
  }
  nft(address: $address) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    category
    image
    primarySaleHappened
    files {
      uri
      fileType
    }
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
export const OffersPageDocument = gql`
    query offersPage($subdomain: String!, $address: PublicKey!, $limit: Int!, $offset: Int!) {
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
      stats {
        floor
        average
        volume24hr
      }
    }
  }
  sentOffers: nfts(offerers: [$address], limit: $limit, offset: $offset) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    image
    primarySaleHappened
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
  receivedOffers: nfts(owners: [$address], limit: $limit, offset: $offset) {
    address
    name
    sellerFeeBasisPoints
    mintAddress
    description
    image
    primarySaleHappened
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
 * __useOffersPageQuery__
 *
 * To run a query within a React component, call `useOffersPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useOffersPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOffersPageQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useOffersPageQuery(baseOptions: Apollo.QueryHookOptions<OffersPageQuery, OffersPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OffersPageQuery, OffersPageQueryVariables>(OffersPageDocument, options);
      }
export function useOffersPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OffersPageQuery, OffersPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OffersPageQuery, OffersPageQueryVariables>(OffersPageDocument, options);
        }
export type OffersPageQueryHookResult = ReturnType<typeof useOffersPageQuery>;
export type OffersPageLazyQueryHookResult = ReturnType<typeof useOffersPageLazyQuery>;
export type OffersPageQueryResult = Apollo.QueryResult<OffersPageQuery, OffersPageQueryVariables>;
export const NftCardDocument = gql`
    query nftCard($subdomain: String!, $address: String!) {
  nft(address: $address) {
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
  marketplace(subdomain: $subdomain) {
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
}
    `;

/**
 * __useNftCardQuery__
 *
 * To run a query within a React component, call `useNftCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftCardQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useNftCardQuery(baseOptions: Apollo.QueryHookOptions<NftCardQuery, NftCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftCardQuery, NftCardQueryVariables>(NftCardDocument, options);
      }
export function useNftCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftCardQuery, NftCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftCardQuery, NftCardQueryVariables>(NftCardDocument, options);
        }
export type NftCardQueryHookResult = ReturnType<typeof useNftCardQuery>;
export type NftCardLazyQueryHookResult = ReturnType<typeof useNftCardLazyQuery>;
export type NftCardQueryResult = Apollo.QueryResult<NftCardQuery, NftCardQueryVariables>;
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
export const ShareNftDocument = gql`
    query shareNFT($subdomain: String!, $address: String!) {
  marketplace(subdomain: $subdomain) {
    subdomain
    name
    description
    logoUrl
    bannerUrl
    auctionHouse {
      address
      stats {
        floor
        average
        volume24hr
      }
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
      price
    }
    listings {
      address
      price
    }
    offers {
      address
      buyer
      price
    }
  }
}
    `;

/**
 * __useShareNftQuery__
 *
 * To run a query within a React component, call `useShareNftQuery` and pass it any options that fit your needs.
 * When your component renders, `useShareNftQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShareNftQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useShareNftQuery(baseOptions: Apollo.QueryHookOptions<ShareNftQuery, ShareNftQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShareNftQuery, ShareNftQueryVariables>(ShareNftDocument, options);
      }
export function useShareNftLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShareNftQuery, ShareNftQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShareNftQuery, ShareNftQueryVariables>(ShareNftDocument, options);
        }
export type ShareNftQueryHookResult = ReturnType<typeof useShareNftQuery>;
export type ShareNftLazyQueryHookResult = ReturnType<typeof useShareNftLazyQuery>;
export type ShareNftQueryResult = Apollo.QueryResult<ShareNftQuery, ShareNftQueryVariables>;
export const AllConnectionsFromDocument = gql`
    query allConnectionsFrom($from: PublicKey!, $limit: Int = 1000, $offset: Int = 0) {
  connections(from: [$from], limit: $limit, offset: $offset) {
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
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
    query allConnectionsTo($to: PublicKey!, $limit: Int = 1000, $offset: Int = 0) {
  connections(to: [$to], limit: $limit, offset: $offset) {
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
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
export const GetCollectedByDocument = gql`
    query getCollectedBy($creator: PublicKey!) {
  nfts(creators: [$creator], limit: 1000, offset: 0) {
    address
    owner {
      profile {
        walletAddress
        profileImageUrlLowres
        handle
      }
    }
  }
}
    `;

/**
 * __useGetCollectedByQuery__
 *
 * To run a query within a React component, call `useGetCollectedByQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectedByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectedByQuery({
 *   variables: {
 *      creator: // value for 'creator'
 *   },
 * });
 */
export function useGetCollectedByQuery(baseOptions: Apollo.QueryHookOptions<GetCollectedByQuery, GetCollectedByQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCollectedByQuery, GetCollectedByQueryVariables>(GetCollectedByDocument, options);
      }
export function useGetCollectedByLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCollectedByQuery, GetCollectedByQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCollectedByQuery, GetCollectedByQueryVariables>(GetCollectedByDocument, options);
        }
export type GetCollectedByQueryHookResult = ReturnType<typeof useGetCollectedByQuery>;
export type GetCollectedByLazyQueryHookResult = ReturnType<typeof useGetCollectedByLazyQuery>;
export type GetCollectedByQueryResult = Apollo.QueryResult<GetCollectedByQuery, GetCollectedByQueryVariables>;
export const GetConnectedWalletProfileDataDocument = gql`
    query getConnectedWalletProfileData($address: PublicKey!, $limit: Int = 1000, $offset: Int = 0) {
  wallet(address: $address) {
    address
    nftCounts {
      owned
      created
      offered
      listed
    }
    connectionCounts {
      fromCount
      toCount
    }
    profile {
      handle
      profileImageUrlLowres
      profileImageUrlHighres
    }
  }
  followers: connections(to: [$address], limit: $limit, offset: $offset) {
    from {
      ...ConnectionNode
    }
  }
  following: connections(from: [$address], limit: $limit, offset: $offset) {
    to {
      ...ConnectionNode
    }
  }
}
    ${ConnectionNodeFragmentDoc}`;

/**
 * __useGetConnectedWalletProfileDataQuery__
 *
 * To run a query within a React component, call `useGetConnectedWalletProfileDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConnectedWalletProfileDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConnectedWalletProfileDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetConnectedWalletProfileDataQuery(baseOptions: Apollo.QueryHookOptions<GetConnectedWalletProfileDataQuery, GetConnectedWalletProfileDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConnectedWalletProfileDataQuery, GetConnectedWalletProfileDataQueryVariables>(GetConnectedWalletProfileDataDocument, options);
      }
export function useGetConnectedWalletProfileDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConnectedWalletProfileDataQuery, GetConnectedWalletProfileDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConnectedWalletProfileDataQuery, GetConnectedWalletProfileDataQueryVariables>(GetConnectedWalletProfileDataDocument, options);
        }
export type GetConnectedWalletProfileDataQueryHookResult = ReturnType<typeof useGetConnectedWalletProfileDataQuery>;
export type GetConnectedWalletProfileDataLazyQueryHookResult = ReturnType<typeof useGetConnectedWalletProfileDataLazyQuery>;
export type GetConnectedWalletProfileDataQueryResult = Apollo.QueryResult<GetConnectedWalletProfileDataQuery, GetConnectedWalletProfileDataQueryVariables>;
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
      profileImageUrlLowres
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
export const TwitterHandleFromPubKeyDocument = gql`
    query twitterHandleFromPubKey($pubKey: PublicKey!) {
  wallet(address: $pubKey) {
    profile {
      handle
    }
  }
}
    `;

/**
 * __useTwitterHandleFromPubKeyQuery__
 *
 * To run a query within a React component, call `useTwitterHandleFromPubKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useTwitterHandleFromPubKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTwitterHandleFromPubKeyQuery({
 *   variables: {
 *      pubKey: // value for 'pubKey'
 *   },
 * });
 */
export function useTwitterHandleFromPubKeyQuery(baseOptions: Apollo.QueryHookOptions<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>(TwitterHandleFromPubKeyDocument, options);
      }
export function useTwitterHandleFromPubKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>(TwitterHandleFromPubKeyDocument, options);
        }
export type TwitterHandleFromPubKeyQueryHookResult = ReturnType<typeof useTwitterHandleFromPubKeyQuery>;
export type TwitterHandleFromPubKeyLazyQueryHookResult = ReturnType<typeof useTwitterHandleFromPubKeyLazyQuery>;
export type TwitterHandleFromPubKeyQueryResult = Apollo.QueryResult<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>;
export const MetadataSearchDocument = gql`
    query metadataSearch($term: String!) {
  metadataJsons(term: $term, limit: 25, offset: 0) {
    name
    address
    image
    creatorAddress
    creatorTwitterHandle
  }
}
    `;

/**
 * __useMetadataSearchQuery__
 *
 * To run a query within a React component, call `useMetadataSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useMetadataSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMetadataSearchQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useMetadataSearchQuery(baseOptions: Apollo.QueryHookOptions<MetadataSearchQuery, MetadataSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetadataSearchQuery, MetadataSearchQueryVariables>(MetadataSearchDocument, options);
      }
export function useMetadataSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetadataSearchQuery, MetadataSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetadataSearchQuery, MetadataSearchQueryVariables>(MetadataSearchDocument, options);
        }
export type MetadataSearchQueryHookResult = ReturnType<typeof useMetadataSearchQuery>;
export type MetadataSearchLazyQueryHookResult = ReturnType<typeof useMetadataSearchLazyQuery>;
export type MetadataSearchQueryResult = Apollo.QueryResult<MetadataSearchQuery, MetadataSearchQueryVariables>;
export const ProfileSearchDocument = gql`
    query profileSearch($term: String!) {
  profiles(term: $term, limit: 10, offset: 0) {
    address
    twitterHandle
    profile {
      profileImageUrl
    }
  }
}
    `;

/**
 * __useProfileSearchQuery__
 *
 * To run a query within a React component, call `useProfileSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileSearchQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useProfileSearchQuery(baseOptions: Apollo.QueryHookOptions<ProfileSearchQuery, ProfileSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileSearchQuery, ProfileSearchQueryVariables>(ProfileSearchDocument, options);
      }
export function useProfileSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileSearchQuery, ProfileSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileSearchQuery, ProfileSearchQueryVariables>(ProfileSearchDocument, options);
        }
export type ProfileSearchQueryHookResult = ReturnType<typeof useProfileSearchQuery>;
export type ProfileSearchLazyQueryHookResult = ReturnType<typeof useProfileSearchLazyQuery>;
export type ProfileSearchQueryResult = Apollo.QueryResult<ProfileSearchQuery, ProfileSearchQueryVariables>;
export const SearchDocument = gql`
    query search($term: String!, $walletAddress: PublicKey!) {
  metadataJsons(term: $term, limit: 25, offset: 0) {
    name
    address
    image
    creatorAddress
    creatorTwitterHandle
  }
  profiles(term: $term, limit: 5, offset: 0) {
    address
    twitterHandle
    profile {
      profileImageUrl
      handle
    }
  }
  wallet(address: $walletAddress) {
    address
    twitterHandle
    profile {
      profileImageUrl
      handle
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      term: // value for 'term'
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;