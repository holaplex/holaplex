import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function solToLamports(priceInSol: number): number {
  return priceInSol * LAMPORTS_PER_SOL;
}
