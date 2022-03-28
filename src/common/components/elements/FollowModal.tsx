import { Dispatch, FC, SetStateAction, useMemo, useRef } from 'react';
import cx from 'classnames';
import Image from 'next/image';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { Close } from '../icons/Close';
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsToWithTwitter } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ButtonV3 } from './Button';
import { SuccessToast } from './SuccessToast';
import { FailureToast } from './FailureToast';
import { toast } from 'react-toastify';
import { useRevokeConnectionWithUpdateTarget } from '@/common/hooks/useRevokeConnection';
import { useMakeConnectionWithUpdateTarget } from '@/common/hooks/useMakeConnection';
import { Unpacked } from '@/types/Unpacked';
import { useQueryClient } from 'react-query';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';

type Visibility = 'hidden' | 'followers' | 'following';

type ConnectionItem =
  | NonNullable<Unpacked<ReturnType<typeof useGetAllConnectionsToWithTwitter>['data']>>
  | NonNullable<Unpacked<ReturnType<typeof useGetAllConnectionsFromWithTwitter>['data']>>;

type FollowModalProps = {
  pubKey: string;
  wallet: AnchorWallet;
  visibility: Visibility;
  setVisibility: Dispatch<SetStateAction<Visibility>> | ((visibility: Visibility) => void);
};

