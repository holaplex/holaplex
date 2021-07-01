export type StorefrontTheme = {
  primaryColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
}

export type Storefront = {
  id?: number;
  theme: StorefrontTheme;
  subdomain: string;
  pubkey: string;
  themeUrl?: string;
}
