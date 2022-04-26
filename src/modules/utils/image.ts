import { seededRandomBetween } from '@/modules/utils/random';
import { PublicKey } from '@solana/web3.js';

export const getPFPFromPublicKey = (publicKey?: string | PublicKey | null): string => {
  if (!publicKey) {
    return `/images/gradients/gradient-${seededRandomBetween(0, 1, 8)}.png`;
  }
  if (publicKey instanceof PublicKey) {
    return `/images/gradients/gradient-${seededRandomBetween(
      publicKey.toBytes().reduce((a, b) => a + b, 0),
      1,
      8
    )}.png`;
  }
  return getPFPFromPublicKey(makePublicKeySilent(publicKey));
};

export const getBannerFromPublicKey = (publicKey?: string | PublicKey | null): string => {
  if (!publicKey) {
    return `/images/gradients/gradient-${seededRandomBetween(1, 1, 8)}.png`;
  }
  if (publicKey instanceof PublicKey) {
    return `/images/gradients/gradient-${seededRandomBetween(
      publicKey.toBytes().reduce((a, b) => a + b, 0) + 1,
      1,
      8
    )}.png`;
  }
  return getBannerFromPublicKey(makePublicKeySilent(publicKey));
};


function makePublicKeySilent(publicKey?: any): PublicKey | null {
  try {
    return new PublicKey(publicKey);

  } catch (e) {
    console.error(`Invalid public key ${publicKey}, returning random image`, e);
    return null;
  }
}