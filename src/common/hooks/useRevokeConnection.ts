import { Connection, PublicKey } from '@solana/web3.js';
import { useMutation, UseMutationOptions } from 'react-query';
import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';

//#region Types

type UpdateTarget = 'allConnectionsTo' | 'allConnectionsFrom';

type RevokeConnectionWithUpdateTargetInput = {
  targetPubKey: string;
  updateTarget: UpdateTarget;
};

type RevokeConnectionOptions = Omit<
  UseMutationOptions<string, Error, string, unknown>,
  'mutationFn'
>;

type RevokeConnectionWithUpdateTargetOptions = Omit<
  UseMutationOptions<string, Error, RevokeConnectionWithUpdateTargetInput, unknown>,
  'mutationFn'
>;

//#endregion

export const useRevokeConnection = (
  deps: { connection: Connection; wallet: AnchorWallet },
  options?: RevokeConnectionOptions
) =>
  useMutation(
    (targetPubKey: string) => Actions.revokeConnection(new PublicKey(targetPubKey), deps),
    options
  );

export const useRevokeConnectionWithUpdateTarget = (
  walletAndConnection: { connection: Connection; wallet: AnchorWallet },
  options?: RevokeConnectionWithUpdateTargetOptions
) =>
  useMutation(
    ({ targetPubKey }: RevokeConnectionWithUpdateTargetInput) =>
      Actions.revokeConnection(new PublicKey(targetPubKey), walletAndConnection),
    options
  );
