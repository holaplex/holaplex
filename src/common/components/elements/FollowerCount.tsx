import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonV3 } from './Button';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsToWithTwitter } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { useConnectTo } from '@/common/hooks/useConnectTo';
import { useDisconnectTo } from '@/common/hooks/useDisconnectTo';
import styled, { css } from 'styled-components';
import { toast } from 'react-toastify';
import { showFirstAndLastFour, b } from '@/modules/utils/string';
import { SuccessToast } from './SuccessToast';
import { FailureToast } from './FailureToast';
import cx from 'classnames';
import { Close } from '../icons/Close';
import Image from 'next/image';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { Unpacked } from '@/types/Unpacked';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import useSWR from 'swr/immutable';
import { useWalletProfileLazyQuery, useWalletProfileQuery } from 'src/graphql/indexerTypes';

type FollowerCountProps = {
  pubKey: string;
};

export const FollowerCount: FC<FollowerCountProps> = ({ pubKey }) => {
  const wallet = useAnchorWallet();
  if (!wallet) return null;
  return <FollowerCountContent wallet={wallet} pubKey={pubKey} />;
};

type FollowerCountContentProps = FollowerCountProps & {
  wallet: AnchorWallet;
};

export const FollowerCountContent: FC<FollowerCountContentProps> = ({ pubKey, wallet }) => {
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(
    () => ({
      wallet,
      connection,
    }),
    [wallet, connection]
  );
  const [showFollowsModal, setShowFollowsModal] = useState<'hidden' | 'followers' | 'following'>(
    'hidden'
  );
  const allConnectionsTo = useGetAllConnectionsToWithTwitter(pubKey, walletConnectionPair);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(pubKey, walletConnectionPair);
  const [connectTo] = useConnectTo(walletConnectionPair, {
    /**
     * Alright, notes about this.
     * The account data and PDA are easy to guess for this scenario; I don't think it's
     * possible for every scenario.
     * What you're about to witness is what's called an Optimistic Update.
     * Since I can figure out what the eventual persistance result will be,
     * I can set up a nice pattern to infer what the ending result is,
     * Using SWR I can mutate directly; however, to avoid reading old data
     * from the validator while the transaction is being sent, I'm using
     * an immutable SWR that is only modified by user land, with no revalidation.
     * Eventually it will be easy to move to Apollo, since it also supports Optimistic Mutations,
     * for when we start reading from the indexer rather than directly from the Validator memory.
     */
    onSuccess: async ({ data: txId, input: toWallet }) => {
      const from = wallet.publicKey;
      const to = new PublicKey(toWallet);
      const [publicKey] = await PublicKey.findProgramAddress(
        [b`connection`, from.toBytes(), to.toBytes()],
        new PublicKey('grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef')
      );
      const mutationData = [
        ...(allConnectionsTo.data ?? []),
        {
          account: {
            from,
            to,
          },
          publicKey,
          twitter: {
            fromHandle: null,
            toHandle: null,
          },
        },
      ];
      allConnectionsTo.mutate(mutationData, { revalidate: false });
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
    onFailure: ({ error, input: toWallet }) => {
      console.error(error);
      toast(
        <FailureToast>
          Unable to follow: {showFirstAndLastFour(toWallet)}, try again later.
        </FailureToast>
      );
    },
  });
  const [disconnectTo] = useDisconnectTo(walletConnectionPair, {
    onSuccess: async ({ data: txId, input: toWallet }) => {
      const from = wallet.publicKey;
      const to = new PublicKey(toWallet);
      const [publicKey] = await PublicKey.findProgramAddress(
        [b`connection`, from.toBytes(), to.toBytes()],
        new PublicKey('grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef')
      );
      allConnectionsTo.mutate(
        (allConnectionsTo.data ?? []).filter((i) => i.publicKey !== publicKey),
        { revalidate: false }
      );
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
    onFailure: ({ error, input: toWallet }) => {
      console.error(error);
      toast(
        <FailureToast>
          Unable to unfollow: {showFirstAndLastFour(toWallet)}, try again later.
        </FailureToast>
      );
    },
  });
  const modalRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(modalRef, () => setShowFollowsModal('hidden'));

  if (allConnectionsTo.error) {
    console.error(allConnectionsTo.error);
    return <div>Error</div>;
  }
  if (allConnectionsFrom.error) {
    console.error(allConnectionsFrom.error);
    return <div>Error</div>;
  }

  const handleUnFollowClick = async () => {
    await disconnectTo(pubKey);
  };
  const handleFollowClick = async () => {
    await connectTo(pubKey);
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
      {/*** Modal */}
      <div
        role="dialog"
        className={cx(
          'fixed top-0 left-0 right-0 bottom-0 z-10',
          'bg-gray-800 bg-opacity-40 backdrop-blur-lg ',
          'transition-opacity duration-500 ease-in-out',
          'flex flex-col items-center justify-center',
          {
            'opacity-100': showFollowsModal !== 'hidden',
            'opacity-0': showFollowsModal === 'hidden',
            'pointer-events-auto': showFollowsModal !== 'hidden',
            'pointer-events-none': showFollowsModal === 'hidden',
          }
        )}
      >
        <div
          ref={modalRef}
          className="relative flex h-[30rem] w-[30rem] flex-col rounded-xl bg-black p-6 text-white shadow-md"
        >
          <button onClick={() => setShowFollowsModal('hidden')} className="absolute top-6 right-6">
            <Close color="#fff" />
          </button>
          <div id="tabs" className="mt-12 flex h-14">
            <button
              onClick={() => setShowFollowsModal('followers')}
              className={cx(
                'flex flex-1 items-center justify-center border-b-2 text-base font-medium leading-3',
                {
                  'border-b-white text-white': showFollowsModal === 'followers',
                  'border-gray-800 text-gray-400': showFollowsModal !== 'followers',
                }
              )}
            >
              Followers
            </button>
            <button
              onClick={() => setShowFollowsModal('following')}
              className={cx(
                'flex flex-1 items-center justify-center border-b-2 text-base font-medium leading-3',
                {
                  'border-b-white text-white': showFollowsModal === 'following',
                  'border-gray-800 text-gray-400': showFollowsModal !== 'following',
                }
              )}
            >
              Following
            </button>
          </div>
          <div className="mt-12 flex flex-1 flex-col overflow-y-auto">
            {showFollowsModal === 'followers' ? (
              <>
                {(allConnectionsTo.data ?? []).map(
                  (
                    i,
                    idx,
                    _,
                    twitterHandle = i.twitter.fromHandle,
                    hasTwitterHandle = !!i.twitter.fromHandle
                  ) => (
                    <div
                      key={i.publicKey.toBase58()}
                      className={cx('flex h-10', {
                        'mt-6': idx !== 0,
                      })}
                    >
                      <div className="flex flex-1 justify-between">
                        <div className="flex items-center">
                          <Image
                            className="rounded-full"
                            width={40}
                            height={40}
                            src={getPFPFromPublicKey(i.account.from)}
                            alt="PFP"
                          />
                          <span
                            className={cx('ml-3 text-base font-medium leading-6 text-white', {
                              "font-['Inter']": hasTwitterHandle,
                              "font-['Space_Mono']": !hasTwitterHandle,
                            })}
                          >
                            {hasTwitterHandle
                              ? `@${twitterHandle}`
                              : showFirstAndLastFour(i.account.from.toBase58())}
                          </span>
                        </div>
                        <div className="flex items-center">{/* <ButtonV3>Follow</ButtonV3> */}</div>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : null}
            {showFollowsModal === 'following' ? (
              <>
                {(allConnectionsFrom.data ?? []).map(
                  (
                    i,
                    idx,
                    _,
                    twitterHandle = i.twitter.toHandle,
                    hasTwitterHandle = !!i.twitter.toHandle
                  ) => (
                    <div
                      key={i.publicKey.toBase58()}
                      className={cx('flex h-10', {
                        'mt-6': idx !== 0,
                      })}
                    >
                      <div className="flex flex-1 justify-between">
                        <div className="flex items-center">
                          <Image
                            className="rounded-full"
                            width={40}
                            height={40}
                            src={getPFPFromPublicKey(i.account.to)}
                            alt="PFP"
                          />
                          <span
                            className={cx('ml-3 text-base font-medium leading-6 text-white', {
                              "font-['Inter']": hasTwitterHandle,
                              "font-['Space_Mono']": !hasTwitterHandle,
                            })}
                          >
                            {hasTwitterHandle
                              ? `@${twitterHandle}`
                              : showFirstAndLastFour(i.account.to.toBase58())}
                          </span>
                        </div>
                        <div className="flex items-center">{/* <ButtonV3>Follow</ButtonV3> */}</div>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
      {/*** End Of Modal */}
      {/*** Contents */}
      <div className="flex flex-col">
        <div className="mt-9 flex flex-row">
          <button onClick={() => setShowFollowsModal('followers')} className="flex flex-col">
            <div className="font-bold">{allConnectionsTo.data?.length ?? 0}</div>
            <div className="text-sm text-gray-200">Followers</div>
          </button>
          <button onClick={() => setShowFollowsModal('following')} className="ml-4 flex flex-col">
            <div className="font-bold">{allConnectionsFrom.data?.length ?? 0}</div>
            <div className="text-sm text-gray-200">Following</div>
          </button>
          {isSameWallet ? null : amIFollowing ? (
            <div className="ml-10 flex flex-row items-center justify-center">
              <UnFollowButton onClick={handleUnFollowClick} />
            </div>
          ) : (
            <div className="ml-10 flex flex-row items-center justify-center">
              <ButtonV3 onClick={handleFollowClick}>Follow</ButtonV3>
            </div>
          )}
        </div>
        {allConnectionsTo.data?.length ? <FollowedBy followers={allConnectionsTo.data} /> : null}
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
  const fromPublicKey = follower.account.from.toBase58();
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
    <div
      className={cx({
        'ml-[-8px]': !isFirst,
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
    </div>
  );
};

type FollowedByProps = {
  followers: Followers;
};

const FollowedBy: FC<FollowedByProps> = ({ followers }) => {
  const followerLength = followers?.length ?? 0;
  return (
    <div className="mt-4 flex flex-col">
      <div className="text-sm text-gray-200">Followed by</div>
      <div className="relative mt-2 flex flex-row">
        {(followers ?? []).map((follower, i) => (
          <FollowerBubble
            key={follower.publicKey.toBase58()}
            isFirst={i === 0}
            follower={follower}
          />
        ))}
        {followerLength > 4 ? (
          <OtherFollowersNumberBubble className="z-10 ml-[-8px] flex h-8 w-8 flex-col items-center justify-center rounded-full">
            +{followerLength - 4}
          </OtherFollowersNumberBubble>
        ) : null}
      </div>
    </div>
  );
};

const OtherFollowersNumberBubble = styled.div`
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

const FollowerCountSkeleton = () => {
  return (
    <div>
      <div>Loading</div>
    </div>
  );
};
