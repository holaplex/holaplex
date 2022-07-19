import BN from 'bn.js';
import { OwnedNfTsQuery } from 'src/graphql/indexerTypes';

export type Volume = number;

export interface MarketplacePreviewData {
  subdomain: string;
  name: string;
  bannerUrl: string;
  creators: {
    creatorAddress: string;
    profile?: {
      profileImageUrlHighres?: string;
      handle?: string;
    };
  }[];
  auctionHouses: {
    stats?: {
      floor: string;
    };
  }[];
  stats: {
    nfts: string;
  };
}

export type BuyNowListingPreviewData = {
  nft: OwnedNfTsQuery['nfts'][0];
  marketplace: OwnedNfTsQuery['marketplace'][0];
};
export interface ProfilePreviewData {
  address: string;
  profile: {
    handle?: string;
    profileImageUrlHighres?: string;
    bannerImageUrl?: string;
  };
  nftCounts: {
    owned?: number;
    created?: number;
  };
}
