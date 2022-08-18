// naughty
// @ts-nocheck

import { compose, filter, sortWith, prop, pipe, descend, not, ascend, contains } from 'ramda';

export interface Creator {
  address: string;
  verified?: boolean;
  share: number;
}

export interface Item {
  metadataAddress: string;
  name: string;
  uri: string;
  primarySaleHappened: boolean;
}

export interface NFTMetadata {
  description: string;
  external_url: string;
  image: string; // url to image, often ipfs, sometimes arweave
  name: string;
  seller_fee_basis_points: number; // in thousands. Prbably need to divide by 100
  symbol: string;
  properties: {
    category: 'image' | string;
    creators: Creator[];
    files: {
      type: 'image/gif' | string;
      uri: string; // arweave URI
    }[];
  };
}

export interface Listing {
  createdAt: string; // ISO(ish) Date "2021-12-01 03:59:45"
  ended: boolean;
  endsAt: string | null; // ISO(ish) Date
  highestBid: number | null;
  instantSalePrice?: number | null; // is often 10000000000
  items: Item[]; // NFT metadata, including URI to fetch more data
  lastBidTime: string | null; // ISO(ish) Date
  listingAddress: string; // uuid of listing
  priceFloor: number | null;
  storeTitle: string;
  subdomain: string;
  logoUrl: string;
  faviconUrl: string;
  totalUncancelledBids?: number | null;
  primarySaleHappened: boolean;
  // would neeed to store listings in an object to make this performant in state management. Better to just reload it pr mount for now.
  // nftMetadata?: NFTMetadata[]; // same length as items. Is set on mount
}
