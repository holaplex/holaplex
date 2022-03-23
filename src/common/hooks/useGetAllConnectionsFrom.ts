import { Program } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import { getTwitterHandle } from './useTwitterHandle';

export const ALL_CONNECTIONS_FROM = `allConnectionsFrom`;

const memcmpFn = (publicKey: string) => ({
  offset: 8,
  bytes: new PublicKey(publicKey).toBase58(),
});

export const useGetAllConnectionsFrom = (
  pubKey: string,
  walletAndConnection: { connection: Connection; wallet: AnchorWallet }
) =>
  useQuery([ALL_CONNECTIONS_FROM, pubKey], async ({ queryKey: [_, pubKey] }) =>
    Program.getGraphProgram(walletAndConnection).account.connection.all([
      { memcmp: memcmpFn(pubKey) },
    ])
  );

export const useGetAllConnectionsFromWithTwitter = (
  pubKey: string,
  walletAndConnection: { connection: Connection; wallet: AnchorWallet }
) =>
  useQuery([ALL_CONNECTIONS_FROM, 'withTwitter', pubKey], async ({ queryKey: [_, __, pubKey] }) => {
    const limit = (await import('p-limit')).default(10);
    const { connection } = walletAndConnection;
    const response = await Program.getGraphProgram(walletAndConnection).account.connection.all([
      { memcmp: memcmpFn(pubKey) },
    ]);
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
