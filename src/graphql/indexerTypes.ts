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
  timestamp: any;
  uuid: any;
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

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
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

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
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

/** columns and relationships of "attributes" */
export type Attributes = {
  __typename?: 'attributes';
  first_verified_creator?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  metadata_address: Scalars['String'];
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregated selection of "attributes" */
export type Attributes_Aggregate = {
  __typename?: 'attributes_aggregate';
  aggregate?: Maybe<Attributes_Aggregate_Fields>;
  nodes: Array<Attributes>;
};

/** aggregate fields of "attributes" */
export type Attributes_Aggregate_Fields = {
  __typename?: 'attributes_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Attributes_Max_Fields>;
  min?: Maybe<Attributes_Min_Fields>;
};


/** aggregate fields of "attributes" */
export type Attributes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Attributes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "attributes" */
export type Attributes_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Attributes_Max_Order_By>;
  min?: InputMaybe<Attributes_Min_Order_By>;
};

/** input type for inserting array relation for remote table "attributes" */
export type Attributes_Arr_Rel_Insert_Input = {
  data: Array<Attributes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Attributes_On_Conflict>;
};

/** Boolean expression to filter rows from the table "attributes". All fields are combined with a logical 'AND'. */
export type Attributes_Bool_Exp = {
  _and?: InputMaybe<Array<Attributes_Bool_Exp>>;
  _not?: InputMaybe<Attributes_Bool_Exp>;
  _or?: InputMaybe<Array<Attributes_Bool_Exp>>;
  first_verified_creator?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata_address?: InputMaybe<String_Comparison_Exp>;
  trait_type?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "attributes" */
export enum Attributes_Constraint {
  /** unique or primary key constraint */
  AttributesPkey = 'attributes_pkey'
}

/** input type for inserting data into table "attributes" */
export type Attributes_Insert_Input = {
  first_verified_creator?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  metadata_address?: InputMaybe<Scalars['String']>;
  trait_type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Attributes_Max_Fields = {
  __typename?: 'attributes_max_fields';
  first_verified_creator?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  metadata_address?: Maybe<Scalars['String']>;
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "attributes" */
export type Attributes_Max_Order_By = {
  first_verified_creator?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Attributes_Min_Fields = {
  __typename?: 'attributes_min_fields';
  first_verified_creator?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  metadata_address?: Maybe<Scalars['String']>;
  trait_type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "attributes" */
export type Attributes_Min_Order_By = {
  first_verified_creator?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "attributes" */
export type Attributes_Mutation_Response = {
  __typename?: 'attributes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Attributes>;
};

/** on_conflict condition type for table "attributes" */
export type Attributes_On_Conflict = {
  constraint: Attributes_Constraint;
  update_columns?: Array<Attributes_Update_Column>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};

/** Ordering options when selecting data from "attributes". */
export type Attributes_Order_By = {
  first_verified_creator?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  trait_type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: attributes */
export type Attributes_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "attributes" */
export enum Attributes_Select_Column {
  /** column name */
  FirstVerifiedCreator = 'first_verified_creator',
  /** column name */
  Id = 'id',
  /** column name */
  MetadataAddress = 'metadata_address',
  /** column name */
  TraitType = 'trait_type',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "attributes" */
export type Attributes_Set_Input = {
  first_verified_creator?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  metadata_address?: InputMaybe<Scalars['String']>;
  trait_type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "attributes" */
export enum Attributes_Update_Column {
  /** column name */
  FirstVerifiedCreator = 'first_verified_creator',
  /** column name */
  Id = 'id',
  /** column name */
  MetadataAddress = 'metadata_address',
  /** column name */
  TraitType = 'trait_type',
  /** column name */
  Value = 'value'
}

/** columns and relationships of "bids" */
export type Bids = {
  __typename?: 'bids';
  bidder_address: Scalars['String'];
  /** An object relationship */
  bids_listing_metadatas?: Maybe<Listing_Metadatas>;
  cancelled: Scalars['Boolean'];
  last_bid_amount: Scalars['bigint'];
  last_bid_time: Scalars['timestamp'];
  listing_address: Scalars['String'];
};

/** aggregated selection of "bids" */
export type Bids_Aggregate = {
  __typename?: 'bids_aggregate';
  aggregate?: Maybe<Bids_Aggregate_Fields>;
  nodes: Array<Bids>;
};

/** aggregate fields of "bids" */
export type Bids_Aggregate_Fields = {
  __typename?: 'bids_aggregate_fields';
  avg?: Maybe<Bids_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Bids_Max_Fields>;
  min?: Maybe<Bids_Min_Fields>;
  stddev?: Maybe<Bids_Stddev_Fields>;
  stddev_pop?: Maybe<Bids_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bids_Stddev_Samp_Fields>;
  sum?: Maybe<Bids_Sum_Fields>;
  var_pop?: Maybe<Bids_Var_Pop_Fields>;
  var_samp?: Maybe<Bids_Var_Samp_Fields>;
  variance?: Maybe<Bids_Variance_Fields>;
};


/** aggregate fields of "bids" */
export type Bids_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bids_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Bids_Avg_Fields = {
  __typename?: 'bids_avg_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "bids". All fields are combined with a logical 'AND'. */
export type Bids_Bool_Exp = {
  _and?: InputMaybe<Array<Bids_Bool_Exp>>;
  _not?: InputMaybe<Bids_Bool_Exp>;
  _or?: InputMaybe<Array<Bids_Bool_Exp>>;
  bidder_address?: InputMaybe<String_Comparison_Exp>;
  bids_listing_metadatas?: InputMaybe<Listing_Metadatas_Bool_Exp>;
  cancelled?: InputMaybe<Boolean_Comparison_Exp>;
  last_bid_amount?: InputMaybe<Bigint_Comparison_Exp>;
  last_bid_time?: InputMaybe<Timestamp_Comparison_Exp>;
  listing_address?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "bids" */
export enum Bids_Constraint {
  /** unique or primary key constraint */
  BidsPkey = 'bids_pkey'
}

/** input type for incrementing numeric columns in table "bids" */
export type Bids_Inc_Input = {
  last_bid_amount?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "bids" */
export type Bids_Insert_Input = {
  bidder_address?: InputMaybe<Scalars['String']>;
  bids_listing_metadatas?: InputMaybe<Listing_Metadatas_Obj_Rel_Insert_Input>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  last_bid_amount?: InputMaybe<Scalars['bigint']>;
  last_bid_time?: InputMaybe<Scalars['timestamp']>;
  listing_address?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Bids_Max_Fields = {
  __typename?: 'bids_max_fields';
  bidder_address?: Maybe<Scalars['String']>;
  last_bid_amount?: Maybe<Scalars['bigint']>;
  last_bid_time?: Maybe<Scalars['timestamp']>;
  listing_address?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Bids_Min_Fields = {
  __typename?: 'bids_min_fields';
  bidder_address?: Maybe<Scalars['String']>;
  last_bid_amount?: Maybe<Scalars['bigint']>;
  last_bid_time?: Maybe<Scalars['timestamp']>;
  listing_address?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "bids" */
export type Bids_Mutation_Response = {
  __typename?: 'bids_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bids>;
};

/** input type for inserting object relation for remote table "bids" */
export type Bids_Obj_Rel_Insert_Input = {
  data: Bids_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Bids_On_Conflict>;
};

/** on_conflict condition type for table "bids" */
export type Bids_On_Conflict = {
  constraint: Bids_Constraint;
  update_columns?: Array<Bids_Update_Column>;
  where?: InputMaybe<Bids_Bool_Exp>;
};

/** Ordering options when selecting data from "bids". */
export type Bids_Order_By = {
  bidder_address?: InputMaybe<Order_By>;
  bids_listing_metadatas?: InputMaybe<Listing_Metadatas_Order_By>;
  cancelled?: InputMaybe<Order_By>;
  last_bid_amount?: InputMaybe<Order_By>;
  last_bid_time?: InputMaybe<Order_By>;
  listing_address?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bids */
export type Bids_Pk_Columns_Input = {
  bidder_address: Scalars['String'];
  listing_address: Scalars['String'];
};

/** select columns of table "bids" */
export enum Bids_Select_Column {
  /** column name */
  BidderAddress = 'bidder_address',
  /** column name */
  Cancelled = 'cancelled',
  /** column name */
  LastBidAmount = 'last_bid_amount',
  /** column name */
  LastBidTime = 'last_bid_time',
  /** column name */
  ListingAddress = 'listing_address'
}

/** input type for updating data in table "bids" */
export type Bids_Set_Input = {
  bidder_address?: InputMaybe<Scalars['String']>;
  cancelled?: InputMaybe<Scalars['Boolean']>;
  last_bid_amount?: InputMaybe<Scalars['bigint']>;
  last_bid_time?: InputMaybe<Scalars['timestamp']>;
  listing_address?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Bids_Stddev_Fields = {
  __typename?: 'bids_stddev_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Bids_Stddev_Pop_Fields = {
  __typename?: 'bids_stddev_pop_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Bids_Stddev_Samp_Fields = {
  __typename?: 'bids_stddev_samp_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Bids_Sum_Fields = {
  __typename?: 'bids_sum_fields';
  last_bid_amount?: Maybe<Scalars['bigint']>;
};

/** update columns of table "bids" */
export enum Bids_Update_Column {
  /** column name */
  BidderAddress = 'bidder_address',
  /** column name */
  Cancelled = 'cancelled',
  /** column name */
  LastBidAmount = 'last_bid_amount',
  /** column name */
  LastBidTime = 'last_bid_time',
  /** column name */
  ListingAddress = 'listing_address'
}

/** aggregate var_pop on columns */
export type Bids_Var_Pop_Fields = {
  __typename?: 'bids_var_pop_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Bids_Var_Samp_Fields = {
  __typename?: 'bids_var_samp_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Bids_Variance_Fields = {
  __typename?: 'bids_variance_fields';
  last_bid_amount?: Maybe<Scalars['Float']>;
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

/** unique or primary key constraints on table "graph_connections" */
export enum Graph_Connections_Constraint {
  /** unique or primary key constraint */
  GraphConnectionsPkey = 'graph_connections_pkey'
}

/** input type for inserting data into table "graph_connections" */
export type Graph_Connections_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  from_account?: InputMaybe<Scalars['String']>;
  from_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Obj_Rel_Insert_Input>;
  to_account?: InputMaybe<Scalars['String']>;
  to_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Obj_Rel_Insert_Input>;
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

/** response of any mutation on the table "graph_connections" */
export type Graph_Connections_Mutation_Response = {
  __typename?: 'graph_connections_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Graph_Connections>;
};

/** on_conflict condition type for table "graph_connections" */
export type Graph_Connections_On_Conflict = {
  constraint: Graph_Connections_Constraint;
  update_columns?: Array<Graph_Connections_Update_Column>;
  where?: InputMaybe<Graph_Connections_Bool_Exp>;
};

/** Ordering options when selecting data from "graph_connections". */
export type Graph_Connections_Order_By = {
  address?: InputMaybe<Order_By>;
  from_account?: InputMaybe<Order_By>;
  from_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Order_By>;
  to_account?: InputMaybe<Order_By>;
  to_account_twitter_handle_name_services?: InputMaybe<Twitter_Handle_Name_Services_Order_By>;
};

/** primary key columns input for table: graph_connections */
export type Graph_Connections_Pk_Columns_Input = {
  address: Scalars['String'];
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

/** input type for updating data in table "graph_connections" */
export type Graph_Connections_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  from_account?: InputMaybe<Scalars['String']>;
  to_account?: InputMaybe<Scalars['String']>;
};

/** update columns of table "graph_connections" */
export enum Graph_Connections_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  FromAccount = 'from_account',
  /** column name */
  ToAccount = 'to_account'
}

/** columns and relationships of "listing_metadatas" */
export type Listing_Metadatas = {
  __typename?: 'listing_metadatas';
  listing_address: Scalars['String'];
  /** An object relationship */
  listing_metadatas_bids?: Maybe<Bids>;
  /** An array relationship */
  listing_metadatas_metadatas: Array<Metadatas>;
  /** An aggregate relationship */
  listing_metadatas_metadatas_aggregate: Metadatas_Aggregate;
  metadata_address: Scalars['String'];
  metadata_index: Scalars['Int'];
};


/** columns and relationships of "listing_metadatas" */
export type Listing_MetadatasListing_Metadatas_MetadatasArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};


/** columns and relationships of "listing_metadatas" */
export type Listing_MetadatasListing_Metadatas_Metadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};

/** aggregated selection of "listing_metadatas" */
export type Listing_Metadatas_Aggregate = {
  __typename?: 'listing_metadatas_aggregate';
  aggregate?: Maybe<Listing_Metadatas_Aggregate_Fields>;
  nodes: Array<Listing_Metadatas>;
};

/** aggregate fields of "listing_metadatas" */
export type Listing_Metadatas_Aggregate_Fields = {
  __typename?: 'listing_metadatas_aggregate_fields';
  avg?: Maybe<Listing_Metadatas_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Listing_Metadatas_Max_Fields>;
  min?: Maybe<Listing_Metadatas_Min_Fields>;
  stddev?: Maybe<Listing_Metadatas_Stddev_Fields>;
  stddev_pop?: Maybe<Listing_Metadatas_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Listing_Metadatas_Stddev_Samp_Fields>;
  sum?: Maybe<Listing_Metadatas_Sum_Fields>;
  var_pop?: Maybe<Listing_Metadatas_Var_Pop_Fields>;
  var_samp?: Maybe<Listing_Metadatas_Var_Samp_Fields>;
  variance?: Maybe<Listing_Metadatas_Variance_Fields>;
};


/** aggregate fields of "listing_metadatas" */
export type Listing_Metadatas_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "listing_metadatas" */
export type Listing_Metadatas_Aggregate_Order_By = {
  avg?: InputMaybe<Listing_Metadatas_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Listing_Metadatas_Max_Order_By>;
  min?: InputMaybe<Listing_Metadatas_Min_Order_By>;
  stddev?: InputMaybe<Listing_Metadatas_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Listing_Metadatas_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Listing_Metadatas_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Listing_Metadatas_Sum_Order_By>;
  var_pop?: InputMaybe<Listing_Metadatas_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Listing_Metadatas_Var_Samp_Order_By>;
  variance?: InputMaybe<Listing_Metadatas_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "listing_metadatas" */
export type Listing_Metadatas_Arr_Rel_Insert_Input = {
  data: Array<Listing_Metadatas_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Listing_Metadatas_On_Conflict>;
};

/** aggregate avg on columns */
export type Listing_Metadatas_Avg_Fields = {
  __typename?: 'listing_metadatas_avg_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Avg_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "listing_metadatas". All fields are combined with a logical 'AND'. */
export type Listing_Metadatas_Bool_Exp = {
  _and?: InputMaybe<Array<Listing_Metadatas_Bool_Exp>>;
  _not?: InputMaybe<Listing_Metadatas_Bool_Exp>;
  _or?: InputMaybe<Array<Listing_Metadatas_Bool_Exp>>;
  listing_address?: InputMaybe<String_Comparison_Exp>;
  listing_metadatas_bids?: InputMaybe<Bids_Bool_Exp>;
  listing_metadatas_metadatas?: InputMaybe<Metadatas_Bool_Exp>;
  metadata_address?: InputMaybe<String_Comparison_Exp>;
  metadata_index?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "listing_metadatas" */
export enum Listing_Metadatas_Constraint {
  /** unique or primary key constraint */
  ListingMetadatasPkey = 'listing_metadatas_pkey'
}

/** input type for incrementing numeric columns in table "listing_metadatas" */
export type Listing_Metadatas_Inc_Input = {
  metadata_index?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "listing_metadatas" */
export type Listing_Metadatas_Insert_Input = {
  listing_address?: InputMaybe<Scalars['String']>;
  listing_metadatas_bids?: InputMaybe<Bids_Obj_Rel_Insert_Input>;
  listing_metadatas_metadatas?: InputMaybe<Metadatas_Arr_Rel_Insert_Input>;
  metadata_address?: InputMaybe<Scalars['String']>;
  metadata_index?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Listing_Metadatas_Max_Fields = {
  __typename?: 'listing_metadatas_max_fields';
  listing_address?: Maybe<Scalars['String']>;
  metadata_address?: Maybe<Scalars['String']>;
  metadata_index?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Max_Order_By = {
  listing_address?: InputMaybe<Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Listing_Metadatas_Min_Fields = {
  __typename?: 'listing_metadatas_min_fields';
  listing_address?: Maybe<Scalars['String']>;
  metadata_address?: Maybe<Scalars['String']>;
  metadata_index?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Min_Order_By = {
  listing_address?: InputMaybe<Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  metadata_index?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "listing_metadatas" */
export type Listing_Metadatas_Mutation_Response = {
  __typename?: 'listing_metadatas_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Listing_Metadatas>;
};

/** input type for inserting object relation for remote table "listing_metadatas" */
export type Listing_Metadatas_Obj_Rel_Insert_Input = {
  data: Listing_Metadatas_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Listing_Metadatas_On_Conflict>;
};

/** on_conflict condition type for table "listing_metadatas" */
export type Listing_Metadatas_On_Conflict = {
  constraint: Listing_Metadatas_Constraint;
  update_columns?: Array<Listing_Metadatas_Update_Column>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};

/** Ordering options when selecting data from "listing_metadatas". */
export type Listing_Metadatas_Order_By = {
  listing_address?: InputMaybe<Order_By>;
  listing_metadatas_bids?: InputMaybe<Bids_Order_By>;
  listing_metadatas_metadatas_aggregate?: InputMaybe<Metadatas_Aggregate_Order_By>;
  metadata_address?: InputMaybe<Order_By>;
  metadata_index?: InputMaybe<Order_By>;
};

/** primary key columns input for table: listing_metadatas */
export type Listing_Metadatas_Pk_Columns_Input = {
  listing_address: Scalars['String'];
  metadata_address: Scalars['String'];
};

/** select columns of table "listing_metadatas" */
export enum Listing_Metadatas_Select_Column {
  /** column name */
  ListingAddress = 'listing_address',
  /** column name */
  MetadataAddress = 'metadata_address',
  /** column name */
  MetadataIndex = 'metadata_index'
}

/** input type for updating data in table "listing_metadatas" */
export type Listing_Metadatas_Set_Input = {
  listing_address?: InputMaybe<Scalars['String']>;
  metadata_address?: InputMaybe<Scalars['String']>;
  metadata_index?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Listing_Metadatas_Stddev_Fields = {
  __typename?: 'listing_metadatas_stddev_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Stddev_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Listing_Metadatas_Stddev_Pop_Fields = {
  __typename?: 'listing_metadatas_stddev_pop_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Stddev_Pop_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Listing_Metadatas_Stddev_Samp_Fields = {
  __typename?: 'listing_metadatas_stddev_samp_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Stddev_Samp_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Listing_Metadatas_Sum_Fields = {
  __typename?: 'listing_metadatas_sum_fields';
  metadata_index?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Sum_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** update columns of table "listing_metadatas" */
export enum Listing_Metadatas_Update_Column {
  /** column name */
  ListingAddress = 'listing_address',
  /** column name */
  MetadataAddress = 'metadata_address',
  /** column name */
  MetadataIndex = 'metadata_index'
}

/** aggregate var_pop on columns */
export type Listing_Metadatas_Var_Pop_Fields = {
  __typename?: 'listing_metadatas_var_pop_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Var_Pop_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Listing_Metadatas_Var_Samp_Fields = {
  __typename?: 'listing_metadatas_var_samp_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Var_Samp_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Listing_Metadatas_Variance_Fields = {
  __typename?: 'listing_metadatas_variance_fields';
  metadata_index?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "listing_metadatas" */
export type Listing_Metadatas_Variance_Order_By = {
  metadata_index?: InputMaybe<Order_By>;
};

/** columns and relationships of "metadatas" */
export type Metadatas = {
  __typename?: 'metadatas';
  address: Scalars['String'];
  edition_nonce?: Maybe<Scalars['Int']>;
  edition_pda: Scalars['String'];
  is_mutable: Scalars['Boolean'];
  /** An array relationship */
  metadatas_attributes: Array<Attributes>;
  /** An aggregate relationship */
  metadatas_attributes_aggregate: Attributes_Aggregate;
  /** An array relationship */
  metadatas_listing_metadatas: Array<Listing_Metadatas>;
  /** An aggregate relationship */
  metadatas_listing_metadatas_aggregate: Listing_Metadatas_Aggregate;
  /** An object relationship */
  metadatas_token_accounts?: Maybe<Token_Accounts>;
  mint_address: Scalars['String'];
  name: Scalars['String'];
  primary_sale_happened: Scalars['Boolean'];
  seller_fee_basis_points: Scalars['Int'];
  symbol: Scalars['String'];
  update_authority_address: Scalars['String'];
  uri: Scalars['String'];
};


/** columns and relationships of "metadatas" */
export type MetadatasMetadatas_AttributesArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


/** columns and relationships of "metadatas" */
export type MetadatasMetadatas_Attributes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


/** columns and relationships of "metadatas" */
export type MetadatasMetadatas_Listing_MetadatasArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};


/** columns and relationships of "metadatas" */
export type MetadatasMetadatas_Listing_Metadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};

/** aggregated selection of "metadatas" */
export type Metadatas_Aggregate = {
  __typename?: 'metadatas_aggregate';
  aggregate?: Maybe<Metadatas_Aggregate_Fields>;
  nodes: Array<Metadatas>;
};

/** aggregate fields of "metadatas" */
export type Metadatas_Aggregate_Fields = {
  __typename?: 'metadatas_aggregate_fields';
  avg?: Maybe<Metadatas_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Metadatas_Max_Fields>;
  min?: Maybe<Metadatas_Min_Fields>;
  stddev?: Maybe<Metadatas_Stddev_Fields>;
  stddev_pop?: Maybe<Metadatas_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Metadatas_Stddev_Samp_Fields>;
  sum?: Maybe<Metadatas_Sum_Fields>;
  var_pop?: Maybe<Metadatas_Var_Pop_Fields>;
  var_samp?: Maybe<Metadatas_Var_Samp_Fields>;
  variance?: Maybe<Metadatas_Variance_Fields>;
};


/** aggregate fields of "metadatas" */
export type Metadatas_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Metadatas_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "metadatas" */
export type Metadatas_Aggregate_Order_By = {
  avg?: InputMaybe<Metadatas_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Metadatas_Max_Order_By>;
  min?: InputMaybe<Metadatas_Min_Order_By>;
  stddev?: InputMaybe<Metadatas_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Metadatas_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Metadatas_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Metadatas_Sum_Order_By>;
  var_pop?: InputMaybe<Metadatas_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Metadatas_Var_Samp_Order_By>;
  variance?: InputMaybe<Metadatas_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "metadatas" */
export type Metadatas_Arr_Rel_Insert_Input = {
  data: Array<Metadatas_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Metadatas_On_Conflict>;
};

/** aggregate avg on columns */
export type Metadatas_Avg_Fields = {
  __typename?: 'metadatas_avg_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "metadatas" */
export type Metadatas_Avg_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "metadatas". All fields are combined with a logical 'AND'. */
export type Metadatas_Bool_Exp = {
  _and?: InputMaybe<Array<Metadatas_Bool_Exp>>;
  _not?: InputMaybe<Metadatas_Bool_Exp>;
  _or?: InputMaybe<Array<Metadatas_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  edition_nonce?: InputMaybe<Int_Comparison_Exp>;
  edition_pda?: InputMaybe<String_Comparison_Exp>;
  is_mutable?: InputMaybe<Boolean_Comparison_Exp>;
  metadatas_attributes?: InputMaybe<Attributes_Bool_Exp>;
  metadatas_listing_metadatas?: InputMaybe<Listing_Metadatas_Bool_Exp>;
  metadatas_token_accounts?: InputMaybe<Token_Accounts_Bool_Exp>;
  mint_address?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  primary_sale_happened?: InputMaybe<Boolean_Comparison_Exp>;
  seller_fee_basis_points?: InputMaybe<Int_Comparison_Exp>;
  symbol?: InputMaybe<String_Comparison_Exp>;
  update_authority_address?: InputMaybe<String_Comparison_Exp>;
  uri?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "metadatas" */
export enum Metadatas_Constraint {
  /** unique or primary key constraint */
  MetadatasPkey = 'metadatas_pkey'
}

/** input type for incrementing numeric columns in table "metadatas" */
export type Metadatas_Inc_Input = {
  edition_nonce?: InputMaybe<Scalars['Int']>;
  seller_fee_basis_points?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "metadatas" */
export type Metadatas_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  edition_nonce?: InputMaybe<Scalars['Int']>;
  edition_pda?: InputMaybe<Scalars['String']>;
  is_mutable?: InputMaybe<Scalars['Boolean']>;
  metadatas_attributes?: InputMaybe<Attributes_Arr_Rel_Insert_Input>;
  metadatas_listing_metadatas?: InputMaybe<Listing_Metadatas_Arr_Rel_Insert_Input>;
  metadatas_token_accounts?: InputMaybe<Token_Accounts_Obj_Rel_Insert_Input>;
  mint_address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  primary_sale_happened?: InputMaybe<Scalars['Boolean']>;
  seller_fee_basis_points?: InputMaybe<Scalars['Int']>;
  symbol?: InputMaybe<Scalars['String']>;
  update_authority_address?: InputMaybe<Scalars['String']>;
  uri?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Metadatas_Max_Fields = {
  __typename?: 'metadatas_max_fields';
  address?: Maybe<Scalars['String']>;
  edition_nonce?: Maybe<Scalars['Int']>;
  edition_pda?: Maybe<Scalars['String']>;
  mint_address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  seller_fee_basis_points?: Maybe<Scalars['Int']>;
  symbol?: Maybe<Scalars['String']>;
  update_authority_address?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "metadatas" */
export type Metadatas_Max_Order_By = {
  address?: InputMaybe<Order_By>;
  edition_nonce?: InputMaybe<Order_By>;
  edition_pda?: InputMaybe<Order_By>;
  mint_address?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  update_authority_address?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Metadatas_Min_Fields = {
  __typename?: 'metadatas_min_fields';
  address?: Maybe<Scalars['String']>;
  edition_nonce?: Maybe<Scalars['Int']>;
  edition_pda?: Maybe<Scalars['String']>;
  mint_address?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  seller_fee_basis_points?: Maybe<Scalars['Int']>;
  symbol?: Maybe<Scalars['String']>;
  update_authority_address?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "metadatas" */
export type Metadatas_Min_Order_By = {
  address?: InputMaybe<Order_By>;
  edition_nonce?: InputMaybe<Order_By>;
  edition_pda?: InputMaybe<Order_By>;
  mint_address?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  update_authority_address?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "metadatas" */
export type Metadatas_Mutation_Response = {
  __typename?: 'metadatas_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Metadatas>;
};

/** input type for inserting object relation for remote table "metadatas" */
export type Metadatas_Obj_Rel_Insert_Input = {
  data: Metadatas_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Metadatas_On_Conflict>;
};

/** on_conflict condition type for table "metadatas" */
export type Metadatas_On_Conflict = {
  constraint: Metadatas_Constraint;
  update_columns?: Array<Metadatas_Update_Column>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};

/** Ordering options when selecting data from "metadatas". */
export type Metadatas_Order_By = {
  address?: InputMaybe<Order_By>;
  edition_nonce?: InputMaybe<Order_By>;
  edition_pda?: InputMaybe<Order_By>;
  is_mutable?: InputMaybe<Order_By>;
  metadatas_attributes_aggregate?: InputMaybe<Attributes_Aggregate_Order_By>;
  metadatas_listing_metadatas_aggregate?: InputMaybe<Listing_Metadatas_Aggregate_Order_By>;
  metadatas_token_accounts?: InputMaybe<Token_Accounts_Order_By>;
  mint_address?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  primary_sale_happened?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  update_authority_address?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
};

/** primary key columns input for table: metadatas */
export type Metadatas_Pk_Columns_Input = {
  address: Scalars['String'];
};

/** select columns of table "metadatas" */
export enum Metadatas_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  EditionNonce = 'edition_nonce',
  /** column name */
  EditionPda = 'edition_pda',
  /** column name */
  IsMutable = 'is_mutable',
  /** column name */
  MintAddress = 'mint_address',
  /** column name */
  Name = 'name',
  /** column name */
  PrimarySaleHappened = 'primary_sale_happened',
  /** column name */
  SellerFeeBasisPoints = 'seller_fee_basis_points',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdateAuthorityAddress = 'update_authority_address',
  /** column name */
  Uri = 'uri'
}

/** input type for updating data in table "metadatas" */
export type Metadatas_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  edition_nonce?: InputMaybe<Scalars['Int']>;
  edition_pda?: InputMaybe<Scalars['String']>;
  is_mutable?: InputMaybe<Scalars['Boolean']>;
  mint_address?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  primary_sale_happened?: InputMaybe<Scalars['Boolean']>;
  seller_fee_basis_points?: InputMaybe<Scalars['Int']>;
  symbol?: InputMaybe<Scalars['String']>;
  update_authority_address?: InputMaybe<Scalars['String']>;
  uri?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Metadatas_Stddev_Fields = {
  __typename?: 'metadatas_stddev_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "metadatas" */
export type Metadatas_Stddev_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Metadatas_Stddev_Pop_Fields = {
  __typename?: 'metadatas_stddev_pop_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "metadatas" */
export type Metadatas_Stddev_Pop_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Metadatas_Stddev_Samp_Fields = {
  __typename?: 'metadatas_stddev_samp_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "metadatas" */
export type Metadatas_Stddev_Samp_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Metadatas_Sum_Fields = {
  __typename?: 'metadatas_sum_fields';
  edition_nonce?: Maybe<Scalars['Int']>;
  seller_fee_basis_points?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "metadatas" */
export type Metadatas_Sum_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** update columns of table "metadatas" */
export enum Metadatas_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  EditionNonce = 'edition_nonce',
  /** column name */
  EditionPda = 'edition_pda',
  /** column name */
  IsMutable = 'is_mutable',
  /** column name */
  MintAddress = 'mint_address',
  /** column name */
  Name = 'name',
  /** column name */
  PrimarySaleHappened = 'primary_sale_happened',
  /** column name */
  SellerFeeBasisPoints = 'seller_fee_basis_points',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  UpdateAuthorityAddress = 'update_authority_address',
  /** column name */
  Uri = 'uri'
}

/** aggregate var_pop on columns */
export type Metadatas_Var_Pop_Fields = {
  __typename?: 'metadatas_var_pop_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "metadatas" */
export type Metadatas_Var_Pop_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Metadatas_Var_Samp_Fields = {
  __typename?: 'metadatas_var_samp_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "metadatas" */
export type Metadatas_Var_Samp_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Metadatas_Variance_Fields = {
  __typename?: 'metadatas_variance_fields';
  edition_nonce?: Maybe<Scalars['Float']>;
  seller_fee_basis_points?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "metadatas" */
export type Metadatas_Variance_Order_By = {
  edition_nonce?: InputMaybe<Order_By>;
  seller_fee_basis_points?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "attributes" */
  delete_attributes?: Maybe<Attributes_Mutation_Response>;
  /** delete single row from the table: "attributes" */
  delete_attributes_by_pk?: Maybe<Attributes>;
  /** delete data from the table: "bids" */
  delete_bids?: Maybe<Bids_Mutation_Response>;
  /** delete single row from the table: "bids" */
  delete_bids_by_pk?: Maybe<Bids>;
  /** delete data from the table: "graph_connections" */
  delete_graph_connections?: Maybe<Graph_Connections_Mutation_Response>;
  /** delete single row from the table: "graph_connections" */
  delete_graph_connections_by_pk?: Maybe<Graph_Connections>;
  /** delete data from the table: "listing_metadatas" */
  delete_listing_metadatas?: Maybe<Listing_Metadatas_Mutation_Response>;
  /** delete single row from the table: "listing_metadatas" */
  delete_listing_metadatas_by_pk?: Maybe<Listing_Metadatas>;
  /** delete data from the table: "metadatas" */
  delete_metadatas?: Maybe<Metadatas_Mutation_Response>;
  /** delete single row from the table: "metadatas" */
  delete_metadatas_by_pk?: Maybe<Metadatas>;
  /** delete data from the table: "token_accounts" */
  delete_token_accounts?: Maybe<Token_Accounts_Mutation_Response>;
  /** delete single row from the table: "token_accounts" */
  delete_token_accounts_by_pk?: Maybe<Token_Accounts>;
  /** delete data from the table: "twitter_handle_name_services" */
  delete_twitter_handle_name_services?: Maybe<Twitter_Handle_Name_Services_Mutation_Response>;
  /** delete single row from the table: "twitter_handle_name_services" */
  delete_twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
  /** insert data into the table: "attributes" */
  insert_attributes?: Maybe<Attributes_Mutation_Response>;
  /** insert a single row into the table: "attributes" */
  insert_attributes_one?: Maybe<Attributes>;
  /** insert data into the table: "bids" */
  insert_bids?: Maybe<Bids_Mutation_Response>;
  /** insert a single row into the table: "bids" */
  insert_bids_one?: Maybe<Bids>;
  /** insert data into the table: "graph_connections" */
  insert_graph_connections?: Maybe<Graph_Connections_Mutation_Response>;
  /** insert a single row into the table: "graph_connections" */
  insert_graph_connections_one?: Maybe<Graph_Connections>;
  /** insert data into the table: "listing_metadatas" */
  insert_listing_metadatas?: Maybe<Listing_Metadatas_Mutation_Response>;
  /** insert a single row into the table: "listing_metadatas" */
  insert_listing_metadatas_one?: Maybe<Listing_Metadatas>;
  /** insert data into the table: "metadatas" */
  insert_metadatas?: Maybe<Metadatas_Mutation_Response>;
  /** insert a single row into the table: "metadatas" */
  insert_metadatas_one?: Maybe<Metadatas>;
  /** insert data into the table: "token_accounts" */
  insert_token_accounts?: Maybe<Token_Accounts_Mutation_Response>;
  /** insert a single row into the table: "token_accounts" */
  insert_token_accounts_one?: Maybe<Token_Accounts>;
  /** insert data into the table: "twitter_handle_name_services" */
  insert_twitter_handle_name_services?: Maybe<Twitter_Handle_Name_Services_Mutation_Response>;
  /** insert a single row into the table: "twitter_handle_name_services" */
  insert_twitter_handle_name_services_one?: Maybe<Twitter_Handle_Name_Services>;
  /** update data of the table: "attributes" */
  update_attributes?: Maybe<Attributes_Mutation_Response>;
  /** update single row of the table: "attributes" */
  update_attributes_by_pk?: Maybe<Attributes>;
  /** update data of the table: "bids" */
  update_bids?: Maybe<Bids_Mutation_Response>;
  /** update single row of the table: "bids" */
  update_bids_by_pk?: Maybe<Bids>;
  /** update data of the table: "graph_connections" */
  update_graph_connections?: Maybe<Graph_Connections_Mutation_Response>;
  /** update single row of the table: "graph_connections" */
  update_graph_connections_by_pk?: Maybe<Graph_Connections>;
  /** update data of the table: "listing_metadatas" */
  update_listing_metadatas?: Maybe<Listing_Metadatas_Mutation_Response>;
  /** update single row of the table: "listing_metadatas" */
  update_listing_metadatas_by_pk?: Maybe<Listing_Metadatas>;
  /** update data of the table: "metadatas" */
  update_metadatas?: Maybe<Metadatas_Mutation_Response>;
  /** update single row of the table: "metadatas" */
  update_metadatas_by_pk?: Maybe<Metadatas>;
  /** update data of the table: "token_accounts" */
  update_token_accounts?: Maybe<Token_Accounts_Mutation_Response>;
  /** update single row of the table: "token_accounts" */
  update_token_accounts_by_pk?: Maybe<Token_Accounts>;
  /** update data of the table: "twitter_handle_name_services" */
  update_twitter_handle_name_services?: Maybe<Twitter_Handle_Name_Services_Mutation_Response>;
  /** update single row of the table: "twitter_handle_name_services" */
  update_twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
};


/** mutation root */
export type Mutation_RootDelete_AttributesArgs = {
  where: Attributes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attributes_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_BidsArgs = {
  where: Bids_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bids_By_PkArgs = {
  bidder_address: Scalars['String'];
  listing_address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Graph_ConnectionsArgs = {
  where: Graph_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Graph_Connections_By_PkArgs = {
  address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Listing_MetadatasArgs = {
  where: Listing_Metadatas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Listing_Metadatas_By_PkArgs = {
  listing_address: Scalars['String'];
  metadata_address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_MetadatasArgs = {
  where: Metadatas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Metadatas_By_PkArgs = {
  address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Token_AccountsArgs = {
  where: Token_Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Token_Accounts_By_PkArgs = {
  address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Twitter_Handle_Name_ServicesArgs = {
  where: Twitter_Handle_Name_Services_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Twitter_Handle_Name_Services_By_PkArgs = {
  address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_AttributesArgs = {
  objects: Array<Attributes_Insert_Input>;
  on_conflict?: InputMaybe<Attributes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attributes_OneArgs = {
  object: Attributes_Insert_Input;
  on_conflict?: InputMaybe<Attributes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BidsArgs = {
  objects: Array<Bids_Insert_Input>;
  on_conflict?: InputMaybe<Bids_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bids_OneArgs = {
  object: Bids_Insert_Input;
  on_conflict?: InputMaybe<Bids_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Graph_ConnectionsArgs = {
  objects: Array<Graph_Connections_Insert_Input>;
  on_conflict?: InputMaybe<Graph_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Graph_Connections_OneArgs = {
  object: Graph_Connections_Insert_Input;
  on_conflict?: InputMaybe<Graph_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Listing_MetadatasArgs = {
  objects: Array<Listing_Metadatas_Insert_Input>;
  on_conflict?: InputMaybe<Listing_Metadatas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Listing_Metadatas_OneArgs = {
  object: Listing_Metadatas_Insert_Input;
  on_conflict?: InputMaybe<Listing_Metadatas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MetadatasArgs = {
  objects: Array<Metadatas_Insert_Input>;
  on_conflict?: InputMaybe<Metadatas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Metadatas_OneArgs = {
  object: Metadatas_Insert_Input;
  on_conflict?: InputMaybe<Metadatas_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Token_AccountsArgs = {
  objects: Array<Token_Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Token_Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Token_Accounts_OneArgs = {
  object: Token_Accounts_Insert_Input;
  on_conflict?: InputMaybe<Token_Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Twitter_Handle_Name_ServicesArgs = {
  objects: Array<Twitter_Handle_Name_Services_Insert_Input>;
  on_conflict?: InputMaybe<Twitter_Handle_Name_Services_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Twitter_Handle_Name_Services_OneArgs = {
  object: Twitter_Handle_Name_Services_Insert_Input;
  on_conflict?: InputMaybe<Twitter_Handle_Name_Services_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AttributesArgs = {
  _set?: InputMaybe<Attributes_Set_Input>;
  where: Attributes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attributes_By_PkArgs = {
  _set?: InputMaybe<Attributes_Set_Input>;
  pk_columns: Attributes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_BidsArgs = {
  _inc?: InputMaybe<Bids_Inc_Input>;
  _set?: InputMaybe<Bids_Set_Input>;
  where: Bids_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bids_By_PkArgs = {
  _inc?: InputMaybe<Bids_Inc_Input>;
  _set?: InputMaybe<Bids_Set_Input>;
  pk_columns: Bids_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Graph_ConnectionsArgs = {
  _set?: InputMaybe<Graph_Connections_Set_Input>;
  where: Graph_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Graph_Connections_By_PkArgs = {
  _set?: InputMaybe<Graph_Connections_Set_Input>;
  pk_columns: Graph_Connections_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Listing_MetadatasArgs = {
  _inc?: InputMaybe<Listing_Metadatas_Inc_Input>;
  _set?: InputMaybe<Listing_Metadatas_Set_Input>;
  where: Listing_Metadatas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Listing_Metadatas_By_PkArgs = {
  _inc?: InputMaybe<Listing_Metadatas_Inc_Input>;
  _set?: InputMaybe<Listing_Metadatas_Set_Input>;
  pk_columns: Listing_Metadatas_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MetadatasArgs = {
  _inc?: InputMaybe<Metadatas_Inc_Input>;
  _set?: InputMaybe<Metadatas_Set_Input>;
  where: Metadatas_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Metadatas_By_PkArgs = {
  _inc?: InputMaybe<Metadatas_Inc_Input>;
  _set?: InputMaybe<Metadatas_Set_Input>;
  pk_columns: Metadatas_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Token_AccountsArgs = {
  _inc?: InputMaybe<Token_Accounts_Inc_Input>;
  _set?: InputMaybe<Token_Accounts_Set_Input>;
  where: Token_Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Token_Accounts_By_PkArgs = {
  _inc?: InputMaybe<Token_Accounts_Inc_Input>;
  _set?: InputMaybe<Token_Accounts_Set_Input>;
  pk_columns: Token_Accounts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Twitter_Handle_Name_ServicesArgs = {
  _inc?: InputMaybe<Twitter_Handle_Name_Services_Inc_Input>;
  _set?: InputMaybe<Twitter_Handle_Name_Services_Set_Input>;
  where: Twitter_Handle_Name_Services_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Twitter_Handle_Name_Services_By_PkArgs = {
  _inc?: InputMaybe<Twitter_Handle_Name_Services_Inc_Input>;
  _set?: InputMaybe<Twitter_Handle_Name_Services_Set_Input>;
  pk_columns: Twitter_Handle_Name_Services_Pk_Columns_Input;
};

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
  /** fetch data from the table: "attributes" */
  attributes: Array<Attributes>;
  /** fetch aggregated fields from the table: "attributes" */
  attributes_aggregate: Attributes_Aggregate;
  /** fetch data from the table: "attributes" using primary key columns */
  attributes_by_pk?: Maybe<Attributes>;
  /** fetch data from the table: "bids" */
  bids: Array<Bids>;
  /** fetch aggregated fields from the table: "bids" */
  bids_aggregate: Bids_Aggregate;
  /** fetch data from the table: "bids" using primary key columns */
  bids_by_pk?: Maybe<Bids>;
  creator: Creator;
  denylist: Denylist;
  /** fetch data from the table: "graph_connections" */
  graph_connections: Array<Graph_Connections>;
  /** fetch aggregated fields from the table: "graph_connections" */
  graph_connections_aggregate: Graph_Connections_Aggregate;
  /** fetch data from the table: "graph_connections" using primary key columns */
  graph_connections_by_pk?: Maybe<Graph_Connections>;
  /** fetch data from the table: "listing_metadatas" */
  listing_metadatas: Array<Listing_Metadatas>;
  /** fetch aggregated fields from the table: "listing_metadatas" */
  listing_metadatas_aggregate: Listing_Metadatas_Aggregate;
  /** fetch data from the table: "listing_metadatas" using primary key columns */
  listing_metadatas_by_pk?: Maybe<Listing_Metadatas>;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  /** fetch data from the table: "metadatas" */
  metadatas: Array<Metadatas>;
  /** fetch aggregated fields from the table: "metadatas" */
  metadatas_aggregate: Metadatas_Aggregate;
  /** fetch data from the table: "metadatas" using primary key columns */
  metadatas_by_pk?: Maybe<Metadatas>;
  nft?: Maybe<Nft>;
  nfts: Array<Nft>;
  profile?: Maybe<Profile>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  /** fetch data from the table: "token_accounts" */
  token_accounts: Array<Token_Accounts>;
  /** fetch aggregated fields from the table: "token_accounts" */
  token_accounts_aggregate: Token_Accounts_Aggregate;
  /** fetch data from the table: "token_accounts" using primary key columns */
  token_accounts_by_pk?: Maybe<Token_Accounts>;
  /** fetch data from the table: "twitter_handle_name_services" */
  twitter_handle_name_services: Array<Twitter_Handle_Name_Services>;
  /** fetch aggregated fields from the table: "twitter_handle_name_services" */
  twitter_handle_name_services_aggregate: Twitter_Handle_Name_Services_Aggregate;
  /** fetch data from the table: "twitter_handle_name_services" using primary key columns */
  twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
  wallet?: Maybe<Wallet>;
};


export type Query_RootAttributesArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


export type Query_RootAttributes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


export type Query_RootAttributes_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootBidsArgs = {
  distinct_on?: InputMaybe<Array<Bids_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bids_Order_By>>;
  where?: InputMaybe<Bids_Bool_Exp>;
};


export type Query_RootBids_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bids_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bids_Order_By>>;
  where?: InputMaybe<Bids_Bool_Exp>;
};


export type Query_RootBids_By_PkArgs = {
  bidder_address: Scalars['String'];
  listing_address: Scalars['String'];
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


export type Query_RootListing_MetadatasArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};


export type Query_RootListing_Metadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};


export type Query_RootListing_Metadatas_By_PkArgs = {
  listing_address: Scalars['String'];
  metadata_address: Scalars['String'];
};


export type Query_RootMarketplaceArgs = {
  subdomain: Scalars['String'];
};


export type Query_RootMetadatasArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};


export type Query_RootMetadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};


export type Query_RootMetadatas_By_PkArgs = {
  address: Scalars['String'];
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


export type Query_RootToken_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Token_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Token_Accounts_Order_By>>;
  where?: InputMaybe<Token_Accounts_Bool_Exp>;
};


export type Query_RootToken_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Token_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Token_Accounts_Order_By>>;
  where?: InputMaybe<Token_Accounts_Bool_Exp>;
};


export type Query_RootToken_Accounts_By_PkArgs = {
  address: Scalars['String'];
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
  /** fetch data from the table: "attributes" */
  attributes: Array<Attributes>;
  /** fetch aggregated fields from the table: "attributes" */
  attributes_aggregate: Attributes_Aggregate;
  /** fetch data from the table: "attributes" using primary key columns */
  attributes_by_pk?: Maybe<Attributes>;
  /** fetch data from the table: "bids" */
  bids: Array<Bids>;
  /** fetch aggregated fields from the table: "bids" */
  bids_aggregate: Bids_Aggregate;
  /** fetch data from the table: "bids" using primary key columns */
  bids_by_pk?: Maybe<Bids>;
  /** fetch data from the table: "graph_connections" */
  graph_connections: Array<Graph_Connections>;
  /** fetch aggregated fields from the table: "graph_connections" */
  graph_connections_aggregate: Graph_Connections_Aggregate;
  /** fetch data from the table: "graph_connections" using primary key columns */
  graph_connections_by_pk?: Maybe<Graph_Connections>;
  /** fetch data from the table: "listing_metadatas" */
  listing_metadatas: Array<Listing_Metadatas>;
  /** fetch aggregated fields from the table: "listing_metadatas" */
  listing_metadatas_aggregate: Listing_Metadatas_Aggregate;
  /** fetch data from the table: "listing_metadatas" using primary key columns */
  listing_metadatas_by_pk?: Maybe<Listing_Metadatas>;
  /** fetch data from the table: "metadatas" */
  metadatas: Array<Metadatas>;
  /** fetch aggregated fields from the table: "metadatas" */
  metadatas_aggregate: Metadatas_Aggregate;
  /** fetch data from the table: "metadatas" using primary key columns */
  metadatas_by_pk?: Maybe<Metadatas>;
  /** fetch data from the table: "token_accounts" */
  token_accounts: Array<Token_Accounts>;
  /** fetch aggregated fields from the table: "token_accounts" */
  token_accounts_aggregate: Token_Accounts_Aggregate;
  /** fetch data from the table: "token_accounts" using primary key columns */
  token_accounts_by_pk?: Maybe<Token_Accounts>;
  /** fetch data from the table: "twitter_handle_name_services" */
  twitter_handle_name_services: Array<Twitter_Handle_Name_Services>;
  /** fetch aggregated fields from the table: "twitter_handle_name_services" */
  twitter_handle_name_services_aggregate: Twitter_Handle_Name_Services_Aggregate;
  /** fetch data from the table: "twitter_handle_name_services" using primary key columns */
  twitter_handle_name_services_by_pk?: Maybe<Twitter_Handle_Name_Services>;
};


export type Subscription_RootAttributesArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


export type Subscription_RootAttributes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Attributes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Attributes_Order_By>>;
  where?: InputMaybe<Attributes_Bool_Exp>;
};


export type Subscription_RootAttributes_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootBidsArgs = {
  distinct_on?: InputMaybe<Array<Bids_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bids_Order_By>>;
  where?: InputMaybe<Bids_Bool_Exp>;
};


export type Subscription_RootBids_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bids_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bids_Order_By>>;
  where?: InputMaybe<Bids_Bool_Exp>;
};


export type Subscription_RootBids_By_PkArgs = {
  bidder_address: Scalars['String'];
  listing_address: Scalars['String'];
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


export type Subscription_RootListing_MetadatasArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};


export type Subscription_RootListing_Metadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listing_Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Listing_Metadatas_Order_By>>;
  where?: InputMaybe<Listing_Metadatas_Bool_Exp>;
};


export type Subscription_RootListing_Metadatas_By_PkArgs = {
  listing_address: Scalars['String'];
  metadata_address: Scalars['String'];
};


export type Subscription_RootMetadatasArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};


export type Subscription_RootMetadatas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Metadatas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Metadatas_Order_By>>;
  where?: InputMaybe<Metadatas_Bool_Exp>;
};


export type Subscription_RootMetadatas_By_PkArgs = {
  address: Scalars['String'];
};


export type Subscription_RootToken_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Token_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Token_Accounts_Order_By>>;
  where?: InputMaybe<Token_Accounts_Bool_Exp>;
};


export type Subscription_RootToken_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Token_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Token_Accounts_Order_By>>;
  where?: InputMaybe<Token_Accounts_Bool_Exp>;
};


export type Subscription_RootToken_Accounts_By_PkArgs = {
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

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** columns and relationships of "token_accounts" */
export type Token_Accounts = {
  __typename?: 'token_accounts';
  address: Scalars['String'];
  amount: Scalars['bigint'];
  mint_address: Scalars['String'];
  owner_address: Scalars['String'];
  slot?: Maybe<Scalars['bigint']>;
  /** An object relationship */
  token_accounts_metadatas?: Maybe<Metadatas>;
  updated_at: Scalars['timestamp'];
};

/** aggregated selection of "token_accounts" */
export type Token_Accounts_Aggregate = {
  __typename?: 'token_accounts_aggregate';
  aggregate?: Maybe<Token_Accounts_Aggregate_Fields>;
  nodes: Array<Token_Accounts>;
};

/** aggregate fields of "token_accounts" */
export type Token_Accounts_Aggregate_Fields = {
  __typename?: 'token_accounts_aggregate_fields';
  avg?: Maybe<Token_Accounts_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Token_Accounts_Max_Fields>;
  min?: Maybe<Token_Accounts_Min_Fields>;
  stddev?: Maybe<Token_Accounts_Stddev_Fields>;
  stddev_pop?: Maybe<Token_Accounts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Token_Accounts_Stddev_Samp_Fields>;
  sum?: Maybe<Token_Accounts_Sum_Fields>;
  var_pop?: Maybe<Token_Accounts_Var_Pop_Fields>;
  var_samp?: Maybe<Token_Accounts_Var_Samp_Fields>;
  variance?: Maybe<Token_Accounts_Variance_Fields>;
};


/** aggregate fields of "token_accounts" */
export type Token_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Token_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Token_Accounts_Avg_Fields = {
  __typename?: 'token_accounts_avg_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "token_accounts". All fields are combined with a logical 'AND'. */
export type Token_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Token_Accounts_Bool_Exp>>;
  _not?: InputMaybe<Token_Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Token_Accounts_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  mint_address?: InputMaybe<String_Comparison_Exp>;
  owner_address?: InputMaybe<String_Comparison_Exp>;
  slot?: InputMaybe<Bigint_Comparison_Exp>;
  token_accounts_metadatas?: InputMaybe<Metadatas_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "token_accounts" */
export enum Token_Accounts_Constraint {
  /** unique or primary key constraint */
  TokenAccountsPkey = 'token_accounts_pkey'
}

/** input type for incrementing numeric columns in table "token_accounts" */
export type Token_Accounts_Inc_Input = {
  amount?: InputMaybe<Scalars['bigint']>;
  slot?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "token_accounts" */
export type Token_Accounts_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['bigint']>;
  mint_address?: InputMaybe<Scalars['String']>;
  owner_address?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['bigint']>;
  token_accounts_metadatas?: InputMaybe<Metadatas_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Token_Accounts_Max_Fields = {
  __typename?: 'token_accounts_max_fields';
  address?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['bigint']>;
  mint_address?: Maybe<Scalars['String']>;
  owner_address?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['bigint']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Token_Accounts_Min_Fields = {
  __typename?: 'token_accounts_min_fields';
  address?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['bigint']>;
  mint_address?: Maybe<Scalars['String']>;
  owner_address?: Maybe<Scalars['String']>;
  slot?: Maybe<Scalars['bigint']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "token_accounts" */
export type Token_Accounts_Mutation_Response = {
  __typename?: 'token_accounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Token_Accounts>;
};

/** input type for inserting object relation for remote table "token_accounts" */
export type Token_Accounts_Obj_Rel_Insert_Input = {
  data: Token_Accounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Token_Accounts_On_Conflict>;
};

/** on_conflict condition type for table "token_accounts" */
export type Token_Accounts_On_Conflict = {
  constraint: Token_Accounts_Constraint;
  update_columns?: Array<Token_Accounts_Update_Column>;
  where?: InputMaybe<Token_Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "token_accounts". */
export type Token_Accounts_Order_By = {
  address?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  mint_address?: InputMaybe<Order_By>;
  owner_address?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  token_accounts_metadatas?: InputMaybe<Metadatas_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: token_accounts */
export type Token_Accounts_Pk_Columns_Input = {
  address: Scalars['String'];
};

/** select columns of table "token_accounts" */
export enum Token_Accounts_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Amount = 'amount',
  /** column name */
  MintAddress = 'mint_address',
  /** column name */
  OwnerAddress = 'owner_address',
  /** column name */
  Slot = 'slot',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "token_accounts" */
export type Token_Accounts_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['bigint']>;
  mint_address?: InputMaybe<Scalars['String']>;
  owner_address?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['bigint']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate stddev on columns */
export type Token_Accounts_Stddev_Fields = {
  __typename?: 'token_accounts_stddev_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Token_Accounts_Stddev_Pop_Fields = {
  __typename?: 'token_accounts_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Token_Accounts_Stddev_Samp_Fields = {
  __typename?: 'token_accounts_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Token_Accounts_Sum_Fields = {
  __typename?: 'token_accounts_sum_fields';
  amount?: Maybe<Scalars['bigint']>;
  slot?: Maybe<Scalars['bigint']>;
};

/** update columns of table "token_accounts" */
export enum Token_Accounts_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Amount = 'amount',
  /** column name */
  MintAddress = 'mint_address',
  /** column name */
  OwnerAddress = 'owner_address',
  /** column name */
  Slot = 'slot',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Token_Accounts_Var_Pop_Fields = {
  __typename?: 'token_accounts_var_pop_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Token_Accounts_Var_Samp_Fields = {
  __typename?: 'token_accounts_var_samp_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Token_Accounts_Variance_Fields = {
  __typename?: 'token_accounts_variance_fields';
  amount?: Maybe<Scalars['Float']>;
  slot?: Maybe<Scalars['Float']>;
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

/** unique or primary key constraints on table "twitter_handle_name_services" */
export enum Twitter_Handle_Name_Services_Constraint {
  /** unique or primary key constraint */
  TwitterHandleNameServicesPkey = 'twitter_handle_name_services_pkey'
}

/** input type for incrementing numeric columns in table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Inc_Input = {
  slot?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['bigint']>;
  twitter_handle?: InputMaybe<Scalars['String']>;
  wallet_address?: InputMaybe<Scalars['String']>;
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

/** response of any mutation on the table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Mutation_Response = {
  __typename?: 'twitter_handle_name_services_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Twitter_Handle_Name_Services>;
};

/** input type for inserting object relation for remote table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Obj_Rel_Insert_Input = {
  data: Twitter_Handle_Name_Services_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Twitter_Handle_Name_Services_On_Conflict>;
};

/** on_conflict condition type for table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_On_Conflict = {
  constraint: Twitter_Handle_Name_Services_Constraint;
  update_columns?: Array<Twitter_Handle_Name_Services_Update_Column>;
  where?: InputMaybe<Twitter_Handle_Name_Services_Bool_Exp>;
};

/** Ordering options when selecting data from "twitter_handle_name_services". */
export type Twitter_Handle_Name_Services_Order_By = {
  address?: InputMaybe<Order_By>;
  slot?: InputMaybe<Order_By>;
  twitter_handle?: InputMaybe<Order_By>;
  wallet_address?: InputMaybe<Order_By>;
};

/** primary key columns input for table: twitter_handle_name_services */
export type Twitter_Handle_Name_Services_Pk_Columns_Input = {
  address: Scalars['String'];
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

/** input type for updating data in table "twitter_handle_name_services" */
export type Twitter_Handle_Name_Services_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['bigint']>;
  twitter_handle?: InputMaybe<Scalars['String']>;
  wallet_address?: InputMaybe<Scalars['String']>;
};

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

/** update columns of table "twitter_handle_name_services" */
export enum Twitter_Handle_Name_Services_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Slot = 'slot',
  /** column name */
  TwitterHandle = 'twitter_handle',
  /** column name */
  WalletAddress = 'wallet_address'
}

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

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type ActivityPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ActivityPageQuery = { __typename?: 'query_root', wallet?: { __typename: 'Wallet', address: string, bids: Array<{ __typename: 'Bid', listingAddress: string, bidderAddress: string, lastBidTime: string, lastBidAmount: any, cancelled: boolean, listing?: { __typename?: 'Listing', address: string, ended: boolean, storefront?: { __typename: 'Storefront', ownerAddress: string, subdomain: string, title: string, description: string, faviconUrl: string, logoUrl: string, bannerUrl: string } | null, nfts: Array<{ __typename: 'Nft', address: string, name: string, description: string, image: string }>, bids: Array<{ __typename?: 'Bid', bidderAddress: string, lastBidTime: string, lastBidAmount: any, cancelled: boolean, listingAddress: string }> } | null }> } | null };

export type OwnedNfTsQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type OwnedNfTsQuery = { __typename?: 'query_root', nfts: Array<{ __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, creators: Array<{ __typename?: 'NftCreator', address: string, share: number }> }> };

export type WalletProfileQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type WalletProfileQuery = { __typename?: 'query_root', profile?: { __typename?: 'Profile', handle: string, profileImageUrlLowres: string, profileImageUrlHighres: string, bannerImageUrl: string } | null };

export type NftPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type NftPageQuery = { __typename?: 'query_root', nft?: { __typename?: 'Nft', address: string, name: string, sellerFeeBasisPoints: number, mintAddress: string, description: string, image: string, primarySaleHappened: boolean, attributes: Array<{ __typename?: 'NftAttribute', metadataAddress: string, value: string, traitType: string }>, creators: Array<{ __typename?: 'NftCreator', address: string, verified: boolean }>, owner?: { __typename?: 'NftOwner', address: string } | null, purchases: Array<{ __typename?: 'PurchaseReceipt', address: string, buyer: string, auctionHouse: string, price: any, createdAt: any }>, listings: Array<{ __typename?: 'ListingReceipt', address: string, tradeState: string, seller: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, createdAt: any, canceledAt?: any | null }>, offers: Array<{ __typename?: 'BidReceipt', address: string, tradeState: string, buyer: string, metadata: string, auctionHouse: string, price: any, tradeStateBump: number, tokenAccount?: string | null, createdAt: any, canceledAt?: any | null }> } | null };

export type GetProfileInfoFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['String'];
}>;


export type GetProfileInfoFromPubKeyQuery = { __typename?: 'query_root', profileInfo: Array<{ __typename?: 'twitter_handle_name_services', twitter_handle: string, wallet_address: string, images?: { __typename?: 'Profile', bannerImageUrl: string, profileImageUrlHighres: string, profileImageUrlLowres: string } | null }> };

export type GetProfileInfoFromTwitterHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetProfileInfoFromTwitterHandleQuery = { __typename?: 'query_root', profileInfo: Array<{ __typename?: 'twitter_handle_name_services', twitter_handle: string, wallet_address: string, images?: { __typename?: 'Profile', bannerImageUrl: string, profileImageUrlHighres: string, profileImageUrlLowres: string } | null }> };

export type ProfileInfoFragment = { __typename?: 'twitter_handle_name_services', twitter_handle: string, wallet_address: string, images?: { __typename?: 'Profile', bannerImageUrl: string, profileImageUrlHighres: string, profileImageUrlLowres: string } | null };

export const ProfileInfoFragmentDoc = gql`
    fragment ProfileInfo on twitter_handle_name_services {
  twitter_handle
  wallet_address
  images: twitter_handle_profile_data {
    bannerImageUrl
    profileImageUrlHighres
    profileImageUrlLowres
  }
}
    `;
export const ActivityPageDocument = gql`
    query activityPage($address: String!) {
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
export const GetProfileInfoFromPubKeyDocument = gql`
    query getProfileInfoFromPubKey($pubKey: String!) {
  profileInfo: twitter_handle_name_services(
    where: {wallet_address: {_eq: $pubKey}}
  ) {
    ...ProfileInfo
  }
}
    ${ProfileInfoFragmentDoc}`;

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
  profileInfo: twitter_handle_name_services(
    where: {twitter_handle: {_eq: $handle}}
  ) {
    ...ProfileInfo
  }
}
    ${ProfileInfoFragmentDoc}`;

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