import { Program } from '@holaplex/graph-program';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import * as anchor from '@project-serum/anchor';

import { getTwitterHandle } from './useTwitterHandle';

export const ALL_CONNECTIONS_TO = `allConnectionsTo`;

const memcmpFn = (publicKey: string) => ({
  offset: 8 + 32,
  bytes: new PublicKey(publicKey).toBase58(),
});

export const DEPRECATED_useGetAllConnectionsTo = (pubKey: string, connection: Connection) =>
  useQuery([ALL_CONNECTIONS_TO, pubKey], ({ queryKey: [_, publicKey] }) =>
    Program.getGraphProgram(
      new anchor.AnchorProvider(connection, null!, {})
    ).account.connectionV2.all([{ memcmp: memcmpFn(publicKey) }])
  );

export const DEPRECATED_useGetAllConnectionsToWithTwitter = (pubKey: string, connection: Connection) =>
  useQuery(
    [ALL_CONNECTIONS_TO, 'withTwitter', pubKey],
    async ({ queryKey: [_, __, publicKey] }) => {
      const limit = (await import('p-limit')).default(10);
      const response = await Program.getGraphProgram(
        new anchor.AnchorProvider(connection, null!, {})
      ).account.connectionV2.all([{ memcmp: memcmpFn(publicKey) }]);
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
    }
  );
