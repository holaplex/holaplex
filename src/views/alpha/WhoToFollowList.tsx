import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FollowUnfollowButton } from '@/components/FollowUnfollowButton';
import { getHandle, User } from './feed.utils';
import { ProfilePFP } from './FeedCard';
import Popover from '@/components/Popover';
import { getProfilePreivewDataFromUser } from '@/lib/utils/typeUtils';
import ProfilePreview from '@/components/ProfilePreviewCard';

function FollowListItem({
  user,
  ...props
}: {
  user: User;

  myFollowingList: string[];
}) {
  return (
    <div className="flex justify-between gap-4">
      <div className="flex items-center">
        <div className="mr-4 flex flex-shrink-0">
          <ProfilePFP user={user} />
        </div>
        <Popover
          key={user.address}
          isShowOnHover={true}
          placement="right"
          content={
            <ProfilePreview
              className="w-80"
              address={user.address}
              context={{
                data: getProfilePreivewDataFromUser(user),
                loading: false,
                refetch: () => {},
                fetchMore: () => {},
              }}
            />
          }
        >
          <Link href={'/profiles/' + user.address + '/nfts'} passHref>
            <a className="truncate">{getHandle(user)}</a>
          </Link>
        </Popover>
      </div>

      <FollowUnfollowButton
        source="whotofollow"
        toProfile={{
          address: user.address,
        }}
        type={props.myFollowingList.includes(user.address) ? 'Unfollow' : 'Follow'} // needs to be dynamic
      />
    </div>
  );
}

export default function WhoToFollowList(props: {
  myFollowingList?: string[];
  profilesToFollow?: User[];
}) {
  const { connectedProfile } = useConnectedWalletProfile();

  const [topProfilesToFollow, setTopProfilesToFollow] = useState<User[]>([]);
  const [currentFollowingList, setCurrentFollowingList] = useState<string[]>([]);

  // initialize based on who you already follow
  useEffect(() => {
    if (props.myFollowingList && !topProfilesToFollow.length && props.profilesToFollow) {
      setTopProfilesToFollow(
        props.profilesToFollow
          .filter((u) => !props.myFollowingList?.includes(u.address))
          .slice(0, 5)
      );
      setCurrentFollowingList(props.myFollowingList);
    }
  }, [props.myFollowingList, props.profilesToFollow]);

  // update
  useEffect(() => {
    if (
      topProfilesToFollow.length > 0 &&
      props.myFollowingList &&
      props.myFollowingList.length > 0 &&
      props.myFollowingList.length !== currentFollowingList.length
    ) {
      const newWalletFollowed = props.myFollowingList.find(
        (address) => !currentFollowingList.includes(address)
      );
      if (newWalletFollowed) {
        const topProfileIndexToChange = topProfilesToFollow.findIndex(
          (u) => u.address === newWalletFollowed
        );
        if (topProfileIndexToChange !== -1) {
          setTopProfilesToFollow(
            [
              ...topProfilesToFollow.slice(0, topProfileIndexToChange),
              (props.profilesToFollow || [])
                .filter(
                  (u) =>
                    !topProfilesToFollow.some((tu) => tu.address === u.address) &&
                    !props.myFollowingList?.includes(u.address)
                )
                .splice(0, 1)[0],
              ...topProfilesToFollow.slice(topProfileIndexToChange + 1),
            ].filter((u) => u)
            // filter to handle case when INFLUENTIAL_WALLETS is empty
          );
        }
      }
      setCurrentFollowingList(props.myFollowingList);
    }
  }, [props.myFollowingList?.length]);

  const myFollowingList = props.myFollowingList || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Who to follow</h3>
      </div>
      <div className="space-y-6">
        {topProfilesToFollow.length === 0 && (
          <>
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
            <LoadingFollowCard />
          </>
        )}

        {connectedProfile?.walletConnectionPair &&
          topProfilesToFollow.map((u) => (
            <FollowListItem key={u.address} user={u} myFollowingList={myFollowingList} />
          ))}
        {!connectedProfile && myFollowingList && <div>Connect wallet to see suggestions</div>}
      </div>
    </div>
  );
}

const LoadingFollowCard = () => (
  <div className="flex animate-pulse justify-between">
    <div className="flex items-center">
      <div className="mr-4">
        <div className={`h-10 w-10 rounded-full bg-gray-800`} />
      </div>
      <div className={`h-10 w-40 rounded-full bg-gray-800`} />
    </div>

    <div className={` h-10 w-28 rounded-full bg-gray-800`} />
  </div>
);
