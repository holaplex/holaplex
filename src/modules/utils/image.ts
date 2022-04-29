import { seededRandomBetween } from '@/modules/utils/random';
import { PublicKey } from '@solana/web3.js';

export const getPFPFromPublicKey = (publicKey?: string | PublicKey | null): string => {
  return tryGetImageFromPublicKey(publicKey);
};

export const getBannerFromPublicKey = (publicKey?: string | PublicKey | null): string => {
  return tryGetImageFromPublicKey(publicKey);
};


function tryGetImageFromPublicKey(publicKey?: string | PublicKey | null): string {
  let result: string;
  if (publicKey instanceof PublicKey) {
    result = getFallbackImage(publicKey);

  } else if (typeof publicKey === 'string') {
    try {
      result = getFallbackImage(new PublicKey(publicKey));

    } catch (e) {
      console.error(`Invalid public key ${publicKey}, returning random image`, e);
      result = getFallbackImage(publicKey);
    }
  } else {
    result = getFallbackImage(publicKey);
  }
  return result;
}


export function getFallbackImage(seed?: number | string | PublicKey | null): string {
  let seedNumber: number = 1;
  if ((seed !== null) && (seed != undefined)) {
    if (typeof seed === 'number') {
      seedNumber = seed;

    } else if (typeof seed === 'string') {
      seedNumber = new TextEncoder().encode(seed).reduce((a, b) => a + b, 0) + 1;

    } else if (seed instanceof PublicKey) {
      seedNumber = seed.toBytes().reduce((a, b) => a + b, 0) + 1;
    }
  }
  return `/images/gradients/gradient-${seededRandomBetween(seedNumber, 1, 8)}.png`;
}