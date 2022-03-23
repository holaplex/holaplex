import { seededRandomBetween } from '@/modules/utils/random';
import { PublicKey } from '@solana/web3.js';

export const getPFPFromPublicKey = (publicKey: string | PublicKey | null): string => {
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
  return getPFPFromPublicKey(new PublicKey(publicKey));
};

export const getBannerFromPublicKey = (publicKey: string | PublicKey | null): string => {
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
  return getBannerFromPublicKey(new PublicKey(publicKey));
};
