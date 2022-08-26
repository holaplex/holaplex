import { GetServerSideProps } from 'next';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
import { ProfileDataProvider, useProfileData } from 'src/views/profiles/ProfileDataProvider';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import { useActivityPageQuery, WalletActivity } from '@/graphql/indexerTypes';
import styled from 'styled-components';
import { LoadingBox, LoadingLine } from '@/components/LoadingPlaceholders';
import { mq } from '@/assets/styles/MediaQuery';
import { Col } from 'antd';
import { IActivityItem } from '@/views/alpha/activity.interfaces';
import { PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import { ActivityCard } from '@/components/ActivityCard';
import { InView } from 'react-intersection-observer';
import { TailSpin } from 'react-loader-spinner';

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

export const INFINITE_SCROLL_AMOUNT_INCREMENT = 25;
export const INITIAL_FETCH = 25;

interface ActivityListProps {
  activities: WalletActivity[];
  onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
}

export const ActivityList: FC<ActivityListProps> = ({
  activities,
  onLoadMore,
  hasMore,
  loading = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {loading ? (
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
      ) : activities.length ? (
        <>
          {activities.map((item) => (
            <ActivityCard activity={item as IActivityItem} key={item.id} />
          ))}
          {hasMore && (
            <InView as="div" threshold={0.1} onChange={onLoadMore}>
              <div className={`my-6 flex w-full items-center justify-center font-bold`}>
                <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
              </div>
            </InView>
          )}
        </>
      ) : (
        <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4 text-center">
          <span className="text-center text-2xl font-semibold">No activity</span>
          <span className="mt-2 text-gray-300 ">
            Activity associated with this user’s wallet will show up here
          </span>
        </div>
      )}
    </div>
  );
};

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
              mintAddress: nft?.mintAddress,
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
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore, refetch } = useActivityPageQuery({
    variables: {
      address: publicKey.toBase58(),
      limit: 25,
      offset: 0,
    },
  });

  const activities = data?.wallet.activities ?? [];

  return (
    <ActivityContainer>
      <ActivityList
        hasMore={hasMore}
        onLoadMore={async (inView: boolean) => {
          if (!inView || loading) {
            return;
          }

          const {
            data: {
              wallet: { activities },
            },
          } = await fetchMore({
            variables: {
              offset: data?.wallet.activities.length,
            },
          });

          setHasMore(activities.length > 0);
        }}
        activities={activities as WalletActivity[]}
        loading={loading}
      />
      <div className="space-y-4"></div>
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
