import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Image from 'next/image';
import { useAppHeaderSettings } from '@/common/components/elements/AppHeaderSettingsProvider';
import { WalletPill } from '@/common/components/elements/WalletIndicator';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { useRouter } from 'next/router';
import { PublicKey } from '@solana/web3.js';

const ActivityLanding = () => {
  const router = useRouter();
  const { wallet } = router.query;
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  const { toggleDisableMarginBottom } = useAppHeaderSettings();
  const [didToggleDisableMarginBottom, setDidToggleDisableMarginBottom] = useState(false);
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const { data: twitterHandle } = useTwitterHandle(publicKey);

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {
    if (!didToggleDisableMarginBottom) {
      setDidToggleDisableMarginBottom(true);
      toggleDisableMarginBottom();
    }
  }, [didToggleDisableMarginBottom, toggleDisableMarginBottom]);

  const bannerUrl = walletProfile.data?.profile?.bannerImageUrl;
  const imageUrl = walletProfile.data?.profile?.profileImageUrlHighres;
  const textOverride = twitterHandle;

  const bannerBackgroundImage = !!bannerUrl
    ? `url(${bannerUrl})`
    : 'url(/images/gradients/gradient-5.png)'; // TODO: Fetch from wallet (DERIVE).
  const profilePictureImage = imageUrl ?? '/images/gradients/gradient-3.png'; // TODO: Fetch from wallet [here-too] (DERIVE).

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
          <WalletPill disableBackground textOverride={textOverride} />
        </Profile>
        <ActivityContent publicKey={publicKey} />
      </ContentCol>
    </>
  );
};

export default ActivityLanding;

const PFP_SIZE = 90;
const BOX_SIZE = 1400;

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
  background-size: 100%;
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
