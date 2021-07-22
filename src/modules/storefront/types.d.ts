import { ArweaveFile } from '@/modules/arweave/types'
export type StorefrontTheme = {
  primaryColor: string;
  backgroundColor: string;
  textFont: string;
  titleFont: string;
  logo: ArweaveFile;
}

export type Storefront = {
  theme: StorefrontTheme;
  subdomain: string;
  pubkey: string;
}
