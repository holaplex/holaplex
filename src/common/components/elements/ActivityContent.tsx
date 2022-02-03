import { FC, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Button, { ButtonV2 } from '@/components/elements/Button';
import { Col, Row } from 'antd';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useActivityPageLazyQuery } from 'src/graphql/indexerTypes';
import { DateTime } from 'luxon';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { showFirstAndLastFour } from '@/modules/utils/string';

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const ActivityContent = ({ publicKey }: { publicKey: PublicKey | null }) => {
  const { data: twitterHandle } = useTwitterHandle(publicKey);

  const [queryActivityPage, activityPage] = useActivityPageLazyQuery();
  useEffect(() => {
    if (!publicKey) return;
    queryActivityPage({
      variables: {
        address: publicKey.toString(),
      },
    });
  }, [publicKey, queryActivityPage]);

  const isLoading = activityPage.loading;

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
    return myBids.map((myBid) => {
      const latestListingBid = myBid.listing?.bids
        .slice()
        .sort(
          (a, b) =>
            DateTime.fromFormat(b.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis() -
            DateTime.fromFormat(a.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toMillis()
        )?.[0];
      const didWalletWon =
        !!myBid.listing?.ended && latestListingBid?.bidderAddress === publicKey?.toString();
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
  };

  const getDisplayName = (twitterHandle?: string, pubKey?: PublicKey | null) => {
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

  return (
    <ActivityContainer>
      {isLoading ? (
        <div>Loading...</div>
      ) : hasItems ? (
        <>
          {items.map((bid, i) => (
            <ActivityBox
              key={i}
              disableMarginTop={i === 0}
              relatedImageUrl={
                bid.listing?.nfts?.[0]?.image ??
                `/images/gradients/gradient-${randomBetween(1, 8)}.png`
              }
              action={
                <ButtonV2
                  onClick={() => {
                    window.open(
                      `https://${bid.listing?.storefront?.subdomain}.holaplex.com/listings/${bid.listingAddress}`,
                      '_blank'
                    );
                  }}
                >
                  View
                </ButtonV2>
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
                          {DateTime.fromFormat(bid.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toRelative()}
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
                          {DateTime.fromFormat(bid.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toRelative()}
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
                          {DateTime.fromFormat(bid.lastBidTime, 'yyyy-MM-dd HH:mm:ss').toRelative()}
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
    </ActivityContainer>
  );
};

type ActivityBoxProps = {
  relatedImageUrl: string;
  content: React.ReactElement;
  action: React.ReactElement;
  isPFPImage?: boolean;
  disableMarginTop?: boolean;
};

const NoActivityBox: FC = () => {
  return (
    <ActivityBoxContainer disableMarginTop>
      <NoActivityContainer>
        <NoActivityTitle>No activity</NoActivityTitle>
        <NoActivityText>
          Activity associated with this user’s wallet will show up here
        </NoActivityText>
      </NoActivityContainer>
    </ActivityBoxContainer>
  );
};

const ActivityBox: FC<ActivityBoxProps> = ({
  relatedImageUrl,
  action,
  content,
  isPFPImage = false,
  disableMarginTop = false,
}) => {
  return (
    <ActivityBoxContainer disableMarginTop={disableMarginTop}>
      <CenteredCol>
        <NFTImage
          unoptimized
          isPFPImage={isPFPImage}
          width={52}
          height={52}
          src={relatedImageUrl}
        />
      </CenteredCol>
      <ContentContainer>{content}</ContentContainer>
      <CenteredCol>{action}</CenteredCol>
    </ActivityBoxContainer>
  );
};

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
  margin-left: 80px;
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

const ActivityBoxContainer = styled(Row)<{ disableMarginTop: boolean }>`
  display: flex;
  flex: 1;
  padding: 10px;
  border: 1px solid #262626;
  box-sizing: border-box;
  border-radius: 8px;
  ${({ disableMarginTop }) =>
    disableMarginTop
      ? css`
          margin-top: 0;
        `
      : css`
          margin-top: 16px;
        `}
`;

const NFTImage = styled(Image)<{ isPFPImage: boolean }>`
  object-fit: contain;
  ${({ isPFPImage }) =>
    isPFPImage
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
