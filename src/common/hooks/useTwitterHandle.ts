import {
  getHandleAndRegistryKey,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@solana/spl-name-service';
import { useConnection } from '@solana/wallet-adapter-react';

import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';

export const getTwitterHandle = async (pk: string, connection: Connection) => {
  try {
    const [twitterHandle] = await getHandleAndRegistryKey(connection, new PublicKey(pk));
    return `${twitterHandle}`;
  } catch (err: any) {
    return undefined;
  }
};

export const getPublicKeyFromTwitterHandle = async (handle: string, connection: Connection) => {
  const hashedName = await getHashedName(handle);
  const domainKey = await getNameAccountKey(hashedName, undefined);
  const result = await NameRegistryState.retrieve(connection, domainKey);
  return result?.owner as PublicKey | undefined;
};

export const useTwitterHandle = (forWallet?: PublicKey | null, base58Key?: string) => {
  const { connection } = useConnection();
  return useQuery(
    ['twitter-handle', forWallet?.toBase58() || base58Key],

    async ({ queryKey: [_, pk] }) => {
      if (pk && connection) {
        return await getTwitterHandle(pk, connection);
      } else {
        return undefined;
      }
    }
  );
};
