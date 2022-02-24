import useMutation, { Options } from 'use-mutation';
import { Connection, PublicKey } from '@solana/web3.js';
import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export const useConnectTo = (
  walletAndConnection: {
    connection: Connection;
    wallet: AnchorWallet;
  },
  options?: Options<string, string, Error>
) =>
  useMutation(
    (targetPubKey: string) =>
      Actions.makeConnection(new PublicKey(targetPubKey), walletAndConnection),
    options
  );
