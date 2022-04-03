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
  bigint: any;
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

export type Creator = {
  __typename?: 'Creator';
  address: Scalars['String'];
  attributeGroups: Array<AttributeGroup>;
  counts: CreatorCounts;
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

export type NftCreator = {
  __typename?: 'NftCreator';
  address: Scalars['String'];
  metadataAddress: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  share: Scalars['Int'];
  verified: Scalars['Boolean'];
};

export type NftOwner = {
  __typename?: 'NftOwner';
  address: Scalars['String'];
  associatedTokenAccountAddress: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  bannerImageUrl: Scalars['String'];
  handle: Scalars['String'];
  profileImageUrlHighres: Scalars['String'];
  profileImageUrlLowres: Scalars['String'];
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

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  bids: Array<Bid>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** columns and relationships of "graph_connections" */
export type Graph_Connections = {
  __typename?: 'graph_connections';
  address: Scalars['String'];
  from_account: Scalars['String'];
  /** An object relationship */
  from_account_twitter_handle_name_services?: Maybe<Twitter_Handle_Name_Services>;
  to_account: Scalars['String'];
  /** An object relationship */
  to_account_twitter_handle_name_services?: Maybe<Twitter_Handle_Name_Services>;
};

/** aggregated selection of "graph_connections" */
export type Graph_Connections_Aggregate = {
  __typename?: 'graph_connections_aggregate';
  aggregate?: Maybe<Graph_Connections_Aggregate_Fields>;
  nodes: Array<Graph_Connections>;
};

/** aggregate fields of "graph_connections" */
export type Graph_Connections_Aggregate_Fields = {
  __typename?: 'graph_connections_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Graph_Connections_Max_Fields>;
  min?: Maybe<Graph_Connections_Min_Fields>;
};


/** aggregate fields of "graph_connections" */
export type Graph_Connections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Graph_Connections_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "graph_connections". All fields are combined with a logical 'AND'. */
export type Graph_Connections_Bool_Exp = {
  _and?: InputMaybe<Array<Graph_Connections_Bool_Exp>>;
  _not?: InputMaybe<Graph_Connections_Bool_Exp>;
  _or?: InputMaybe<Array<Graph_Connections_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  from_account?: InputMaybe<String_Comparison_Exp>;
  from_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
  to_account?: InputMaybe<String_Comparison_Exp>;
  to_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};

/** aggregate max on columns */
export type Graph_Connections_Max_Fields = {
  __typename?: 'graph_connections_max_fields';
  address?: Maybe<Scalars['String']>;
  from_account?: Maybe<Scalars['String']>;
  to_account?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Graph_Connections_Min_Fields = {
  __typename?: 'graph_connections_min_fields';
  address?: Maybe<Scalars['String']>;
  from_account?: Maybe<Scalars['String']>;
  to_account?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "graph_connections". */
export type Graph_Connections_Order_By = {
  address?: InputMaybe<Order_By>;
  from_account?: InputMaybe<Order_By>;
  from_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Order_By>;
  to_account?: InputMaybe<Order_By>;
  to_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Order_By>;
};

/** select columns of table "graph_connections" */
export enum Graph_Connections_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  FromAccount = 'from_account',
  /** column name */
  ToAccount = 'to_account'
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  creator: Creator;
  denylist: Denylist;
  /** fetch data from the table: "graph_connections" */
  graph_connections: Array<Graph_Connections>;
  /** fetch aggregated fields from the table: "graph_connections" */
  graph_connections_aggregate: Graph_Connections_Aggregate;
  /** fetch data from the table: "graph_connections" using primary key columns */
  graph_connections_by_pk?: Maybe<Graph_Connections>;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  nft?: Maybe<Nft>;
  nfts: Array<Nft>;
  profile?: Maybe<Profile>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  /** fetch data from the table: "twitter_handle_name_services" */
  twitter_handle_name_services: Array<Twitter_Handle_Name_Services>;
  /** fetch aggregated fields from the table: "twitter_handle_name_services" */
  twitter_handle_name_services_aggregate: Twitter_Handle_Name_Services_Aggregate;
  /** fetch data from the table: "twitter_handle_name_services" using primary key columns */
  twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
  wallet?: Maybe<Wallet>;
};


export type Query_RootCreatorArgs = {
  address: Scalars['String'];
};


export type Query_RootGraph_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Graph_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Graph_Connections_Order_By>>;
  where?: InputMaybe<Graph_Connections_Bool_Exp>;
};


export type Query_RootGraph_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Graph_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Graph_Connections_Order_By>>;
  where?: InputMaybe<Graph_Connections_Bool_Exp>;
};


export type Query_RootGraph_Connections_By_PkArgs = {
  address: Scalars['String'];
};


export type Query_RootMarketplaceArgs = {
  subdomain: Scalars['String'];
};


export type Query_RootNftArgs = {
  address: Scalars['String'];
};


export type Query_RootNftsArgs = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  listed?: InputMaybe<Array<Scalars['PublicKey']>>;
  offerers?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type Query_RootProfileArgs = {
  handle: Scalars['String'];
};


export type Query_RootStorefrontArgs = {
  subdomain: Scalars['String'];
};


export type Query_RootTwitter_Handle_Name_ServicesArgs = {
  distinct_on?: InputMaybe<Array<Twitter_Handle_Name_Services_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitter_Handle_Name_Services_Order_By>>;
  where?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};


export type Query_RootTwitter_Handle_Name_Services_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Twitter_Handle_Name_Services_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitter_Handle_Name_Services_Order_By>>;
  where?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};


