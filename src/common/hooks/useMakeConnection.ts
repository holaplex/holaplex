import { useMutation, UseMutationOptions } from 'react-query';
import { Connection, PublicKey } from '@solana/web3.js';
import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';

//#region Types

// type UpdateTarget = 'allConnectionsTo' | 'allConnectionsFrom';

// type MakeConnectionWithUpdateTargetInput = {
//   targetPubKey: string;
//   updateTarget: UpdateTarget;
// };
type MakeConnectionOptions = Omit<UseMutationOptions<string, Error, string, unknown>, 'mutationFn'>;

// type MakeConnectionWithUpdateTargetOptions = Omit<
//   UseMutationOptions<string, Error, MakeConnectionWithUpdateTargetInput, unknown>,
//   'mutationFn'
// >;

//#endregion

export const useMakeConnection = (
  deps: { connection: Connection; wallet: AnchorWallet },
  options?: MakeConnectionOptions
) =>
  useMutation(
    (targetPubKey: string) => Actions.makeConnection(new PublicKey(targetPubKey), deps),
    options
  );

// export const useMakeConnectionWithUpdateTarget = (
//   deps: { connection: Connection; wallet: AnchorWallet },
//   options?: MakeConnectionWithUpdateTargetOptions
// ) =>
//   useMutation(
//     async ({ targetPubKey }: MakeConnectionWithUpdateTargetInput) =>
//       Actions.makeConnection(new PublicKey(targetPubKey), deps),
//     options
//   );
