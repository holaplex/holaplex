import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { testData } from '@/common/components/elements/test-nft-data';
import { WalletPill } from '@/common/components/elements/WalletIndicator';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { mq } from '@/common/styles/MediaQuery';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  wallet: string;
  publicKey: PublicKey | null;
}

export const ProfileContainer: FC<Props> = ({ children, wallet, publicKey }) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const bannerUrl = walletProfile.data?.profile?.bannerImageUrl;
  const imageUrl = walletProfile.data?.profile?.profileImageUrlHighres?.replace('_normal', '');
  const bannerBackgroundImage = !!bannerUrl
    ? `url(${bannerUrl})`
    : 'url(/images/gradients/gradient-5.png)'; // TODO: Fetch from wallet (DERIVE).
  const profilePictureImage = imageUrl ?? '/images/gradients/gradient-3.png'; // TODO: Fetch from wallet [here-too] (DERIVE).
  const { data: twitterHandle } = useTwitterHandle(publicKey);
  const router = useRouter();

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  const getPublicKeyFromWalletOnUrl = () => {
    try {
      return new PublicKey(wallet as string);
    } catch (_) {
      return null;
    }
  };

  return (
    <>
      <HeadingContainer>
        <Banner style={{ backgroundImage: bannerBackgroundImage }} />
      </HeadingContainer>
      <ContentCol>
        <Profile>
          <ProfilePictureContainer>
            <ProfilePicture src={profilePictureImage} width={PFP_SIZE} height={PFP_SIZE} />
          </ProfilePictureContainer>
          <WalletPillContainer>
            <WalletPill
              disableBackground
              disableLink
              textOverride={twitterHandle ? `@${twitterHandle}` : null}
              publicKey={getPublicKeyFromWalletOnUrl()}
            />
          </WalletPillContainer>
        </Profile>
        <ContentWrapper>
          <ProfileMenu wallet={wallet} />
          {children}
        </ContentWrapper>
      </ContentCol>
    </>
  );
};

export const PFP_SIZE = 90;
const BOX_SIZE = 1400;

const ProfilePictureContainer = styled.div`
  position: absolute;
  top: ${-PFP_SIZE / 2}px;
  left: 20px;
  ${mq('md')} {
    left: 90px;
  }
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
  height: 265px;
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

const Profile = styled.div`
  padding-left: calc(20px + 0.5rem);
  min-width: 348px;
  position: relative;
  ${mq('md')} {
    padding-left: calc(${PFP_SIZE}px + 0.5rem);
  }
`;
const HeadingContainer = styled.header``;
