import { ArweaveFile } from '@/modules/arweave/types'
export type StorefrontTheme = {
  primaryColor: string;
  backgroundColor: string;
  textFont: string;
  titleFont: string;
  logo: ArweaveFile;
}

export type PageMetaData = {
  title: string;
  description: string;
  favicon: ArweaveFile;
}

export type Storefront = {
  theme: StorefrontTheme;
  meta: PageMetaData;
  subdomain: string;
  pubkey: string;
}
