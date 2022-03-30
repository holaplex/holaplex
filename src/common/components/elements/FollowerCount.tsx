import { FC, useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsToWithTwitter } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import styled, { css } from 'styled-components';
import cx from 'classnames';
import Image from 'next/image';
import { Unpacked } from '@/types/Unpacked';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import Link from 'next/link';
import { FollowUnfollowButton } from './FollowUnfollowButton';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { FollowerBubble } from './FollowerBubble';

type FollowerCountProps = {
  profile: IProfile;
  setShowFollowsModal: (s: FollowsModalState) => void;
};

export const FollowerCount: FC<FollowerCountProps> = ({ profile, setShowFollowsModal }) => {
  const wallet = useAnchorWallet();
  if (!wallet)
    return (
      <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4 md:mr-4">
        <span className="text-center text-xl">
          Connect to see <b>Followers</b> and <b>Following</b>{' '}
        </span>
      </div>
    );
  return (
    <FollowerCountContent
      wallet={wallet}
      profile={profile}
      setShowFollowsModal={setShowFollowsModal}
    />
  );
};

type FollowerCountContentProps = FollowerCountProps & {
  wallet: AnchorWallet;
};

type FollowsModalState = 'hidden' | 'followers' | 'following';

export const FollowerCountContent: FC<FollowerCountContentProps> = ({
  profile,
  wallet,
  setShowFollowsModal,
}) => {
  const { pubkey } = profile;

  const { connection } = useConnection();
  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);

  const allConnectionsTo = useGetAllConnectionsToWithTwitter(pubkey, walletConnectionPair);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(pubkey, walletConnectionPair);

  if (allConnectionsTo.error) {
    console.error(allConnectionsTo.error);
    return <div>Error</div>;
  }
  if (allConnectionsFrom.error) {
    console.error(allConnectionsFrom.error);
    return <div>Error</div>;
  }

  const allConnectionsToLoading = !allConnectionsTo.data && !allConnectionsTo.error;
  const allConnectionsFromLoading = !allConnectionsFrom.data && !allConnectionsFrom.error;

  const isLoading = allConnectionsToLoading || allConnectionsFromLoading;

  if (isLoading) return <FollowerCountSkeleton />;
  const isSameWallet = wallet.publicKey.equals(new PublicKey(pubkey));

  const amIFollowing = (allConnectionsTo.data ?? []).some((i) =>
    i.account.from.equals(wallet.publicKey)
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="mt-10 flex justify-between md:justify-start">
          <button onClick={() => setShowFollowsModal('followers')} className="flex flex-col">
            <div className="text-left font-semibold">{allConnectionsTo.data?.length ?? 0}</div>
            <div className="text-sm font-medium text-gray-200">Followers</div>
          </button>
          <button onClick={() => setShowFollowsModal('following')} className="ml-4 flex flex-col">
            <div className="text-left font-semibold">{allConnectionsFrom.data?.length ?? 0}</div>
            <div className="text-sm font-medium text-gray-200">Following</div>
          </button>
          <div className="ml-10">
            {isSameWallet ? null : (
              <FollowUnfollowButton
                source="profileButton"
                walletConnectionPair={walletConnectionPair}
                toProfile={profile}
                type={amIFollowing ? 'Unfollow' : 'Follow'}
              />
            )}
          </div>
        </div>
        {allConnectionsTo.data?.length ? (
          <FollowedBy
            onOtherFollowersClick={() => setShowFollowsModal('followers')}
            followers={allConnectionsTo.data}
          />
        ) : null}
      </div>
    </>
  );
};

export type Followers = ReturnType<typeof useGetAllConnectionsToWithTwitter>['data'];
export type Follower = NonNullable<Unpacked<Followers>>;

type FollowedByProps = {
  followers: Followers;
  onOtherFollowersClick?: VoidFunction;
};

const FollowedBy: FC<FollowedByProps> = ({ followers, onOtherFollowersClick }) => {
  const followerLength = followers?.length ?? 0;
  return (
    <div className="mt-2 flex items-center space-x-2 md:flex-col md:items-start md:space-x-0">
      <div className="text-sm font-medium text-gray-200">Followed by</div>
      <div className="relative mt-2 flex flex-row">
        {(followers ?? []).slice(0, 4).map((follower, i) => (
          <FollowerBubble
            key={follower.publicKey.toBase58()}
            isFirst={i === 0}
            follower={follower}
          />
        ))}
        {followerLength > 4 ? (
          <OtherFollowersNumberBubble
            onClick={onOtherFollowersClick}
            className="z-10 ml-[-8px] flex h-8 w-8 flex-col items-center justify-center rounded-full"
          >
            +{followerLength - 4}
          </OtherFollowersNumberBubble>
        ) : null}
      </div>
    </div>
  );
};

const FollowerCountSkeleton = () => (
  <div className="flex flex-col">
    <div className="mt-10 flex flex-row">
      <button disabled className="flex flex-col">
        <div className="animate-pulse rounded-sm bg-gradient-to-r from-slate-800 to-slate-600 font-bold">
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div className="text-sm text-gray-200">Followers</div>
      </button>
      <button disabled className="ml-4 flex flex-col">
        <div className="animate-pulse rounded-sm bg-gradient-to-r from-slate-800 to-slate-600 font-bold">
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div className="text-sm text-gray-200">Following</div>
      </button>
    </div>
  </div>
);

const OtherFollowersNumberBubble = styled.button`
  font-size: 12px;
  color: #a8a8a8;
  background-color: #262626;
`;
