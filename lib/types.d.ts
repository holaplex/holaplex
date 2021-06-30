export type StorefrontTheme = {
  primaryColor?: string;
  backgroundColor?: string;
}

export type Storefront = {
  id?: number;
  theme: StorefrontTheme;
  subdomain: string;
  pubkey: string;
  themeUrl?: string;
}
