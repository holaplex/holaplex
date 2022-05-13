import { Dispatch, FC, SetStateAction, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { Close } from '../icons/Close';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { FollowUnfollowButton } from './FollowUnfollowButton';
import {
  ConnectionNodeFragment,
  useAllConnectionsFromQuery,
  useAllConnectionsToQuery,
} from 'src/graphql/indexerTypes';
import { useProfileData } from '@/common/context/ProfileData';

export type FollowModalVisibility = 'hidden' | 'followers' | 'following';

type FollowModalProps = {
  wallet?: AnchorWallet;
  visibility: FollowModalVisibility;
  setVisibility:
    | Dispatch<SetStateAction<FollowModalVisibility>>
    | ((visibility: FollowModalVisibility) => void);
};

export const FollowModal: FC<FollowModalProps> = ({ wallet, visibility, setVisibility }) => {
  const { connection } = useConnection();

  const { publicKey } = useProfileData();
  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);

  const profileFollowersList = useAllConnectionsToQuery({ variables: { to: publicKey } });
  const profileFollowingList = useAllConnectionsFromQuery({ variables: { from: publicKey } });

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
            ? (profileFollowersList.data?.connections ?? []).map((item) => (
                <FollowItem key={item.from.address as string} side={'followers'} user={item.from} />
              ))
            : null}
          {visibility === 'following'
            ? (profileFollowingList.data?.connections ?? []).map((item) => (
                <FollowItem key={item.to.address as string} side={'following'} user={item.to} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

type FollowItemProps = {
  user: ConnectionNodeFragment;
  side: 'followers' | 'following';
};

const FollowItem: FC<FollowItemProps> = ({ user, side }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const connectionsFromWallet = useAllConnectionsFromQuery({
    variables: { from: wallet?.publicKey.toBase58() ?? '' },
  });
  const { address, profile } = user;
  const itemToReferTo = address as string;
  const twitterHandle = profile?.handle;
  const hasTwitter = !!twitterHandle;

  const copyPubKey = async () => {
    if (itemToReferTo) {
      await navigator.clipboard.writeText(itemToReferTo);
    }
  };

  const itemIsMyWallet = address === wallet?.publicKey.toBase58() ?? false;

  const amIFollowingThisAccount = (connectionsFromWallet.data?.connections ?? []).some(({ to }) => {
    return (to.address as string) === itemToReferTo;
  });

  return (
    <div className={cx('flex h-10')}>
      <div className="flex flex-1 justify-between">
        <div className="flex items-center">
          <img
            onClick={copyPubKey}
            className="rounded-full"
            width={40}
            height={40}
            src={profile?.profileImageUrl ?? getPFPFromPublicKey(itemToReferTo)}
            alt="PFP"
          />
          <Link href={`/profiles/${itemToReferTo}`} passHref>
            <a
              className={cx('ml-3 text-base font-medium leading-6 text-white', {
                'font-sans': hasTwitter,
                'font-mono': !hasTwitter,
              })}
            >
              {hasTwitter ? `@${twitterHandle}` : showFirstAndLastFour(itemToReferTo)}
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          {itemIsMyWallet ||
          connectionsFromWallet.error ||
          connectionsFromWallet.loading ||
          !wallet ||
          !connection ? null : (
            <FollowUnfollowButton
              walletConnectionPair={{
                connection,
                wallet,
              }}
              source={side === 'followers' ? 'modalFollowers' : 'modalFollowing'}
              type={amIFollowingThisAccount ? 'Unfollow' : 'Follow'}
              toProfile={{
                address: itemToReferTo,
                handle: twitterHandle,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
