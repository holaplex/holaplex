export const HOLAPLEX_MARKETPLACE_SUBDOMAIN = `haus`;

// TODO: deprecate
export const HOLAPLEX_MARKETPLACE_ADDRESS = `9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t`;

// TODO: deprecate
export const OPENSEA_MARKETPLACE_ADDRESS = '3o9d13qUvEuuauhFrVom1vuCzgNsJifeaBYDPquaT73Y';

export interface AUCTION_HOUSE_INFO {
  name: string;
  address: string | null;
  logo?: string;
  link?: string;
}

export const AUCTION_HOUSE_ADDRESSES: AUCTION_HOUSE_INFO[] = [
  {
    name: 'Open Sea',
    address: '3o9d13qUvEuuauhFrVom1vuCzgNsJifeaBYDPquaT73Y',
    logo: '/images/listings/opensea.svg',
    link: 'https://opensea.io/assets/solana/',
  },
  {
    name: 'Holaplex',
    address: '9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t',
    logo: '/images/hola-logo.svg',
  },
  {
    name: 'Fractal',
    address: 'BAmKB58MgkeYF2VueVBfASL5q8Qf6VKp4nA4cRuVUVft',
    logo: '/images/listings/fractal.ico',
  },
];

export const MARKETPLACE_PROGRAMS: AUCTION_HOUSE_INFO[] = [
  {
    name: 'Magic Eden',
    address: 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
    logo: '/images/listings/magiceden.png',
    link: 'https://magiceden.io/item-details/',
  },
];

export const HOLAPLEX_MONITORING_PUBLIC_KEY = 'BpVYWaAPbv5vyeRxiX9PMsmAVJVoL2Lp4YtuRgjuhoZh';
