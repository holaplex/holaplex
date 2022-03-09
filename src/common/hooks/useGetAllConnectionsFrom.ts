import { Program } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import useSWR from 'swr/immutable';
import { getTwitterHandle } from './useTwitterHandle';

export const ALL_CONNECTIONS_FROM = `allConnectionsFrom`;

export const useGetAllConnectionsFrom = (
  pubKey: string,
  walletAndConnection: { connection: Connection; wallet: AnchorWallet }
) =>
  useSWR([ALL_CONNECTIONS_FROM, pubKey], (_, pubKey: string) =>
    Program.getGraphProgram(walletAndConnection).account.connection.all([
      {
        memcmp: {
          offset: 8,
          bytes: new PublicKey(pubKey).toBase58(),
        },
      },
    ])
  );

export const useGetAllConnectionsFromWithTwitter = (
  pubKey: string,
  walletAndConnection: { connection: Connection; wallet: AnchorWallet }
) =>
  useSWR([ALL_CONNECTIONS_FROM, 'withTwitter', pubKey], async (_, __, pubKey: string) => {
    const { default: pLimit } = await import('p-limit');
    const response = await Program.getGraphProgram(walletAndConnection).account.connection.all([
      {
        memcmp: {
          offset: 8,
          bytes: pubKey,
        },
      },
    ]);
    /**
     * Terribly inefficient until we can index this too...
     * What happens for people who have 2500+ followers?
     * Validators will think we're ddosing them.
     */
    const limit = pLimit(10);
    const promises = response.map((i) =>
      limit(async () => {
        const [fromHandle, toHandle] = await Promise.all([
          getTwitterHandle(i.account.from.toBase58(), walletAndConnection.connection).then(
            (r) => r ?? null
          ),
          getTwitterHandle(i.account.to.toBase58(), walletAndConnection.connection).then(
            (r) => r ?? null
          ),
        ]);
        return {
          ...i,
          twitter: {
            fromHandle,
            toHandle,
          },
        };
      })
    );
    const results = await Promise.all(promises);
    return results;
  });
