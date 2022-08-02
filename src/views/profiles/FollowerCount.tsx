import { FC, useMemo, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import styled from 'styled-components';
import {
  GetProfileFollowerOverviewQuery,
  TwitterProfile,
  useGetCollectedByQuery,
  useGetProfileFollowerOverviewQuery,
  useIsXFollowingYQuery,
} from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '@/components/FollowUnfollowButton';
import { FollowerBubble, FollowerBubbleImage } from '@/components/FollowerBubble';
import { useProfileData } from 'src/views/profiles/ProfileDataProvider';
import Modal from '@/components/Modal';
import ReactDom from 'react-dom';
import { FollowItem } from './FollowModal';
import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import { compareTwitterProfilesForSorting } from '@/views/profiles/follow.utils';
import clsx from 'clsx';

type FollowerCountProps = {
  wallet?: AnchorWallet;
  setShowFollowsModal: (s: FollowsModalState) => void;
  showButton?: boolean;
};

type FollowsModalState = 'hidden' | 'followers' | 'following';

export const FollowerCount: FC<FollowerCountProps> = ({
  wallet,
  setShowFollowsModal,
  showButton,
}) => {
  const { connectedProfile } = useConnectedWalletProfile();
  const walletConnectionPair = connectedProfile?.walletConnectionPair;
  const { loading, publicKey, isMe, amIFollowingThisAccount, followers, following, collectedBy } =
    useProfileData();

  if (loading) return <FollowerCountSkeleton />;

  // note: could be refactored into connection counts, but this method avoids the current duplicate issue.
  const followerCount = followers?.length;
  const followingCount = following?.length;

  return (
    <>
      <div className="flex flex-col">
        <div
          className={clsx(
            'mt-10 grid gap-6  lg:grid-cols-2',
            collectedBy?.length ? 'grid-cols-4' : 'grid-cols-3'
          )}
        >
          <div className={`flex flex-col gap-4`}>
            <button
              onClick={() => setShowFollowsModal('followers')}
              className="flex flex-col text-left"
            >
              <div className="text-sm font-medium text-gray-200">Followers</div>
              <div className="font-semibold">{followerCount}</div>
            </button>
          </div>

          <div className={`flex flex-col gap-4`}>
            <button
              onClick={() => setShowFollowsModal('following')}
              className="flex flex-col text-left"
            >
              <div className="text-sm font-medium text-gray-200">Following</div>
              <div className=" font-semibold">{followingCount}</div>
            </button>
          </div>
          {followers?.length ? (
            <FollowedBy onOtherFollowersClick={() => setShowFollowsModal('followers')} />
          ) : null}

          <CollectedBy />
          {showButton && (
            <div className="ml-10">
              {isMe || !wallet ? null : (
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
      </div>
    </>
  );
};

type FollowedByProps = {
  onOtherFollowersClick?: VoidFunction;
};

export const FollowedBy: FC<FollowedByProps> = ({ onOtherFollowersClick }) => {
  const { followers } = useProfileData();
  if (!followers?.length) return null;

  if (followers.length === 0) return null;

  const followerCount = followers.length ?? 0;

  return (
    <div className=" flex flex-col items-start justify-start space-x-2 lg:justify-start lg:space-x-0">
      <div
        onClick={onOtherFollowersClick}
        className=" cursor-pointer text-sm font-medium text-gray-200"
      >
        Followed by
      </div>
      <div className={`flex items-center gap-2`}>
        <div className="relative mt-2 flex flex-row justify-start -space-x-4">
          {followers.slice(0, 4).map((follower, i) => (
            <FollowerBubble
              isFirst={i === 0}
              key={follower.address as string}
              follower={follower}
            />
          ))}
          {followerCount > 4 ? (
            <OtherFollowersNumberBubble
              onClick={onOtherFollowersClick}
              className="z-10 flex h-6 w-6 flex-col items-center justify-center rounded-full lg:h-6 lg:w-6"
            >
              +{followerCount - 4}
            </OtherFollowersNumberBubble>
          ) : null}
        </div>
      </div>
    </div>
  );
};

type CollectedByProps = {
  onOtherCollectedClick?: VoidFunction;
};

export const CollectedBy: FC<CollectedByProps> = ({ onOtherCollectedClick }) => {
  const [showCollectedByModal, setShowCollectedByModal] = useState(false);
  const { collectedBy } = useProfileData();

  if (!collectedBy || collectedBy?.length === 0) return null;

  if (!collectedBy || collectedBy.length <= 0) return null;
  collectedBy.sort(compareTwitterProfilesForSorting);
  return (
    <div className=" flex flex-col items-start justify-start space-x-2 lg:justify-start lg:space-x-0">
      <div
        className="cursor-pointer text-sm font-medium text-gray-200 "
        onClick={() => setShowCollectedByModal(true)}
      >
        Collected by
      </div>
      <div className={`flex items-center gap-2`}>
        {/* <p className={`m-0 text-left text-lg font-semibold`}>{collectedBy.length}</p> */}
        <div className="relative mt-2 flex flex-row justify-start -space-x-4">
          {collectedBy?.slice(0, 4)?.map((collector, i) => (
            <FollowerBubbleImage
              isFirst={i === 0}
              key={collector?.walletAddress as string}
              image={collector?.profileImageUrlLowres}
              address={collector?.walletAddress as string}
            />
          ))}
          {collectedBy.length > 4 ? (
            <OtherFollowersNumberBubble
              onClick={() => setShowCollectedByModal(true)}
              className="z-10 flex h-6 w-6  flex-col items-center justify-center rounded-full lg:h-6 lg:w-6"
            >
              +{collectedBy.length - 4}
            </OtherFollowersNumberBubble>
          ) : null}
        </div>
      </div>
      {ReactDom.createPortal(
        <Modal open={showCollectedByModal} short setOpen={setShowCollectedByModal}>
          <h4 className="mt-12 h-14 text-center text-base font-medium leading-3">Collected by</h4>
          <div className="scrollbar-thumb-rounded-full flex flex-1 flex-col space-y-6 overflow-y-auto py-4 px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900">
            {collectedBy.map((p) => (
              <FollowItem
                key={p.walletAddress}
                source={'collectedBy'}
                user={{
                  address: p.walletAddress,
                  profile: p,
                }}
              />
            ))}
          </div>
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
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
