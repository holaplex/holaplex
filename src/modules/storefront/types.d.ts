import { ArweaveFile } from '@/modules/arweave/types';

export interface StorefrontTheme<F extends ArweaveFile | undefined = ArweaveFile> {
  primaryColor: string;
  backgroundColor: string;
  textFont: string;
  titleFont: string;
  logo: F;
}

export interface PageMetaData<F extends ArweaveFile | undefined = ArweaveFile> {
  title: string;
  description: string;
  favicon: F;
}

export interface AnonStorefront<F> {
  theme: StorefrontTheme<F>;
  meta: PageMetaData<F>;
  subdomain: string;
}

export interface Storefront extends AnonStorefront<ArweaveFile> {
  pubkey: string;
}
