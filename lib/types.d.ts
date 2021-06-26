import { Prisma } from ".prisma/client";

export type StorefrontTheme = {
  primaryColor: string;
  backgroundColor: string;
}

export type Storefront = {
  id: number,
  theme: Prisma.JsonValue | StorefrontTheme,
  subdomain: string,
  pubkey: string
}

