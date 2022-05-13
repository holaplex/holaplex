import { FC, useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { HomeSection, HomeSectionCarousel } from 'pages/home-v2-wip';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { getFallbackImage } from '@/modules/utils/image';
import { FeaturedProfilesData, ProfilePreviewData } from '@/types/types';
import { useFeaturedProfilesQuery, useProfilePreviewQuery } from 'src/graphql/indexerTypes';
import { AvatarImage } from '../elements/Avatar';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useGetAllConnectionsToWithTwitter } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFromWithTwitter } from '@/common/hooks/useGetAllConnectionsFrom';
import classNames from 'classnames';
import Link from 'next/link';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 2;

const FeaturedProfilesSection: VFC = () => {
  const wallet: WalletContextState = useWallet();
  const [featuredProfiles, setFeaturedProfiles] = useState<FeaturedProfilesData>([]);

  const dataQuery = useFeaturedProfilesQuery({
    variables: {
      userWallet: wallet?.publicKey,
      limit: CAROUSEL_PAGES * CAROUSEL_COLS * CAROUSEL_ROWS,
    },
  });

  // get featured profiles once on page load and anytime later when the wallet has been (dis)connected
  // by making the wallet pubkey one of the dependencies
  useEffect(() => {
    if (dataQuery.data?.followWallets && (dataQuery.data.followWallets.length > 0)) {
      setFeaturedProfiles(dataQuery.data.followWallets as FeaturedProfilesData);
    }
  }, [wallet?.publicKey, setFeaturedProfiles, dataQuery.data?.followWallets]); 

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAProfile = useCallback<(profileAddress: string) => void>(
    (profileAddress) => {
      setFeaturedProfiles(featuredProfiles.filter((p) => p.address !== profileAddress));
    },
    [featuredProfiles]
  );

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Profiles to Follow</HomeSection.Title>
        <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredProfiles.map((s) => (
            <HomeSectionCarousel.Item key={s.address}>
              <div className="p-2 md:p-3">
                <ProfilePreview
                  address={s.address}
                  onInsufficientData={onInsufficientDataForAProfile}
                />
              </div>
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

interface ProfilePreviewProps {
  address: string;
  onInsufficientData: (address: string) => void;
}

const ProfilePreview: FC<ProfilePreviewProps> = ({ address, onInsufficientData }) => {
  const { track } = useAnalytics();
  const dataQuery = useProfilePreviewQuery({
    variables: {
      address: address,
    },
  });
  let data: ProfilePreviewData | undefined = dataQuery?.data?.wallet
    ? (dataQuery.data.wallet as ProfilePreviewData)
    : undefined;
  const loading: boolean = dataQuery?.loading;

  useEffect(() => {
    if (!loading && !previewDataAreSufficient(data)) {
      onInsufficientData(address);
    }
  }, [address, data, onInsufficientData, loading]);

  const onClickProfileLink = useCallback(() => {
    track('Profile Selected', {
      event_category: 'Discovery',
      event_label: data ? data.address : 'unknown-address',
    });
  }, [data, track]);

  if (loading || !previewDataAreSufficient(data)) {
    return <LoadingPreview />;
  }

  // sufficient data are available after checking previewDataAreSufficient()
  data = data!;

  const profileUrl: string = `/profiles/${data.address}`;
  const handleString: string = data.profile?.handle
    ? `@${data.profile.handle}`
    : showFirstAndLastFour(data.address);
  const ownNftsString: string = (data.nftCounts.owned ?? 0).toLocaleString();
  const createdNftsString: string = (data.nftCounts.created ?? 0).toLocaleString();

  return (
    <PreviewContainer>
      {/* put the profile link under everything so that it doesnt interfere with other interactions,
        and force every element to have no pointer events unless it needs them */}
      <div className="pointer-events-none">
        <Link href={profileUrl} passHref>
          <a
            href={profileUrl}
            onClick={onClickProfileLink}
            title="Go to profile page"
            className="pointer-events-auto absolute top-0 left-0 -z-50 h-full w-full"
          />
        </Link>
        {/* preview image */}
        <div className="relative h-[47%] overflow-clip">
          <img
            src={data.profile?.bannerImageUrl ?? getFallbackImage()}
            alt={`${data.address} banner`}
            className="flex min-h-full min-w-full object-cover"
            // provide a fallback image in case the banner isnt found
            onError={({ currentTarget }) => {
              // null onerror to prevent looping in worst case
              currentTarget.onerror = null;
              currentTarget.src = getFallbackImage();
            }}
          />
        </div>

        {/* profile handle, follow, stats box */}
        <div className="h-full w-full">
          <FollowUnfollowButtonDataWrapper
            targetPubkey={data.address}
            className="pointer-events-auto z-50 float-right mt-2 mr-3"
          />
          <div className="absolute bottom-0 p-2 2xl:p-6">
            <div className="flex flex-col">
              <span className="flex text-lg 2xl:text-2xl">{handleString}</span>
              <div className="mt-4 flex flex-row justify-start text-sm 2xl:text-lg">
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

        {/* profile icon  */}
        <div className="absolute left-3 top-1/2 aspect-square h-[22%] -translate-y-1/2">
          <AvatarImage
            src={data.profile?.profileImageUrl ?? getFallbackImage()}
            border
            borderClass="border-4 border-gray-900"
          />
        </div>
      </div>
    </PreviewContainer>
  );
};

function previewDataAreSufficient(data?: ProfilePreviewData): boolean {
  return (
    data != undefined &&
    data.address != undefined &&
    data.nftCounts != undefined
  );
}

const LoadingPreview = () => {
  return (
    <PreviewContainer>
      <div className="h-full w-full animate-pulse bg-gray-700" />
    </PreviewContainer>
  );
};

const PreviewContainer: FC<any> = (props) => {
  return (
    <div
      className="relative flex aspect-square w-full overflow-clip rounded-lg shadow-md shadow-black duration-150 hover:scale-[1.02]"
      {...props}
    />
  );
};

const FollowUnfollowButtonDataWrapper: VFC<{ targetPubkey: string; className?: string }> = ({
  targetPubkey,
  className,
}) => {
  const { connection } = useConnection();
  const userWallet: AnchorWallet | undefined = useAnchorWallet();
  const walletConnectionPair = useMemo(
    () => ({ wallet: userWallet, connection }),
    [userWallet, connection]
  );

  const allConnectionsTo = useGetAllConnectionsToWithTwitter(targetPubkey, connection);
  const allConnectionsFrom = useGetAllConnectionsFromWithTwitter(targetPubkey, connection);

  if (!userWallet || !userWallet.publicKey) {
    return null;
  }

  if (allConnectionsTo.error) {
    console.error(allConnectionsTo.error);
    return null;
  }

  if (allConnectionsFrom.error) {
    console.error(allConnectionsFrom.error);
    return null;
  }

  const allConnectionsToLoading = !allConnectionsTo.data && !allConnectionsTo.error;
  const allConnectionsFromLoading = !allConnectionsFrom.data && !allConnectionsFrom.error;

  const isLoading = allConnectionsToLoading || allConnectionsFromLoading;
  if (isLoading) {
    return null;
  }

  const walletIsUsers: boolean = !!userWallet?.publicKey.equals(new PublicKey(targetPubkey));
  let userIsFollowingProfile: boolean = false;
  if (!walletIsUsers && userWallet && allConnectionsTo.data && allConnectionsTo.data.length > 0) {
    userIsFollowingProfile = allConnectionsTo.data.some((i) =>
      i.account.from.equals(userWallet.publicKey)
    );
  }

  const hideButton: boolean = walletIsUsers || !userWallet;

  return (
    <FollowUnfollowButton
      source="profileButton"
      walletConnectionPair={
        walletConnectionPair as {
          wallet: AnchorWallet;
          connection: Connection;
        }
      }
      toProfile={{ address : targetPubkey }}
      type={userIsFollowingProfile ? 'Unfollow' : 'Follow'}
      className={classNames(className, { hidden: hideButton })}
    />
  );
};

export default FeaturedProfilesSection;
