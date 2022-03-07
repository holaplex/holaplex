import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';

export const useTwitterHandle = (forWallet?: PublicKey | null) => {
  const { connection } = useConnection();
  return useSWR(
    ['twitter-handle', forWallet?.toBase58()],
    async (_: string, pk: string) => {
      if (pk && connection) {
        try {
          const [twitterHandle] = await getHandleAndRegistryKey(connection, new PublicKey(pk));
          return `${twitterHandle}`;
        } catch (err) {
          console.warn(`err: `, err);
          return undefined;
        }
      } else {
        return undefined;
      }
    }
  );
};