export type Query_RootTwitter_Handle_Name_Services_By_PkArgs = {
  address: Scalars['String'];
};


export type Query_RootWalletArgs = {
  address: Scalars['String'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "graph_connections" */
  graph_connections: Array<Graph_Connections>;
  /** fetch aggregated fields from the table: "graph_connections" */
  graph_connections_aggregate: Graph_Connections_Aggregate;
  /** fetch data from the table: "graph_connections" using primary key columns */
  graph_connections_by_pk?: Maybe<Graph_Connections>;
  /** fetch data from the table: "twitter_handle_name_services" */
  twitter_handle_name_services: Array<Twitter_Handle_Name_Services>;
  /** fetch aggregated fields from the table: "twitter_handle_name_services" */
  twitter_handle_name_services_aggregate: Twitter_Handle_Name_Services_Aggregate;
  /** fetch data from the table: "twitter_handle_name_services" using primary key columns */
  twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
};


export type Subscription_RootGraph_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Graph_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Graph_Connections_Order_By>>;
  where?: InputMaybe<Graph_Connections_Bool_Exp>;
};


export type Subscription_RootGraph_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Graph_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Graph_Connections_Order_By>>;
  where?: InputMaybe<Graph_Connections_Bool_Exp>;
};


export type Subscription_RootGraph_Connections_By_PkArgs = {
  address: Scalars['String'];
};


export type Subscription_RootTwitter_Handle_Name_ServicesArgs = {
  distinct_on?: InputMaybe<Array<Twitter_Handle_Name_Services_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitter_Handle_Name_Services_Order_By>>;
  where?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};


export type Subscription_RootTwitter_Handle_Name_Services_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Twitter_Handle_Name_Services_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Twitter_Handle_Name_Services_Order_By>>;
  where?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};


export type Subscription_RootTwitter_Handle_Name_Services_By_PkArgs = {
  address: Scalars['String'];
};

