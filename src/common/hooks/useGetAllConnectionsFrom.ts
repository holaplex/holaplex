import { Program } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import useSWR from 'swr/immutable';

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
