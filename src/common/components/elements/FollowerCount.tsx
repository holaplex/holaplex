import { FC, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import styled from 'styled-components';
import {
  TwitterProfile,
  useGetCollectedByQuery,
  useGetProfileFollowerOverviewQuery,
  useIsXFollowingYQuery,
} from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from './FollowUnfollowButton';
import { FollowerBubble, FollowerBubbleImage } from './FollowerBubble';
import { useProfileData } from '@/common/context/ProfileData';

type FollowerCountProps = {
  setShowFollowsModal: (s: FollowsModalState) => void;
  showButton?: boolean;
};

export const FollowerCount: FC<FollowerCountProps> = ({
  setShowFollowsModal,
  showButton = true,
}) => {
  const wallet = useAnchorWallet();
  return (
    <FollowerCountContent
      wallet={wallet}
      setShowFollowsModal={setShowFollowsModal}
      showButton={showButton}
    />
  );
};

type FollowerCountContentProps = FollowerCountProps & {
  wallet?: AnchorWallet;
};

type FollowsModalState = 'hidden' | 'followers' | 'following';

export const FollowerCountContent: FC<FollowerCountContentProps> = ({
  wallet,
  setShowFollowsModal,
  showButton,
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
        <div className="mt-10 flex justify-between">
          <div className={`flex flex-col gap-4`}>
            <button onClick={() => setShowFollowsModal('followers')} className="flex flex-col">
              <div className="text-sm font-medium text-gray-200">Followers</div>
              <div className="text-left font-semibold">{followers}</div>
            </button>
            {followers ? (
              <FollowedBy onOtherFollowersClick={() => setShowFollowsModal('followers')} />
            ) : null}
          </div>

          <div className={`flex flex-col gap-4`}>
            <button onClick={() => setShowFollowsModal('following')} className="flex flex-col">
              <div className="text-sm font-medium text-gray-200">Following</div>
              <div className="text-left font-semibold">{following}</div>
            </button>
            <CollectedBy />
          </div>

          {showButton && (
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
          )}
        </div>
        <div className={`flex items-center justify-between`}></div>
      </div>
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
  const followers = data?.wallet.connectionCounts.toCount ?? 0;
  if (!followers) return null;
  return (
    <div className="mt-2 flex flex-col items-start justify-start space-x-2 lg:justify-start lg:space-x-0">
      <div className="mr-2 text-sm font-medium text-gray-200">Followed by</div>
      <div className="relative mt-2 flex flex-row justify-start -space-x-2">
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

type CollectedByProps = {
  onOtherCollectedClick?: VoidFunction;
};

const CollectedBy: FC<CollectedByProps> = ({ onOtherCollectedClick }) => {
  const { publicKey } = useProfileData();
  const { data, loading } = useGetCollectedByQuery({
    variables: { creator: publicKey },
  });
  if (loading) return null;
  const collectedProfiles: TwitterProfile[] = [];
  data?.nfts.map((nft) => {
    if (
      !collectedProfiles.find(
        (profile) => nft.owner?.profile?.walletAddress === profile?.walletAddress
      ) &&
      publicKey !== nft.owner?.profile?.walletAddress &&
      nft?.owner?.profile !== null
    ) {
      collectedProfiles.push(nft.owner?.profile as TwitterProfile);
    }
  });
  if (!collectedProfiles || collectedProfiles.length <= 0) return null;
  return (
    <div className="mt-2 flex flex-col items-start justify-start space-x-2 lg:justify-start lg:space-x-0">
      <div className="mr-2 text-sm font-medium text-gray-200">Collected by</div>
      <div className="relative mt-2 flex flex-row justify-start -space-x-2">
        {collectedProfiles?.slice(0, 4)?.map((collector, i) => (
          <FollowerBubbleImage
            isFirst={i === 0}
            key={collector?.walletAddress as string}
            image={collector?.profileImageUrlLowres}
            address={collector?.walletAddress as string}
          />
        ))}
        {collectedProfiles.length > 4 ? (
          <OtherFollowersNumberBubble
            onClick={onOtherCollectedClick}
            className="z-10 flex h-8 w-8 flex-col items-center justify-center rounded-full"
          >
            +{collectedProfiles.length - 4}
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
        <div className="text-sm text-gray-200">Followers</div>
        <div className="animate-pulse rounded-sm bg-gradient-to-r from-gray-900 to-gray-800 font-bold">
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </button>
      <button disabled className="ml-4 flex flex-col">
        <div className="text-sm text-gray-200">Following</div>
        <div className="animate-pulse rounded-sm bg-gradient-to-r from-gray-900 to-gray-800 font-bold">
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </button>
    </div>
  </div>
);

const OtherFollowersNumberBubble = styled.button`
  font-size: 12px;
  color: #a8a8a8;
  background-color: #262626;
`;
