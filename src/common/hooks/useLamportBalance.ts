import { useQuery } from 'react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export const useLamportBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  return useQuery(['lamport-balance', publicKey?.toBase58()], ({ queryKey: [_, pk] }) => {
    if (pk && connection) {
      return connection.getBalance(new PublicKey(pk));
    }
  });
};
