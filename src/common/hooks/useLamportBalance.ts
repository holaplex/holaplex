import useSWR from 'swr';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export const useLamportBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  return useSWR(['lamport-balance', publicKey?.toBase58()], (_: string, pk: string) => {
    if (pk && connection) {
      return connection.getBalance(new PublicKey(pk));
    }
  });
};
