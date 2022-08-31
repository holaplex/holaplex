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
  /** Uuid */
  Uuid: any;
};

export type AhListing = {
  __typename?: 'AhListing';
  auctionHouse?: Maybe<AuctionHouse>;
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['Uuid'];
  marketplaceProgramAddress: Scalars['String'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  purchaseId?: Maybe<Scalars['Uuid']>;
  seller: Scalars['PublicKey'];
  tokenSize: Scalars['Int'];
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
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
  auctionHouse?: Maybe<AuctionHouse>;
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

export type CandyMachine = {
  __typename?: 'CandyMachine';
  address: Scalars['PublicKey'];
  authority: Scalars['PublicKey'];
  collectionPda?: Maybe<CandyMachineCollectionPda>;
  /** NOTE - this is currently bugged and will always be empty */
  configLines: Array<CandyMachineConfigLine>;
  /** NOTE - this is currently bugged and will only return one creator */
  creators: Array<CandyMachineCreator>;
  endSetting?: Maybe<CandyMachineEndSetting>;
  gateKeeperConfig?: Maybe<CandyMachineGateKeeperConfig>;
  goLiveDate?: Maybe<Scalars['U64']>;
  hiddenSetting?: Maybe<CandyMachineHiddenSetting>;
  isMutable: Scalars['Boolean'];
  itemsAvailable: Scalars['U64'];
  itemsRedeemed: Scalars['U64'];
  maxSupply: Scalars['U64'];
  price: Scalars['U64'];
  retainAuthority: Scalars['Boolean'];
  sellerFeeBasisPoints: Scalars['Int'];
  symbol: Scalars['String'];
  tokenMint?: Maybe<Scalars['PublicKey']>;
  uuid: Scalars['String'];
  wallet: Scalars['PublicKey'];
  whitelistMintSetting?: Maybe<CandyMachineWhitelistMintSetting>;
};

export type CandyMachineCollectionPda = {
  __typename?: 'CandyMachineCollectionPda';
  candyMachineAddress: Scalars['PublicKey'];
  collectionPda: Scalars['PublicKey'];
  mint: Scalars['PublicKey'];
};

export type CandyMachineConfigLine = {
  __typename?: 'CandyMachineConfigLine';
  candyMachineAddress: Scalars['PublicKey'];
  idx: Scalars['Int'];
  name: Scalars['String'];
  taken: Scalars['Boolean'];
  uri: Scalars['String'];
};

export type CandyMachineCreator = {
  __typename?: 'CandyMachineCreator';
  candyMachineAddress: Scalars['PublicKey'];
  creatorAddress: Scalars['PublicKey'];
  share: Scalars['Int'];
  verified: Scalars['Boolean'];
};

export type CandyMachineEndSetting = {
  __typename?: 'CandyMachineEndSetting';
  candyMachineAddress: Scalars['PublicKey'];
  endSettingType: CandyMachineEndSettingType;
  number: Scalars['U64'];
};

export enum CandyMachineEndSettingType {
  Amount = 'AMOUNT',
  Date = 'DATE',
}

export type CandyMachineGateKeeperConfig = {
  __typename?: 'CandyMachineGateKeeperConfig';
  candyMachineAddress: Scalars['PublicKey'];
  expireOnUse: Scalars['Boolean'];
  gatekeeperNetwork: Scalars['String'];
};

export type CandyMachineHiddenSetting = {
  __typename?: 'CandyMachineHiddenSetting';
  candyMachineAddress: Scalars['PublicKey'];
  /** lowercase base64 encoded string of the hash bytes */
  hash: Scalars['String'];
  name: Scalars['String'];
  uri: Scalars['String'];
};

export enum CandyMachineWhitelistMintMode {
  BurnEveryTime = 'BURN_EVERY_TIME',
  NeverBurn = 'NEVER_BURN',
}

export type CandyMachineWhitelistMintSetting = {
  __typename?: 'CandyMachineWhitelistMintSetting';
  candyMachineAddress: Scalars['PublicKey'];
  discountPrice?: Maybe<Scalars['U64']>;
  mint: Scalars['PublicKey'];
  mode: CandyMachineWhitelistMintMode;
  presale: Scalars['Boolean'];
};

export type CollectedCollection = {
  __typename?: 'CollectedCollection';
  collection?: Maybe<Collection>;
  estimatedValue: Scalars['U64'];
  nftsOwned: Scalars['Int'];
};

export type Collection = {
  __typename?: 'Collection';
  activities: Array<NftActivity>;
  /** @deprecated use `nft { address }` */
  address: Scalars['String'];
  /** @deprecated use `nft { animation_url }` */
  animationUrl?: Maybe<Scalars['String']>;
  /** @deprecated use `nft { attributes }` */
  attributes: Array<NftAttribute>;
  /** @deprecated use `nft { category }` */
  category: Scalars['String'];
  /** @deprecated use `nft { collection }` */
  collection?: Maybe<Collection>;
  /** @deprecated use `nft { created_at }` */
  createdAt?: Maybe<Scalars['DateTimeUtc']>;
  /** @deprecated use `nft { creators }` */
  creators: Array<NftCreator>;
  /** @deprecated use `nft { description }` */
  description: Scalars['String'];
  /** @deprecated use `nft { external_url }` */
  externalUrl?: Maybe<Scalars['String']>;
  /** @deprecated use `nft { files }` */
  files: Array<NftFile>;
  /** Lowest price of currently listed NFTs in the collection. */
  floorPrice?: Maybe<Scalars['I64']>;
  /** Count of wallets that currently hold at least one NFT from the collection. */
  holderCount: Scalars['U64'];
  /** @deprecated use `nft { image }` */
  image: Scalars['String'];
  /** Count of active listings of NFTs in the collection. */
  listedCount: Scalars['U64'];
  /** @deprecated use `nft { ah_listings_loader }` */
  listings: Array<AhListing>;
  /** @deprecated use `nft { mint_address }` */
  mintAddress: Scalars['String'];
  /** @deprecated use `nft { name }` */
  name: Scalars['String'];
  nft: Nft;
  /** Count of NFTs in the collection. */
  nftCount?: Maybe<Scalars['I64']>;
  /** @deprecated use `nft { offers }` */
  offers: Array<Offer>;
  /** @deprecated use `nft { owner }` */
  owner?: Maybe<NftOwner>;
  /** @deprecated use `nft { parser }` */
  parser?: Maybe<Scalars['String']>;
  /** @deprecated use `nft { primary_sale_happened }` */
  primarySaleHappened: Scalars['Boolean'];
  /** @deprecated use `nft { purchases }` */
  purchases: Array<Purchase>;
  /** @deprecated use `nft { seller_fee_basis_points }` */
  sellerFeeBasisPoints: Scalars['Int'];
  /** @deprecated use `nft { token_account_address }` */
  tokenAccountAddress: Scalars['String'];
  /** @deprecated use `nft { update_authority_address }` */
  updateAuthorityAddress: Scalars['String'];
  /** Total of all sales of all NFTs in the collection over all time, in lamports. */
  volumeTotal: Scalars['U64'];
};

export type CollectionActivitiesArgs = {
  eventTypes?: InputMaybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type CollectionImageArgs = {
  width?: InputMaybe<Scalars['Int']>;
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
  wallet: Wallet;
  walletAddress: Scalars['PublicKey'];
};

export type GenoHabitat = {
  __typename?: 'GenoHabitat';
  active: Scalars['Boolean'];
  address: Scalars['PublicKey'];
  crystalsRefined: Scalars['Int'];
  durability: Scalars['Int'];
  element: Scalars['Int'];
  expiryTimestamp: Scalars['DateTimeUtc'];
  genesis: Scalars['Boolean'];
  guild?: Maybe<Scalars['Int']>;
  habitatMint: Scalars['PublicKey'];
  habitatsTerraformed: Scalars['Int'];
  harvester: Scalars['String'];
  harvesterOpenMarket: Scalars['Boolean'];
  harvesterRoyaltyBips: Scalars['Int'];
  harvesterSettingsCooldownTimestamp: Scalars['DateTimeUtc'];
  isSubHabitat: Scalars['Boolean'];
  kiHarvested: Scalars['I64'];
  level: Scalars['Int'];
  nextDayTimestamp: Scalars['DateTimeUtc'];
  nft?: Maybe<Nft>;
  parentHabitat?: Maybe<Scalars['PublicKey']>;
  renewalTimestamp: Scalars['DateTimeUtc'];
  rentalAgreement?: Maybe<GenoRentalAgreement>;
  seedsSpawned: Scalars['Boolean'];
  sequence: Scalars['I64'];
  subHabitatCooldownTimestamp: Scalars['DateTimeUtc'];
  subHabitats: Array<Scalars['PublicKey']>;
  terraformingHabitat?: Maybe<Scalars['PublicKey']>;
  totalCrystalsRefined: Scalars['I64'];
  totalKiHarvested: Scalars['I64'];
};

export type GenoRentalAgreement = {
  __typename?: 'GenoRentalAgreement';
  alchemist?: Maybe<Scalars['PublicKey']>;
  gracePeriod: Scalars['I64'];
  habitatAddress: Scalars['PublicKey'];
  lastRentPayment: Scalars['DateTimeUtc'];
  nextPaymentDue: Scalars['DateTimeUtc'];
  openMarket: Scalars['Boolean'];
  rent: Scalars['I64'];
  rentToken: Scalars['PublicKey'];
  rentTokenDecimals: Scalars['Int'];
  rentalPeriod: Scalars['I64'];
};

export type Governance = {
  __typename?: 'Governance';
  accountType: GovernanceAccountType;
  address: Scalars['PublicKey'];
  governanceConfig?: Maybe<GovernanceConfig>;
  governedAccount: Scalars['PublicKey'];
  proposalsCount: Scalars['I64'];
  realm?: Maybe<Realm>;
  votingProposalCount: Scalars['Int'];
};

export enum GovernanceAccountType {
  GovernanceV1 = 'GOVERNANCE_V1',
  GovernanceV2 = 'GOVERNANCE_V2',
  MintGovernanceV1 = 'MINT_GOVERNANCE_V1',
  MintGovernanceV2 = 'MINT_GOVERNANCE_V2',
  ProgramGovernanceV1 = 'PROGRAM_GOVERNANCE_V1',
  ProgramGovernanceV2 = 'PROGRAM_GOVERNANCE_V2',
  ProgramMetadata = 'PROGRAM_METADATA',
  ProposalInstructionV1 = 'PROPOSAL_INSTRUCTION_V1',
  ProposalTransactionV2 = 'PROPOSAL_TRANSACTION_V2',
  ProposalV1 = 'PROPOSAL_V1',
  ProposalV2 = 'PROPOSAL_V2',
  RealmConfig = 'REALM_CONFIG',
  RealmV1 = 'REALM_V1',
  RealmV2 = 'REALM_V2',
  SignatoryRecordV1 = 'SIGNATORY_RECORD_V1',
  SignatoryRecordV2 = 'SIGNATORY_RECORD_V2',
  TokenGovernanceV1 = 'TOKEN_GOVERNANCE_V1',
  TokenGovernanceV2 = 'TOKEN_GOVERNANCE_V2',
  TokenOwnerRecordV1 = 'TOKEN_OWNER_RECORD_V1',
  TokenOwnerRecordV2 = 'TOKEN_OWNER_RECORD_V2',
  Uninitialized = 'UNINITIALIZED',
  VoteRecordV1 = 'VOTE_RECORD_V1',
  VoteRecordV2 = 'VOTE_RECORD_V2',
}

export type GovernanceConfig = {
  __typename?: 'GovernanceConfig';
  governanceAddress: Scalars['PublicKey'];
  maxVotingTime: Scalars['I64'];
  minCommunityWeightToCreateProposal: Scalars['U64'];
  minCouncilWeightToCreateProposal: Scalars['I64'];
  minInstructionHoldUpTime: Scalars['I64'];
  proposalCoolOffTime: Scalars['I64'];
  voteThresholdPercentage: Scalars['Int'];
  voteThresholdType: VoteThreshold;
  voteTipping: VoteTipping;
};

export type GraphConnection = {
  __typename?: 'GraphConnection';
  address: Scalars['String'];
  connectedAt: Scalars['DateTimeUtc'];
  from: Wallet;
  to: Wallet;
};

export enum InstructionExecutionFlags {
  None = 'NONE',
  Ordered = 'ORDERED',
  UseTransaction = 'USE_TRANSACTION',
}

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
  listing?: Maybe<AhListing>;
  listingId: Scalars['Uuid'];
  profile?: Maybe<TwitterProfile>;
  wallet: Wallet;
  walletAddress: Scalars['PublicKey'];
};

export type MarketStats = {
  __typename?: 'MarketStats';
  nfts?: Maybe<Scalars['U64']>;
};

export type Marketplace = {
  __typename?: 'Marketplace';
  auctionHouses: Array<AuctionHouse>;
  bannerUrl: Scalars['String'];
  configAddress: Scalars['PublicKey'];
  creators: Array<StoreCreator>;
  description: Scalars['String'];
  logoUrl: Scalars['String'];
  name: Scalars['String'];
  ownerAddress: Scalars['String'];
  stats?: Maybe<MarketStats>;
  storeAddress?: Maybe<Scalars['PublicKey']>;
  subdomain: Scalars['String'];
};

export type MetadataJson = {
  __typename?: 'MetadataJson';
  address: Scalars['String'];
  creatorAddress?: Maybe<Scalars['String']>;
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
  wallet: Wallet;
  walletAddress: Scalars['PublicKey'];
};

export enum MintMaxVoteWeightSource {
  Absolute = 'ABSOLUTE',
  SupplyFraction = 'SUPPLY_FRACTION',
}

export type MintStats = {
  __typename?: 'MintStats';
  auctionHouse?: Maybe<AuctionHouse>;
  average?: Maybe<Scalars['U64']>;
  floor?: Maybe<Scalars['U64']>;
  mint: Scalars['String'];
  volume24hr?: Maybe<Scalars['U64']>;
  volumeTotal?: Maybe<Scalars['U64']>;
};

export type MultiChoice = {
  __typename?: 'MultiChoice';
  maxVoterOptions: Scalars['Int'];
  maxWinningOptions: Scalars['Int'];
};

export type Nft = {
  __typename?: 'Nft';
  activities: Array<NftActivity>;
  address: Scalars['String'];
  animationUrl?: Maybe<Scalars['String']>;
  attributes: Array<NftAttribute>;
  category: Scalars['String'];
  collection?: Maybe<Collection>;
  createdAt?: Maybe<Scalars['DateTimeUtc']>;
  creators: Array<NftCreator>;
  description: Scalars['String'];
  externalUrl?: Maybe<Scalars['String']>;
  files: Array<NftFile>;
  image: Scalars['String'];
  listings: Array<AhListing>;
  mintAddress: Scalars['String'];
  name: Scalars['String'];
  offers: Array<Offer>;
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
  purchases: Array<Purchase>;
  sellerFeeBasisPoints: Scalars['Int'];
  tokenAccountAddress: Scalars['String'];
  updateAuthorityAddress: Scalars['String'];
};

export type NftImageArgs = {
  width?: InputMaybe<Scalars['Int']>;
};

export type NftActivity = {
  __typename?: 'NftActivity';
  activityType: Scalars['String'];
  auctionHouse?: Maybe<AuctionHouse>;
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['Uuid'];
  marketplaceProgramAddress: Scalars['String'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  wallets: Array<Wallet>;
};

export type NftAttribute = {
  __typename?: 'NftAttribute';
  metadataAddress: Scalars['String'];
  traitType?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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

export type NftsStats = {
  __typename?: 'NftsStats';
  /** The total number of buy-now listings */
  buyNowListings: Scalars['Int'];
  /** The total number of NFTs with active offers */
  nftsWithActiveOffers: Scalars['Int'];
  /** The total number of indexed NFTs */
  totalNfts: Scalars['Int'];
};

export type Offer = {
  __typename?: 'Offer';
  auctionHouse?: Maybe<AuctionHouse>;
  buyer: Scalars['PublicKey'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['Uuid'];
  marketplaceProgramAddress: Scalars['String'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  purchaseId?: Maybe<Scalars['Uuid']>;
  tokenAccount?: Maybe<Scalars['String']>;
  tokenSize: Scalars['Int'];
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type OfferEvent = {
  __typename?: 'OfferEvent';
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  lifecycle: Scalars['String'];
  offer?: Maybe<Offer>;
  offerId: Scalars['Uuid'];
  profile?: Maybe<TwitterProfile>;
  wallet: Wallet;
  walletAddress: Scalars['PublicKey'];
};

export enum OptionVoteResult {
  Defeated = 'DEFEATED',
  None = 'NONE',
  Succeeded = 'SUCCEEDED',
}

/** Sorts results ascending or descending */
export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

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

export type ProfilesStats = {
  __typename?: 'ProfilesStats';
  /** The total number of indexed profiles */
  totalProfiles: Scalars['Int'];
};

export type Proposal = ProposalV1 | ProposalV2;

export type ProposalOption = {
  __typename?: 'ProposalOption';
  label: Scalars['String'];
  proposalAddress: Scalars['PublicKey'];
  transactionsCount: Scalars['Int'];
  transactionsExecutedCount: Scalars['Int'];
  transactionsNextIndex: Scalars['Int'];
  voteResult: OptionVoteResult;
  voteWeight: Scalars['I64'];
};

export enum ProposalState {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Defeated = 'DEFEATED',
  Draft = 'DRAFT',
  Executing = 'EXECUTING',
  ExecutingWithErrors = 'EXECUTING_WITH_ERRORS',
  SigningOff = 'SIGNING_OFF',
  Succeeded = 'SUCCEEDED',
  Voting = 'VOTING',
}

export type ProposalV1 = {
  __typename?: 'ProposalV1';
  accountType: GovernanceAccountType;
  address: Scalars['PublicKey'];
  closedAt?: Maybe<Scalars['DateTimeUtc']>;
  description: Scalars['String'];
  draftAt: Scalars['DateTimeUtc'];
  executingAt?: Maybe<Scalars['DateTimeUtc']>;
  executionFlags: InstructionExecutionFlags;
  governance?: Maybe<Governance>;
  governingTokenMint: Scalars['PublicKey'];
  instructionsCount: Scalars['Int'];
  instructionsExecutedCount: Scalars['Int'];
  instructionsNextIndex: Scalars['Int'];
  maxVoteWeight?: Maybe<Scalars['I64']>;
  name: Scalars['String'];
  noVotesCount: Scalars['I64'];
  signatoriesCount: Scalars['Int'];
  signatoriesSignedOffCount: Scalars['Int'];
  signingOffAt?: Maybe<Scalars['DateTimeUtc']>;
  state: ProposalState;
  tokenOwnerRecord?: Maybe<TokenOwnerRecord>;
  voteThresholdPercentage?: Maybe<Scalars['Int']>;
  voteThresholdType?: Maybe<VoteThreshold>;
  votingAt?: Maybe<Scalars['DateTimeUtc']>;
  votingAtSlot?: Maybe<Scalars['I64']>;
  votingCompletedAt?: Maybe<Scalars['DateTimeUtc']>;
  yesVotesCount: Scalars['I64'];
};

export type ProposalV2 = {
  __typename?: 'ProposalV2';
  abstainVoteWeight?: Maybe<Scalars['I64']>;
  address: Scalars['PublicKey'];
  closedAt?: Maybe<Scalars['DateTimeUtc']>;
  denyVoteWeight?: Maybe<Scalars['I64']>;
  description: Scalars['String'];
  draftAt: Scalars['DateTimeUtc'];
  executingAt?: Maybe<Scalars['DateTimeUtc']>;
  executionFlags: InstructionExecutionFlags;
  governance?: Maybe<Governance>;
  governingTokenMint: Scalars['PublicKey'];
  maxVoteWeight?: Maybe<Scalars['I64']>;
  maxVotingTime?: Maybe<Scalars['I64']>;
  multiChoice?: Maybe<MultiChoice>;
  name: Scalars['String'];
  proposalOptions: Array<ProposalOption>;
  signatoriesCount: Scalars['Int'];
  signatoriesSignedOffCount: Scalars['Int'];
  signingOffAt?: Maybe<Scalars['DateTimeUtc']>;
  startVotingAt?: Maybe<Scalars['DateTimeUtc']>;
  state: ProposalState;
  tokenOwnerRecord?: Maybe<TokenOwnerRecord>;
  vetoVoteWeight?: Maybe<Scalars['I64']>;
  voteThresholdPercentage?: Maybe<Scalars['Int']>;
  voteThresholdType?: Maybe<VoteThreshold>;
  voteType: VoteType;
  votingAt?: Maybe<Scalars['DateTimeUtc']>;
  votingAtSlot?: Maybe<Scalars['I64']>;
  votingCompletedAt?: Maybe<Scalars['DateTimeUtc']>;
};

export type Purchase = {
  __typename?: 'Purchase';
  auctionHouse?: Maybe<AuctionHouse>;
  buyer: Scalars['PublicKey'];
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['Uuid'];
  marketplaceProgramAddress: Scalars['String'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  seller: Scalars['PublicKey'];
  tokenSize: Scalars['Int'];
};

export type PurchaseEvent = {
  __typename?: 'PurchaseEvent';
  createdAt: Scalars['DateTimeUtc'];
  feedEventId: Scalars['String'];
  profile?: Maybe<TwitterProfile>;
  purchase?: Maybe<Purchase>;
  purchaseId: Scalars['Uuid'];
  wallet: Wallet;
  walletAddress: Scalars['PublicKey'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  activities: Array<NftActivity>;
  auctionHouse?: Maybe<AuctionHouse>;
  /** Get a candy machine by the candy machine config address */
  candyMachine?: Maybe<CandyMachine>;
  /** @deprecated Deprecated alias for candyMachine */
  candymachine?: Maybe<CandyMachine>;
  charts: PriceChart;
  /** Returns collection data along with collection activities */
  collection?: Maybe<Collection>;
  /** Returns featured collection NFTs ordered by market cap (floor price * number of NFTs in collection) */
  collectionsFeaturedByMarketCap: Array<Collection>;
  /** Returns featured collection NFTs ordered by volume (sum of purchase prices) */
  collectionsFeaturedByVolume: Array<Collection>;
  connections: Array<GraphConnection>;
  creator: Creator;
  denylist: Denylist;
  enrichedBondingChanges: Array<EnrichedBondingChange>;
  featuredListings: Array<AhListing>;
  /** Returns events for the wallets the user is following using the graph_program. */
  feedEvents: Array<FeedEvent>;
  /** Recommend wallets to follow. */
  followWallets: Array<Wallet>;
  genoHabitat?: Maybe<GenoHabitat>;
  genoHabitats: Array<GenoHabitat>;
  governances: Array<Governance>;
  /** Returns the latest on chain events using the graph_program. */
  latestFeedEvents: Array<FeedEvent>;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  /** Get multiple marketplaces; results will be in alphabetical order by subdomain */
  marketplaces: Array<Marketplace>;
  /** returns metadata_jsons matching the term */
  metadataJsons: Array<MetadataJson>;
  /** Get an NFT by metadata address. */
  nft?: Maybe<Nft>;
  /** Get an NFT by mint address. */
  nftByMintAddress?: Maybe<Nft>;
  nftCounts: NftCount;
  nfts: Array<Nft>;
  /** Get a list of NFTs by mint address. */
  nftsByMintAddress: Array<Nft>;
  /** Stats aggregated across all indexed NFTs */
  nftsStats: NftsStats;
  offer?: Maybe<BidReceipt>;
  profile?: Maybe<TwitterProfile>;
  /** returns profiles matching the search term */
  profiles: Array<Wallet>;
  /** returns stats about profiles */
  profilesStats: ProfilesStats;
  proposals: Array<Proposal>;
  realms: Array<Realm>;
  /** returns all the collections matching the search term */
  searchCollections: Array<MetadataJson>;
  signatoryRecords: Array<SignatoryRecord>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  tokenOwnerRecords: Array<TokenOwnerRecord>;
  voteRecords: Array<VoteRecord>;
  wallet: Wallet;
  wallets: Array<Wallet>;
};

export type QueryRootActivitiesArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootAuctionHouseArgs = {
  address: Scalars['String'];
};

export type QueryRootCandyMachineArgs = {
  address: Scalars['String'];
};

export type QueryRootCandymachineArgs = {
  addr: Scalars['String'];
};

export type QueryRootChartsArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  endDate: Scalars['DateTimeUtc'];
  startDate: Scalars['DateTimeUtc'];
};

export type QueryRootCollectionArgs = {
  address: Scalars['String'];
};

export type QueryRootCollectionsFeaturedByMarketCapArgs = {
  endDate: Scalars['DateTimeUtc'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  orderDirection: OrderDirection;
  startDate: Scalars['DateTimeUtc'];
  term?: InputMaybe<Scalars['String']>;
};

export type QueryRootCollectionsFeaturedByVolumeArgs = {
  endDate: Scalars['DateTimeUtc'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  orderDirection: OrderDirection;
  startDate: Scalars['DateTimeUtc'];
  term?: InputMaybe<Scalars['String']>;
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
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  limitPerSeller?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sellerExclusions?: InputMaybe<Array<Scalars['PublicKey']>>;
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

export type QueryRootGenoHabitatArgs = {
  address: Scalars['PublicKey'];
};

export type QueryRootGenoHabitatsArgs = {
  elements?: InputMaybe<Array<Scalars['Int']>>;
  genesis?: InputMaybe<Scalars['Boolean']>;
  guilds?: InputMaybe<Array<Scalars['Int']>>;
  harvesterOpenMarket?: InputMaybe<Scalars['Boolean']>;
  harvesters?: InputMaybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  maxDurability?: InputMaybe<Scalars['Int']>;
  maxExpiry?: InputMaybe<Scalars['DateTimeUtc']>;
  maxLevel?: InputMaybe<Scalars['Int']>;
  maxSequence?: InputMaybe<Scalars['Int']>;
  minDurability?: InputMaybe<Scalars['Int']>;
  minExpiry?: InputMaybe<Scalars['DateTimeUtc']>;
  minLevel?: InputMaybe<Scalars['Int']>;
  minSequence?: InputMaybe<Scalars['Int']>;
  mints?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
  rentalOpenMarket?: InputMaybe<Scalars['Boolean']>;
  renters?: InputMaybe<Array<Scalars['PublicKey']>>;
  term?: InputMaybe<Scalars['String']>;
};

export type QueryRootGovernancesArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  realms?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootLatestFeedEventsArgs = {
  cursor: Scalars['String'];
  includeTypes?: InputMaybe<Array<Scalars['String']>>;
  isForward: Scalars['Boolean'];
  limit: Scalars['Int'];
};

export type QueryRootMarketplaceArgs = {
  subdomain: Scalars['String'];
};

export type QueryRootMarketplacesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  subdomains?: InputMaybe<Array<Scalars['String']>>;
};

export type QueryRootMetadataJsonsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  term: Scalars['String'];
};

export type QueryRootNftArgs = {
  address: Scalars['String'];
};

export type QueryRootNftByMintAddressArgs = {
  address: Scalars['String'];
};

export type QueryRootNftCountsArgs = {
  creators: Array<Scalars['PublicKey']>;
};

export type QueryRootNftsArgs = {
  allowUnverified?: InputMaybe<Scalars['Boolean']>;
  attributes?: InputMaybe<Array<AttributeFilter>>;
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
  collection?: InputMaybe<Scalars['PublicKey']>;
  collections?: InputMaybe<Array<Scalars['PublicKey']>>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  listed?: InputMaybe<Scalars['Boolean']>;
  offerers?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
  term?: InputMaybe<Scalars['String']>;
  updateAuthorities?: InputMaybe<Array<Scalars['PublicKey']>>;
  withOffers?: InputMaybe<Scalars['Boolean']>;
};

export type QueryRootNftsByMintAddressArgs = {
  addresses: Array<Scalars['PublicKey']>;
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

export type QueryRootProposalsArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  governances?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootRealmsArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  communityMints?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootSearchCollectionsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  term: Scalars['String'];
};

export type QueryRootSignatoryRecordsArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  proposals?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootStorefrontArgs = {
  subdomain: Scalars['String'];
};

export type QueryRootTokenOwnerRecordsArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  governingTokenMints?: InputMaybe<Array<Scalars['PublicKey']>>;
  realms?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootVoteRecordsArgs = {
  addresses?: InputMaybe<Array<Scalars['PublicKey']>>;
  governingTokenOwners?: InputMaybe<Array<Scalars['PublicKey']>>;
  isRelinquished?: InputMaybe<Scalars['Boolean']>;
  proposals?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type QueryRootWalletArgs = {
  address: Scalars['PublicKey'];
};

export type QueryRootWalletsArgs = {
  addresses: Array<Scalars['PublicKey']>;
};

export type Realm = {
  __typename?: 'Realm';
  accountType: GovernanceAccountType;
  address: Scalars['PublicKey'];
  authority?: Maybe<Scalars['PublicKey']>;
  communityMint: Scalars['PublicKey'];
  name: Scalars['String'];
  realmConfig?: Maybe<RealmConfig>;
  votingProposalCount: Scalars['Int'];
};

export type RealmConfig = {
  __typename?: 'RealmConfig';
  communityMintMaxVoteWeight: Scalars['I64'];
  communityMintMaxVoteWeightSource: MintMaxVoteWeightSource;
  councilMint?: Maybe<Scalars['PublicKey']>;
  minCommunityWeightToCreateGovernance: Scalars['U64'];
  realmAddress: Scalars['PublicKey'];
  useCommunityVoterWeightAddin: Scalars['Boolean'];
  useMaxCommunityVoterWeightAddin: Scalars['Boolean'];
};

export type SignatoryRecord = {
  __typename?: 'SignatoryRecord';
  accountType: GovernanceAccountType;
  address: Scalars['PublicKey'];
  proposal?: Maybe<Proposal>;
  signatory: Scalars['PublicKey'];
  signedOff: Scalars['Boolean'];
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

export type TokenOwnerRecord = {
  __typename?: 'TokenOwnerRecord';
  accountType: GovernanceAccountType;
  address: Scalars['PublicKey'];
  governanceDelegate?: Maybe<Scalars['PublicKey']>;
  governingTokenDepositAmount: Scalars['I64'];
  governingTokenMint: Scalars['PublicKey'];
  governingTokenOwner: Scalars['PublicKey'];
  outstandingProposalCount: Scalars['Int'];
  realm?: Maybe<Realm>;
  totalVotesCount: Scalars['I64'];
  unrelinquishedVotesCount: Scalars['I64'];
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

export enum Vote {
  Abstain = 'ABSTAIN',
  Approve = 'APPROVE',
  Deny = 'DENY',
  Veto = 'VETO',
}

export type VoteChoice = {
  __typename?: 'VoteChoice';
  address: Scalars['PublicKey'];
  rank: Scalars['Int'];
  weightPercentage: Scalars['Int'];
};

export type VoteRecord = VoteRecordV1 | VoteRecordV2;

export type VoteRecordV1 = {
  __typename?: 'VoteRecordV1';
  address: Scalars['PublicKey'];
  governingTokenOwner: Scalars['PublicKey'];
  isRelinquished: Scalars['Boolean'];
  proposal?: Maybe<ProposalV1>;
  tokenOwnerRecords: Array<TokenOwnerRecord>;
  voteType: VoteWeightV1;
  voteWeight: Scalars['I64'];
};

export type VoteRecordV2 = {
  __typename?: 'VoteRecordV2';
  address: Scalars['PublicKey'];
  approveVoteChoices: Array<VoteChoice>;
  governingTokenOwner: Scalars['PublicKey'];
  isRelinquished: Scalars['Boolean'];
  proposal?: Maybe<ProposalV2>;
  tokenOwnerRecords: Array<TokenOwnerRecord>;
  vote: Vote;
  voterWeight: Scalars['I64'];
};

export enum VoteThreshold {
  Quorum = 'QUORUM',
  YesVote = 'YES_VOTE',
}

export enum VoteTipping {
  Disabled = 'DISABLED',
  Early = 'EARLY',
  Strict = 'STRICT',
}

export enum VoteType {
  MultiChoice = 'MULTI_CHOICE',
  SingleChoice = 'SINGLE_CHOICE',
}

export enum VoteWeightV1 {
  No = 'NO',
  Yes = 'YES',
}

export type Wallet = {
  __typename?: 'Wallet';
  activities: Array<WalletActivity>;
  address: Scalars['PublicKey'];
  bids: Array<Bid>;
  collectedCollections: Array<CollectedCollection>;
  connectionCounts: ConnectionCounts;
  nftCounts: WalletNftCount;
  profile?: Maybe<TwitterProfile>;
  twitterHandle?: Maybe<Scalars['String']>;
};

export type WalletActivitiesArgs = {
  eventTypes?: InputMaybe<Array<Scalars['String']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type WalletNftCountsArgs = {
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type WalletActivity = {
  __typename?: 'WalletActivity';
  activityType: Scalars['String'];
  auctionHouse?: Maybe<AuctionHouse>;
  createdAt: Scalars['DateTimeUtc'];
  id: Scalars['Uuid'];
  marketplaceProgramAddress: Scalars['String'];
  metadata: Scalars['PublicKey'];
  nft?: Maybe<Nft>;
  price: Scalars['U64'];
  wallets: Array<Wallet>;
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
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type ActivityPageQuery = {
  __typename?: 'QueryRoot';
  wallet: {
    __typename: 'Wallet';
    address: any;
    activities: Array<{
      __typename?: 'WalletActivity';
      id: any;
      price: any;
      createdAt: any;
      activityType: string;
      wallets: Array<{ __typename?: 'Wallet'; address: any; twitterHandle?: string | null }>;
      nft?: {
        __typename: 'Nft';
        address: string;
        name: string;
        description: string;
        image: string;
        creators: Array<{
          __typename?: 'NftCreator';
          address: string;
          twitterHandle?: string | null;
        }>;
      } | null;
      auctionHouse?: { __typename?: 'AuctionHouse'; address: string; treasuryMint: string } | null;
    }>;
  };
};

export type CollectionNfTsQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
  owner: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type CollectionNfTsQuery = {
  __typename?: 'QueryRoot';
  ownedCollection: Array<{
    __typename?: 'Nft';
    address: string;
    collection?: {
      __typename?: 'Collection';
      address: string;
      name: string;
      image: string;
      description: string;
    } | null;
  }>;
  createdCollection: Array<{
    __typename?: 'Nft';
    address: string;
    collection?: {
      __typename?: 'Collection';
      address: string;
      name: string;
      image: string;
      description: string;
    } | null;
  }>;
};

export type CreatedNfTsQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  subdomain: Scalars['String'];
}>;

export type CreatedNfTsQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    collection?: { __typename?: 'Collection'; address: string; name: string; image: string } | null;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
};

export type OwnedNfTsQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  subdomain: Scalars['String'];
}>;

export type OwnedNfTsQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
    collection?: { __typename?: 'Collection'; address: string; name: string; image: string } | null;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
};

export type WalletProfileQueryVariables = Exact<{
  handle: Scalars['String'];
}>;

export type WalletProfileQuery = {
  __typename?: 'QueryRoot';
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
};

export type GetCollectionQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type GetCollectionQuery = {
  __typename?: 'QueryRoot';
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    description: string;
    mintAddress: string;
    image: string;
    creators: Array<{
      __typename?: 'NftCreator';
      position?: number | null;
      address: string;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
  } | null;
  nftByMintAddress?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    description: string;
    mintAddress: string;
    image: string;
    creators: Array<{
      __typename?: 'NftCreator';
      position?: number | null;
      address: string;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
  } | null;
};

export type NftCollectionQueryVariables = Exact<{
  address: Scalars['String'];
  marketplaceSubdomain: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type NftCollectionQuery = {
  __typename?: 'QueryRoot';
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    mintAddress: string;
    creators: Array<{
      __typename?: 'NftCreator';
      position?: number | null;
      address: string;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
  } | null;
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    attributes: Array<{
      __typename?: 'NftAttribute';
      metadataAddress: string;
      value?: string | null;
      traitType?: string | null;
    }>;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    owner?: { __typename?: 'NftOwner'; address: string } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
};

export type NftsInCollectionQueryVariables = Exact<{
  collectionMintAddress: Scalars['PublicKey'];
  listed?: InputMaybe<Scalars['Boolean']>;
  marketplaceSubdomain: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type NftsInCollectionQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    attributes: Array<{
      __typename?: 'NftAttribute';
      metadataAddress: string;
      value?: string | null;
      traitType?: string | null;
    }>;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    collection?: { __typename?: 'Collection'; address: string; name: string; image: string } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
};

export type DiscoverCollectionsByMarketCapQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  start: Scalars['DateTimeUtc'];
  end: Scalars['DateTimeUtc'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverCollectionsByMarketCapQuery = {
  __typename?: 'QueryRoot';
  collectionsFeaturedByMarketCap: Array<{
    __typename?: 'Collection';
    floorPrice?: any | null;
    nftCount?: any | null;
    nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
  }>;
};

export type DiscoverCollectionsByVolumeQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  start: Scalars['DateTimeUtc'];
  end: Scalars['DateTimeUtc'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverCollectionsByVolumeQuery = {
  __typename?: 'QueryRoot';
  collectionsFeaturedByVolume: Array<{
    __typename?: 'Collection';
    floorPrice?: any | null;
    nftCount?: any | null;
    nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
  }>;
};

export type DiscoverNftsActiveOffersQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverNftsActiveOffersQuery = {
  __typename?: 'QueryRoot';
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      purchaseId?: any | null;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
  marketplace?: {
    __typename?: 'Marketplace';
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
};

export type DiscoverNftsAllQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverNftsAllQuery = {
  __typename?: 'QueryRoot';
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      purchaseId?: any | null;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
  marketplace?: {
    __typename?: 'Marketplace';
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
};

export type DiscoverNftsBuyNowQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverNftsBuyNowQuery = {
  __typename?: 'QueryRoot';
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      purchaseId?: any | null;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
  marketplace?: {
    __typename?: 'Marketplace';
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
};

export type DiscoverProfilesAllQueryVariables = Exact<{
  userWallet?: InputMaybe<Scalars['PublicKey']>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type DiscoverProfilesAllQuery = {
  __typename?: 'QueryRoot';
  followWallets: Array<{
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  }>;
};

export type DiscoverStatsQueryVariables = Exact<{ [key: string]: never }>;

export type DiscoverStatsQuery = {
  __typename?: 'QueryRoot';
  nftsStats: {
    __typename?: 'NftsStats';
    totalNfts: number;
    buyNowListings: number;
    nftsWithActiveOffers: number;
  };
  profilesStats: { __typename?: 'ProfilesStats'; totalProfiles: number };
};

export type FeedQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  excludeTypes?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type FeedQuery = {
  __typename?: 'QueryRoot';
  feedEvents: Array<
    | {
        __typename: 'FollowEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        graphConnectionAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        connection?: {
          __typename?: 'GraphConnection';
          address: string;
          from: {
            __typename?: 'Wallet';
            address: any;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          };
          to: {
            __typename?: 'Wallet';
            address: any;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          };
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'ListingEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        lifecycle: string;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        listing?: {
          __typename?: 'AhListing';
          id: any;
          seller: any;
          price: any;
          auctionHouse?: {
            __typename?: 'AuctionHouse';
            address: string;
            treasuryMint: string;
            auctionHouseTreasury: string;
            treasuryWithdrawalDestination: string;
            feeWithdrawalDestination: string;
            authority: string;
            creator: string;
            auctionHouseFeeAccount: string;
            bump: number;
            treasuryBump: number;
            feePayerBump: number;
            sellerFeeBasisPoints: number;
            requiresSignOff: boolean;
            canChangeSalePrice: boolean;
          } | null;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            creators: Array<{
              __typename?: 'NftCreator';
              address: string;
              position?: number | null;
              profile?: {
                __typename?: 'TwitterProfile';
                handle: string;
                profileImageUrlLowres: string;
                profileImageUrlHighres: string;
              } | null;
            }>;
            listings: Array<{
              __typename?: 'AhListing';
              id: any;
              seller: any;
              price: any;
              nft?: {
                __typename?: 'Nft';
                name: string;
                image: string;
                description: string;
                sellerFeeBasisPoints: number;
                primarySaleHappened: boolean;
                address: string;
                mintAddress: string;
                owner?: {
                  __typename?: 'NftOwner';
                  address: string;
                  associatedTokenAccountAddress: string;
                  twitterHandle?: string | null;
                } | null;
                creators: Array<{
                  __typename?: 'NftCreator';
                  address: string;
                  position?: number | null;
                  profile?: {
                    __typename?: 'TwitterProfile';
                    walletAddress?: string | null;
                    handle: string;
                    profileImageUrlLowres: string;
                    profileImageUrlHighres: string;
                    bannerImageUrl: string;
                  } | null;
                }>;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'MintEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        nft?: {
          __typename?: 'Nft';
          name: string;
          image: string;
          description: string;
          sellerFeeBasisPoints: number;
          primarySaleHappened: boolean;
          address: string;
          mintAddress: string;
          owner?: {
            __typename?: 'NftOwner';
            address: string;
            associatedTokenAccountAddress: string;
            twitterHandle?: string | null;
          } | null;
          creators: Array<{
            __typename?: 'NftCreator';
            address: string;
            position?: number | null;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          }>;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'OfferEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        lifecycle: string;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        offer?: {
          __typename?: 'Offer';
          id: any;
          buyer: any;
          price: any;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            offers: Array<{
              __typename?: 'Offer';
              id: any;
              buyer: any;
              price: any;
              nft?: {
                __typename?: 'Nft';
                name: string;
                image: string;
                description: string;
                sellerFeeBasisPoints: number;
                primarySaleHappened: boolean;
                address: string;
                mintAddress: string;
                owner?: {
                  __typename?: 'NftOwner';
                  address: string;
                  associatedTokenAccountAddress: string;
                  twitterHandle?: string | null;
                } | null;
                creators: Array<{
                  __typename?: 'NftCreator';
                  address: string;
                  position?: number | null;
                  profile?: {
                    __typename?: 'TwitterProfile';
                    walletAddress?: string | null;
                    handle: string;
                    profileImageUrlLowres: string;
                    profileImageUrlHighres: string;
                    bannerImageUrl: string;
                  } | null;
                }>;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'PurchaseEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        purchase?: {
          __typename?: 'Purchase';
          id: any;
          buyer: any;
          seller: any;
          price: any;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            sellerFeeBasisPoints: number;
            primarySaleHappened: boolean;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            creators: Array<{
              __typename?: 'NftCreator';
              address: string;
              position?: number | null;
              profile?: {
                __typename?: 'TwitterProfile';
                walletAddress?: string | null;
                handle: string;
                profileImageUrlLowres: string;
                profileImageUrlHighres: string;
                bannerImageUrl: string;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
  >;
};

export type WhoToFollowQueryVariables = Exact<{
  wallet: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type WhoToFollowQuery = {
  __typename?: 'QueryRoot';
  followWallets: Array<{
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  }>;
};

export type CollectionPreviewFragment = {
  __typename?: 'Collection';
  floorPrice?: any | null;
  nftCount?: any | null;
  nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
};

export type FollowEventPreviewFragment = {
  __typename?: 'FollowEvent';
  feedEventId: string;
  createdAt: any;
  walletAddress: any;
  graphConnectionAddress: any;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  connection?: {
    __typename?: 'GraphConnection';
    address: string;
    from: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
    to: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  } | null;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  };
};

export type ListingEventPreviewFragment = {
  __typename?: 'ListingEvent';
  feedEventId: string;
  createdAt: any;
  walletAddress: any;
  lifecycle: string;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  listing?: {
    __typename?: 'AhListing';
    id: any;
    seller: any;
    price: any;
    auctionHouse?: {
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    } | null;
    nft?: {
      __typename?: 'Nft';
      name: string;
      image: string;
      description: string;
      address: string;
      mintAddress: string;
      owner?: {
        __typename?: 'NftOwner';
        address: string;
        associatedTokenAccountAddress: string;
        twitterHandle?: string | null;
      } | null;
      creators: Array<{
        __typename?: 'NftCreator';
        address: string;
        position?: number | null;
        profile?: {
          __typename?: 'TwitterProfile';
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
        } | null;
      }>;
      listings: Array<{
        __typename?: 'AhListing';
        id: any;
        seller: any;
        price: any;
        nft?: {
          __typename?: 'Nft';
          name: string;
          image: string;
          description: string;
          sellerFeeBasisPoints: number;
          primarySaleHappened: boolean;
          address: string;
          mintAddress: string;
          owner?: {
            __typename?: 'NftOwner';
            address: string;
            associatedTokenAccountAddress: string;
            twitterHandle?: string | null;
          } | null;
          creators: Array<{
            __typename?: 'NftCreator';
            address: string;
            position?: number | null;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          }>;
        } | null;
      }>;
    } | null;
  } | null;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  };
};

export type MarketplaceAuctionHouseFragment = {
  __typename?: 'Marketplace';
  auctionHouses: Array<{
    __typename?: 'AuctionHouse';
    address: string;
    treasuryMint: string;
    auctionHouseTreasury: string;
    treasuryWithdrawalDestination: string;
    feeWithdrawalDestination: string;
    authority: string;
    creator: string;
    auctionHouseFeeAccount: string;
    bump: number;
    treasuryBump: number;
    feePayerBump: number;
    sellerFeeBasisPoints: number;
    requiresSignOff: boolean;
    canChangeSalePrice: boolean;
  }>;
};

export type MintEventPreviewFragment = {
  __typename?: 'MintEvent';
  feedEventId: string;
  createdAt: any;
  walletAddress: any;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  nft?: {
    __typename?: 'Nft';
    name: string;
    image: string;
    description: string;
    sellerFeeBasisPoints: number;
    primarySaleHappened: boolean;
    address: string;
    mintAddress: string;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
      twitterHandle?: string | null;
    } | null;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      position?: number | null;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
  } | null;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  };
};

export type NftCardFragment = {
  __typename?: 'Nft';
  address: string;
  name: string;
  sellerFeeBasisPoints: number;
  mintAddress: string;
  description: string;
  image: string;
  primarySaleHappened: boolean;
  creators: Array<{ __typename?: 'NftCreator'; address: string; share: number; verified: boolean }>;
  owner?: {
    __typename?: 'NftOwner';
    address: string;
    associatedTokenAccountAddress: string;
  } | null;
  purchases: Array<{
    __typename?: 'Purchase';
    id: any;
    buyer: any;
    price: any;
    createdAt: any;
    auctionHouse?: {
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    } | null;
  }>;
  listings: Array<{
    __typename?: 'AhListing';
    id: any;
    tradeState: string;
    seller: any;
    metadata: any;
    marketplaceProgramAddress: string;
    price: any;
    tradeStateBump: number;
    purchaseId?: any | null;
    createdAt: any;
    canceledAt?: any | null;
    auctionHouse?: {
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    } | null;
  }>;
  offers: Array<{
    __typename?: 'Offer';
    id: any;
    tradeState: string;
    buyer: any;
    metadata: any;
    price: any;
    purchaseId?: any | null;
    tradeStateBump: number;
    tokenAccount?: string | null;
    createdAt: any;
    canceledAt?: any | null;
    auctionHouse?: {
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    } | null;
  }>;
};

export type OfferEventPreviewFragment = {
  __typename?: 'OfferEvent';
  feedEventId: string;
  createdAt: any;
  walletAddress: any;
  lifecycle: string;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  offer?: {
    __typename?: 'Offer';
    id: any;
    buyer: any;
    price: any;
    nft?: {
      __typename?: 'Nft';
      name: string;
      image: string;
      description: string;
      address: string;
      mintAddress: string;
      owner?: {
        __typename?: 'NftOwner';
        address: string;
        associatedTokenAccountAddress: string;
        twitterHandle?: string | null;
      } | null;
      offers: Array<{
        __typename?: 'Offer';
        id: any;
        buyer: any;
        price: any;
        nft?: {
          __typename?: 'Nft';
          name: string;
          image: string;
          description: string;
          sellerFeeBasisPoints: number;
          primarySaleHappened: boolean;
          address: string;
          mintAddress: string;
          owner?: {
            __typename?: 'NftOwner';
            address: string;
            associatedTokenAccountAddress: string;
            twitterHandle?: string | null;
          } | null;
          creators: Array<{
            __typename?: 'NftCreator';
            address: string;
            position?: number | null;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          }>;
        } | null;
      }>;
    } | null;
  } | null;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  };
};

export type ProfileInfoFragment = {
  __typename?: 'TwitterProfile';
  walletAddress?: string | null;
  handle: string;
  profileImageUrlLowres: string;
  profileImageUrlHighres: string;
  bannerImageUrl: string;
};

export type PurchaseEventPreviewFragment = {
  __typename?: 'PurchaseEvent';
  feedEventId: string;
  createdAt: any;
  walletAddress: any;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  purchase?: {
    __typename?: 'Purchase';
    id: any;
    buyer: any;
    seller: any;
    price: any;
    nft?: {
      __typename?: 'Nft';
      name: string;
      image: string;
      description: string;
      sellerFeeBasisPoints: number;
      primarySaleHappened: boolean;
      address: string;
      mintAddress: string;
      owner?: {
        __typename?: 'NftOwner';
        address: string;
        associatedTokenAccountAddress: string;
        twitterHandle?: string | null;
      } | null;
      creators: Array<{
        __typename?: 'NftCreator';
        address: string;
        position?: number | null;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
      }>;
    } | null;
  } | null;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  };
};

export type ProfilePreviewFragment = {
  __typename?: 'Wallet';
  address: any;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
  nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
};

export type BuyNowListingFragment = {
  __typename?: 'AhListing';
  id: any;
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  } | null;
};

export type MarketplacePreviewFragment = {
  __typename?: 'Marketplace';
  subdomain: string;
  name: string;
  bannerUrl: string;
  creators: Array<{
    __typename?: 'StoreCreator';
    creatorAddress: string;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  }>;
  auctionHouses: Array<{
    __typename?: 'AuctionHouse';
    stats?: { __typename?: 'MintStats'; floor?: any | null } | null;
  }>;
  stats?: { __typename?: 'MarketStats'; nfts?: any | null } | null;
};

export type HomeQueryVariables = Exact<{
  userWallet?: InputMaybe<Scalars['PublicKey']>;
  featuredCollectionsLimit: Scalars['Int'];
  featuredProfileLimit: Scalars['Int'];
  featuredBuyNowLimit: Scalars['Int'];
  feedEventsLimit: Scalars['Int'];
  collectionsByVolumeStartDate: Scalars['DateTimeUtc'];
  collectionsByVolumeEndDate: Scalars['DateTimeUtc'];
  collectionsByMarketCapStartDate: Scalars['DateTimeUtc'];
  collectionsByMarketCapEndDate: Scalars['DateTimeUtc'];
}>;

export type HomeQuery = {
  __typename?: 'QueryRoot';
  feedEvents: Array<
    | {
        __typename: 'FollowEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        graphConnectionAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        connection?: {
          __typename?: 'GraphConnection';
          address: string;
          from: {
            __typename?: 'Wallet';
            address: any;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          };
          to: {
            __typename?: 'Wallet';
            address: any;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          };
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'ListingEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        lifecycle: string;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        listing?: {
          __typename?: 'AhListing';
          id: any;
          seller: any;
          price: any;
          auctionHouse?: {
            __typename?: 'AuctionHouse';
            address: string;
            treasuryMint: string;
            auctionHouseTreasury: string;
            treasuryWithdrawalDestination: string;
            feeWithdrawalDestination: string;
            authority: string;
            creator: string;
            auctionHouseFeeAccount: string;
            bump: number;
            treasuryBump: number;
            feePayerBump: number;
            sellerFeeBasisPoints: number;
            requiresSignOff: boolean;
            canChangeSalePrice: boolean;
          } | null;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            creators: Array<{
              __typename?: 'NftCreator';
              address: string;
              position?: number | null;
              profile?: {
                __typename?: 'TwitterProfile';
                handle: string;
                profileImageUrlLowres: string;
                profileImageUrlHighres: string;
              } | null;
            }>;
            listings: Array<{
              __typename?: 'AhListing';
              id: any;
              seller: any;
              price: any;
              nft?: {
                __typename?: 'Nft';
                name: string;
                image: string;
                description: string;
                sellerFeeBasisPoints: number;
                primarySaleHappened: boolean;
                address: string;
                mintAddress: string;
                owner?: {
                  __typename?: 'NftOwner';
                  address: string;
                  associatedTokenAccountAddress: string;
                  twitterHandle?: string | null;
                } | null;
                creators: Array<{
                  __typename?: 'NftCreator';
                  address: string;
                  position?: number | null;
                  profile?: {
                    __typename?: 'TwitterProfile';
                    walletAddress?: string | null;
                    handle: string;
                    profileImageUrlLowres: string;
                    profileImageUrlHighres: string;
                    bannerImageUrl: string;
                  } | null;
                }>;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'MintEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        nft?: {
          __typename?: 'Nft';
          name: string;
          image: string;
          description: string;
          sellerFeeBasisPoints: number;
          primarySaleHappened: boolean;
          address: string;
          mintAddress: string;
          owner?: {
            __typename?: 'NftOwner';
            address: string;
            associatedTokenAccountAddress: string;
            twitterHandle?: string | null;
          } | null;
          creators: Array<{
            __typename?: 'NftCreator';
            address: string;
            position?: number | null;
            profile?: {
              __typename?: 'TwitterProfile';
              walletAddress?: string | null;
              handle: string;
              profileImageUrlLowres: string;
              profileImageUrlHighres: string;
              bannerImageUrl: string;
            } | null;
          }>;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'OfferEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        lifecycle: string;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        offer?: {
          __typename?: 'Offer';
          id: any;
          buyer: any;
          price: any;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            offers: Array<{
              __typename?: 'Offer';
              id: any;
              buyer: any;
              price: any;
              nft?: {
                __typename?: 'Nft';
                name: string;
                image: string;
                description: string;
                sellerFeeBasisPoints: number;
                primarySaleHappened: boolean;
                address: string;
                mintAddress: string;
                owner?: {
                  __typename?: 'NftOwner';
                  address: string;
                  associatedTokenAccountAddress: string;
                  twitterHandle?: string | null;
                } | null;
                creators: Array<{
                  __typename?: 'NftCreator';
                  address: string;
                  position?: number | null;
                  profile?: {
                    __typename?: 'TwitterProfile';
                    walletAddress?: string | null;
                    handle: string;
                    profileImageUrlLowres: string;
                    profileImageUrlHighres: string;
                    bannerImageUrl: string;
                  } | null;
                }>;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
    | {
        __typename: 'PurchaseEvent';
        feedEventId: string;
        createdAt: any;
        walletAddress: any;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
        purchase?: {
          __typename?: 'Purchase';
          id: any;
          buyer: any;
          seller: any;
          price: any;
          nft?: {
            __typename?: 'Nft';
            name: string;
            image: string;
            description: string;
            sellerFeeBasisPoints: number;
            primarySaleHappened: boolean;
            address: string;
            mintAddress: string;
            owner?: {
              __typename?: 'NftOwner';
              address: string;
              associatedTokenAccountAddress: string;
              twitterHandle?: string | null;
            } | null;
            creators: Array<{
              __typename?: 'NftCreator';
              address: string;
              position?: number | null;
              profile?: {
                __typename?: 'TwitterProfile';
                walletAddress?: string | null;
                handle: string;
                profileImageUrlLowres: string;
                profileImageUrlHighres: string;
                bannerImageUrl: string;
              } | null;
            }>;
          } | null;
        } | null;
        wallet: {
          __typename?: 'Wallet';
          address: any;
          nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
        };
      }
  >;
  collectionsFeaturedByVolume: Array<{
    __typename?: 'Collection';
    floorPrice?: any | null;
    nftCount?: any | null;
    nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
  }>;
  collectionsFeaturedByMarketCap: Array<{
    __typename?: 'Collection';
    floorPrice?: any | null;
    nftCount?: any | null;
    nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
  }>;
  followWallets: Array<{
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
    nftCounts: { __typename?: 'WalletNftCount'; owned: number; created: number };
  }>;
  featuredListings: Array<{
    __typename?: 'AhListing';
    id: any;
    nft?: {
      __typename?: 'Nft';
      address: string;
      name: string;
      sellerFeeBasisPoints: number;
      mintAddress: string;
      description: string;
      image: string;
      primarySaleHappened: boolean;
      creators: Array<{
        __typename?: 'NftCreator';
        address: string;
        share: number;
        verified: boolean;
      }>;
      owner?: {
        __typename?: 'NftOwner';
        address: string;
        associatedTokenAccountAddress: string;
      } | null;
      purchases: Array<{
        __typename?: 'Purchase';
        id: any;
        buyer: any;
        price: any;
        createdAt: any;
        auctionHouse?: {
          __typename?: 'AuctionHouse';
          address: string;
          treasuryMint: string;
          auctionHouseTreasury: string;
          treasuryWithdrawalDestination: string;
          feeWithdrawalDestination: string;
          authority: string;
          creator: string;
          auctionHouseFeeAccount: string;
          bump: number;
          treasuryBump: number;
          feePayerBump: number;
          sellerFeeBasisPoints: number;
          requiresSignOff: boolean;
          canChangeSalePrice: boolean;
        } | null;
      }>;
      listings: Array<{
        __typename?: 'AhListing';
        id: any;
        tradeState: string;
        seller: any;
        metadata: any;
        marketplaceProgramAddress: string;
        price: any;
        tradeStateBump: number;
        createdAt: any;
        canceledAt?: any | null;
        auctionHouse?: {
          __typename?: 'AuctionHouse';
          address: string;
          treasuryMint: string;
          auctionHouseTreasury: string;
          treasuryWithdrawalDestination: string;
          feeWithdrawalDestination: string;
          authority: string;
          creator: string;
          auctionHouseFeeAccount: string;
          bump: number;
          treasuryBump: number;
          feePayerBump: number;
          sellerFeeBasisPoints: number;
          requiresSignOff: boolean;
          canChangeSalePrice: boolean;
        } | null;
      }>;
      offers: Array<{
        __typename?: 'Offer';
        id: any;
        tradeState: string;
        buyer: any;
        metadata: any;
        price: any;
        tradeStateBump: number;
        tokenAccount?: string | null;
        createdAt: any;
        canceledAt?: any | null;
        auctionHouse?: {
          __typename?: 'AuctionHouse';
          address: string;
          treasuryMint: string;
          auctionHouseTreasury: string;
          treasuryWithdrawalDestination: string;
          feeWithdrawalDestination: string;
          authority: string;
          creator: string;
          auctionHouseFeeAccount: string;
          bump: number;
          treasuryBump: number;
          feePayerBump: number;
          sellerFeeBasisPoints: number;
          requiresSignOff: boolean;
          canChangeSalePrice: boolean;
        } | null;
      }>;
    } | null;
  }>;
  buyNowMarketplace?: {
    __typename?: 'Marketplace';
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
  featuredMarketplaces: Array<{
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    bannerUrl: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      stats?: { __typename?: 'MintStats'; floor?: any | null } | null;
    }>;
    stats?: { __typename?: 'MarketStats'; nfts?: any | null } | null;
  }>;
};

export type NftMarketplaceQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;

export type NftMarketplaceQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    category: string;
    image: string;
    primarySaleHappened: boolean;
    files: Array<{ __typename?: 'NftFile'; uri: string; fileType: string }>;
    attributes: Array<{
      __typename?: 'NftAttribute';
      metadataAddress: string;
      value?: string | null;
      traitType?: string | null;
    }>;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    collection?: {
      __typename?: 'Collection';
      address: string;
      name: string;
      image: string;
      mintAddress: string;
    } | null;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  } | null;
  nftByMintAddress?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    category: string;
    image: string;
    primarySaleHappened: boolean;
    files: Array<{ __typename?: 'NftFile'; uri: string; fileType: string }>;
    attributes: Array<{
      __typename?: 'NftAttribute';
      metadataAddress: string;
      value?: string | null;
      traitType?: string | null;
    }>;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    collection?: {
      __typename?: 'Collection';
      address: string;
      name: string;
      image: string;
      mintAddress: string;
    } | null;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  } | null;
};

export type OffersPageQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['PublicKey'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type OffersPageQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
    creators: Array<{
      __typename?: 'StoreCreator';
      creatorAddress: string;
      storeConfigAddress: string;
    }>;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
  nftsWithSentOffers: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      verified: boolean;
      twitterHandle?: string | null;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
  ownedNFTs: Array<{
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      verified: boolean;
      twitterHandle?: string | null;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  }>;
};

export type SubdomainCheckQueryVariables = Exact<{
  subdomain: Scalars['String'];
}>;

export type SubdomainCheckQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    ownerAddress: string;
  } | null;
};

export type NftActivityQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type NftActivityQuery = {
  __typename?: 'QueryRoot';
  nftByMintAddress?: {
    __typename?: 'Nft';
    activities: Array<{
      __typename?: 'NftActivity';
      id: any;
      metadata: any;
      price: any;
      createdAt: any;
      activityType: string;
      wallets: Array<{
        __typename?: 'Wallet';
        address: any;
        twitterHandle?: string | null;
        profile?: {
          __typename?: 'TwitterProfile';
          walletAddress?: string | null;
          handle: string;
          profileImageUrlLowres: string;
          profileImageUrlHighres: string;
          bannerImageUrl: string;
        } | null;
      }>;
      auctionHouse?: { __typename?: 'AuctionHouse'; address: string; treasuryMint: string } | null;
    }>;
  } | null;
};

export type NftCardQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;

export type NftCardQuery = {
  __typename?: 'QueryRoot';
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{
      __typename?: 'NftCreator';
      address: string;
      share: number;
      verified: boolean;
    }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      purchaseId?: any | null;
      tradeStateBump: number;
      tokenAccount?: string | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  } | null;
  marketplace?: {
    __typename?: 'Marketplace';
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      treasuryMint: string;
      auctionHouseTreasury: string;
      treasuryWithdrawalDestination: string;
      feeWithdrawalDestination: string;
      authority: string;
      creator: string;
      auctionHouseFeeAccount: string;
      bump: number;
      treasuryBump: number;
      feePayerBump: number;
      sellerFeeBasisPoints: number;
      requiresSignOff: boolean;
      canChangeSalePrice: boolean;
    }>;
  } | null;
};

export type NftPageQueryVariables = Exact<{
  address: Scalars['String'];
}>;

export type NftPageQuery = {
  __typename?: 'QueryRoot';
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    attributes: Array<{
      __typename?: 'NftAttribute';
      metadataAddress: string;
      value?: string | null;
      traitType?: string | null;
    }>;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    owner?: { __typename?: 'NftOwner'; address: string } | null;
    purchases: Array<{
      __typename?: 'Purchase';
      id: any;
      buyer: any;
      price: any;
      createdAt: any;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    listings: Array<{
      __typename?: 'AhListing';
      id: any;
      tradeState: string;
      seller: any;
      metadata: any;
      marketplaceProgramAddress: string;
      price: any;
      tradeStateBump: number;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
    offers: Array<{
      __typename?: 'Offer';
      id: any;
      tradeState: string;
      buyer: any;
      metadata: any;
      price: any;
      tradeStateBump: number;
      tokenAccount?: string | null;
      purchaseId?: any | null;
      createdAt: any;
      canceledAt?: any | null;
      auctionHouse?: {
        __typename?: 'AuctionHouse';
        address: string;
        treasuryMint: string;
        auctionHouseTreasury: string;
        treasuryWithdrawalDestination: string;
        feeWithdrawalDestination: string;
        authority: string;
        creator: string;
        auctionHouseFeeAccount: string;
        bump: number;
        treasuryBump: number;
        feePayerBump: number;
        sellerFeeBasisPoints: number;
        requiresSignOff: boolean;
        canChangeSalePrice: boolean;
      } | null;
    }>;
  } | null;
};

export type ShareNftQueryVariables = Exact<{
  subdomain: Scalars['String'];
  address: Scalars['String'];
}>;

export type ShareNftQuery = {
  __typename?: 'QueryRoot';
  marketplace?: {
    __typename?: 'Marketplace';
    subdomain: string;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    auctionHouses: Array<{
      __typename?: 'AuctionHouse';
      address: string;
      stats?: {
        __typename?: 'MintStats';
        floor?: any | null;
        average?: any | null;
        volume24hr?: any | null;
      } | null;
    }>;
  } | null;
  nft?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{ __typename?: 'Purchase'; id: any; buyer: any; price: any }>;
    listings: Array<{ __typename?: 'AhListing'; id: any; price: any }>;
    offers: Array<{ __typename?: 'Offer'; id: any; buyer: any; price: any }>;
  } | null;
  nftByMintAddress?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    sellerFeeBasisPoints: number;
    mintAddress: string;
    description: string;
    image: string;
    primarySaleHappened: boolean;
    creators: Array<{ __typename?: 'NftCreator'; address: string; verified: boolean }>;
    owner?: {
      __typename?: 'NftOwner';
      address: string;
      associatedTokenAccountAddress: string;
    } | null;
    purchases: Array<{ __typename?: 'Purchase'; id: any; buyer: any; price: any }>;
    listings: Array<{ __typename?: 'AhListing'; id: any; price: any }>;
    offers: Array<{ __typename?: 'Offer'; id: any; buyer: any; price: any }>;
  } | null;
};

export type ConnectionNodeFragment = {
  __typename?: 'Wallet';
  address: any;
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
};

export type AllConnectionsFromQueryVariables = Exact<{
  from: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type AllConnectionsFromQuery = {
  __typename?: 'QueryRoot';
  connections: Array<{
    __typename?: 'GraphConnection';
    to: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
};

export type AllConnectionsToQueryVariables = Exact<{
  to: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type AllConnectionsToQuery = {
  __typename?: 'QueryRoot';
  connections: Array<{
    __typename?: 'GraphConnection';
    from: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
};

export type GetCollectedByQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
}>;

export type GetCollectedByQuery = {
  __typename?: 'QueryRoot';
  nfts: Array<{
    __typename?: 'Nft';
    address: string;
    owner?: {
      __typename?: 'NftOwner';
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    } | null;
  }>;
};

export type GetConnectedWalletProfileDataQueryVariables = Exact<{
  address: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type GetConnectedWalletProfileDataQuery = {
  __typename?: 'QueryRoot';
  wallet: {
    __typename?: 'Wallet';
    address: any;
    nftCounts: {
      __typename?: 'WalletNftCount';
      owned: number;
      created: number;
      offered: number;
      listed: number;
    };
    connectionCounts: { __typename?: 'ConnectionCounts'; fromCount: number; toCount: number };
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  };
  followers: Array<{
    __typename?: 'GraphConnection';
    from: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
  following: Array<{
    __typename?: 'GraphConnection';
    to: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
};

export type GetProfileFollowerOverviewQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type GetProfileFollowerOverviewQuery = {
  __typename?: 'QueryRoot';
  wallet: {
    __typename?: 'Wallet';
    connectionCounts: { __typename?: 'ConnectionCounts'; fromCount: number; toCount: number };
  };
  followers: Array<{
    __typename?: 'GraphConnection';
    from: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
  following: Array<{
    __typename?: 'GraphConnection';
    to: {
      __typename?: 'Wallet';
      address: any;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    };
  }>;
  nftsCreated: Array<{
    __typename?: 'Nft';
    address: string;
    owner?: {
      __typename?: 'NftOwner';
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    } | null;
  }>;
};

export type GetProfileInfoFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;

export type GetProfileInfoFromPubKeyQuery = {
  __typename?: 'QueryRoot';
  wallet: {
    __typename?: 'Wallet';
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  };
};

export type GetProfileInfoFromTwitterHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;

export type GetProfileInfoFromTwitterHandleQuery = {
  __typename?: 'QueryRoot';
  profile?: {
    __typename?: 'TwitterProfile';
    walletAddress?: string | null;
    handle: string;
    profileImageUrlLowres: string;
    profileImageUrlHighres: string;
    bannerImageUrl: string;
  } | null;
};

export type GetProfilesQueryVariables = Exact<{
  addresses: Array<Scalars['PublicKey']> | Scalars['PublicKey'];
}>;

export type GetProfilesQuery = {
  __typename?: 'QueryRoot';
  wallets: Array<{
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  }>;
};

export type IsXFollowingYQueryVariables = Exact<{
  xPubKey: Scalars['PublicKey'];
  yPubKey: Scalars['PublicKey'];
}>;

export type IsXFollowingYQuery = {
  __typename?: 'QueryRoot';
  connections: Array<{ __typename?: 'GraphConnection'; address: string }>;
};

export type TwitterHandleFromPubKeyQueryVariables = Exact<{
  pubKey: Scalars['PublicKey'];
}>;

export type TwitterHandleFromPubKeyQuery = {
  __typename?: 'QueryRoot';
  wallet: {
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  };
};

export type MetadataSearchQueryVariables = Exact<{
  term: Scalars['String'];
}>;

export type MetadataSearchQuery = {
  __typename?: 'QueryRoot';
  metadataJsons: Array<{
    __typename?: 'MetadataJson';
    name: string;
    address: string;
    image?: string | null;
    creatorAddress?: string | null;
    creatorTwitterHandle?: string | null;
  }>;
};

export type ProfileSearchQueryVariables = Exact<{
  term: Scalars['String'];
}>;

export type ProfileSearchQuery = {
  __typename?: 'QueryRoot';
  profiles: Array<{
    __typename?: 'Wallet';
    address: any;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  }>;
};

export type SearchQueryVariables = Exact<{
  term: Scalars['String'];
  walletAddress: Scalars['PublicKey'];
  nftMintAddress: Scalars['String'];
  start: Scalars['DateTimeUtc'];
  end: Scalars['DateTimeUtc'];
}>;

export type SearchQuery = {
  __typename?: 'QueryRoot';
  metadataJsons: Array<{
    __typename?: 'MetadataJson';
    name: string;
    address: string;
    mintAddress: string;
    image?: string | null;
    creatorAddress?: string | null;
    creatorTwitterHandle?: string | null;
  }>;
  profiles: Array<{
    __typename?: 'Wallet';
    address: any;
    twitterHandle?: string | null;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  }>;
  wallet: {
    __typename?: 'Wallet';
    address: any;
    twitterHandle?: string | null;
    profile?: {
      __typename?: 'TwitterProfile';
      walletAddress?: string | null;
      handle: string;
      profileImageUrlLowres: string;
      profileImageUrlHighres: string;
      bannerImageUrl: string;
    } | null;
  };
  nftByMintAddress?: {
    __typename?: 'Nft';
    address: string;
    name: string;
    image: string;
    mintAddress: string;
    creators: Array<{
      __typename?: 'NftCreator';
      twitterHandle?: string | null;
      address: string;
      profile?: {
        __typename?: 'TwitterProfile';
        walletAddress?: string | null;
        handle: string;
        profileImageUrlLowres: string;
        profileImageUrlHighres: string;
        bannerImageUrl: string;
      } | null;
    }>;
  } | null;
  searchCollections: Array<{
    __typename?: 'MetadataJson';
    name: string;
    address: string;
    mintAddress: string;
    image?: string | null;
  }>;
  collectionsFeaturedByVolume: Array<{
    __typename?: 'Collection';
    floorPrice?: any | null;
    nftCount?: any | null;
    nft: { __typename?: 'Nft'; mintAddress: string; name: string; image: string };
  }>;
};

export const CollectionPreviewFragmentDoc = gql`
  fragment CollectionPreview on Collection {
    floorPrice
    nftCount
    nft {
      mintAddress
      name
      image
    }
  }
`;
export const ProfileInfoFragmentDoc = gql`
  fragment ProfileInfo on TwitterProfile {
    walletAddress
    handle
    profileImageUrlLowres
    profileImageUrlHighres
    bannerImageUrl
  }
`;
export const FollowEventPreviewFragmentDoc = gql`
  fragment FollowEventPreview on FollowEvent {
    feedEventId
    createdAt
    walletAddress
    profile {
      ...ProfileInfo
    }
    graphConnectionAddress
    connection {
      address
      from {
        address
        profile {
          ...ProfileInfo
        }
      }
      to {
        address
        profile {
          ...ProfileInfo
        }
      }
    }
    wallet {
      address
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const ListingEventPreviewFragmentDoc = gql`
  fragment ListingEventPreview on ListingEvent {
    feedEventId
    createdAt
    walletAddress
    profile {
      ...ProfileInfo
    }
    lifecycle
    listing {
      id
      seller
      price
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
      nft {
        name
        image(width: 600)
        description
        owner {
          address
          associatedTokenAccountAddress
          twitterHandle
        }
        creators {
          address
          position
          profile {
            handle
            profileImageUrlLowres
            profileImageUrlHighres
          }
        }
        listings {
          id
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
                ...ProfileInfo
              }
            }
            address
            mintAddress
          }
        }
        address
        mintAddress
      }
    }
    wallet {
      address
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const MarketplaceAuctionHouseFragmentDoc = gql`
  fragment MarketplaceAuctionHouse on Marketplace {
    auctionHouses {
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
`;
export const MintEventPreviewFragmentDoc = gql`
  fragment MintEventPreview on MintEvent {
    feedEventId
    createdAt
    walletAddress
    profile {
      ...ProfileInfo
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
          ...ProfileInfo
        }
      }
      address
      mintAddress
    }
    wallet {
      address
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const NftCardFragmentDoc = gql`
  fragment NftCard on Nft {
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
      id
      buyer
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
      price
      createdAt
    }
    listings {
      id
      tradeState
      seller
      metadata
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
      marketplaceProgramAddress
      price
      tradeStateBump
      purchaseId
      createdAt
      canceledAt
    }
    offers {
      id
      tradeState
      buyer
      metadata
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
      price
      purchaseId
      tradeStateBump
      tokenAccount
      createdAt
      canceledAt
    }
  }
`;
export const OfferEventPreviewFragmentDoc = gql`
  fragment OfferEventPreview on OfferEvent {
    feedEventId
    createdAt
    walletAddress
    profile {
      ...ProfileInfo
    }
    lifecycle
    offer {
      id
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
        offers {
          id
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
                ...ProfileInfo
              }
            }
            address
            mintAddress
          }
        }
        address
        mintAddress
      }
    }
    wallet {
      address
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const PurchaseEventPreviewFragmentDoc = gql`
  fragment PurchaseEventPreview on PurchaseEvent {
    feedEventId
    createdAt
    walletAddress
    profile {
      ...ProfileInfo
    }
    purchase {
      id
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
            ...ProfileInfo
          }
        }
        address
        mintAddress
      }
    }
    wallet {
      address
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const ProfilePreviewFragmentDoc = gql`
  fragment ProfilePreview on Wallet {
    address
    profile {
      ...ProfileInfo
    }
    nftCounts {
      owned
      created
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const BuyNowListingFragmentDoc = gql`
  fragment BuyNowListing on AhListing {
    id
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
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
  }
`;
export const MarketplacePreviewFragmentDoc = gql`
  fragment MarketplacePreview on Marketplace {
    subdomain
    name
    bannerUrl
    creators {
      creatorAddress
      profile {
        ...ProfileInfo
      }
    }
    auctionHouses {
      stats {
        floor
      }
    }
    stats {
      nfts
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const ConnectionNodeFragmentDoc = gql`
  fragment ConnectionNode on Wallet {
    address
    profile {
      ...ProfileInfo
    }
  }
  ${ProfileInfoFragmentDoc}
`;
export const ActivityPageDocument = gql`
  query activityPage($address: PublicKey!, $limit: Int!, $offset: Int!) {
    wallet(address: $address) {
      __typename
      address
      activities(limit: $limit, offset: $offset) {
        id
        price
        createdAt
        wallets {
          address
          twitterHandle
        }
        activityType
        nft {
          __typename
          address
          name
          description
          image
          creators {
            address
            twitterHandle
          }
        }
        auctionHouse {
          address
          treasuryMint
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useActivityPageQuery(
  baseOptions: Apollo.QueryHookOptions<ActivityPageQuery, ActivityPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ActivityPageQuery, ActivityPageQueryVariables>(
    ActivityPageDocument,
    options
  );
}
export function useActivityPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ActivityPageQuery, ActivityPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ActivityPageQuery, ActivityPageQueryVariables>(
    ActivityPageDocument,
    options
  );
}
export type ActivityPageQueryHookResult = ReturnType<typeof useActivityPageQuery>;
export type ActivityPageLazyQueryHookResult = ReturnType<typeof useActivityPageLazyQuery>;
export type ActivityPageQueryResult = Apollo.QueryResult<
  ActivityPageQuery,
  ActivityPageQueryVariables
>;
export const CollectionNfTsDocument = gql`
  query collectionNFTs($creator: PublicKey!, $owner: PublicKey!, $limit: Int!, $offset: Int!) {
    ownedCollection: nfts(owners: [$owner], limit: $limit, offset: $offset) {
      address
      collection {
        address
        name
        image
        description
      }
    }
    createdCollection: nfts(creators: [$creator], limit: $limit, offset: $offset) {
      address
      collection {
        address
        name
        image
        description
      }
    }
  }
`;

/**
 * __useCollectionNfTsQuery__
 *
 * To run a query within a React component, call `useCollectionNfTsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionNfTsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionNfTsQuery({
 *   variables: {
 *      creator: // value for 'creator'
 *      owner: // value for 'owner'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useCollectionNfTsQuery(
  baseOptions: Apollo.QueryHookOptions<CollectionNfTsQuery, CollectionNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CollectionNfTsQuery, CollectionNfTsQueryVariables>(
    CollectionNfTsDocument,
    options
  );
}
export function useCollectionNfTsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CollectionNfTsQuery, CollectionNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CollectionNfTsQuery, CollectionNfTsQueryVariables>(
    CollectionNfTsDocument,
    options
  );
}
export type CollectionNfTsQueryHookResult = ReturnType<typeof useCollectionNfTsQuery>;
export type CollectionNfTsLazyQueryHookResult = ReturnType<typeof useCollectionNfTsLazyQuery>;
export type CollectionNfTsQueryResult = Apollo.QueryResult<
  CollectionNfTsQuery,
  CollectionNfTsQueryVariables
>;
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
      auctionHouses {
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
      collection {
        address
        name
        image
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
export function useCreatedNfTsQuery(
  baseOptions: Apollo.QueryHookOptions<CreatedNfTsQuery, CreatedNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CreatedNfTsQuery, CreatedNfTsQueryVariables>(CreatedNfTsDocument, options);
}
export function useCreatedNfTsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CreatedNfTsQuery, CreatedNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CreatedNfTsQuery, CreatedNfTsQueryVariables>(
    CreatedNfTsDocument,
    options
  );
}
export type CreatedNfTsQueryHookResult = ReturnType<typeof useCreatedNfTsQuery>;
export type CreatedNfTsLazyQueryHookResult = ReturnType<typeof useCreatedNfTsLazyQuery>;
export type CreatedNfTsQueryResult = Apollo.QueryResult<
  CreatedNfTsQuery,
  CreatedNfTsQueryVariables
>;
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
      auctionHouses {
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
          ...ProfileInfo
        }
      }
      collection {
        address
        name
        image
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useOwnedNfTsQuery(
  baseOptions: Apollo.QueryHookOptions<OwnedNfTsQuery, OwnedNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OwnedNfTsQuery, OwnedNfTsQueryVariables>(OwnedNfTsDocument, options);
}
export function useOwnedNfTsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OwnedNfTsQuery, OwnedNfTsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OwnedNfTsQuery, OwnedNfTsQueryVariables>(OwnedNfTsDocument, options);
}
export type OwnedNfTsQueryHookResult = ReturnType<typeof useOwnedNfTsQuery>;
export type OwnedNfTsLazyQueryHookResult = ReturnType<typeof useOwnedNfTsLazyQuery>;
export type OwnedNfTsQueryResult = Apollo.QueryResult<OwnedNfTsQuery, OwnedNfTsQueryVariables>;
export const WalletProfileDocument = gql`
  query walletProfile($handle: String!) {
    profile(handle: $handle) {
      ...ProfileInfo
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useWalletProfileQuery(
  baseOptions: Apollo.QueryHookOptions<WalletProfileQuery, WalletProfileQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<WalletProfileQuery, WalletProfileQueryVariables>(
    WalletProfileDocument,
    options
  );
}
export function useWalletProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<WalletProfileQuery, WalletProfileQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<WalletProfileQuery, WalletProfileQueryVariables>(
    WalletProfileDocument,
    options
  );
}
export type WalletProfileQueryHookResult = ReturnType<typeof useWalletProfileQuery>;
export type WalletProfileLazyQueryHookResult = ReturnType<typeof useWalletProfileLazyQuery>;
export type WalletProfileQueryResult = Apollo.QueryResult<
  WalletProfileQuery,
  WalletProfileQueryVariables
>;
export const GetCollectionDocument = gql`
  query getCollection($address: String!) {
    nft(address: $address) {
      address
      name
      description
      mintAddress
      image
      creators {
        position
        address
        profile {
          ...ProfileInfo
        }
      }
    }
    nftByMintAddress(address: $address) {
      address
      name
      description
      mintAddress
      image
      creators {
        position
        address
        profile {
          ...ProfileInfo
        }
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useGetCollectionQuery__
 *
 * To run a query within a React component, call `useGetCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionQuery, GetCollectionQueryVariables>(
    GetCollectionDocument,
    options
  );
}
export function useGetCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCollectionQuery, GetCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionQuery, GetCollectionQueryVariables>(
    GetCollectionDocument,
    options
  );
}
export type GetCollectionQueryHookResult = ReturnType<typeof useGetCollectionQuery>;
export type GetCollectionLazyQueryHookResult = ReturnType<typeof useGetCollectionLazyQuery>;
export type GetCollectionQueryResult = Apollo.QueryResult<
  GetCollectionQuery,
  GetCollectionQueryVariables
>;
export const NftCollectionDocument = gql`
  query nftCollection(
    $address: String!
    $marketplaceSubdomain: String!
    $limit: Int = 25
    $offset: Int = 0
  ) {
    nft(address: "DTjENPCxVnukLh5wbdBsb3CDttSfQzdNeRyk7dzr6vjr") {
      address
      name
      mintAddress
      creators {
        position
        address
        profile {
          ...ProfileInfo
        }
      }
    }
    nfts(
      collection: "FbMgyHab7LxdhnSAFueCR9JGdCZKQNornmHEf4vocGGQ"
      limit: $limit
      offset: $offset
    ) {
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
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
    marketplace(subdomain: $marketplaceSubdomain) {
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
      auctionHouses {
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
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useNftCollectionQuery__
 *
 * To run a query within a React component, call `useNftCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftCollectionQuery({
 *   variables: {
 *      address: // value for 'address'
 *      marketplaceSubdomain: // value for 'marketplaceSubdomain'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useNftCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<NftCollectionQuery, NftCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftCollectionQuery, NftCollectionQueryVariables>(
    NftCollectionDocument,
    options
  );
}
export function useNftCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftCollectionQuery, NftCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NftCollectionQuery, NftCollectionQueryVariables>(
    NftCollectionDocument,
    options
  );
}
export type NftCollectionQueryHookResult = ReturnType<typeof useNftCollectionQuery>;
export type NftCollectionLazyQueryHookResult = ReturnType<typeof useNftCollectionLazyQuery>;
export type NftCollectionQueryResult = Apollo.QueryResult<
  NftCollectionQuery,
  NftCollectionQueryVariables
>;
export const NftsInCollectionDocument = gql`
  query nftsInCollection(
    $collectionMintAddress: PublicKey!
    $listed: Boolean
    $marketplaceSubdomain: String!
    $limit: Int = 25
    $offset: Int = 0
  ) {
    marketplace(subdomain: $marketplaceSubdomain) {
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
      auctionHouses {
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
    nfts(collection: $collectionMintAddress, listed: $listed, limit: $limit, offset: $offset) {
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
        share
        verified
        profile {
          ...ProfileInfo
        }
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      collection {
        address
        name
        image
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useNftsInCollectionQuery__
 *
 * To run a query within a React component, call `useNftsInCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftsInCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftsInCollectionQuery({
 *   variables: {
 *      collectionMintAddress: // value for 'collectionMintAddress'
 *      listed: // value for 'listed'
 *      marketplaceSubdomain: // value for 'marketplaceSubdomain'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useNftsInCollectionQuery(
  baseOptions: Apollo.QueryHookOptions<NftsInCollectionQuery, NftsInCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftsInCollectionQuery, NftsInCollectionQueryVariables>(
    NftsInCollectionDocument,
    options
  );
}
export function useNftsInCollectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftsInCollectionQuery, NftsInCollectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NftsInCollectionQuery, NftsInCollectionQueryVariables>(
    NftsInCollectionDocument,
    options
  );
}
export type NftsInCollectionQueryHookResult = ReturnType<typeof useNftsInCollectionQuery>;
export type NftsInCollectionLazyQueryHookResult = ReturnType<typeof useNftsInCollectionLazyQuery>;
export type NftsInCollectionQueryResult = Apollo.QueryResult<
  NftsInCollectionQuery,
  NftsInCollectionQueryVariables
>;
export const DiscoverCollectionsByMarketCapDocument = gql`
  query discoverCollectionsByMarketCap(
    $searchTerm: String
    $start: DateTimeUtc!
    $end: DateTimeUtc!
    $limit: Int!
    $offset: Int!
  ) {
    collectionsFeaturedByMarketCap(
      term: $searchTerm
      startDate: $start
      endDate: $end
      limit: $limit
      offset: $offset
      orderDirection: DESC
    ) {
      ...CollectionPreview
    }
  }
  ${CollectionPreviewFragmentDoc}
`;

/**
 * __useDiscoverCollectionsByMarketCapQuery__
 *
 * To run a query within a React component, call `useDiscoverCollectionsByMarketCapQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverCollectionsByMarketCapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverCollectionsByMarketCapQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverCollectionsByMarketCapQuery(
  baseOptions: Apollo.QueryHookOptions<
    DiscoverCollectionsByMarketCapQuery,
    DiscoverCollectionsByMarketCapQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverCollectionsByMarketCapQuery,
    DiscoverCollectionsByMarketCapQueryVariables
  >(DiscoverCollectionsByMarketCapDocument, options);
}
export function useDiscoverCollectionsByMarketCapLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverCollectionsByMarketCapQuery,
    DiscoverCollectionsByMarketCapQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverCollectionsByMarketCapQuery,
    DiscoverCollectionsByMarketCapQueryVariables
  >(DiscoverCollectionsByMarketCapDocument, options);
}
export type DiscoverCollectionsByMarketCapQueryHookResult = ReturnType<
  typeof useDiscoverCollectionsByMarketCapQuery
>;
export type DiscoverCollectionsByMarketCapLazyQueryHookResult = ReturnType<
  typeof useDiscoverCollectionsByMarketCapLazyQuery
>;
export type DiscoverCollectionsByMarketCapQueryResult = Apollo.QueryResult<
  DiscoverCollectionsByMarketCapQuery,
  DiscoverCollectionsByMarketCapQueryVariables
>;
export const DiscoverCollectionsByVolumeDocument = gql`
  query discoverCollectionsByVolume(
    $searchTerm: String
    $start: DateTimeUtc!
    $end: DateTimeUtc!
    $limit: Int!
    $offset: Int!
  ) {
    collectionsFeaturedByVolume(
      term: $searchTerm
      startDate: $start
      endDate: $end
      limit: $limit
      offset: $offset
      orderDirection: DESC
    ) {
      ...CollectionPreview
    }
  }
  ${CollectionPreviewFragmentDoc}
`;

/**
 * __useDiscoverCollectionsByVolumeQuery__
 *
 * To run a query within a React component, call `useDiscoverCollectionsByVolumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverCollectionsByVolumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverCollectionsByVolumeQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverCollectionsByVolumeQuery(
  baseOptions: Apollo.QueryHookOptions<
    DiscoverCollectionsByVolumeQuery,
    DiscoverCollectionsByVolumeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DiscoverCollectionsByVolumeQuery,
    DiscoverCollectionsByVolumeQueryVariables
  >(DiscoverCollectionsByVolumeDocument, options);
}
export function useDiscoverCollectionsByVolumeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverCollectionsByVolumeQuery,
    DiscoverCollectionsByVolumeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DiscoverCollectionsByVolumeQuery,
    DiscoverCollectionsByVolumeQueryVariables
  >(DiscoverCollectionsByVolumeDocument, options);
}
export type DiscoverCollectionsByVolumeQueryHookResult = ReturnType<
  typeof useDiscoverCollectionsByVolumeQuery
>;
export type DiscoverCollectionsByVolumeLazyQueryHookResult = ReturnType<
  typeof useDiscoverCollectionsByVolumeLazyQuery
>;
export type DiscoverCollectionsByVolumeQueryResult = Apollo.QueryResult<
  DiscoverCollectionsByVolumeQuery,
  DiscoverCollectionsByVolumeQueryVariables
>;
export const DiscoverNftsActiveOffersDocument = gql`
  query discoverNftsActiveOffers($searchTerm: String, $limit: Int!, $offset: Int!) {
    nfts(
      auctionHouses: ["9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t"]
      withOffers: true
      limit: $limit
      offset: $offset
      term: $searchTerm
    ) {
      ...NftCard
    }
    marketplace(subdomain: "haus") {
      ...MarketplaceAuctionHouse
    }
  }
  ${NftCardFragmentDoc}
  ${MarketplaceAuctionHouseFragmentDoc}
`;

/**
 * __useDiscoverNftsActiveOffersQuery__
 *
 * To run a query within a React component, call `useDiscoverNftsActiveOffersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverNftsActiveOffersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverNftsActiveOffersQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverNftsActiveOffersQuery(
  baseOptions: Apollo.QueryHookOptions<
    DiscoverNftsActiveOffersQuery,
    DiscoverNftsActiveOffersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverNftsActiveOffersQuery, DiscoverNftsActiveOffersQueryVariables>(
    DiscoverNftsActiveOffersDocument,
    options
  );
}
export function useDiscoverNftsActiveOffersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverNftsActiveOffersQuery,
    DiscoverNftsActiveOffersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverNftsActiveOffersQuery, DiscoverNftsActiveOffersQueryVariables>(
    DiscoverNftsActiveOffersDocument,
    options
  );
}
export type DiscoverNftsActiveOffersQueryHookResult = ReturnType<
  typeof useDiscoverNftsActiveOffersQuery
>;
export type DiscoverNftsActiveOffersLazyQueryHookResult = ReturnType<
  typeof useDiscoverNftsActiveOffersLazyQuery
>;
export type DiscoverNftsActiveOffersQueryResult = Apollo.QueryResult<
  DiscoverNftsActiveOffersQuery,
  DiscoverNftsActiveOffersQueryVariables
>;
export const DiscoverNftsAllDocument = gql`
  query discoverNftsAll($searchTerm: String, $limit: Int!, $offset: Int!) {
    nfts(
      auctionHouses: ["9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t"]
      limit: $limit
      offset: $offset
      term: $searchTerm
    ) {
      ...NftCard
    }
    marketplace(subdomain: "haus") {
      ...MarketplaceAuctionHouse
    }
  }
  ${NftCardFragmentDoc}
  ${MarketplaceAuctionHouseFragmentDoc}
`;

/**
 * __useDiscoverNftsAllQuery__
 *
 * To run a query within a React component, call `useDiscoverNftsAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverNftsAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverNftsAllQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverNftsAllQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverNftsAllQuery, DiscoverNftsAllQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverNftsAllQuery, DiscoverNftsAllQueryVariables>(
    DiscoverNftsAllDocument,
    options
  );
}
export function useDiscoverNftsAllLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverNftsAllQuery, DiscoverNftsAllQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverNftsAllQuery, DiscoverNftsAllQueryVariables>(
    DiscoverNftsAllDocument,
    options
  );
}
export type DiscoverNftsAllQueryHookResult = ReturnType<typeof useDiscoverNftsAllQuery>;
export type DiscoverNftsAllLazyQueryHookResult = ReturnType<typeof useDiscoverNftsAllLazyQuery>;
export type DiscoverNftsAllQueryResult = Apollo.QueryResult<
  DiscoverNftsAllQuery,
  DiscoverNftsAllQueryVariables
>;
export const DiscoverNftsBuyNowDocument = gql`
  query discoverNftsBuyNow($searchTerm: String, $limit: Int!, $offset: Int!) {
    nfts(
      auctionHouses: ["9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t"]
      listed: true
      limit: $limit
      offset: $offset
      term: $searchTerm
    ) {
      ...NftCard
    }
    marketplace(subdomain: "haus") {
      ...MarketplaceAuctionHouse
    }
  }
  ${NftCardFragmentDoc}
  ${MarketplaceAuctionHouseFragmentDoc}
`;

/**
 * __useDiscoverNftsBuyNowQuery__
 *
 * To run a query within a React component, call `useDiscoverNftsBuyNowQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverNftsBuyNowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverNftsBuyNowQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverNftsBuyNowQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverNftsBuyNowQuery, DiscoverNftsBuyNowQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverNftsBuyNowQuery, DiscoverNftsBuyNowQueryVariables>(
    DiscoverNftsBuyNowDocument,
    options
  );
}
export function useDiscoverNftsBuyNowLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverNftsBuyNowQuery,
    DiscoverNftsBuyNowQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverNftsBuyNowQuery, DiscoverNftsBuyNowQueryVariables>(
    DiscoverNftsBuyNowDocument,
    options
  );
}
export type DiscoverNftsBuyNowQueryHookResult = ReturnType<typeof useDiscoverNftsBuyNowQuery>;
export type DiscoverNftsBuyNowLazyQueryHookResult = ReturnType<
  typeof useDiscoverNftsBuyNowLazyQuery
>;
export type DiscoverNftsBuyNowQueryResult = Apollo.QueryResult<
  DiscoverNftsBuyNowQuery,
  DiscoverNftsBuyNowQueryVariables
>;
export const DiscoverProfilesAllDocument = gql`
  query discoverProfilesAll($userWallet: PublicKey, $limit: Int!, $offset: Int!) {
    followWallets(wallet: $userWallet, limit: $limit, offset: $offset) {
      address
      profile {
        ...ProfileInfo
      }
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useDiscoverProfilesAllQuery__
 *
 * To run a query within a React component, call `useDiscoverProfilesAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverProfilesAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverProfilesAllQuery({
 *   variables: {
 *      userWallet: // value for 'userWallet'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useDiscoverProfilesAllQuery(
  baseOptions: Apollo.QueryHookOptions<DiscoverProfilesAllQuery, DiscoverProfilesAllQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverProfilesAllQuery, DiscoverProfilesAllQueryVariables>(
    DiscoverProfilesAllDocument,
    options
  );
}
export function useDiscoverProfilesAllLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DiscoverProfilesAllQuery,
    DiscoverProfilesAllQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverProfilesAllQuery, DiscoverProfilesAllQueryVariables>(
    DiscoverProfilesAllDocument,
    options
  );
}
export type DiscoverProfilesAllQueryHookResult = ReturnType<typeof useDiscoverProfilesAllQuery>;
export type DiscoverProfilesAllLazyQueryHookResult = ReturnType<
  typeof useDiscoverProfilesAllLazyQuery
>;
export type DiscoverProfilesAllQueryResult = Apollo.QueryResult<
  DiscoverProfilesAllQuery,
  DiscoverProfilesAllQueryVariables
>;
export const DiscoverStatsDocument = gql`
  query discoverStats {
    nftsStats {
      totalNfts
      buyNowListings
      nftsWithActiveOffers
    }
    profilesStats {
      totalProfiles
    }
  }
`;

/**
 * __useDiscoverStatsQuery__
 *
 * To run a query within a React component, call `useDiscoverStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscoverStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<DiscoverStatsQuery, DiscoverStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DiscoverStatsQuery, DiscoverStatsQueryVariables>(
    DiscoverStatsDocument,
    options
  );
}
export function useDiscoverStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<DiscoverStatsQuery, DiscoverStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DiscoverStatsQuery, DiscoverStatsQueryVariables>(
    DiscoverStatsDocument,
    options
  );
}
export type DiscoverStatsQueryHookResult = ReturnType<typeof useDiscoverStatsQuery>;
export type DiscoverStatsLazyQueryHookResult = ReturnType<typeof useDiscoverStatsLazyQuery>;
export type DiscoverStatsQueryResult = Apollo.QueryResult<
  DiscoverStatsQuery,
  DiscoverStatsQueryVariables
>;
export const FeedDocument = gql`
  query feed($address: PublicKey!, $limit: Int = 25, $offset: Int = 0, $excludeTypes: [String!]) {
    feedEvents(wallet: $address, limit: $limit, offset: $offset, excludeTypes: $excludeTypes) {
      __typename
      ... on MintEvent {
        ...MintEventPreview
      }
      ... on FollowEvent {
        ...FollowEventPreview
      }
      ... on PurchaseEvent {
        ...PurchaseEventPreview
      }
      ... on ListingEvent {
        ...ListingEventPreview
      }
      ... on OfferEvent {
        ...OfferEventPreview
      }
    }
  }
  ${MintEventPreviewFragmentDoc}
  ${FollowEventPreviewFragmentDoc}
  ${PurchaseEventPreviewFragmentDoc}
  ${ListingEventPreviewFragmentDoc}
  ${OfferEventPreviewFragmentDoc}
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
}
export function useFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
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
        ...ProfileInfo
      }
      nftCounts {
        owned
        created
      }
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useWhoToFollowQuery(
  baseOptions: Apollo.QueryHookOptions<WhoToFollowQuery, WhoToFollowQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<WhoToFollowQuery, WhoToFollowQueryVariables>(WhoToFollowDocument, options);
}
export function useWhoToFollowLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<WhoToFollowQuery, WhoToFollowQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<WhoToFollowQuery, WhoToFollowQueryVariables>(
    WhoToFollowDocument,
    options
  );
}
export type WhoToFollowQueryHookResult = ReturnType<typeof useWhoToFollowQuery>;
export type WhoToFollowLazyQueryHookResult = ReturnType<typeof useWhoToFollowLazyQuery>;
export type WhoToFollowQueryResult = Apollo.QueryResult<
  WhoToFollowQuery,
  WhoToFollowQueryVariables
>;
export const HomeDocument = gql`
  query home(
    $userWallet: PublicKey
    $featuredCollectionsLimit: Int!
    $featuredProfileLimit: Int!
    $featuredBuyNowLimit: Int!
    $feedEventsLimit: Int!
    $collectionsByVolumeStartDate: DateTimeUtc!
    $collectionsByVolumeEndDate: DateTimeUtc!
    $collectionsByMarketCapStartDate: DateTimeUtc!
    $collectionsByMarketCapEndDate: DateTimeUtc!
  ) {
    feedEvents(
      wallet: "ALphA7iWKMUi8owfbSKFm2i3BxG6LbasYYXt8sP85Upz"
      limit: $feedEventsLimit
      offset: 0
      excludeTypes: ["follow", "mint"]
    ) {
      __typename
      ... on MintEvent {
        ...MintEventPreview
      }
      ... on FollowEvent {
        ...FollowEventPreview
      }
      ... on PurchaseEvent {
        ...PurchaseEventPreview
      }
      ... on ListingEvent {
        ...ListingEventPreview
      }
      ... on OfferEvent {
        ...OfferEventPreview
      }
    }
    collectionsFeaturedByVolume(
      startDate: $collectionsByVolumeStartDate
      endDate: $collectionsByVolumeEndDate
      limit: $featuredCollectionsLimit
      offset: 0
      orderDirection: DESC
    ) {
      ...CollectionPreview
    }
    collectionsFeaturedByMarketCap(
      startDate: $collectionsByMarketCapStartDate
      endDate: $collectionsByMarketCapEndDate
      limit: $featuredCollectionsLimit
      offset: 0
      orderDirection: DESC
    ) {
      ...CollectionPreview
    }
    followWallets(wallet: $userWallet, limit: $featuredProfileLimit, offset: 0) {
      ...ProfilePreview
    }
    featuredListings(limit: $featuredBuyNowLimit, offset: 0) {
      ...BuyNowListing
    }
    buyNowMarketplace: marketplace(subdomain: "haus") {
      ...MarketplaceAuctionHouse
    }
    featuredMarketplaces: marketplaces(
      subdomains: [
        "junglecats"
        "womeninnfts"
        "nft4good"
        "monkedao"
        "pixelbands"
        "event"
        "skeletoncrew"
        "thechimpions"
      ]
    ) {
      ...MarketplacePreview
    }
  }
  ${MintEventPreviewFragmentDoc}
  ${FollowEventPreviewFragmentDoc}
  ${PurchaseEventPreviewFragmentDoc}
  ${ListingEventPreviewFragmentDoc}
  ${OfferEventPreviewFragmentDoc}
  ${CollectionPreviewFragmentDoc}
  ${ProfilePreviewFragmentDoc}
  ${BuyNowListingFragmentDoc}
  ${MarketplaceAuctionHouseFragmentDoc}
  ${MarketplacePreviewFragmentDoc}
`;

/**
 * __useHomeQuery__
 *
 * To run a query within a React component, call `useHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeQuery({
 *   variables: {
 *      userWallet: // value for 'userWallet'
 *      featuredCollectionsLimit: // value for 'featuredCollectionsLimit'
 *      featuredProfileLimit: // value for 'featuredProfileLimit'
 *      featuredBuyNowLimit: // value for 'featuredBuyNowLimit'
 *      feedEventsLimit: // value for 'feedEventsLimit'
 *      collectionsByVolumeStartDate: // value for 'collectionsByVolumeStartDate'
 *      collectionsByVolumeEndDate: // value for 'collectionsByVolumeEndDate'
 *      collectionsByMarketCapStartDate: // value for 'collectionsByMarketCapStartDate'
 *      collectionsByMarketCapEndDate: // value for 'collectionsByMarketCapEndDate'
 *   },
 * });
 */
export function useHomeQuery(baseOptions: Apollo.QueryHookOptions<HomeQuery, HomeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
}
export function useHomeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HomeQuery, HomeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
}
export type HomeQueryHookResult = ReturnType<typeof useHomeQuery>;
export type HomeLazyQueryHookResult = ReturnType<typeof useHomeLazyQuery>;
export type HomeQueryResult = Apollo.QueryResult<HomeQuery, HomeQueryVariables>;
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
      auctionHouses {
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
      collection {
        address
        name
        image
        mintAddress
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
    nftByMintAddress(address: $address) {
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
      collection {
        address
        name
        image
        mintAddress
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
export function useNftMarketplaceQuery(
  baseOptions: Apollo.QueryHookOptions<NftMarketplaceQuery, NftMarketplaceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftMarketplaceQuery, NftMarketplaceQueryVariables>(
    NftMarketplaceDocument,
    options
  );
}
export function useNftMarketplaceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftMarketplaceQuery, NftMarketplaceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NftMarketplaceQuery, NftMarketplaceQueryVariables>(
    NftMarketplaceDocument,
    options
  );
}
export type NftMarketplaceQueryHookResult = ReturnType<typeof useNftMarketplaceQuery>;
export type NftMarketplaceLazyQueryHookResult = ReturnType<typeof useNftMarketplaceLazyQuery>;
export type NftMarketplaceQueryResult = Apollo.QueryResult<
  NftMarketplaceQuery,
  NftMarketplaceQueryVariables
>;
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
      auctionHouses {
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
    nftsWithSentOffers: nfts(offerers: [$address], limit: $limit, offset: $offset) {
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
        twitterHandle
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        createdAt
        canceledAt
      }
    }
    ownedNFTs: nfts(owners: [$address], limit: $limit, offset: $offset) {
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
        twitterHandle
      }
      owner {
        address
        associatedTokenAccountAddress
      }
      purchases {
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
export function useOffersPageQuery(
  baseOptions: Apollo.QueryHookOptions<OffersPageQuery, OffersPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OffersPageQuery, OffersPageQueryVariables>(OffersPageDocument, options);
}
export function useOffersPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OffersPageQuery, OffersPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OffersPageQuery, OffersPageQueryVariables>(
    OffersPageDocument,
    options
  );
}
export type OffersPageQueryHookResult = ReturnType<typeof useOffersPageQuery>;
export type OffersPageLazyQueryHookResult = ReturnType<typeof useOffersPageLazyQuery>;
export type OffersPageQueryResult = Apollo.QueryResult<OffersPageQuery, OffersPageQueryVariables>;
export const SubdomainCheckDocument = gql`
  query subdomainCheck($subdomain: String!) {
    marketplace(subdomain: $subdomain) {
      subdomain
      name
      description
      logoUrl
      bannerUrl
      ownerAddress
    }
  }
`;

/**
 * __useSubdomainCheckQuery__
 *
 * To run a query within a React component, call `useSubdomainCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubdomainCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubdomainCheckQuery({
 *   variables: {
 *      subdomain: // value for 'subdomain'
 *   },
 * });
 */
export function useSubdomainCheckQuery(
  baseOptions: Apollo.QueryHookOptions<SubdomainCheckQuery, SubdomainCheckQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubdomainCheckQuery, SubdomainCheckQueryVariables>(
    SubdomainCheckDocument,
    options
  );
}
export function useSubdomainCheckLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubdomainCheckQuery, SubdomainCheckQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubdomainCheckQuery, SubdomainCheckQueryVariables>(
    SubdomainCheckDocument,
    options
  );
}
export type SubdomainCheckQueryHookResult = ReturnType<typeof useSubdomainCheckQuery>;
export type SubdomainCheckLazyQueryHookResult = ReturnType<typeof useSubdomainCheckLazyQuery>;
export type SubdomainCheckQueryResult = Apollo.QueryResult<
  SubdomainCheckQuery,
  SubdomainCheckQueryVariables
>;
export const NftActivityDocument = gql`
  query nftActivity($address: String!) {
    nftByMintAddress(address: $address) {
      activities {
        id
        metadata
        price
        createdAt
        wallets {
          address
          twitterHandle
          profile {
            ...ProfileInfo
          }
        }
        activityType
        auctionHouse {
          address
          treasuryMint
        }
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useNftActivityQuery__
 *
 * To run a query within a React component, call `useNftActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftActivityQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useNftActivityQuery(
  baseOptions: Apollo.QueryHookOptions<NftActivityQuery, NftActivityQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftActivityQuery, NftActivityQueryVariables>(NftActivityDocument, options);
}
export function useNftActivityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftActivityQuery, NftActivityQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NftActivityQuery, NftActivityQueryVariables>(
    NftActivityDocument,
    options
  );
}
export type NftActivityQueryHookResult = ReturnType<typeof useNftActivityQuery>;
export type NftActivityLazyQueryHookResult = ReturnType<typeof useNftActivityLazyQuery>;
export type NftActivityQueryResult = Apollo.QueryResult<
  NftActivityQuery,
  NftActivityQueryVariables
>;
export const NftCardDocument = gql`
  query nftCard($subdomain: String!, $address: String!) {
    nft(address: $address) {
      ...NftCard
    }
    marketplace(subdomain: $subdomain) {
      ...MarketplaceAuctionHouse
    }
  }
  ${NftCardFragmentDoc}
  ${MarketplaceAuctionHouseFragmentDoc}
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
export function useNftCardQuery(
  baseOptions: Apollo.QueryHookOptions<NftCardQuery, NftCardQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftCardQuery, NftCardQueryVariables>(NftCardDocument, options);
}
export function useNftCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftCardQuery, NftCardQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
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
        id
        buyer
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
        price
        createdAt
      }
      listings {
        id
        tradeState
        seller
        metadata
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
        marketplaceProgramAddress
        price
        tradeStateBump
        purchaseId
        createdAt
        canceledAt
      }
      offers {
        id
        tradeState
        buyer
        metadata
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
        price
        tradeStateBump
        tokenAccount
        purchaseId
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
export function useNftPageQuery(
  baseOptions: Apollo.QueryHookOptions<NftPageQuery, NftPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NftPageQuery, NftPageQueryVariables>(NftPageDocument, options);
}
export function useNftPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<NftPageQuery, NftPageQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
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
      auctionHouses {
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
        id
        buyer
        price
      }
      listings {
        id
        price
      }
      offers {
        id
        buyer
        price
      }
    }
    nftByMintAddress(address: $address) {
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
        id
        buyer
        price
      }
      listings {
        id
        price
      }
      offers {
        id
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
export function useShareNftQuery(
  baseOptions: Apollo.QueryHookOptions<ShareNftQuery, ShareNftQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ShareNftQuery, ShareNftQueryVariables>(ShareNftDocument, options);
}
export function useShareNftLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ShareNftQuery, ShareNftQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
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
  ${ConnectionNodeFragmentDoc}
`;

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
export function useAllConnectionsFromQuery(
  baseOptions: Apollo.QueryHookOptions<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>(
    AllConnectionsFromDocument,
    options
  );
}
export function useAllConnectionsFromLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllConnectionsFromQuery,
    AllConnectionsFromQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AllConnectionsFromQuery, AllConnectionsFromQueryVariables>(
    AllConnectionsFromDocument,
    options
  );
}
export type AllConnectionsFromQueryHookResult = ReturnType<typeof useAllConnectionsFromQuery>;
export type AllConnectionsFromLazyQueryHookResult = ReturnType<
  typeof useAllConnectionsFromLazyQuery
>;
export type AllConnectionsFromQueryResult = Apollo.QueryResult<
  AllConnectionsFromQuery,
  AllConnectionsFromQueryVariables
>;
export const AllConnectionsToDocument = gql`
  query allConnectionsTo($to: PublicKey!, $limit: Int = 1000, $offset: Int = 0) {
    connections(to: [$to], limit: $limit, offset: $offset) {
      from {
        ...ConnectionNode
      }
    }
  }
  ${ConnectionNodeFragmentDoc}
`;

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
export function useAllConnectionsToQuery(
  baseOptions: Apollo.QueryHookOptions<AllConnectionsToQuery, AllConnectionsToQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AllConnectionsToQuery, AllConnectionsToQueryVariables>(
    AllConnectionsToDocument,
    options
  );
}
export function useAllConnectionsToLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AllConnectionsToQuery, AllConnectionsToQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AllConnectionsToQuery, AllConnectionsToQueryVariables>(
    AllConnectionsToDocument,
    options
  );
}
export type AllConnectionsToQueryHookResult = ReturnType<typeof useAllConnectionsToQuery>;
export type AllConnectionsToLazyQueryHookResult = ReturnType<typeof useAllConnectionsToLazyQuery>;
export type AllConnectionsToQueryResult = Apollo.QueryResult<
  AllConnectionsToQuery,
  AllConnectionsToQueryVariables
>;
export const GetCollectedByDocument = gql`
  query getCollectedBy($creator: PublicKey!) {
    nfts(creators: [$creator], limit: 1000, offset: 0) {
      address
      owner {
        profile {
          ...ProfileInfo
        }
      }
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useGetCollectedByQuery(
  baseOptions: Apollo.QueryHookOptions<GetCollectedByQuery, GetCollectedByQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectedByQuery, GetCollectedByQueryVariables>(
    GetCollectedByDocument,
    options
  );
}
export function useGetCollectedByLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCollectedByQuery, GetCollectedByQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectedByQuery, GetCollectedByQueryVariables>(
    GetCollectedByDocument,
    options
  );
}
export type GetCollectedByQueryHookResult = ReturnType<typeof useGetCollectedByQuery>;
export type GetCollectedByLazyQueryHookResult = ReturnType<typeof useGetCollectedByLazyQuery>;
export type GetCollectedByQueryResult = Apollo.QueryResult<
  GetCollectedByQuery,
  GetCollectedByQueryVariables
>;
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
        ...ProfileInfo
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
  ${ProfileInfoFragmentDoc}
  ${ConnectionNodeFragmentDoc}
`;

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
export function useGetConnectedWalletProfileDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetConnectedWalletProfileDataQuery,
    GetConnectedWalletProfileDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetConnectedWalletProfileDataQuery,
    GetConnectedWalletProfileDataQueryVariables
  >(GetConnectedWalletProfileDataDocument, options);
}
export function useGetConnectedWalletProfileDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetConnectedWalletProfileDataQuery,
    GetConnectedWalletProfileDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetConnectedWalletProfileDataQuery,
    GetConnectedWalletProfileDataQueryVariables
  >(GetConnectedWalletProfileDataDocument, options);
}
export type GetConnectedWalletProfileDataQueryHookResult = ReturnType<
  typeof useGetConnectedWalletProfileDataQuery
>;
export type GetConnectedWalletProfileDataLazyQueryHookResult = ReturnType<
  typeof useGetConnectedWalletProfileDataLazyQuery
>;
export type GetConnectedWalletProfileDataQueryResult = Apollo.QueryResult<
  GetConnectedWalletProfileDataQuery,
  GetConnectedWalletProfileDataQueryVariables
>;
export const GetProfileFollowerOverviewDocument = gql`
  query getProfileFollowerOverview($pubKey: PublicKey!, $limit: Int = 1000, $offset: Int = 0) {
    wallet(address: $pubKey) {
      connectionCounts {
        fromCount
        toCount
      }
    }
    followers: connections(to: [$pubKey], limit: $limit, offset: $offset) {
      from {
        ...ConnectionNode
      }
    }
    following: connections(from: [$pubKey], limit: $limit, offset: $offset) {
      to {
        ...ConnectionNode
      }
    }
    nftsCreated: nfts(creators: [$pubKey], limit: 300, offset: 0) {
      address
      owner {
        profile {
          ...ProfileInfo
        }
      }
    }
  }
  ${ConnectionNodeFragmentDoc}
  ${ProfileInfoFragmentDoc}
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetProfileFollowerOverviewQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProfileFollowerOverviewQuery,
    GetProfileFollowerOverviewQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProfileFollowerOverviewQuery, GetProfileFollowerOverviewQueryVariables>(
    GetProfileFollowerOverviewDocument,
    options
  );
}
export function useGetProfileFollowerOverviewLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProfileFollowerOverviewQuery,
    GetProfileFollowerOverviewQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetProfileFollowerOverviewQuery,
    GetProfileFollowerOverviewQueryVariables
  >(GetProfileFollowerOverviewDocument, options);
}
export type GetProfileFollowerOverviewQueryHookResult = ReturnType<
  typeof useGetProfileFollowerOverviewQuery
>;
export type GetProfileFollowerOverviewLazyQueryHookResult = ReturnType<
  typeof useGetProfileFollowerOverviewLazyQuery
>;
export type GetProfileFollowerOverviewQueryResult = Apollo.QueryResult<
  GetProfileFollowerOverviewQuery,
  GetProfileFollowerOverviewQueryVariables
>;
export const GetProfileInfoFromPubKeyDocument = gql`
  query getProfileInfoFromPubKey($pubKey: PublicKey!) {
    wallet(address: $pubKey) {
      profile {
        ...ProfileInfo
      }
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useGetProfileInfoFromPubKeyQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProfileInfoFromPubKeyQuery,
    GetProfileInfoFromPubKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>(
    GetProfileInfoFromPubKeyDocument,
    options
  );
}
export function useGetProfileInfoFromPubKeyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProfileInfoFromPubKeyQuery,
    GetProfileInfoFromPubKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProfileInfoFromPubKeyQuery, GetProfileInfoFromPubKeyQueryVariables>(
    GetProfileInfoFromPubKeyDocument,
    options
  );
}
export type GetProfileInfoFromPubKeyQueryHookResult = ReturnType<
  typeof useGetProfileInfoFromPubKeyQuery
>;
export type GetProfileInfoFromPubKeyLazyQueryHookResult = ReturnType<
  typeof useGetProfileInfoFromPubKeyLazyQuery
>;
export type GetProfileInfoFromPubKeyQueryResult = Apollo.QueryResult<
  GetProfileInfoFromPubKeyQuery,
  GetProfileInfoFromPubKeyQueryVariables
>;
export const GetProfileInfoFromTwitterHandleDocument = gql`
  query getProfileInfoFromTwitterHandle($handle: String!) {
    profile(handle: $handle) {
      ...ProfileInfo
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useGetProfileInfoFromTwitterHandleQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProfileInfoFromTwitterHandleQuery,
    GetProfileInfoFromTwitterHandleQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetProfileInfoFromTwitterHandleQuery,
    GetProfileInfoFromTwitterHandleQueryVariables
  >(GetProfileInfoFromTwitterHandleDocument, options);
}
export function useGetProfileInfoFromTwitterHandleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProfileInfoFromTwitterHandleQuery,
    GetProfileInfoFromTwitterHandleQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetProfileInfoFromTwitterHandleQuery,
    GetProfileInfoFromTwitterHandleQueryVariables
  >(GetProfileInfoFromTwitterHandleDocument, options);
}
export type GetProfileInfoFromTwitterHandleQueryHookResult = ReturnType<
  typeof useGetProfileInfoFromTwitterHandleQuery
>;
export type GetProfileInfoFromTwitterHandleLazyQueryHookResult = ReturnType<
  typeof useGetProfileInfoFromTwitterHandleLazyQuery
>;
export type GetProfileInfoFromTwitterHandleQueryResult = Apollo.QueryResult<
  GetProfileInfoFromTwitterHandleQuery,
  GetProfileInfoFromTwitterHandleQueryVariables
>;
export const GetProfilesDocument = gql`
  query getProfiles($addresses: [PublicKey!]!) {
    wallets(addresses: $addresses) {
      address
      profile {
        ...ProfileInfo
      }
    }
  }
  ${ProfileInfoFragmentDoc}
`;

/**
 * __useGetProfilesQuery__
 *
 * To run a query within a React component, call `useGetProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfilesQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useGetProfilesQuery(
  baseOptions: Apollo.QueryHookOptions<GetProfilesQuery, GetProfilesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProfilesQuery, GetProfilesQueryVariables>(GetProfilesDocument, options);
}
export function useGetProfilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProfilesQuery, GetProfilesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProfilesQuery, GetProfilesQueryVariables>(
    GetProfilesDocument,
    options
  );
}
export type GetProfilesQueryHookResult = ReturnType<typeof useGetProfilesQuery>;
export type GetProfilesLazyQueryHookResult = ReturnType<typeof useGetProfilesLazyQuery>;
export type GetProfilesQueryResult = Apollo.QueryResult<
  GetProfilesQuery,
  GetProfilesQueryVariables
>;
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
export function useIsXFollowingYQuery(
  baseOptions: Apollo.QueryHookOptions<IsXFollowingYQuery, IsXFollowingYQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<IsXFollowingYQuery, IsXFollowingYQueryVariables>(
    IsXFollowingYDocument,
    options
  );
}
export function useIsXFollowingYLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<IsXFollowingYQuery, IsXFollowingYQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<IsXFollowingYQuery, IsXFollowingYQueryVariables>(
    IsXFollowingYDocument,
    options
  );
}
export type IsXFollowingYQueryHookResult = ReturnType<typeof useIsXFollowingYQuery>;
export type IsXFollowingYLazyQueryHookResult = ReturnType<typeof useIsXFollowingYLazyQuery>;
export type IsXFollowingYQueryResult = Apollo.QueryResult<
  IsXFollowingYQuery,
  IsXFollowingYQueryVariables
>;
export const TwitterHandleFromPubKeyDocument = gql`
  query twitterHandleFromPubKey($pubKey: PublicKey!) {
    wallet(address: $pubKey) {
      ...ConnectionNode
    }
  }
  ${ConnectionNodeFragmentDoc}
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
export function useTwitterHandleFromPubKeyQuery(
  baseOptions: Apollo.QueryHookOptions<
    TwitterHandleFromPubKeyQuery,
    TwitterHandleFromPubKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>(
    TwitterHandleFromPubKeyDocument,
    options
  );
}
export function useTwitterHandleFromPubKeyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TwitterHandleFromPubKeyQuery,
    TwitterHandleFromPubKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TwitterHandleFromPubKeyQuery, TwitterHandleFromPubKeyQueryVariables>(
    TwitterHandleFromPubKeyDocument,
    options
  );
}
export type TwitterHandleFromPubKeyQueryHookResult = ReturnType<
  typeof useTwitterHandleFromPubKeyQuery
>;
export type TwitterHandleFromPubKeyLazyQueryHookResult = ReturnType<
  typeof useTwitterHandleFromPubKeyLazyQuery
>;
export type TwitterHandleFromPubKeyQueryResult = Apollo.QueryResult<
  TwitterHandleFromPubKeyQuery,
  TwitterHandleFromPubKeyQueryVariables
>;
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
export function useMetadataSearchQuery(
  baseOptions: Apollo.QueryHookOptions<MetadataSearchQuery, MetadataSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MetadataSearchQuery, MetadataSearchQueryVariables>(
    MetadataSearchDocument,
    options
  );
}
export function useMetadataSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MetadataSearchQuery, MetadataSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MetadataSearchQuery, MetadataSearchQueryVariables>(
    MetadataSearchDocument,
    options
  );
}
export type MetadataSearchQueryHookResult = ReturnType<typeof useMetadataSearchQuery>;
export type MetadataSearchLazyQueryHookResult = ReturnType<typeof useMetadataSearchLazyQuery>;
export type MetadataSearchQueryResult = Apollo.QueryResult<
  MetadataSearchQuery,
  MetadataSearchQueryVariables
>;
export const ProfileSearchDocument = gql`
  query profileSearch($term: String!) {
    profiles(term: $term, limit: 5, offset: 0) {
      address
      profile {
        ...ProfileInfo
      }
    }
  }
  ${ProfileInfoFragmentDoc}
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
export function useProfileSearchQuery(
  baseOptions: Apollo.QueryHookOptions<ProfileSearchQuery, ProfileSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProfileSearchQuery, ProfileSearchQueryVariables>(
    ProfileSearchDocument,
    options
  );
}
export function useProfileSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProfileSearchQuery, ProfileSearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProfileSearchQuery, ProfileSearchQueryVariables>(
    ProfileSearchDocument,
    options
  );
}
export type ProfileSearchQueryHookResult = ReturnType<typeof useProfileSearchQuery>;
export type ProfileSearchLazyQueryHookResult = ReturnType<typeof useProfileSearchLazyQuery>;
export type ProfileSearchQueryResult = Apollo.QueryResult<
  ProfileSearchQuery,
  ProfileSearchQueryVariables
>;
export const SearchDocument = gql`
  query search(
    $term: String!
    $walletAddress: PublicKey!
    $nftMintAddress: String!
    $start: DateTimeUtc!
    $end: DateTimeUtc!
  ) {
    metadataJsons(term: $term, limit: 25, offset: 0) {
      name
      address
      mintAddress
      image
      creatorAddress
      creatorTwitterHandle
    }
    profiles(term: $term, limit: 5, offset: 0) {
      address
      twitterHandle
      profile {
        ...ProfileInfo
      }
    }
    wallet(address: $walletAddress) {
      address
      twitterHandle
      profile {
        ...ProfileInfo
      }
    }
    nftByMintAddress(address: $nftMintAddress) {
      address
      name
      image
      creators {
        twitterHandle
        address
        profile {
          ...ProfileInfo
        }
      }
      mintAddress
    }
    searchCollections(term: $term, limit: 15, offset: 0) {
      name
      address
      mintAddress
      image
    }
    collectionsFeaturedByVolume(
      term: $term
      startDate: $start
      endDate: $end
      limit: 25
      offset: 0
      orderDirection: DESC
    ) {
      ...CollectionPreview
    }
  }
  ${ProfileInfoFragmentDoc}
  ${CollectionPreviewFragmentDoc}
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
 *      nftMintAddress: // value for 'nftMintAddress'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useSearchQuery(
  baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
}
export function useSearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
