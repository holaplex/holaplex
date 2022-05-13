import { FC, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import styled from 'styled-components';
import {
  useGetProfileFollowerOverviewQuery,
  useIsXFollowingYQuery,
} from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from './FollowUnfollowButton';
import { FollowerBubble } from './FollowerBubble';
import { useProfileData } from '@/common/context/ProfileData';

type FollowerCountProps = {
  setShowFollowsModal: (s: FollowsModalState) => void;
};

export const FollowerCount: FC<FollowerCountProps> = ({ setShowFollowsModal }) => {
  const wallet = useAnchorWallet();
  return <FollowerCountContent wallet={wallet} setShowFollowsModal={setShowFollowsModal} />;
};

type FollowerCountContentProps = FollowerCountProps & {
  wallet?: AnchorWallet;
};

type FollowsModalState = 'hidden' | 'followers' | 'following';

export const FollowerCountContent: FC<FollowerCountContentProps> = ({
  wallet,
  setShowFollowsModal,
}) => {
  const { publicKey } = useProfileData();

  const { connection } = useConnection();
  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);

  const profileFollowerOverview = useGetProfileFollowerOverviewQuery({
    variables: { pubKey: publicKey },
  });
  const isXFollowingY = useIsXFollowingYQuery({
    variables: {
      xPubKey: wallet?.publicKey.toBase58() ?? '',
      yPubKey: publicKey,
    },
  });

  if (profileFollowerOverview.loading || isXFollowingY.loading) return <FollowerCountSkeleton />;
  const isSameWallet = wallet?.publicKey.equals(new PublicKey(publicKey)) ?? false;

  const followers = profileFollowerOverview.data?.wallet.connectionCounts.toCount ?? 0;
  const following = profileFollowerOverview.data?.wallet.connectionCounts.fromCount ?? 0;
  const amIFollowingThisAccount = !!isXFollowingY.data?.connections?.length ?? 0 > 0;
  return (
    <>
      <div className="flex flex-col">
        <div className="mt-10 flex justify-between lg:justify-start">
          <button onClick={() => setShowFollowsModal('followers')} className="flex flex-col">
            <div className="text-left font-semibold">{followers}</div>
            <div className="text-sm font-medium text-gray-200">Followers</div>
          </button>
          <button onClick={() => setShowFollowsModal('following')} className="ml-4 flex flex-col">
            <div className="text-left font-semibold">{following}</div>
            <div className="text-sm font-medium text-gray-200">Following</div>
          </button>
          <div className="ml-10">
            {isSameWallet || !wallet ? null : (
              <FollowUnfollowButton
                source="profileButton"
                walletConnectionPair={
                  walletConnectionPair as {
                    wallet: AnchorWallet;
                    connection: Connection;
                  }
                }
                type={amIFollowingThisAccount ? 'Unfollow' : 'Follow'}
                toProfile={{
                  address: publicKey,
                }}
              />
            )}
          </div>
        </div>
      </div>
      {followers ? (
        <FollowedBy onOtherFollowersClick={() => setShowFollowsModal('followers')} />
      ) : null}
    </>
  );
};

type FollowedByProps = {
  onOtherFollowersClick?: VoidFunction;
};

const FollowedBy: FC<FollowedByProps> = ({ onOtherFollowersClick }) => {
  const { publicKey } = useProfileData();
  const { data, loading } = useGetProfileFollowerOverviewQuery({
    variables: { pubKey: publicKey },
  });
  if (loading) return null;
  const followers = data?.wallet.connectionCounts.fromCount ?? 0;
  if (!followers) return null;
  return (
    <div className="mt-2 flex  items-center justify-center space-x-2 lg:justify-start lg:space-x-0">
      <div className="mr-2 text-sm font-medium text-gray-200">Followed by</div>
      <div className="relative mt-2 flex flex-row -space-x-2">
        {data?.connections.map((follower, i) => (
          <FollowerBubble
            isFirst={i === 0}
            key={follower.from.address as string}
            follower={follower}
          />
        ))}
        {followers > 4 ? (
          <OtherFollowersNumberBubble
            onClick={onOtherFollowersClick}
            className="z-10 flex h-8 w-8 flex-col items-center justify-center rounded-full"
          >
            +{followers - 4}
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
