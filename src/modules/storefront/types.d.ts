export type StorefrontTheme = {
  primaryColor?: string;
  backgroundColor?: string;
  logo?: any;
}

export type Storefront = {
  theme: StorefrontTheme;
  subdomain: string;
  pubkey: string;
}
