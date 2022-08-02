import React, { useState, useEffect, useContext } from 'react';
import Button from '@/components/Button';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';

import { Program } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';
import { Action, MultiTransactionContext } from 'src/views/_global/MultiTransaction';
import { shortenAddress } from '@/modules/utils/string';
import { useConnectedWalletProfile } from '../views/_global/ConnectedWalletProfileProvider';

export interface ProfileToFollow {
  address: string;
  handle?: string;
  profileImageUrl?: string;
}

const FollowAllButton = (props: { profilesToFollow?: ProfileToFollow[] }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
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

    const followTx = async (targetPubKey: string) => {
      await graphProgram.methods
        .makeConnection(new anchor.web3.PublicKey(targetPubKey))
        .accounts({ from: anchorWallet.publicKey })
        .rpc();
    };
    let actions: Action[] = actualProfilesToFollow.map((profile) => {
      return {
        name: `Following ${profile.handle || shortenAddress(profile.address)}`,
        id: `follow${profile.address}}`,
        action: followTx,
        param: profile.address,
      };
    });

    await runActions(actions, {
      onActionSuccess: async () => {
        // nothing
      },
      onActionFailure: async (err) => {
        console.error(err);
      },
      onComplete: async () => {
        //await props.refetch();
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
