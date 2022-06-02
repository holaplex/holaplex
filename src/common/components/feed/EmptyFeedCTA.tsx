import React, { useState, useEffect, useContext } from 'react';
import Button from '../elements/Button';
import { User, shuffleArray } from './feed.utils';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';

import { Program } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';
import { Action, MultiTransactionContext } from '@/common/context/MultiTransaction';
import { shortenAddress } from '@/modules/utils/string';
import { EmptyStateCTA } from './EmptyStateCTA';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from '../forms/OfferForm';

const EmptyFeedCTA = (props: {
  myFollowingList?: string[];
  profilesToFollow?: User[];
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
}) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();

  const myPubkey = anchorWallet?.publicKey.toBase58() || '';

  const myFollowingList = props.myFollowingList;

  const [topProfilesToFollow, setTopProfilesToFollow] = useState<User[]>([]);

  useEffect(() => {
    if (!myFollowingList) return;
    if (props.profilesToFollow) {
      setTopProfilesToFollow(
        shuffleArray(
          props.profilesToFollow.filter((u) => !myFollowingList.includes(u.address))
        ).slice(0, 5)
      );
    }
  }, [myFollowingList, myFollowingList?.length, props.profilesToFollow]);

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const followMultiple = async () => {
    if (!myPubkey || !anchorWallet || !topProfilesToFollow) {
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

    const actions: Action[] = [
      {
        name: `Following ${
          topProfilesToFollow[0].profile?.handle || shortenAddress(topProfilesToFollow[0].address)
        }`,
        id: `follow${topProfilesToFollow[0].address}}`,
        action: followTx,
        param: topProfilesToFollow[0].address,
      },
      {
        name: `Following ${
          topProfilesToFollow[1].profile?.handle || shortenAddress(topProfilesToFollow[1].address)
        }`,
        id: `follow${topProfilesToFollow[1].address}}`,
        action: followTx,
        param: topProfilesToFollow[1].address,
      },
      {
        name: `Following ${
          topProfilesToFollow[2].profile?.handle || shortenAddress(topProfilesToFollow[2].address)
        }`,
        id: `follow${topProfilesToFollow[2].address}}`,
        action: followTx,
        param: topProfilesToFollow[2].address,
      },
      {
        name: `Following ${
          topProfilesToFollow[3].profile?.handle || shortenAddress(topProfilesToFollow[3].address)
        }`,
        id: `follow${topProfilesToFollow[3].address}}`,
        action: followTx,
        param: topProfilesToFollow[3].address,
      },
      {
        name: `Following ${
          topProfilesToFollow[4].profile?.handle || shortenAddress(topProfilesToFollow[4].address)
        }`,
        id: `follow${topProfilesToFollow[4].address}}`,
        action: followTx,
        param: topProfilesToFollow[4].address,
      },
    ];

    await runActions(actions, {
      onActionSuccess: async () => {
        // nothing
      },
      onActionFailure: async (err) => {
        console.error(err);
      },
      onComplete: async () => {
        props.refetch();
      },
    });
  };

  return (
    <EmptyStateCTA
      header="Not following anyone yet"
      body="Follow your favorite collectors and creators, or get started by following some artists and collectors"
    >
      <Button loading={hasActionPending} onClick={followMultiple}>
        Follow top 5 profiles
      </Button>
    </EmptyStateCTA>
    /*     <div
      className={`flex w-full flex-col items-center gap-6 rounded-lg border border-dashed border-gray-300 p-4`}
    >
      <h6 className={`text-center text-2xl font-semibold`}>Not following anyone yet</h6>
      <p className={`text-center text-base text-gray-300`}>
        Follow your favorite collectors and creators, or get started by following some artists and
        collectors

      </p>
    </div> */
  );
};

export default EmptyFeedCTA;
