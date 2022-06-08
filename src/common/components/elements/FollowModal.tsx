import { Dispatch, FC, SetStateAction, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { Close } from '../icons/Close';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { FollowUnfollowButton, FollowUnfollowSource } from './FollowUnfollowButton';
import {
  ConnectionNodeFragment,
  useAllConnectionsFromQuery,
  useAllConnectionsToQuery,
} from 'src/graphql/indexerTypes';
import { useProfileData } from '@/common/context/ProfileData';
import { cleanUpFollowers, cleanUpFollowing } from './FollowerCount';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
export type FollowModalVisibility = 'hidden' | 'followers' | 'following';

type FollowModalProps = {
  wallet?: AnchorWallet;
  visibility: FollowModalVisibility;
  setVisibility:
    | Dispatch<SetStateAction<FollowModalVisibility>>
    | ((visibility: FollowModalVisibility) => void);
};

export const FollowModal: FC<FollowModalProps> = ({ wallet, visibility, setVisibility }) => {
  const { publicKey } = useProfileData();

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
            ? cleanUpFollowers(profileFollowersList.data?.connections)
                .filter((v, i, a) => i === a.indexOf(v))
                .map((item: any) => (
                  <FollowItem
                    key={item.from.address as string}
                    source={'modalFollowers'}
                    user={item.from}
                  />
                ))
            : null}
          {visibility === 'following'
            ? cleanUpFollowing(profileFollowingList.data?.connections).map((item: any) => (
                <FollowItem
                  key={item.to.address as string}
                  source={'modalFollowing'}
                  user={item.to}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

type FollowItemProps = {
  user: ConnectionNodeFragment;
  source: FollowUnfollowSource;
};

export const FollowItem: FC<FollowItemProps> = ({ user, source }) => {
  const { connectedProfile } = useConnectedWalletProfile();
  const myPubkey = connectedProfile?.pubkey;

  const copyUserPubKey = async () => {
    if (user.address) {
      await navigator.clipboard.writeText(user.address);
    }
  };

  const userIsMe = user.address === myPubkey ?? false;
  const userHasTwitter = !!user.profile?.handle;
  const amIFollowingThisAccount = connectedProfile?.following?.some(
    (p) => p.address === user.address
  );

  return (
    <div className="flex h-10">
      <div className="flex flex-1 justify-between">
        <div className="flex items-center">
          <img
            onClick={copyUserPubKey}
            className="rounded-full"
            width={40}
            height={40}
            src={user.profile?.profileImageUrlLowres ?? getPFPFromPublicKey(user.address)}
            alt="PFP"
          />
          <Link href={`/profiles/${user.address}`} passHref>
            <a
              className={cx('ml-3 text-base font-medium leading-6 text-white', {
                'font-sans': userHasTwitter,
                'font-mono': !userHasTwitter,
              })}
            >
              {userHasTwitter ? `@${user.profile?.handle}` : showFirstAndLastFour(user.address)}
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          {userIsMe || !myPubkey || !connectedProfile.walletConnectionPair ? null : (
            <FollowUnfollowButton
              walletConnectionPair={connectedProfile.walletConnectionPair}
              source={source}
              type={amIFollowingThisAccount ? 'Unfollow' : 'Follow'}
              toProfile={{
                address: user.address,
                handle: user.profile?.handle,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
