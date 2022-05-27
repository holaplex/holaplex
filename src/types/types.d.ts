import BN from 'bn.js';
import { OwnedNfTsQuery } from 'src/graphql/indexerTypes';

export type Volume = number;

interface MarketplaceStats {
  nfts: Volume;
}

interface CreatorCounts {
  creations: number;
}

export interface Marketplace {
  subdomain: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  auctionHouse: AuctionHouse;
  ownerAddress: string;
  creators: MarketplaceCreator[];
  stats: MarketplaceStats;
}

export interface MarketplacePreviewData {
  subdomain: string;
  name: string;
  bannerUrl: string;
  creators: {
    creatorAddress: string;
    profile?: {
      profileImageUrlHighres?: string;
      handle?: string;
    }
  }[]
  auctionHouse: {
    stats?: {
      floor: string;
    }
  };
  stats: {
    nfts: string;
  }
}


export type BuyNowListingPreviewData = {
  nft: OwnedNfTsQuery['nfts'][0],
  marketplace: OwnedNfTsQuery['marketplace'][0]
};


export interface ProfilePreviewData {
  address: string;
  profile: {
    handle?: string;
    profileImageUrlHighres?: string;
    bannerImageUrl?: string;
  }
  nftCounts: {
    owned?: number;
    created?: number;
  }
}

interface GraphQLObject {
  __typename: string;
}

export interface MarketplaceCreator {
  creatorAddress: string;
  storeConfigAddress: string;
  preview: Nft[];
}

export interface AuctionHouse {
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
  stats?: MintStats;
}

export interface AttributeVariant {
  name: string;
  count: number;
}

export interface AttributeGroup {
  name: string;
  variants: AttributeVariant[];
}

export interface MintStats {
  volume24hr: BN;
  average: BN;
  floor: BN;
  mint: string;
  auctionHouse: string;
}
export interface Creator {
  address: string;
  attributeGroups: AttributeGroup[];
  stats: MintStats[];
  counts: CreatorCounts;
}

export interface NftAttribute {
  value: string;
  traitType: string;
}

export interface UserWallet {
  address: string;
}

export interface NftOwnerWallet extends UserWallet {
  associatedTokenAccountAddress: string;
}

interface AddressKeyType {
  [address: string]: string;
}

export type KeyType = AddressKeyType;

export interface Listing {
  address: string;
  auctionHouse: string;
  bookkepper: string;
  seller: string;
  metadata: string;
  purchaseReceipt: string;
  price: BN;
  tokenSize: number;
  bump: number;
  tradeState: string;
  tradeStateBump: number;
  createdAt: string;
  canceledAt: string;
}

export interface Purchase {
  address: string;
  buyer: string;
  seller: string;
  auctionHouse: string;
  price: BN;
  createdAt: string;
}

export interface Offer {
  address: string;
  buyer: string;
  price: BN;
  createdAt: string;
  auctionHouse: string;
  tradeState: string;
}

export interface Nft extends KeyType {
  name: string;
  address: string;
  description: string;
  image: string;
  sellerFeeBasisPoints: number;
  mintAddress: string;
  attributes: NftAttribute[];
  creators: UserWallet[];
  owner: NftOwnerWallet;
  listings: Listing[];
  purchases: Purchase[];
  offers: Offer[];
  activities: Activity[];
}

export interface AttributeFilter {
  traitType: string;
  values: string[];
}

export enum PresetNftFilter {
  All = 'All',
  Listed = 'Listed',
  Owned = 'Owned',
  OpenOffers = 'OpenOffers',
}

export interface Viewer extends GraphQLObject {
  id: string;
  balance: number;
}

export enum PresetEditFilter {
  Marketplace = 'Marketplace',
  Creators = 'Creators',
}

export enum ActivityType {
  Listed = 'listing',
  Sold = 'purchase',
}
export interface Activity {
  address: string;
  metadata: string;
  auctionHouse: string;
  price: BN;
  createdAt: string;
  wallets: string[];
  activityType: string;
}
