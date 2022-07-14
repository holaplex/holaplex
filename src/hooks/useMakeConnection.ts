import { useMutation, UseMutationOptions } from 'react-query';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Program } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';

type MakeConnectionOptions = Omit<UseMutationOptions<string, Error, string, unknown>, 'mutationFn'>;

export const useMakeConnection = (
  { connection, wallet }: { connection: anchor.web3.Connection; wallet: AnchorWallet },
  options?: MakeConnectionOptions
) =>
  useMutation((targetPubKey: string) => {
    const graphProgram = Program.getGraphProgram(
      new anchor.AnchorProvider(connection, wallet, { commitment: 'processed' })
    );
    return graphProgram.methods
      .makeConnection(new anchor.web3.PublicKey(targetPubKey))
      .accounts({ from: wallet.publicKey })
      .rpc();
  }, options);
