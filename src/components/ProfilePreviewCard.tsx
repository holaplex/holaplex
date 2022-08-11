import { QueryContext } from '@/hooks/useApolloQuery';
import { getFallbackImage } from '@/modules/utils/image';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useAnalytics } from '@/views/_global/AnalyticsProvider';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, FC, VFC } from 'react';
import { useIsXFollowingYLazyQuery } from 'src/graphql/indexerTypes';
import { AvatarImage } from './Avatar';
import { FollowUnfollowButton } from './FollowUnfollowButton';

export interface ProfilePreviewData {
  address: string;
  nftsOwned: number;
  nftsCreated: number;
  handle?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
}

export interface ProfilePreviewProps {
  address: string;
  context: QueryContext<ProfilePreviewData>;
  className?: string;
}

export default function ProfilePreview(props: ProfilePreviewProps): JSX.Element {
  const { track } = useAnalytics();

  const onClickProfileLink = useCallback(() => {
    track('Profile Selected', {
      event_category: 'Discovery',
      event_label: props.address,
    });
  }, [track, props.address]);

  if (props.context.loading || !props.context.data) {
    return <ProfilePreviewLoadingCard />;
  }

  const profileUrl: string = `/profiles/${props.context.data.address}`;
  const handleString: string = props.context.data.handle
    ? `@${props.context.data.handle}`
    : showFirstAndLastFour(props.context.data.address);
  const ownNftsString: string = props.context.data.nftsOwned.toLocaleString();
  const createdNftsString: string = props.context.data.nftsCreated.toLocaleString();

  return (
    <PreviewContainer className={clsx(props.className)}>
      {/* put the profile link under everything so that it doesnt interfere with other interactions,
          and force every element to have no pointer events unless it needs them */}
      <div className="pointer-events-none flex flex-col">
        <Link href={profileUrl} passHref>
          <a
            href={profileUrl}
            onClick={onClickProfileLink}
            title="Go to profile page"
            className="pointer-events-auto absolute top-0 left-0 h-full w-full"
          />
        </Link>
        {/* preview image */}
        <div className="relative h-32 flex-shrink-0 overflow-clip">
          <img
            src={props.context.data.bannerImageUrl ?? getFallbackImage()}
            alt={`${props.context.data.address} banner`}
            className="flex min-h-full min-w-full object-cover"
            // provide a fallback image in case the banner isnt found
            onError={({ currentTarget }) => {
              // null onerror to prevent looping in worst case
              currentTarget.onerror = null;
              currentTarget.src = getFallbackImage();
            }}
          />
        </div>

        <div className="flex h-full w-full flex-col p-4">
          {/* pfp, follow */}
          <div className="relative -mt-12 flex items-end justify-between">
            <div className="h-16 w-16 md:h-12 md:w-12 lg:h-24 lg:w-24">
              <AvatarImage
                src={props.context.data.profileImageUrl ?? getFallbackImage()}
                border
                borderClass="outline outline-gray-900"
              />
            </div>
            <FollowUnfollowButtonDataWrapper
              targetPubkey={props.context.data.address}
              className="pointer-events-auto flex"
            />
          </div>
          {/* handle, stats */}
          <div className="mt-6 flex flex-col ">
            <span className="flex text-base lg:text-2xl ">{handleString}</span>
            <div className="mt-4 flex flex-row justify-start text-sm lg:text-base">
              <span>
                <span className="font-semibold text-white">{ownNftsString}</span>
                <span className="ml-2 font-medium text-gray-300">Collected</span>
              </span>
              <span className="ml-4">
                <span className="font-semibold text-white">{createdNftsString}</span>
                <span className="ml-2 font-medium text-gray-300">Created</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </PreviewContainer>
  );
}

export function ProfilePreviewLoadingCard(): JSX.Element {
  return (
    <PreviewContainer className="animate-pulse">
      <div className="relative h-32 w-full flex-shrink-0">
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 bg-gray-700" />
      </div>
      <div className="p-4">
        <div className="relative z-20 -mt-12 h-16 w-16 rounded-full bg-gray-800 md:h-12 md:w-12 lg:h-24 lg:w-24" />
        <div className="mt-6 h-6 w-24 rounded-md bg-gray-700 lg:h-8" />
        <div className="mt-4 flex gap-4">
          <div className="h-6 w-20 rounded-md bg-gray-700" />
          <div className="h-6 w-20 rounded-md bg-gray-700" />
        </div>
      </div>
    </PreviewContainer>
  );
}

const PreviewContainer: FC<any> = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        'relative flex w-full flex-col overflow-clip rounded-lg bg-gray-900 shadow-md shadow-black duration-300 hover:scale-[1.02]',
        className
      )}
      {...props}
    />
  );
};

export const FollowUnfollowButtonDataWrapper: VFC<{ targetPubkey: string; className?: string }> = ({
  targetPubkey,
  className,
}) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [userIsFollowingThisAccountQuery, userIsFollowingThisAccountContext] =
    useIsXFollowingYLazyQuery();

  const userWalletAddress: string | undefined = wallet?.publicKey.toBase58();
  const targetIsUserWallet = targetPubkey === userWalletAddress;

  if (userWalletAddress && !targetIsUserWallet && !userIsFollowingThisAccountContext.called) {
    userIsFollowingThisAccountQuery({
      variables: { xPubKey: userWalletAddress, yPubKey: targetPubkey },
    });
  }

  const canAssessFollowState: boolean =
    userWalletAddress !== undefined &&
    !targetIsUserWallet &&
    userIsFollowingThisAccountContext !== undefined &&
    userIsFollowingThisAccountContext.error === undefined &&
    !userIsFollowingThisAccountContext.loading &&
    userIsFollowingThisAccountContext.data !== undefined &&
    userIsFollowingThisAccountContext.data.connections !== undefined;

  const userIsFollowingThisAccount: boolean =
    canAssessFollowState && userIsFollowingThisAccountContext!.data!.connections.length > 0;

  const hideButton: boolean = targetIsUserWallet || !canAssessFollowState || !wallet || !connection;

  if (hideButton) {
    return null;
  }

  return (
    <FollowUnfollowButton
      walletConnectionPair={{ connection, wallet: wallet! }}
      source="modalFollowing"
      type={userIsFollowingThisAccount ? 'Unfollow' : 'Follow'}
      toProfile={{
        address: targetPubkey,
      }}
      className={clsx(className, { hidden: hideButton })}
    />
  );
};
