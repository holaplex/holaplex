import { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { AnchorButton } from '@/components/elements/Button';
import { Col, Row } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useActivityPageLazyQuery } from 'src/graphql/indexerTypes';
import { DateTime } from 'luxon';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { mq } from '@/common/styles/MediaQuery';
import { maybeImageCDN } from '@/common/utils';
import { ChevronRight } from '../icons/ChevronRight';
import { Unpacked } from '@/types/Unpacked';
import Bugsnag from '@bugsnag/js';
import TextInput2 from './TextInput2';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useWallet } from '@solana/wallet-adapter-react';

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const ActivityContent = ({ publicKey }: { publicKey: PublicKey | null }) => {
  const { data: twitterHandle } = useTwitterHandle(publicKey);
  const [didPerformInitialLoad, setDidPerformInitialLoad] = useState(false);
  const [activityFilter, setActivityFilter] = useState('');
  const [queryActivityPage, activityPage] = useActivityPageLazyQuery();
  const { publicKey: connectedPubkey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
    setDidPerformInitialLoad(true);

    try {
      queryActivityPage({
        variables: {
          address: publicKey.toString(),
        },
      });
    } catch (error: any) {
      console.error(error);
      console.log('faield to query activity for pubkey', publicKey.toString());
      Bugsnag.notify(error);
    }
  }, [publicKey, queryActivityPage]);

  const isLoading = !didPerformInitialLoad || activityPage.loading;

  const hasItems = !!activityPage.data?.wallet?.bids.length;

  const bids = activityPage.data?.wallet?.bids
    .slice()
    .sort(
      (a, b) =>
        DateTime.fromFormat(b.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis() -
        DateTime.fromFormat(a.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis()
    );

  type MyBids = typeof bids;

  const getEndedAuctions = (myBids: MyBids) => {
    if (!myBids?.length) return [];
    const results = myBids.map((myBid) => {
      const latestListingBid = myBid.listing?.bids
        .slice()
        .sort(
          (a, b) =>
            DateTime.fromFormat(b.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis() -
            DateTime.fromFormat(a.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis()
        )?.[0];
      if (!myBid.listing?.ended) {
        return null;
      }
      const didWalletWon = latestListingBid?.bidderAddress === publicKey?.toString();
      const closedDate = latestListingBid?.lastBidTime;
      return {
        ...myBid,
        // Add 1 second to these items to pop them over bids that are too close.
        lastBidTime: DateTime.fromFormat(myBid.lastBidTime, 'yyyy-MM-dd HH:mm:ss')
          .plus({ seconds: 1 })
          .toFormat('yyyy-MM-dd HH:mm:ss'),
        didWalletWon,
        closedDate,
      };
    });
    return results.filter((item) => !!item) as NonNullable<Unpacked<typeof results>>[];
  };

  const getDisplayName = (twitterHandle?: string, pubKey?: PublicKey | null) => {
    console.log('get displayname', { twitterHandle, pubKey, connectedPubkey });
    if (connectedPubkey?.toBase58() === pubKey?.toBase58()) return 'You';
    if (twitterHandle) return twitterHandle;
    if (pubKey) return showFirstAndLastFour(pubKey.toBase58());
    return 'Loading';
  };

  const items = hasItems
    ? [...bids!, ...getEndedAuctions(bids!)]
        .slice()
        .sort(
          (a, b) =>
            DateTime.fromFormat(b.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis() -
            DateTime.fromFormat(a.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis()
        )
    : [];

  const filteredItems = items.filter(
    ({ listing }) =>
      !activityFilter ||
      [
        listing?.storefront?.subdomain,
        listing?.storefront?.title,
        listing?.nfts.map((nft) => nft.name),
      ]
        .flat()
        .some((word) => word?.includes(activityFilter))
  );

  return (
    <ActivityContainer>
      <div className="mb-4 flex flex-1">
        <form className="flex w-full md:ml-0" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              {/* <SearchIcon className="h-5 w-5" aria-hidden="true" /> */}
              <FeatherIcon icon="search" aria-hidden="true" />
            </div>
            <input
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              id="search-field"
              className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="Search"
              type="search"
              name="search"
            />
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
          </>
        ) : hasItems ? (
          <>
            <TextInput2
              id="activity-search"
              label="activity search"
              hideLabel
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              leadingIcon={<FeatherIcon icon="search" aria-hidden="true" />}
            />
            {filteredItems.map((bid, i) => (
              <ActivityBox
                key={i}
                relatedImageUrl={
                  maybeImageCDN(bid.listing?.nfts?.[0]?.image) ??
                  `/images/gradients/gradient-${randomBetween(1, 8)}.png`
                }
                href={`https://${bid.listing?.storefront?.subdomain}.holaplex.com/listings/${bid.listingAddress}`}
                action={
                  <>
                    <ActivityButton
                      href={`https://${bid.listing?.storefront?.subdomain}.holaplex.com/listings/${bid.listingAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </ActivityButton>
                    <ChevronRightContainer>
                      <ChevronRight color="#fff" />
                    </ChevronRightContainer>
                  </>
                }
                content={(() => {
                  if ((bid as any).didWalletWon === true) {
                    return (
                      <ContentCol>
                        <Row>
                          <ItemText>
                            <b>{getDisplayName(twitterHandle, publicKey)}</b> won&nbsp;
                            <b>{bid.listing?.nfts?.[0]?.name}</b>
                            &nbsp;by <b>{bid.listing?.storefront?.title}</b> for{' '}
                            <b>{(bid.lastBidAmount ?? 0) / LAMPORTS_PER_SOL} SOL</b>
                          </ItemText>
                        </Row>
                        <Row style={{ marginTop: 8 }}>
                          <TimeText>
                            {DateTime.fromFormat(
                              bid.lastBidTime,
                              'yyyy-MM-dd HH:mm:ss'
                            ).toRelative()}
                          </TimeText>
                        </Row>
                      </ContentCol>
                    );
                  } else if ((bid as any).didWalletWon === false) {
                    return (
                      <ContentCol>
                        <Row>
                          <ItemText>
                            <b>{getDisplayName(twitterHandle, publicKey)}</b> lost&nbsp;
                            <b>{bid.listing?.nfts?.[0]?.name}</b>
                            &nbsp;by <b>{bid.listing?.storefront?.title}</b>
                          </ItemText>
                        </Row>
                        <Row style={{ marginTop: 8 }}>
                          <TimeText>
                            {DateTime.fromFormat(
                              bid.lastBidTime,
                              'yyyy-MM-dd HH:mm:ss'
                            ).toRelative()}
                          </TimeText>
                        </Row>
                      </ContentCol>
                    );
                  } else {
                    return (
                      <ContentCol>
                        <Row>
                          <ItemText>
                            <b>{getDisplayName(twitterHandle, publicKey)}</b> bid{' '}
                            <b>{(bid.lastBidAmount ?? 0) / LAMPORTS_PER_SOL} SOL</b> on{' '}
                            <b>{bid.listing?.nfts?.[0]?.name}</b>
                            &nbsp;by <b>{bid.listing?.storefront?.title}</b>
                          </ItemText>
                        </Row>
                        <Row style={{ marginTop: 8 }}>
                          <TimeText>
                            {DateTime.fromFormat(
                              bid.lastBidTime,
                              'yyyy-MM-dd HH:mm:ss'
                            ).toRelative()}
                          </TimeText>
                        </Row>
                      </ContentCol>
                    );
                  }
                })()}
              />
            ))}
          </>
        ) : (
          <NoActivityBox />
        )}
      </div>
    </ActivityContainer>
  );
};

const NoActivityBox: FC = () => {
  return (
    <ActivityBoxContainer>
      <NoActivityContainer>
        <NoActivityTitle>No activity</NoActivityTitle>
        <NoActivityText>
          Activity associated with this user’s wallet will show up here
        </NoActivityText>
      </NoActivityContainer>
    </ActivityBoxContainer>
  );
};

const LoadingActivitySkeletonBoxSquareShort = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="4px" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="60%" />
          <LoadingLine $width="25%" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

const LoadingActivitySkeletonBoxCircleLong = () => {
  return (
    <ActivityBoxContainer>
      <CenteredCol>
        <LoadingBox $borderRadius="100%" />
      </CenteredCol>
      <ContentContainer>
        <LoadingLinesContainer>
          <LoadingLine $width="100%" />
          <LoadingLine $width="25%" />
        </LoadingLinesContainer>
      </ContentContainer>
    </ActivityBoxContainer>
  );
};

const LoadingBox = styled.div<{ $borderRadius: '4px' | '100%' }>`
  width: 52px;
  height: 52px;
  background: #707070;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/300% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

const LoadingLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingLine = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 16px;
  background: #707070;
  border-radius: 4px;
  margin-top: 8px;
  -webkit-mask: linear-gradient(-60deg, #000 30%, #000a, #000 70%) right/400% 100%;
  animation: shimmer 2.5s infinite;
  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }
`;

type ActivityBoxProps = {
  relatedImageUrl: string;
  content: React.ReactElement;
  action: React.ReactElement;
  href: string;
  isPFPImage?: boolean;
};

const ActivityBox: FC<ActivityBoxProps> = ({
  relatedImageUrl,
  action,
  content,
  href,
  isPFPImage = false,
}) => {
  return (
    <>
      <ShowOnMobile display="block">
        <Link href={href} passHref>
          <a>
            <ActivityBoxContainer>
              <CenteredCol>
                <NFTImage
                  unoptimized
                  $isPFPImage={isPFPImage}
                  width={52}
                  height={52}
                  src={relatedImageUrl}
                />
              </CenteredCol>
              <ContentContainer>{content}</ContentContainer>
              <CenteredCol>{action}</CenteredCol>
            </ActivityBoxContainer>
          </a>
        </Link>
      </ShowOnMobile>
      <HideOnMobile display="block">
        <ActivityBoxContainer>
          <CenteredCol>
            <NFTImage
              unoptimized
              $isPFPImage={isPFPImage}
              width={52}
              height={52}
              src={relatedImageUrl}
            />
          </CenteredCol>
          <ContentContainer>{content}</ContentContainer>
          <CenteredCol>{action}</CenteredCol>
        </ActivityBoxContainer>
      </HideOnMobile>
    </>
  );
};

const ShowOnMobile = styled.div<{ display: string }>`
  display: ${(props) => props.display};
  ${mq('sm')} {
    display: none;
  }
`;

const HideOnMobile = styled.div<{ display: string }>`
  display: none;
  ${mq('sm')} {
    display: ${(props) => props.display};
  }
`;

const ChevronRightContainer = styled.div`
  display: flex;
  align-items: center;
  ${mq('sm')} {
    display: none;
  }
`;

const ActivityButton = styled(AnchorButton)`
  display: none;
  ${mq('sm')} {
    display: inline-flex;
  }
`;

const NoActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NoActivityTitle = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
`;

const NoActivityText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #a8a8a8;
  margin-top: 8px;
  text-align: center;
`;

const ActivityContainer = styled.main`
  flex: 1;
  margin-top: 16px;
  ${mq('lg')} {
    margin-top: 0px;
    margin-left: 40px;
  }
  ${mq('xl')} {
    margin-left: 80px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  margin-left: 16px;
  margin-right: 16px;
`;

const CenteredCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentCol = styled(CenteredCol)`
  height: 100%;
  justify-content: center;
`;

const ActivityBoxContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  border: 1px solid #262626;
  box-sizing: border-box;
  border-radius: 8px;
`;

const NFTImage = styled(Image)<{ $isPFPImage: boolean }>`
  object-fit: contain;
  ${({ $isPFPImage }) =>
    $isPFPImage
      ? css`
          border-radius: 50%;
        `
      : css`
          border-radius: 2px;
        `}
`;

const TimeText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #707070;
`;

const ItemText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;
