import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';

export const getTwitterHandle = async (pk: string, connection: Connection) => {
  try {
    const [twitterHandle] = await getHandleAndRegistryKey(connection, new PublicKey(pk));
    return `${twitterHandle}`;
  } catch (err) {
    return undefined;
  }
};

export const useTwitterHandle = (forWallet?: PublicKey | null) => {
  const { connection } = useConnection();
  return useQuery(['twitter-handle', forWallet?.toBase58()], async ({ queryKey: [_, pk] }) => {
    if (pk && connection) {
      return await getTwitterHandle(pk, connection);
    } else {
      return undefined;
    }
  });
};
