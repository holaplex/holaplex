import { FC, useEffect, useMemo, useState } from 'react';
import { ButtonV3 } from './Button';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsToWithTwitter } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { SuccessToast } from './SuccessToast';
import { FailureToast } from './FailureToast';
import cx from 'classnames';
import Image from 'next/image';
import { Unpacked } from '@/types/Unpacked';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import Link from 'next/link';
import { FollowModal } from './FollowModal';
import { useQueryClient } from 'react-query';

type FollowerCountProps = {
  pubKey: string;
  setShowFollowsModal: (s: FollowsModalState) => void;
};

export const FollowerCount: FC<FollowerCountProps> = ({ pubKey, setShowFollowsModal }) => {
  const wallet = useAnchorWallet();
  if (!wallet) return null;
  return (
    <FollowerCountContent
      wallet={wallet}
      pubKey={pubKey}
      setShowFollowsModal={setShowFollowsModal}
    />
  );
};

type FollowerCountContentProps = FollowerCountProps & {
  wallet: AnchorWallet;
};

type FollowsModalState = 'hidden' | 'followers' | 'following';

export const FollowerCountContent: FC<FollowerCountContentProps> = ({
  pubKey,
  wallet,
  setShowFollowsModal,
}) => {
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(
    () => ({
      wallet,
      connection,
    }),
    [wallet, connection]
  );

  const queryClient = useQueryClient();
  const allConnectionsTo = useGetAllConnectionsToWithTwitter(pubKey, walletConnectionPair);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(pubKey, walletConnectionPair);
  const connectTo = useMakeConnection(walletConnectionPair, {
    onSuccess: async (txId, toWallet) => {
      toast(
        <SuccessToast>
          Confirming transaction:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>,
        { autoClose: 13_000 }
      );
      await connection.confirmTransaction(txId, 'finalized');
      await queryClient.invalidateQueries();
      toast(
        <SuccessToast>
          Followed: {showFirstAndLastFour(toWallet)}, TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>
      );
    },
    onError: (error) => {
      console.error(error);
      toast(<FailureToast>Unable to follow, try again later.</FailureToast>);
    },
  });
  const disconnectTo = useRevokeConnection(walletConnectionPair, {
    onSuccess: async (txId, toWallet) => {
      toast(
        <SuccessToast>
          Confirming transaction:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>,
        { autoClose: 13_000 }
      );
      await connection.confirmTransaction(txId, 'finalized');
      await queryClient.invalidateQueries();
      toast(
        <SuccessToast>
          Unfollowed: {showFirstAndLastFour(toWallet)}, TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>
      );
    },
    onError: (error) => {
      console.error(error);
      toast(<FailureToast>Unable to unfollow, try again later.</FailureToast>);
    },
  });

  if (allConnectionsTo.error) {
    console.error(allConnectionsTo.error);
    return <div>Error</div>;
  }
  if (allConnectionsFrom.error) {
    console.error(allConnectionsFrom.error);
    return <div>Error</div>;
  }

  const handleUnFollowClick = (pubKeyOverride?: string) => {
    const pk = pubKeyOverride ?? pubKey;
    disconnectTo.mutate(pk);
  };
  const handleFollowClick = (pubKeyOverride?: string) => {
    const pk = pubKeyOverride ?? pubKey;
    connectTo.mutate(pk);
  };

  const allConnectionsToLoading = !allConnectionsTo.data && !allConnectionsTo.error;
  const allConnectionsFromLoading = !allConnectionsFrom.data && !allConnectionsFrom.error;

  const isLoading = allConnectionsToLoading || allConnectionsFromLoading;

  if (isLoading) return <FollowerCountSkeleton />;
  const isSameWallet = wallet.publicKey.equals(new PublicKey(pubKey));

  const amIFollowing = (allConnectionsTo.data ?? []).some((i) =>
    i.account.from.equals(wallet.publicKey)
  );

  return (
    <>
      {/*** Contents */}
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
            {isSameWallet ? null : amIFollowing ? (
              // <div className="ml-10 flex flex-row items-center justify-center">
              /* <UnFollowButton
            className="hover:bg-gray-800 hover:text-white"
            onClick={() => handleUnFollowClick()}
            /> 
               <ButtonV3
               className="!bg-gray-800 !px-6 !py-2 !text-base !text-white hover:!bg-gray-600"
               onClick={() => handleUnFollowClick()}
               >
               Unfollow
               </ButtonV3> */
              // </div>
              <button
                className="rounded-full bg-gray-800 px-6 py-2 text-base font-medium text-white hover:bg-gray-600"
                onClick={() => handleUnFollowClick()}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="rounded-full bg-white px-6 py-2 text-base font-medium  text-gray-900 hover:bg-gray-200"
                onClick={() => handleFollowClick()}
              >
                Follow
              </button>
              // <div className="ml-10 flex flex-row items-center justify-center">
              //   <ButtonV3 onClick={() => handleFollowClick()}>Follow</ButtonV3>
              // </div>
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
      {/*** End Of Contents */}
    </>
  );
};

type Followers = ReturnType<typeof useGetAllConnectionsToWithTwitter>['data'];
type Follower = NonNullable<Unpacked<Followers>>;

type FollowerBubbleProps = {
  isFirst?: boolean;
  follower: Follower;
};

const FollowerBubble: FC<FollowerBubbleProps> = ({ isFirst, follower }) => {
  const { fromHandle } = follower.twitter;

  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [queryWalletProfile, result] = useWalletProfileLazyQuery();
  useEffect(() => {
    (async () => {
      setStatus('loading');
      try {
        if (fromHandle) {
          queryWalletProfile({
            variables: {
              handle: fromHandle,
            },
          });
        }
      } finally {
        setStatus('done');
      }
    })();
  }, [fromHandle, queryWalletProfile]);

  const isLoading = status === 'loading' || status === 'idle' || result.loading;

  return (
    <Link href={`/profiles/${follower.account.from.toBase58()}`} passHref>
      <a
        className={cx({
          'ml-[-8px] block': !isFirst,
        })}
      >
        {!isLoading ? (
          <FollowedByImage
            className="h-8 w-8 rounded-full"
            src={
              result.data?.profile?.profileImageUrlLowres ??
              getPFPFromPublicKey(follower.account.from)
            }
            width={32}
            height={32}
            alt="PFP"
          />
        ) : (
          <div className='[content: ""] skeleton-animation [background-color: #262626] h-8 w-8 rounded-full' />
        )}
      </a>
    </Link>
  );
};

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

const FollowedByImage = styled(Image)<{ isFirst?: boolean }>`
  ${({ isFirst }) =>
    !isFirst &&
    css`
      border: 1.5px solid #161616 !important;
    `}
`;

const UnFollowButton = styled(ButtonV3)`
  :after {
    content: 'Following';
  }
  :hover {
    :after {
      content: 'Unfollow';
    }
  }
`;
