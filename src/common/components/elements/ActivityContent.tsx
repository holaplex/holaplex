import { FC, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Button from '@/components/elements/Button';
import { Col, Row } from 'antd';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useActivityPageLazyQuery } from 'src/graphql/indexerTypes';

export const ActivityContent = () => {
  const { publicKey } = useWallet();
  const [queryActivityPage, activityPage] = useActivityPageLazyQuery();
  useEffect(() => {
    if (!publicKey) return;
    queryActivityPage({
      variables: {
        address: publicKey.toString(),
      },
    });
  }, [publicKey, queryActivityPage]);

  const hasItems = !!activityPage.data?.wallet?.bids.length;

  // TODO: Implement listing.

  return (
    <ActivityContainer>
      <ActivityBox
        disableMarginTop
        relatedImageUrl="/images/gradients/gradient-1.png"
        action={<ActivityButton>Claim NFT</ActivityButton>}
        content={
          <ContentCol>
            <Row>
              <ItemText>
                Congratulations! You won <b>BOOGLE Recovery</b> by <b>BOOGLE</b> for <b>1800 SOL</b>
              </ItemText>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <TimeText>Just now</TimeText>
            </Row>
          </ContentCol>
        }
      />
      <ActivityBox
        relatedImageUrl="/images/gradients/gradient-2.png"
        action={<ActivityButton>Redeem bid</ActivityButton>}
        content={
          <ContentCol>
            <Row>
              <ItemText>
                The auction for <b>Flying Witches of Velacruz</b> by <b>Sleepr</b> has ended at{' '}
                <b>15 SOL</b>
              </ItemText>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <TimeText>2 hours ago</TimeText>
            </Row>
          </ContentCol>
        }
      />
      <ActivityBox
        isPFPImage
        relatedImageUrl="/images/gradients/gradient-4.png"
        action={<ActivityButton>View</ActivityButton>}
        content={
          <ContentCol>
            <Row>
              <ItemText>
                You were outbid by Feik...8j01 on <b>The Firstborn</b> by <b>The Chimpions</b>
              </ItemText>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <TimeText>6 hours ago</TimeText>
            </Row>
          </ContentCol>
        }
      />
      <ActivityBox
        isPFPImage
        relatedImageUrl="/images/gradients/gradient-3.png"
        action={<ActivityButton>View</ActivityButton>}
        content={
          <ContentCol>
            <Row>
              <ItemText>
                You placed a bid of <b>5 SOL</b> on <b>The Firstborn</b> by <b>The Chimpions</b>
              </ItemText>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <TimeText>8 hours ago</TimeText>
            </Row>
          </ContentCol>
        }
      />
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
        <NFTImage isPFPImage={isPFPImage} width={52} height={52} src={relatedImageUrl} />
      </CenteredCol>
      <ContentContainer>{content}</ContentContainer>
      <CenteredCol>{action}</CenteredCol>
    </ActivityBoxContainer>
  );
};

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

const ActivityButton = styled(Button)`
  width: 88px;
  height: 32px;
  border-radius: 16px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #171717;
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
