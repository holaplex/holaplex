import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Image from 'next/image';
import { useAppHeaderSettings } from '@/common/components/elements/AppHeaderSettingsProvider';
import { MiniWallet } from '@/common/components/elements/MiniWallet';
import { WalletPill } from '@/common/components/elements/WalletIndicator';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { gql } from '@apollo/client';

const GetWalletInformationQuery = gql`
  query getWalletInformation {
  }
`;

const ActivityLanding = () => {
  const { toggleDisableMarginBottom } = useAppHeaderSettings();
  const [didToggleDisableMarginBottom, setDidToggleDisableMarginBottom] = useState(false);

  useEffect(() => {
    if (!didToggleDisableMarginBottom) {
      setDidToggleDisableMarginBottom(true);
      toggleDisableMarginBottom();
    }
  }, [didToggleDisableMarginBottom, toggleDisableMarginBottom]);

  const bannerBackgroundImage = 'url(/images/gradients/gradient-5.png)';
  const profilePictureImage = '/images/gradients/gradient-3.png';

  return (
    <>
      <HeadingContainer>
        <Banner style={{ backgroundImage: bannerBackgroundImage }}>
          <InnerBanner>
            <ProfilePictureContainer>
              <ProfilePicture src={profilePictureImage} width={PFP_SIZE} height={PFP_SIZE} />
            </ProfilePictureContainer>
          </InnerBanner>
        </Banner>
      </HeadingContainer>
      <ContentCol>
        <Profile>
          <WalletPill />
          <MiniWalletContainer>
            <MiniWallet />
          </MiniWalletContainer>
        </Profile>
        <ActivityContent />
      </ContentCol>
    </>
  );
};

export default ActivityLanding;

const PFP_SIZE = 90;
const BOX_SIZE = 1400;

const MiniWalletContainer = styled.div`
  margin-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Profile = styled.div`
  margin-top: 40px;
  min-width: 385px;
`;

const ContentCol = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${PFP_SIZE}px;
  padding-right: ${PFP_SIZE}px;
  max-width: ${BOX_SIZE}px;
  display: flex;
`;

const HeadingContainer = styled.header`
  position: relative;
  margin-bottom: ${PFP_SIZE / 2}px;
`;

const ProfilePictureContainer = styled.div`
  position: absolute;
  bottom: -${PFP_SIZE / 2 + 10}px;
  left: 90px;
  @media (min-width: ${BOX_SIZE - PFP_SIZE}) {
    left: 0px;
  }
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
  border: 5px solid #161616 !important;
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