export const FollowModal: FC<FollowModalProps> = ({
  wallet,
  pubKey,
  visibility,
  setVisibility,
}) => {
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);
  const allConnectionsTo = useGetAllConnectionsToWithTwitter(pubKey, walletConnectionPair);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(pubKey, walletConnectionPair);

  const modalRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(modalRef, () => setVisibility('hidden'));

  return (
    <div
      role="dialog"
      className={cx(
        'fixed top-0 left-0 right-0 bottom-0 z-20',
        'bg-gray-800 bg-opacity-40 backdrop-blur-lg ',
        'transition-opacity duration-500 ease-in-out',
        'flex flex-col items-center justify-center',
        {
          'opacity-100': visibility !== 'hidden',
          'opacity-0': visibility === 'hidden',
          'pointer-events-auto': visibility !== 'hidden',
          'pointer-events-none': visibility === 'hidden',
        }
      )}
    >
      <div
        ref={modalRef}
        className="relative flex h-full max-h-[30rem] w-full flex-col rounded-xl bg-gray-900  pt-6 text-white shadow-md sm:max-w-lg"
      >
        <button onClick={() => setVisibility('hidden')} className="absolute top-6 right-6">
          <Close color="#fff" />
        </button>
        <div id="tabs" className="mt-4 flex h-14">
          <button
            onClick={() => setVisibility('followers')}
            className={cx(
              'flex flex-1 items-center justify-center border-b-2 text-base font-medium leading-3',
              {
                'border-b-white text-white': visibility === 'followers',
                'border-gray-800 text-gray-400': visibility !== 'followers',
              }
            )}
          >
            Followers
          </button>
          <button
            onClick={() => setVisibility('following')}
            className={cx(
              'flex flex-1 items-center justify-center border-b-2 text-base font-medium leading-3',
              {
                'border-b-white text-white': visibility === 'following',
                'border-gray-800 text-gray-400': visibility !== 'following',
              }
            )}
          >
            Following
          </button>
        </div>
        <div className="scrollbar-thumb-rounded-full flex flex-1 flex-col overflow-y-auto py-4 px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900">
          {visibility === 'followers' ? (
            <>
              {(allConnectionsTo.data ?? []).map(
                (
                  i,
                  idx,
                  _,
                  twitter = i.twitter.fromHandle,
                  hasTwitter = !!i.twitter.fromHandle
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
                        <Link href={`/profiles/${i.account.from.toBase58()}`} passHref>
                          <a
                            onClick={() => setVisibility('hidden')}
                            className={cx('ml-3 text-base font-medium leading-6 text-white', {
                              "font-['Inter']": hasTwitter,
                              "font-['Space_Mono']": !hasTwitter,
                            })}
                          >
                            {hasTwitter
                              ? `@${twitter}`
                              : showFirstAndLastFour(i.account.from.toBase58())}
                          </a>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <FollowButton wallet={wallet} item={i} side="allConnectionsFrom" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          ) : null}
          {visibility === 'following' ? (
            <>
              {(allConnectionsFrom.data ?? []).map(
                (i, idx, _, twitter = i.twitter.toHandle, hasTwitter = !!i.twitter.toHandle) => (
                  <div
                    key={i.publicKey.toBase58()}
                    className={cx('flex h-10', { 'mt-6': idx !== 0 })}
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
                        <Link href={`/profiles/${i.account.to}`} passHref>
                          <a
                            onClick={() => setVisibility('hidden')}
                            className={cx('ml-3 text-base font-medium leading-6 text-white', {
                              "font-['Inter']": hasTwitter,
                              "font-['Space_Mono']": !hasTwitter,
                            })}
                          >
                            {hasTwitter
                              ? `@${twitter}`
                              : showFirstAndLastFour(i.account.to.toBase58())}
                          </a>
                        </Link>
                      </div>
                      <div className="flex items-center">
                        <FollowButton wallet={wallet} item={i} side="allConnectionsTo" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FollowButton: FC<{
  item: ConnectionItem;
  side: 'allConnectionsTo' | 'allConnectionsFrom';
  wallet: AnchorWallet;
}> = ({ wallet, item, side }) => {
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);
  const { track } = useAnalytics();
  const queryClient = useQueryClient();

  const allConnectionsFromWallet = useGetAllConnectionsFromWithTwitter(
    wallet.publicKey.toBase58(),
    walletConnectionPair
  );
  const makeConnection = useMakeConnectionWithUpdateTarget(walletConnectionPair, {
    onSuccess: async (txId, input) => {
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
      track('Follow succeeded', {
        event_category: 'Profile',
        event_label: 'modal',
        from: item.account.from.toBase58(),
        to: item.account.to.toBase58(),
        source: 'modal',
      });
      toast(
        <SuccessToast>
          Followed: {showFirstAndLastFour(input.targetPubKey)}, TX:&nbsp;
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
      track('Follow errored', {
        event_category: 'Profile',
        event_label: 'modal',
        from: item.account.from.toBase58(),
        to: item.account.to.toBase58(),
        source: 'modal',
      });
      toast(<FailureToast>Unable to follow, try again later.</FailureToast>);
    },
  });
  const revokeConnection = useRevokeConnectionWithUpdateTarget(walletConnectionPair, {
    onSuccess: async (txId, input) => {
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
      track('Unfollow succeeded', {
        event_category: 'Profile',
        event_label: 'modal',
        from: item.account.from.toBase58(),
        to: item.account.to.toBase58(),
        source: 'modal',
      });
      toast(
        <SuccessToast>
          Unfollowed: {showFirstAndLastFour(input.targetPubKey)}, TX:&nbsp;
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
      track('Unfollow errored', {
        event_category: 'Profile',
        event_label: 'modal',
        from: item.account.from.toBase58(),
        to: item.account.to.toBase58(),
        source: 'modal',
      });
      toast(<FailureToast>Unable to unfollow, try again later.</FailureToast>);
    },
  });

  if (makeConnection.status === 'loading' || revokeConnection.status === 'loading') {
    return (
      <ButtonV3 disabled>
        <svg
          role="status"
          className="h-4 w-4 animate-spin fill-black text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </ButtonV3>
    );
  }

  const itemIsMyWallet =
    (side === 'allConnectionsFrom' &&
      item.account.from.toBase58() === wallet.publicKey.toBase58()) ||
    (side === 'allConnectionsTo' && item.account.to.toBase58() === wallet.publicKey.toBase58());
  if (itemIsMyWallet) {
    return null;
  }
  const amIFollowingThisAccount =
    (side === 'allConnectionsFrom' &&
      (allConnectionsFromWallet.data ?? []).some((i) => i.account.to.equals(item.account.from))) ||
    (side === 'allConnectionsTo' &&
      (allConnectionsFromWallet.data ?? []).some((i) => i.account.to.equals(item.account.to)));

  if (amIFollowingThisAccount) {
    return (
      <ButtonV3
        className="!bg-gray-800 !text-white hover:!bg-gray-600"
        onClick={() => {
          track('Unfollow initiated', {
            event_category: 'Profile',
            event_label: 'modal',
            from: item.account.from.toBase58(),
            to: item.account.to.toBase58(),
            source: 'modal',
          });
          const revokeConnectionInput = {
            targetPubKey:
              side === 'allConnectionsFrom'
                ? item.account.from.toBase58()
                : item.account.to.toBase58(),
            updateTarget: side,
          };
          revokeConnection.mutate(revokeConnectionInput);
        }}
      >
        Unfollow
      </ButtonV3>
    );
  } else {
    return (
      <ButtonV3
        onClick={() => {
          track('Follow initiated', {
            event_category: 'Profile',
            event_label: 'modal',
            from: item.account.from.toBase58(),
            to: item.account.to.toBase58(),
            source: 'modal',
          });

          const makeConnectionInput = {
            targetPubKey:
              side === 'allConnectionsFrom'
                ? item.account.from.toBase58()
                : item.account.to.toBase58(),
            updateTarget: side,
          };
          makeConnection.mutate(makeConnectionInput);
        }}
      >
        Follow
      </ButtonV3>
    );
  }
};
