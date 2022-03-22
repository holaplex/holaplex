import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { WalletPill } from '@/common/components/elements/WalletIndicator';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { mq } from '@/common/styles/MediaQuery';
import { getBannerFromPublicKey, getPFPFromPublicKey } from '@/modules/utils/image';
import Bugsnag from '@bugsnag/js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import styled from 'styled-components';
import { FollowerCount } from './FollowerCount';
import { FollowModal } from './FollowModal';

interface Props {
  children: React.ReactNode;
  wallet: string;
  publicKey: PublicKey | null;
}

export const ProfileContainer: FC<Props> = ({ children, wallet, publicKey }) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const bannerUrl = walletProfile.data?.profile?.bannerImageUrl;
  const imageUrl = walletProfile.data?.profile?.profileImageUrlHighres?.replace('_normal', '');
  const { data: twitterHandle } = useTwitterHandle(publicKey);
  const [showFollowsModal, setShowFollowsModal] = useState<'hidden' | 'followers' | 'following'>(
    'hidden'
  );
  const anchorWallet = useAnchorWallet();

  const [{ pfp, banner }, setPfpAndBanner] = useState({
    pfp: getPFPFromPublicKey(publicKey),
    banner: `url(${getBannerFromPublicKey(publicKey)})`,
  });

  useEffect(() => {
    try {
      queryWalletProfile({
        variables: {
          handle: twitterHandle ?? '',
        },
      });
    } catch (error: any) {
      console.error(error);
      console.log('failed to fetch wallet');
      Bugsnag.notify(error);
    }
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {
    const profilePictureImage = imageUrl ?? getPFPFromPublicKey(publicKey);
    const bannerBackgroundImage = !!bannerUrl
      ? `url(${bannerUrl})`
      : `url(${getBannerFromPublicKey(publicKey)})`;

    setPfpAndBanner({
      pfp: profilePictureImage,
      banner: bannerBackgroundImage,
    });
  }, [imageUrl, bannerUrl, publicKey]);

  const getPublicKeyFromWalletOnUrl = () => {
    try {
      return new PublicKey(wallet);
    } catch (_) {
      return null;
    }
  };

  return (
    <>
      <HeadingContainer>
        <Banner className="h-40 md:h-64 " style={{ backgroundImage: banner }} />
      </HeadingContainer>
      <ContentCol>
        <div className="relative md:sticky md:top-24 md:h-96 md:w-full md:max-w-xs ">
          <ProfilePictureContainer>
            <ProfilePicture src={pfp} width={PFP_SIZE} height={PFP_SIZE} />
          </ProfilePictureContainer>
          <WalletPillContainer>
            <WalletPill
              disableBackground
              disableLink
              textOverride={twitterHandle ? `${twitterHandle}` : null}
              publicKey={getPublicKeyFromWalletOnUrl()}
            />
          </WalletPillContainer>
          <FollowerCount pubKey={wallet} setShowFollowsModal={setShowFollowsModal} />
        </div>
        <ContentWrapper>
          <ProfileMenu wallet={wallet} />
          {children}
        </ContentWrapper>
        {anchorWallet && (
          <FollowModal
            visibility={showFollowsModal}
            setVisibility={setShowFollowsModal}
            pubKey={wallet}
            wallet={anchorWallet}
          />
        )}
      </ContentCol>
    </>
  );
};

export const PFP_SIZE = 90;
const BOX_SIZE = 1400;

const ProfilePictureContainer = styled.div`
  position: absolute;
  top: ${-PFP_SIZE / 2}px;
  @media (min-width: ${BOX_SIZE - PFP_SIZE}) {
    left: 0px;
  }
`;

const ContentWrapper = styled.section`
  margin-top: ${PFP_SIZE / 2}px;
  width: 100%;
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
  border: 5px solid #161616 !important;
`;

const ContentCol = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;
  ${mq('md')} {
    padding-left: ${PFP_SIZE - 40}px;
    padding-right: ${PFP_SIZE - 40}px;
    max-width: ${BOX_SIZE}px;
    flex-direction: row;
  }
  ${mq('lg')} {
    padding-left: ${PFP_SIZE - 20}px;
    padding-right: ${PFP_SIZE - 20}px;
  }
`;

const Banner = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;

  ${mq('lg')} {
    background-attachment: fixed;
    background-size: 100%;
  }
`;

const WalletPillContainer = styled.div`
  margin-top: 80px;
`;

const HeadingContainer = styled.header``;
