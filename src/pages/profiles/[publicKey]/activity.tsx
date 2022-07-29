import { GetServerSideProps } from 'next';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
import { ProfileDataProvider, useProfileData } from 'src/views/profiles/ProfileDataProvider';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import { useActivityPageQuery, WalletActivity } from '@/graphql/indexerTypes';
import styled from 'styled-components';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { LoadingBox, LoadingLine } from '@/components/LoadingPlaceholders';
import { mq } from '@/assets/styles/MediaQuery';
import { Col } from 'antd';
import { IActivityItem } from '@/views/alpha/activity.interfaces';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import TextInput2 from '@/components/TextInput2';
import { ActivityCard } from '@/components/ActivityCard';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

export const LoadingActivitySkeletonBoxSquareShort = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="8px" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="60%" />
          <LoadingLine $width="25%" $height="16px" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

export const LoadingActivitySkeletonBoxCircleLong = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="8px" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="100%" />
          <LoadingLine $width="25%" $height="16px" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

const LoadingLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityContainer = styled.main`
  flex: 1;
  margin-top: 16px;
  /*
  ${mq('lg')} {
    margin-top: 0px;
    margin-left: 40px;
  }
  ${mq('xl')} {
    margin-left: 80px;
  }*/
`;

const ContentContainer = styled.div`
  flex: 1;
  margin-left: 16px;
  margin-right: 16px;
  align-items: center;
`;

const CenteredCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ActivityBoxContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 16px;
  border: 1px solid #262626;
  box-sizing: border-box;
  border-radius: 8px;
`;

export function getActivityItems(activities: WalletActivity[]) {
  return (
    activities.reduce((items, activity) => {
      const nft = activity.nft;
      const creators = nft?.creators.map((creator) => {
        return {
          address: creator.address as string,
          twitterHandle: creator.twitterHandle as string,
        };
      });
      const wallets = activity.wallets.map((wallet) => {
        return {
          address: wallet.address as string,
          twitterHandle: wallet.twitterHandle as string,
        };
      });
      items.push({
        id: activity.id,
        price: activity.price,
        createdAt: activity.createdAt,
        activityType: activity.activityType,
        wallets: wallets,
        nft: nft
          ? {
              address: nft?.address,
              name: nft.name,
              description: nft.description,
              image: nft.image,
              creators: creators,
            }
          : undefined,
        auctionHouse: activity.auctionHouse
          ? {
              address: activity.auctionHouse?.address,
              treasuryMint: activity.auctionHouse?.treasuryMint,
            }
          : undefined,
      });

      return items;
    }, [] as IActivityItem[]) || []
  );
}

function ActivityPage(props: WalletDependantPageProps) {
  const { publicKey: pk } = useProfileData();
  const publicKey = new PublicKey(pk);
  const [activityFilter, setActivityFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const activityPage = useActivityPageQuery({
    variables: {
      address: publicKey.toBase58(),
    },
  });

  const isLoading = activityPage.loading;
  const activityItems = useMemo(
    () =>
      activityPage.data?.wallet?.activities
        ? // @ts-ignore
          getActivityItems(activityPage.data.wallet.activities)
        : [],

    [activityPage.data?.wallet?.activities]
  );
  //const activityItems = activityPage.data?.wallet?.activities ?? [];
  const filteredActivityItems = activityItems.filter((i) => {
    return (
      !activityFilter ||
      [
        i.nft?.name,
        i.nft?.address,
        i.nft?.description,
        i.wallets[0]?.address,
        i.wallets[1]?.address,
        i.wallets[0]?.twitterHandle,
        i.wallets[1]?.twitterHandle,
      ].some((w) => w?.toLocaleLowerCase()?.includes(activityFilter.toLocaleLowerCase()))
    );
  });

  return (
    <ActivityContainer>
      <div className="mb-4  ">
        <TextInput2
          id="activity-search"
          label="activity search"
          hideLabel
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          leadingIcon={
            <FeatherIcon
              icon="search"
              aria-hidden="true"
              className={searchFocused ? 'text-white' : 'text-gray-500'}
            />
          }
          placeholder="Search"
        />
      </div>
      {/* <div className="flex">
      <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Bids</button>
      <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Unclaimed bids</button>
      <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Wins</button>
      <button className="mr-2 bg-gray-600 p-2 hover:bg-gray-800">Losses</button>
    </div> */}

      <div className="space-y-4">
        {isLoading ? (
          <>
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
          </>
        ) : filteredActivityItems.length ? (
          filteredActivityItems.map((item) => <ActivityCard activity={item} key={item.id} />)
        ) : (
          <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4 text-center">
            <span className="text-center text-2xl font-semibold">
              No activity
              {!!activityItems.length && !filteredActivityItems.length && ' for this filter'}
            </span>
            <span className="mt-2 text-gray-300 ">
              Activity associated with this user’s wallet will show up here
            </span>
          </div>
        )}
      </div>
    </ActivityContainer>
  );
}

export default ActivityPage;

ActivityPage.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};