/** columns and relationships of "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services = {
  __typename?: 'twitter_handle_name_services';
  address: Scalars['String'];
  slot: Scalars['bigint'];
  twitter_handle: Scalars['String'];
  twitter_handle_profile_data?: Maybe<Profile>;
  wallet_address: Scalars['String'];
};

/** aggregated selection of "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Aggregate = {
  __typename?: 'twitter_handle_name_services_aggregate';
  aggregate?: Maybe<Twitter_Handle_Name_Services_Aggregate_Fields>;
  nodes: Array<Twitter_Handle_Name_Services>;
};

/** aggregate fields of "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Aggregate_Fields = {
  __typename?: 'twitter_handle_name_services_aggregate_fields';
  avg?: Maybe<Twitter_Handle_Name_Services_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Twitter_Handle_Name_Services_Max_Fields>;
  min?: Maybe<Twitter_Handle_Name_Services_Min_Fields>;
  stddev?: Maybe<Twitter_Handle_Name_Services_Stddev_Fields>;
  stddev_pop?: Maybe<Twitter_Handle_Name_Services_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Twitter_Handle_Name_Services_Stddev_Samp_Fields>;
  sum?: Maybe<Twitter_Handle_Name_Services_Sum_Fields>;
  var_pop?: Maybe<Twitter_Handle_Name_Services_Var_Pop_Fields>;
  var_samp?: Maybe<Twitter_Handle_Name_Services_Var_Samp_Fields>;
  variance?: Maybe<Twitter_Handle_Name_Services_Variance_Fields>;
};


/** aggregate fields of "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Twitter_Handle_Name_Services_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Twitter_Handle_Name_Services_Avg_Fields = {
  __typename?: 'twitter_handle_name_services_avg_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "twitter_handle_name_services". All fields are combined with a logical 'AND'. */
