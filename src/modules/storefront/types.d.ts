import { ArweaveFile } from '@/modules/arweave/types';

export interface StorefrontTheme<F = ArweaveFile> {
  banner?: F;
  primaryColor: string;
  backgroundColor: string;
  textFont: string;
  titleFont: string;
  logo: F;
}

export interface PageMetaData<F = ArweaveFile> {
  title: string;
  description: string;
  favicon: F;
}

export interface Integrations<F = ArweaveFile> {
  crossmintClientId: string;
}

export interface Storefront<F = ArweaveFile> {
  theme: StorefrontTheme<F>;
  meta: PageMetaData<F>;
  subdomain: string;
  pubkey: string;
  integrations: Integrations<F>;
}
