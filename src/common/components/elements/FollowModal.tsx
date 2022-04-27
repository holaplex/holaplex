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
import { Unpacked } from '@/types/Unpacked';
import { FollowUnfollowButton } from './FollowUnfollowButton';
import { Connection } from '@solana/web3.js';
import { useWalletProfileQuery } from 'src/graphql/indexerTypes';
import { IProfile } from '@/modules/feed/feed.interfaces';

export type FollowModalVisibility = 'hidden' | 'followers' | 'following';

type ConnectionItem =
  | NonNullable<Unpacked<ReturnType<typeof useGetAllConnectionsToWithTwitter>['data']>>
  | NonNullable<Unpacked<ReturnType<typeof useGetAllConnectionsFromWithTwitter>['data']>>;

type FollowModalProps = {
  profile: IProfile;
  wallet?: AnchorWallet;
  visibility: FollowModalVisibility;
  setVisibility:
    | Dispatch<SetStateAction<FollowModalVisibility>>
    | ((visibility: FollowModalVisibility) => void);
};

export const FollowModal: FC<FollowModalProps> = ({
  wallet,
  profile,
  visibility,
  setVisibility,
}) => {
  const { connection } = useConnection();
  const { pubkey } = profile;

  const allConnectionsTo = useGetAllConnectionsToWithTwitter(pubkey, connection);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(pubkey, connection);

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
        <div className="scrollbar-thumb-rounded-full flex flex-1 flex-col space-y-6 overflow-y-auto py-4 px-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900">
          {visibility === 'followers'
            ? (allConnectionsTo.data ?? []).map((item) => (
                <FollowItem
                  wallet={wallet}
                  connection={connection}
                  key={item.publicKey.toBase58()}
                  item={item}
                  side={'allConnectionsFrom'}
                />
              ))
            : null}
          {visibility === 'following'
            ? (allConnectionsFrom.data ?? []).map((item) => (
                <FollowItem
                  wallet={wallet}
                  connection={connection}
                  key={item.publicKey.toBase58()}
                  item={item}
                  side={'allConnectionsTo'}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

type FollowItemProps = {
  item: ConnectionItem;
  wallet?: AnchorWallet;
  connection: Connection;
  side: 'allConnectionsTo' | 'allConnectionsFrom';
};

const FollowItem: FC<FollowItemProps> = ({ item, side, connection, wallet }) => {
  const itemToReferTo = side === 'allConnectionsTo' ? item.account.to : item.account.from;
  const twitterHandle =
    side === 'allConnectionsTo' ? item.twitter.toHandle : item.twitter.fromHandle;
  const hasTwitter = !!twitterHandle;

  const walletProfile = useWalletProfileQuery({
    variables: {
      handle: twitterHandle ?? '',
    },
  });

  const copyPubKey = async () => {
    if (itemToReferTo) {
      await navigator.clipboard.writeText(itemToReferTo.toBase58());
    }
  };

  const allConnectionsFromWallet = useGetAllConnectionsFromWithTwitter(
    wallet?.publicKey.toBase58() ?? null,
    connection
  );

  const itemIsMyWallet = !wallet
    ? false
    : (side === 'allConnectionsFrom' &&
        item.account.from.toBase58() === wallet.publicKey.toBase58()) ||
      (side === 'allConnectionsTo' && item.account.to.toBase58() === wallet.publicKey.toBase58());

  const amIFollowingThisAccount = !wallet
    ? false
    : (allConnectionsFromWallet.data ?? []).some((connectionFromWallet) =>
        connectionFromWallet.account.to.equals(itemToReferTo)
      );

  return (
    <div className={cx('flex h-10')}>
      <div className="flex flex-1 justify-between">
        <div className="flex items-center">
          <img
            onClick={copyPubKey}
            className="rounded-full"
            width={40}
            height={40}
            src={
              walletProfile.data?.profile?.profileImageUrlHighres ??
              getPFPFromPublicKey(itemToReferTo)
            }
            alt="PFP"
          />
          <Link href={`/profiles/${itemToReferTo}`} passHref>
            <a
              className={cx('ml-3 text-base font-medium leading-6 text-white', {
                'font-sans': hasTwitter,
                'font-mono': !hasTwitter,
              })}
            >
              {hasTwitter ? `@${twitterHandle}` : showFirstAndLastFour(itemToReferTo.toBase58())}
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          {itemIsMyWallet || !wallet ? null : (
            <FollowUnfollowButton
              source={side === 'allConnectionsTo' ? 'modalTo' : 'modalFrom'}
              type={amIFollowingThisAccount ? 'Unfollow' : 'Follow'}
              walletConnectionPair={{ wallet, connection }}
              toProfile={{
                pubkey: itemToReferTo.toBase58(),
                handle: twitterHandle,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
