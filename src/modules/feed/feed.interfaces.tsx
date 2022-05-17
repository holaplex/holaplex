import { TopFollower } from '@/common/context/ProfileData';
import { Storefront } from 'src/graphql/indexerTypes';
import { Listing } from 'src/graphql/indexerTypes.ssr';

export const BID_ACTIVITY = [
  'BID_MADE',
  'OUTBID',
  'WAS_OUTBID',
  'BID_CANCELLED',
  // 'BID_LOWERED',
  // 'BID_INCREASED',
] as const;
export type BID_ACTIVITY = typeof BID_ACTIVITY[number];

const LISTING_ACTIVITY = [
  'LISTING_CREATED_BUY_NOW_PRIMARY',
  'LISTING_CREATED_BUY_NOW_SECONDARY',
  'LISTING_CREATED_AUCTION_PRIMARY',
  'LISTING_CREATED_AUCTION_SECONDARY',
  'LISTING_WON',
  'LISTING_LOST',
] as const;
type LISTING_ACTIVITY = typeof LISTING_ACTIVITY[number];

const MINT_ACTIVITY = ['MINT_NEW'] as const;
type MINT_ACTIVITY = typeof MINT_ACTIVITY[number];

const SALE_ACTIVITY = ['BUY', 'SALE_PRIMARY', 'SALE_SECONDARY'] as const;
type SALE_ACTIVITY = typeof SALE_ACTIVITY[number];

const FOLLOW_ACTIVITY = ['FOLLOW'] as const;
type FOLLOW_ACTIVITY = typeof FOLLOW_ACTIVITY[number];

const OFFER_ACTIVITY = [
  'OFFER_MADE',
  'OFFER_CANCELED',
  'OFFER_ACCEPTED',
  'OFFER_DECLINED',
] as const;
type OFFER_ACTIVITY = typeof OFFER_ACTIVITY[number];

export type ActivityType = BID_ACTIVITY | LISTING_ACTIVITY | SALE_ACTIVITY;

export enum ACTIVITY_E {
  BID_MADE,
  LISTING_WON,
  LISTING_LOST,
}

export interface ActivityItem {}

enum BID_ACTIVITY_E {
  BID_MADE = 'BID_MADE',
  OUTBID = 'OUTBID',
  WAS_OUTBID = 'WAS_OUTBID',
  BID_CANCELLED = 'BID_CANCELLED',
}

export enum LISTING_ACTIVITY_E {
  LISTING_CREATED_INSTANT_SALE_PRIMARY = 'LISTING_CREATED_INSTANT_SALE_PRIMARY',
  LISTING_CREATED_INSTANT_SALE_SECONDARY = 'LISTING_CREATED_INSTANT_SALE_SECONDARY',
  LISTING_CREATED_AUCTION_PRIMARY = 'LISTING_CREATED_AUCTION_PRIMARY',
  LISTING_CREATED_AUCTION_SECONDARY = 'LISTING_CREATED_AUCTION_SECONDARY',
  LISTING_WON = 'LISTING_WON',
  LISTING_LOST = 'LISTING_LOST',
}

export interface IProfile {
  pfp?: string;
  address: string;
  handle?: string | null;
  followers?: number;
  following?: number;
  topFollowers?: TopFollower[];
  nfts?: NFT[];
}

interface NFT {
  creators?: IProfile[];
  name: string;
  storeSubdomain: string;
  imageURL: string;
  address: string;
  listingAddress?: string;
}

export interface IFeedItem {
  id: string;
  timestamp: string; // ISO Date // at
  type: ActivityType;
  sourceUser?: IProfile; // if from is empty, defualt to creator
  // creator?: string; // creator can be empty if the activity is not related to an NFT (like following)
  toUser?: IProfile;
  solAmount?: number;

  nft?: NFT;
  misc?: {
    bidCancelled?: boolean;
    wonListing?: boolean;
    // hasUncancelledBid
    // showClaimUncancelledBid
  };
  // not sure if these should make it
  listing?: Listing;
  storefront?: Storefront;
}
