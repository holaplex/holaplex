import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import useMutation, { Options } from 'use-mutation';

export const useDisconnectTo = (
  walletAndConnection: {
    connection: Connection;
    wallet: AnchorWallet;
  },
  options?: Options<string, string, Error>
) =>
  useMutation(
    (targetPubKey: string) =>
      Actions.revokeConnection(new PublicKey(targetPubKey), walletAndConnection),
    options
  );
