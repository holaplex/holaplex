import { useMutation, UseMutationOptions } from 'react-query';
import { Connection, PublicKey } from '@solana/web3.js';
import { Actions } from '@holaplex/graph-program';
import { AnchorWallet } from '@solana/wallet-adapter-react';

type MakeConnectionOptions = Omit<UseMutationOptions<string, Error, string, unknown>, 'mutationFn'>;

export const useMakeConnection = (
  deps: { connection: Connection; wallet: AnchorWallet },
  options?: MakeConnectionOptions
) =>
  useMutation(
    (targetPubKey: string) => Actions.makeConnection(new PublicKey(targetPubKey), deps),
    options
  );
