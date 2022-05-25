import {
  getHandleAndRegistryKey,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@solana/spl-name-service';
import { tryGetName } from '@cardinal/namespaces'
import { useConnection } from '@solana/wallet-adapter-react';

import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';

export const getTwitterHandle = async (pk: string, connection: Connection) => {

  try {
    let thCardinal = await tryGetName(connection, new PublicKey(pk));
    if (thCardinal) {
      return `${thCardinal.replace('@', '')}`;
    }
    
    let [twitterHandle] = await getHandleAndRegistryKey(connection, new PublicKey(pk));
    if (twitterHandle) {
      return `${twitterHandle}`;
    }


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