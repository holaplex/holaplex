import React, { useState, useEffect, useContext } from 'react';
import Button from '@/components/Button';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';

import { Program } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';
import { Action, MultiTransactionContext } from 'src/views/_global/MultiTransaction';
import { shortenAddress } from '@/modules/utils/string';
import { useConnectedWalletProfile } from '../views/_global/ConnectedWalletProfileProvider';
import { Transaction } from '@solana/web3.js';
import { useRouter } from 'next/router';

export interface ProfileToFollow {
  address: string;
  handle?: string;
  profileImageUrl?: string;
}

const FollowAllButton = (props: { profilesToFollow?: ProfileToFollow[] }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const router = useRouter();
  const myPubkey = anchorWallet?.publicKey.toBase58() || '';

  const { connectedProfile } = useConnectedWalletProfile();
  const myFollowingList: string[] | undefined = connectedProfile?.following?.map((f) => f.address);

  const [actualProfilesToFollow, setactualProfilesToFollow] = useState<ProfileToFollow[]>([]);

  useEffect(() => {
    if (props.profilesToFollow) {
      setactualProfilesToFollow(
        props.profilesToFollow.filter((u) => !myFollowingList?.includes(u.address))
      );
    }
  }, [myFollowingList, myFollowingList?.length, props.profilesToFollow]);

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const followMultiple = async () => {
    if (!myPubkey || !anchorWallet || !actualProfilesToFollow) {
      return;
    }

    const graphProgram = Program.getGraphProgram(
      new anchor.AnchorProvider(connection, anchorWallet, { commitment: 'processed' })
    );

    const followTx = async (profileAddresses: string[]) => {
      const txn = new Transaction();
      const asyncFollowTxns = profileAddresses.map(async (address) => {
        return await graphProgram.methods
          .makeConnection(new anchor.web3.PublicKey(address))
          .accounts({ from: anchorWallet.publicKey })
          .transaction();
      });

      const followTxns = await Promise.all(asyncFollowTxns);
      txn.add(...followTxns);

      txn.feePayer = anchorWallet.publicKey;
      const recentBlockhash = await connection.getLatestBlockhash();
      txn.recentBlockhash = recentBlockhash.blockhash;
      const signedTransaction = await anchorWallet.signTransaction(txn);

      const txtId = await connection.sendRawTransaction(signedTransaction.serialize());
      if (txtId) await connection.confirmTransaction(txtId, 'confirmed');
    };

    let actions: Action[] = [];
    const profilesArray = [...actualProfilesToFollow];
    while (profilesArray.length) {
      const batch = profilesArray.splice(0, 5);
      const profileAddresses = batch.map((p) => p.address);
      const namesArray = batch.map((p) => p.handle || shortenAddress(p.address));
      const names = namesArray.join(', ');

      actions.push({
        name: `Following ${names}`,
        id: `follow${batch[0].address}}`,
        action: followTx,
        param: profileAddresses,
      });
    }

    await runActions(actions, {
      onActionSuccess: async () => {
        // nothing
      },
      onActionFailure: async (err) => {
        console.error(err);
      },
      onComplete: async () => {
        //await props.refetch();
        router.reload();
      },
    });
  };

  return (
    <Button
      loading={hasActionPending}
      onClick={followMultiple}
      disabled={actualProfilesToFollow.length === 0}
      secondary={actualProfilesToFollow.length === 0}
    >
      Follow All
    </Button>
  );
};

export default FollowAllButton;
