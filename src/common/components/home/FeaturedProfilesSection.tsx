import { FC, useCallback, useEffect, useState, VFC } from 'react';
import ReactDom from 'react-dom';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { getFallbackImage } from '@/modules/utils/image';
import { ProfilePreviewData } from '@/types/types';
import {
  useFeaturedProfilesQuery,
  useIsXFollowingYLazyQuery,
  useProfilePreviewLazyQuery,
} from 'src/graphql/indexerTypes';
import { AvatarImage } from '../elements/Avatar';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
import Modal from '../elements/Modal';
import { Button5 } from '../elements/Button2';
import { useMultiTransactionModal } from '@/common/context/MultiTransaction';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 2;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS * CAROUSEL_PAGES;

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

const FeaturedProfilesSection: VFC = () => {
  const wallet: WalletContextState = useWallet();
  // initial value hack to get loading card
  // TODO pass in a loading boolean to bypass loading until the address is known
  const [featuredProfiles, setFeaturedProfiles] = useState<ProfilePreviewData[]>(
    [...Array(N_LISTINGS)].map((_) => ({ address: '', profile: {}, nftCounts: {} }))
  );

  const dataQuery = useFeaturedProfilesQuery({
    variables: {
      userWallet: wallet?.publicKey,
      limit: CAROUSEL_PAGES * CAROUSEL_COLS * CAROUSEL_ROWS,
    },
  });

  // get featured profiles once on page load and anytime later when the wallet has been (dis)connected
  // by making the wallet pubkey one of the dependencies
  useEffect(() => {
    if (dataQuery.data?.followWallets && dataQuery.data.followWallets.length > 0) {
      const profilesToShow = (dataQuery.data.followWallets as ProfilePreviewData[]).filter(
        (p) => !DISALLOWED_PROFILES.includes(p.address)
      );
      setFeaturedProfiles(profilesToShow);
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
        <HomeSection.Title>Profiles to follow</HomeSection.Title>
        {/* //TODO revert once discovery is ready  */}
        {/* <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction> */}
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredProfiles.map((s) => (
            <HomeSectionCarousel.Item key={s.address} className="p-4">
              <ProfilePreview
                address={s.address}
                data={s}
                onInsufficientData={onInsufficientDataForAProfile}
              />
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

interface ProfilePreviewProps {
  address: string;
  data?: ProfilePreviewData;
  onInsufficientData: (address: string) => void;
}

const ProfilePreview: FC<ProfilePreviewProps> = ({ address, onInsufficientData, data }) => {
  const { track } = useAnalytics();
  const [dataQuery, dataQueryContext] = useProfilePreviewLazyQuery();
  const [finalData, setFinalData] = useState<ProfilePreviewData>({
    address: address,
    nftCounts: {},
    profile: {},
  });

  useEffect(
    () => {
      async function queryAndSetData() {
        await dataQuery({ variables: { address: address } });
        if (dataQueryContext.data) {
          setFinalData(dataQueryContext.data.wallet as ProfilePreviewData);
        }
      }

      if (data) setFinalData(data);
      else queryAndSetData();
    },
    // dont want to include the dataQuery.data as this will re-trigger the request
    [dataQuery, data, address]
  );

  useEffect(() => {
    if ((data || !dataQueryContext.loading) && !previewDataAreSufficient(finalData)) {
      onInsufficientData(address);
    }
  }, [address, onInsufficientData, dataQueryContext.loading, finalData, data]);

  const onClickProfileLink = useCallback(() => {
    track('Profile Selected', {
      event_category: 'Discovery',
      event_label: data ? data.address : 'unknown-address',
    });
  }, [data, track]);

  if (!previewDataAreSufficient(finalData)) {
    return <LoadingPreview />;
  }

  const profileUrl: string = `/profiles/${finalData.address}`;
  const handleString: string = finalData.profile?.handle
    ? `@${finalData.profile.handle}`
    : showFirstAndLastFour(finalData.address);
  const ownNftsString: string = (finalData.nftCounts.owned ?? 0).toLocaleString();
  const createdNftsString: string = (finalData.nftCounts.created ?? 0).toLocaleString();

  return (
    <PreviewContainer>
      {/* put the profile link under everything so that it doesnt interfere with other interactions,
        and force every element to have no pointer events unless it needs them */}
      <div className="pointer-events-none flex flex-col justify-between">
        <Link href={profileUrl} passHref>
          <a
            href={profileUrl}
            onClick={onClickProfileLink}
            title="Go to profile page"
            className="pointer-events-auto absolute top-0 left-0 -z-50 h-full w-full"
          />
        </Link>
        {/* preview image */}
        <div className="relative h-[47%] flex-shrink-0 overflow-clip">
          <img
            src={finalData.profile?.bannerImageUrl ?? getFallbackImage()}
            alt={`${finalData.address} banner`}
            className="flex min-h-full min-w-full object-cover"
            // provide a fallback image in case the banner isnt found
            onError={({ currentTarget }) => {
              // null onerror to prevent looping in worst case
              currentTarget.onerror = null;
              currentTarget.src = getFallbackImage();
            }}
          />
        </div>

        <div className="flex h-full w-full flex-col justify-between p-4 md:p-2 lg:p-4">
          {/* pfp, follow */}
          <div className="relative flex h-8 items-end justify-end lg:h-10">
            <div className="absolute left-0 bottom-0 aspect-square h-16 w-16 md:h-12 md:w-12 lg:h-20 lg:w-20">
              <AvatarImage
                src={finalData.profile?.profileImageUrlHighres ?? getFallbackImage()}
                border
                borderClass="border-4 border-gray-900"
              />
            </div>
            <FollowUnfollowButtonDataWrapper
              targetPubkey={finalData.address}
              className="pointer-events-auto z-50 flex"
            />
          </div>
          {/* handle, stats */}
          <div className="flex flex-col">
            <span className="flex text-base lg:text-lg 2xl:text-2xl">{handleString}</span>
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
    </PreviewContainer>
  );
};

function previewDataAreSufficient(data?: ProfilePreviewData): boolean {
  return data != undefined && data.address != undefined && data.nftCounts != undefined;
}

const LoadingPreview = () => {
  return (
    <PreviewContainer>
      <div className="h-full w-full animate-pulse bg-gray-800" />
    </PreviewContainer>
  );
};

const PreviewContainer: FC<any> = (props) => {
  return (
    <div
      className="relative flex aspect-[364/300] w-full overflow-clip rounded-lg shadow-md shadow-black duration-300 hover:scale-[1.02]"
      {...props}
    />
  );
};

export const FollowUnfollowButtonDataWrapper: VFC<{ targetPubkey: string; className?: string }> = ({
  targetPubkey,
  className,
}) => {
  const { connectedProfile } = useConnectedWalletProfile();

  const userIsFollowingThisAccount = connectedProfile?.following?.find(
    (f) => f.address === targetPubkey
  );

  const targetIsUserWallet = targetPubkey === connectedProfile?.pubkey;

  const canAssessFollowState: boolean = !!connectedProfile && !targetIsUserWallet;

  const hideButton: boolean = targetIsUserWallet || !canAssessFollowState;

  if (hideButton) {
    return null; // <ConnectAndFollowButton />;
  }

  return (
    <FollowUnfollowButton
      source="modalFollowing"
      type={userIsFollowingThisAccount ? 'Unfollow' : 'Follow'}
      toProfile={{
        address: targetPubkey,
      }}
      className={classNames(className, { hidden: hideButton })}
    />
  );
};

export default FeaturedProfilesSection;

// WIP: Ignore for now
function ConnectAndFollowButton() {
  const [showModal, setShowModal] = useState(false);

  const { connection } = useConnection();

  const { runActions } = useMultiTransactionModal();
  const { setVisible } = useWalletModal();

  async function connectWalletPromise() {
    setVisible(true);

    await waitUserInput();

    return;
  }

  const timeout = async (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function waitUserInput() {
    while (!connection) await timeout(1000); // pauses script
    // next = false; // reset var
  }

  return (
    <div>
      {ReactDom.createPortal(
        <Modal priority title={'Connect and Follow'} open={showModal} setOpen={setShowModal}>
          <p>
            You&apos;ll get two wallet prompts, one to connect and one to confirm the follow
            transaction
          </p>
          <p>When you are connected in the future, you won&apos;t receive this message</p>
          <Button5
            onClick={() =>
              runActions([
                {
                  id: 'Connect',
                  name: 'Connecting wallet',
                  action: connectWalletPromise,
                  param: null,
                },
              ])
            }
            v="primary"
          >
            Connect and Follow
          </Button5>
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
      <Button5 v="primary" onClick={() => setShowModal(true)}>
        Follow
      </Button5>
    </div>
  );
}
