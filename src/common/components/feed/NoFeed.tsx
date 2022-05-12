import React, { FC, useState, useMemo, useEffect, useContext } from 'react';
import Button from '../elements/Button';
import { User, shuffleArray } from './feed.utils';
import { INFLUENTIAL_WALLETS } from './WhoToFollowList';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { toast } from 'react-toastify';
import { Program } from '@holaplex/graph-program';
import * as anchor from '@project-serum/anchor';
import { Action, MultiTransactionContext } from '@/common/context/MultiTransaction';
import { shortenAddress } from '@/modules/utils/string';

const NoFeed = (props: { myFollowingList?: string[] }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const walletConnectionPair = useMemo(
    () => ({ wallet: anchorWallet!, connection }),
    [anchorWallet, connection]
  );

  const myPubkey = anchorWallet?.publicKey.toBase58() || '';

  /*   const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(myPubkey, connection);
   */
  // const myFollowingList: string[] = [];
  const myFollowingList = props.myFollowingList;
  // @ts-ignore
  /*     allConnectionsFrom.data?.map((account) => account.account.to.toBase58()) || [];
   */
  const [topProfilesToFollow, setTopProfilesToFollow] = useState<User[]>([]);

  useEffect(() => {
    if (!myFollowingList) return;
    setTopProfilesToFollow(
      shuffleArray(INFLUENTIAL_WALLETS.filter((u) => !myFollowingList.includes(u.address))).slice(
        0,
        5
      )
    );
  }, [myFollowingList, myFollowingList?.length]);

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  // const follow = useMakeConnection(walletConnectionPair, {
  //   onSuccess: async (txId, toWallet) => {
  //     console.log(`Successfully followed ${toWallet}`)
  //   },
  //   onError: (err, toWallet) => {
  //     console.error(err)
  //   }
  // })

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
        // should refetch feed
      },
    });
  };

  return (
    <div
      className={`flex w-full flex-col items-center gap-6 rounded-lg border border-dashed border-gray-300 p-4`}
    >
      <h6 className={`text-center text-2xl font-semibold`}>Not following anyone yet</h6>
      <p className={`text-center text-base text-gray-300`}>
        Follow your favorite collectors and creators, or get started by following some artists and
        collectors
        {/* the top 10 collectors on Holaplex */}
      </p>
      <Button loading={hasActionPending} onClick={followMultiple}>
        Follow top 5 profiles
      </Button>
    </div>
  );
};

export default NoFeed;
