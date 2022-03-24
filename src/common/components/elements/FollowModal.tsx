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
import FollowUnfollowButton from './FollowUnfollowButton';

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
        className="relative flex h-full max-h-screen w-full flex-col rounded-xl bg-gray-900 pt-6  text-white shadow-md sm:max-h-[30rem] sm:max-w-lg"
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

  const allConnectionsFromWallet = useGetAllConnectionsFromWithTwitter(
    wallet.publicKey.toBase58(),
    walletConnectionPair
  );

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

  return (
    <FollowUnfollowButton
      walletConnectionPair={walletConnectionPair}
      toWallet={item.account.to.toBase58()}
      type={amIFollowingThisAccount ? 'Unfollow' : 'Follow'}
    />
  );
};
