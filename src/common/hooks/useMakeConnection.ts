import useMutation, { Options } from 'use-mutation';
import { Connection, PublicKey } from '@solana/web3.js';
import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export const useMakeConnection = (
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

type UpdateTarget = 'allConnectionsTo' | 'allConnectionsFrom';

type MakeConnectionWithUpdateTargetInput = {
  targetPubKey: string;
  updateTarget: UpdateTarget;
};

export const useMakeConnectionWithUpdateTarget = (
  walletAndConnection: {
    connection: Connection;
    wallet: AnchorWallet;
  },
  options?: Options<MakeConnectionWithUpdateTargetInput, string, Error>
) =>
  useMutation(
    ({ targetPubKey }: MakeConnectionWithUpdateTargetInput) =>
      Actions.makeConnection(new PublicKey(targetPubKey), walletAndConnection),
    options
  );
