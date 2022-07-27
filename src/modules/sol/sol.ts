import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BN from 'bn.js';

export function toLamports(priceInSol: number): number {
  return priceInSol * LAMPORTS_PER_SOL;
}

export const toSOL = (lamports: number, precision: number = 5) => {
  var multiplier = Math.pow(10, precision);

  return Math.round((lamports / LAMPORTS_PER_SOL) * multiplier) / multiplier;
};