export type Twitter_Handle_Name_Services_Bool_Exp = {
  _and?: InputMaybe<Array<Twitter_Handle_Name_Services_Bool_Exp>>;
  _not?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
  _or?: InputMaybe<Array<Twitter_Handle_Name_Services_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  slot?: InputMaybe<Bigint_Comparison_Exp>;
  twitter_handle?: InputMaybe<String_Comparison_Exp>;
  wallet_address?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Twitter_Handle_Name_Services_Max_Fields = {
  __typename?: 'twitter_handle_name_services_max_fields';
  address?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['bigint']>;
  twitter_handle?: Maybe<Scalars['String']>;
  wallet_address?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Twitter_Handle_Name_Services_Min_Fields = {
  __typename?: 'twitter_handle_name_services_min_fields';
  address?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['bigint']>;
  twitter_handle?: Maybe<Scalars['String']>;
  wallet_address?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "twitter_handle_name_services". */
export type Twitter_Handle_Name_Services_Order_By = {
  address?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  twitter_handle?: InputMaybe<Order_By>;
  wallet_address?: InputMaybe<Order_By>;
};

/** select columns of table "twitter_handle_name_services" */
export enum Twitter_Handle_Name_Services_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Slot = 'slot',
  /** column name */
  TwitterHandle = 'twitter_handle',
  /** column name */
  WalletAddress = 'wallet_address'
}

/** aggregate stddev on columns */
export type Twitter_Handle_Name_Services_Stddev_Fields = {
  __typename?: 'twitter_handle_name_services_stddev_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Twitter_Handle_Name_Services_Stddev_Pop_Fields = {
  __typename?: 'twitter_handle_name_services_stddev_pop_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Twitter_Handle_Name_Services_Stddev_Samp_Fields = {
  __typename?: 'twitter_handle_name_services_stddev_samp_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Twitter_Handle_Name_Services_Sum_Fields = {
  __typename?: 'twitter_handle_name_services_sum_fields';
  slot?: Maybe<Scalars['bigint']>;
};

/** aggregate var_pop on columns */
export type Twitter_Handle_Name_Services_Var_Pop_Fields = {
  __typename?: 'twitter_handle_name_services_var_pop_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Twitter_Handle_Name_Services_Var_Samp_Fields = {
  __typename?: 'twitter_handle_name_services_var_samp_fields';
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Twitter_Handle_Name_Services_Variance_Fields = {
  __typename?: 'twitter_handle_name_services_variance_fields';
  slot?: Maybe<Scalars['Float']>;
};

export type GetPubKeyGraphConnectionsQueryVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type GetPubKeyGraphConnectionsQuery = { __typename?: 'query_root', from: Array<{ __typename?: 'graph_connections', address: string, from_account: string, to_account: string, from_twitter_handle?: { __typename?: 'twitter_handle_name_services', twitter_handle: string, twitter_handle_profile_data?: { __typename?: 'Profile', profileImageUrlHighres: string, bannerImageUrl: string } | null } | null, to_twitter_handle?: { __typename?: 'twitter_handle_name_services', twitter_handle: string, twitter_handle_profile_data?: { __typename?: 'Profile', profileImageUrlHighres: string, bannerImageUrl: string } | null } | null }>, to: Array<{ __typename?: 'graph_connections', address: string, from_account: string, to_account: string, from_twitter_handle?: { __typename?: 'twitter_handle_name_services', twitter_handle: string, twitter_handle_profile_data?: { __typename?: 'Profile', profileImageUrlHighres: string, bannerImageUrl: string } | null } | null, to_twitter_handle?: { __typename?: 'twitter_handle_name_services', twitter_handle: string, twitter_handle_profile_data?: { __typename?: 'Profile', profileImageUrlHighres: string, bannerImageUrl: string } | null } | null }> };

export type GetPubKeyGraphConnectionsCountQueryVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type GetPubKeyGraphConnectionsCountQuery = { __typename?: 'query_root', from: { __typename?: 'graph_connections_aggregate', aggregate?: { __typename?: 'graph_connections_aggregate_fields', count: number } | null }, to: { __typename?: 'graph_connections_aggregate', aggregate?: { __typename?: 'graph_connections_aggregate_fields', count: number } | null } };

export type GetPubKeyGraphConnectionsSimpleQueryVariables = Exact<{
  publicKey: Scalars['String'];
}>;


export type GetPubKeyGraphConnectionsSimpleQuery = { __typename?: 'query_root', from: Array<{ __typename?: 'graph_connections', from_account: string, to_account: string }>, to: Array<{ __typename?: 'graph_connections', from_account: string, to_account: string }> };


export const GetPubKeyGraphConnectionsDocument = gql`
    query getPubKeyGraphConnections($publicKey: String!) {
  from: graph_connections(where: {from_account: {_eq: $publicKey}}) {
    address
    from_account
    to_account
    from_twitter_handle: from_account_twitter_handle_name_services {
      twitter_handle
      twitter_handle_profile_data {
        profileImageUrlHighres
        bannerImageUrl
      }
    }
    to_twitter_handle: to_account_twitter_handle_name_services {
      twitter_handle
      twitter_handle_profile_data {
        profileImageUrlHighres
        bannerImageUrl
      }
    }
  }
  to: graph_connections(where: {to_account: {_eq: $publicKey}}) {
    address
    from_account
    to_account
    from_twitter_handle: from_account_twitter_handle_name_services {
      twitter_handle
      twitter_handle_profile_data {
        profileImageUrlHighres
        bannerImageUrl
      }
    }
    to_twitter_handle: to_account_twitter_handle_name_services {
      twitter_handle
      twitter_handle_profile_data {
        profileImageUrlHighres
        bannerImageUrl
      }
    }
  }
}
    `;

/**
 * __useGetPubKeyGraphConnectionsQuery__
 *
 * To run a query within a React component, call `useGetPubKeyGraphConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPubKeyGraphConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPubKeyGraphConnectionsQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useGetPubKeyGraphConnectionsQuery(baseOptions: Apollo.QueryHookOptions<GetPubKeyGraphConnectionsQuery, GetPubKeyGraphConnectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPubKeyGraphConnectionsQuery, GetPubKeyGraphConnectionsQueryVariables>(GetPubKeyGraphConnectionsDocument, options);
      }
export function useGetPubKeyGraphConnectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPubKeyGraphConnectionsQuery, GetPubKeyGraphConnectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPubKeyGraphConnectionsQuery, GetPubKeyGraphConnectionsQueryVariables>(GetPubKeyGraphConnectionsDocument, options);
        }
export type GetPubKeyGraphConnectionsQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsQuery>;
export type GetPubKeyGraphConnectionsLazyQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsLazyQuery>;
export type GetPubKeyGraphConnectionsQueryResult = Apollo.QueryResult<GetPubKeyGraphConnectionsQuery, GetPubKeyGraphConnectionsQueryVariables>;
export const GetPubKeyGraphConnectionsCountDocument = gql`
    query getPubKeyGraphConnectionsCount($publicKey: String!) {
  from: graph_connections_aggregate(where: {from_account: {_eq: $publicKey}}) {
    aggregate {
      count
    }
  }
  to: graph_connections_aggregate(where: {to_account: {_eq: $publicKey}}) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useGetPubKeyGraphConnectionsCountQuery__
 *
 * To run a query within a React component, call `useGetPubKeyGraphConnectionsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPubKeyGraphConnectionsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPubKeyGraphConnectionsCountQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useGetPubKeyGraphConnectionsCountQuery(baseOptions: Apollo.QueryHookOptions<GetPubKeyGraphConnectionsCountQuery, GetPubKeyGraphConnectionsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPubKeyGraphConnectionsCountQuery, GetPubKeyGraphConnectionsCountQueryVariables>(GetPubKeyGraphConnectionsCountDocument, options);
      }
export function useGetPubKeyGraphConnectionsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPubKeyGraphConnectionsCountQuery, GetPubKeyGraphConnectionsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPubKeyGraphConnectionsCountQuery, GetPubKeyGraphConnectionsCountQueryVariables>(GetPubKeyGraphConnectionsCountDocument, options);
        }
export type GetPubKeyGraphConnectionsCountQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsCountQuery>;
export type GetPubKeyGraphConnectionsCountLazyQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsCountLazyQuery>;
export type GetPubKeyGraphConnectionsCountQueryResult = Apollo.QueryResult<GetPubKeyGraphConnectionsCountQuery, GetPubKeyGraphConnectionsCountQueryVariables>;
export const GetPubKeyGraphConnectionsSimpleDocument = gql`
    query getPubKeyGraphConnectionsSimple($publicKey: String!) {
  from: graph_connections(where: {from_account: {_eq: $publicKey}}) {
    from_account
    to_account
  }
  to: graph_connections(where: {to_account: {_eq: $publicKey}}) {
    from_account
    to_account
  }
}
    `;

/**
 * __useGetPubKeyGraphConnectionsSimpleQuery__
 *
 * To run a query within a React component, call `useGetPubKeyGraphConnectionsSimpleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPubKeyGraphConnectionsSimpleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPubKeyGraphConnectionsSimpleQuery({
 *   variables: {
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useGetPubKeyGraphConnectionsSimpleQuery(baseOptions: Apollo.QueryHookOptions<GetPubKeyGraphConnectionsSimpleQuery, GetPubKeyGraphConnectionsSimpleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPubKeyGraphConnectionsSimpleQuery, GetPubKeyGraphConnectionsSimpleQueryVariables>(GetPubKeyGraphConnectionsSimpleDocument, options);
      }
export function useGetPubKeyGraphConnectionsSimpleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPubKeyGraphConnectionsSimpleQuery, GetPubKeyGraphConnectionsSimpleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPubKeyGraphConnectionsSimpleQuery, GetPubKeyGraphConnectionsSimpleQueryVariables>(GetPubKeyGraphConnectionsSimpleDocument, options);
        }
export type GetPubKeyGraphConnectionsSimpleQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsSimpleQuery>;
export type GetPubKeyGraphConnectionsSimpleLazyQueryHookResult = ReturnType<typeof useGetPubKeyGraphConnectionsSimpleLazyQuery>;
export type GetPubKeyGraphConnectionsSimpleQueryResult = Apollo.QueryResult<GetPubKeyGraphConnectionsSimpleQuery, GetPubKeyGraphConnectionsSimpleQueryVariables>;