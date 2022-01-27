import { useAppHeaderSettings } from '@/common/components/elements/AppHeaderSettingsProvider';
import { WalletLabel, WalletPill } from '@/common/components/elements/WalletIndicator';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ActivityLanding = () => {
  const { connected } = useWallet();
  const { toggleDisableMarginBottom } = useAppHeaderSettings();
  const [didToggleDisableMarginBottom, setDidToggleDisableMarginBottom] = useState(false);

  useEffect(() => {
    if (!didToggleDisableMarginBottom) {
      setDidToggleDisableMarginBottom(true);
      toggleDisableMarginBottom();
    }
  }, [didToggleDisableMarginBottom, toggleDisableMarginBottom]);

  const bannerBackgroundImage = 'url(/images/gradients/gradient-5.png);';
  const profilePictureImage = 'url(/images/gradients/gradient-3.png);';

  return (
    <>
      <HeadingContainer>
        <Banner style={{ backgroundImage: bannerBackgroundImage }}>
          <InnerBanner>
            <ProfilePicture style={{ backgroundImage: profilePictureImage }} />
          </InnerBanner>
        </Banner>
      </HeadingContainer>
      <ContentCol>
        <Profile>
          <WalletPill />
          <SecondaryCol>
            <SolAmount>{connected ? '# SOL' : 'Balance'}</SolAmount>
            <SpacedRow>
              <WalletLabel />
              <DisconnectText>{connected ? 'Disconnect' : 'Connect'}</DisconnectText>
            </SpacedRow>
          </SecondaryCol>
        </Profile>
      </ContentCol>
    </>
  );
};

export default ActivityLanding;

const PFP_SIZE = 90;
const BOX_SIZE = 1400;

const DisconnectText = styled.button`
  ${ButtonReset}
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;

const SpacedRow = styled(Row)`
  margin-top: 8px;
  justify-content: space-between;
`;

const SecondaryCol = styled(Col)`
  margin-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
`;

const SolAmount = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;

const Profile = styled.div`
  margin-top: 80px;
  width: 385px;
`;

const ContentCol = styled(Col)`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${PFP_SIZE}px;
  padding-right: ${PFP_SIZE}px;
  max-width: ${BOX_SIZE}px;
`;

const HeadingContainer = styled.header`
  position: relative;
  margin-bottom: ${PFP_SIZE / 2}px;
`;

const ProfilePicture = styled.div`
  width: ${PFP_SIZE}px;
  height: ${PFP_SIZE}px;
  border-radius: 50%;
  border: 5px solid #161616;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  bottom: -${PFP_SIZE / 2}px;
  left: 90px;
  @media (min-width: ${BOX_SIZE - PFP_SIZE}) {
    left: 0px;
  }
`;

const Banner = styled.div`
  width: 100%;
  height: 265px;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  margin-bottom: ${PFP_SIZE / 2}px;
`;

const InnerBanner = styled.div`
  position: relative;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
`;
