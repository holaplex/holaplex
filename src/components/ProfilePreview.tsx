import Link from 'next/link';
import { FC, useCallback, useEffect, useState } from 'react';
import { useProfilePreviewLazyQuery } from '../graphql/indexerTypes';
import { getFallbackImage } from '../modules/utils/image';
import { showFirstAndLastFour } from '../modules/utils/string';
import { ProfilePreviewData } from '../types/types';
import { FollowUnfollowButtonDataWrapper } from '../views/home/FeaturedProfilesSection';
import { useAnalytics } from '../views/_global/AnalyticsProvider';
import { AvatarImage } from './Avatar';

interface ProfilePreviewProps {
  address: string;
  data?: ProfilePreviewData;
  onInsufficientData?: (address: string) => void;
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
    if (
      onInsufficientData &&
      (data || !dataQueryContext.loading) &&
      !previewDataAreSufficient(finalData)
    ) {
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

const PreviewContainer: FC<any> = (props) => {
  return (
    <div
      className="relative flex aspect-[364/300] w-full overflow-clip  rounded-lg bg-gray-900 shadow-md shadow-black duration-300 hover:scale-[1.02]"
      {...props}
    />
  );
};

const LoadingPreview = () => {
  return (
    <PreviewContainer>
      <div className="h-full w-full animate-pulse bg-gray-800" />
    </PreviewContainer>
  );
};

export default ProfilePreview;
