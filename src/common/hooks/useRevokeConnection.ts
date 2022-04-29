import { useMutation, UseMutationOptions } from 'react-query';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Program, Helpers } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';

type RevokeConnectionOptions = Omit<
  UseMutationOptions<string[], Error, string, unknown>,
  'mutationFn'
>;

export const useRevokeConnection = (
  { connection, wallet }: { connection: anchor.web3.Connection; wallet: AnchorWallet },
  options?: RevokeConnectionOptions
) =>
  useMutation(async (targetPubKey: string) => {
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const graphProgram = Program.getGraphProgram(provider);
    const target = new anchor.web3.PublicKey(targetPubKey);
    const [pda, bump] = await Helpers.getConnectionPDA(wallet.publicKey, target);
    const revokeTx = await graphProgram.methods
      .revokeConnection(bump, target)
      .accounts({
        from: wallet.publicKey,
        connection: pda,
      })
      .transaction();
    const closeTx = await graphProgram.methods
      .closeConnection(bump, target)
      .accounts({
        from: wallet.publicKey,
        signer: wallet.publicKey,
        connection: pda,
      })
      .transaction();
    const blockHash = (await connection.getLatestBlockhash()).blockhash;
    revokeTx.feePayer = wallet.publicKey;
    closeTx.feePayer = wallet.publicKey;
    revokeTx.recentBlockhash = blockHash;
    closeTx.recentBlockhash = blockHash;
    const [signedRevokeTx, signedCloseTx] = await wallet.signAllTransactions([revokeTx, closeTx]);
    const txIds = await provider.sendAll([
      { tx: signedRevokeTx, signers: [] },
      { tx: signedCloseTx, signers: [] },
    ]);
    return txIds;
  }, options);
