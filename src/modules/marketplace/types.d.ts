import { ArweaveFile } from '@/modules/arweave/types';

export interface MarketplaceCollection<F = ArweaveFile> {
  name: string;
  logo: F;
  creatorAddress: string;
}

export interface MarketplaceMetaData {
  title: string;
  description: string;
}

export interface MarketplaceTheme<F = ArweaveFile> {
  logo: F;
  banner: F;
}

export interface Marketplace<F = ArweaveFile> {
  auctionHouseAddress: string;
  ownerAddress: string;
  hostname: string;
  meta: MarketplaceMetaData;
  theme: MarketplaceTheme;
  collections: MarketplaceCollection[];
}