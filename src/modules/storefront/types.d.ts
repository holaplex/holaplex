import { ArweaveFile } from '@/modules/arweave/types';

export interface StorefrontTheme<F = ArweaveFile> {
  primaryColor: string;
  backgroundColor: string;
  textFont: string;
  titleFont: string;
  logo: F;
  version: string;
}

export interface PageMetaData<F = ArweaveFile> {
  title: string;
  description: string;
  favicon: F;
}

export interface Storefront<F = ArweaveFile> {
  theme: StorefrontTheme<F>;
  meta: PageMetaData<F>;
  subdomain: string;
  pubkey: string;
}
