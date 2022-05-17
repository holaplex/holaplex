import { Program } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import * as anchor from '@project-serum/anchor';

import { getTwitterHandle } from './useTwitterHandle';

export const ALL_CONNECTIONS_FROM = `allConnectionsFrom`;

const memcmpFn = (publicKey: string) => ({
  offset: 8,
  bytes: new PublicKey(publicKey).toBase58(),
});

export const DEPRECATED_useGetAllConnectionsFrom = (pubKey: string, connection: Connection) =>
  useQuery([ALL_CONNECTIONS_FROM, pubKey], async ({ queryKey: [_, pubKey] }) =>
    Program.getGraphProgram(
      new anchor.AnchorProvider(connection, null!, {})
    ).account.connectionV2.all([{ memcmp: memcmpFn(pubKey) }])
  );

export const DEPRECATED_useGetAllConnectionsFromWithTwitter = (
  pubKey: string | null,
  connection: Connection
) =>
  useQuery([ALL_CONNECTIONS_FROM, 'withTwitter', pubKey], async ({ queryKey: [_, __, pubKey] }) => {
    if (!pubKey) return [];
    const limit = (await import('p-limit')).default(10);
    const response = await Program.getGraphProgram(
      new anchor.AnchorProvider(connection, null!, {})
    ).account.connectionV2.all([{ memcmp: memcmpFn(pubKey) }]);
    return Promise.all(
      response.map((i) =>
        limit(async () => {
          const [fromHandle, toHandle] = await Promise.all([
            getTwitterHandle(i.account.from.toBase58(), connection).then((r) => r ?? null),
            getTwitterHandle(i.account.to.toBase58(), connection).then((r) => r ?? null),
          ]);
          return { ...i, twitter: { fromHandle, toHandle } };
        })
      )
    );
  });
