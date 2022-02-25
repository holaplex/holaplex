import { WalletPill } from '@/common/components/elements/WalletIndicator';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { mq } from '@/common/styles/MediaQuery';
import { seededRandomBetween } from '@/modules/utils/random';
import Bugsnag from '@bugsnag/js';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import styled from 'styled-components';
import { ButtonV2 } from './Button';
import { FollowerCount } from './FollowerCount';

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
  const seed = publicKey?.toBytes()?.reduce((a, b) => a + b, 0) ?? 0;
  const [{ pfp, banner }, setPfpAndBanner] = useState({
    pfp: `/images/gradients/gradient-${seededRandomBetween(seed, 1, 8)}.png`,
    banner: `url(/images/gradients/gradient-${seededRandomBetween(seed + 1, 1, 8)}.png)`, // TODO: Fetch from wallet (DERIVE)
  });

  useEffect(() => {
    if (!twitterHandle) return;
    try {
      queryWalletProfile({
        variables: {
          handle: twitterHandle,
        },
      });
    } catch (error: any) {
      console.error(error);
      console.log('failed to fetch wallet');
      Bugsnag.notify(error);
    }
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {
    const profilePictureImage =
      imageUrl ?? `/images/gradients/gradient-${seededRandomBetween(seed, 1, 8)}.png`; // TODO: Fetch from wallet [here-too] (DERIVE).
    const bannerBackgroundImage = !!bannerUrl
      ? `url(${bannerUrl})`
      : `url(/images/gradients/gradient-${seededRandomBetween(seed + 1, 1, 8)}.png)`; // TODO: Fetch from wallet (DERIVE).

    setPfpAndBanner({
      pfp: profilePictureImage,
      banner: bannerBackgroundImage,
    });
  }, [imageUrl, bannerUrl, seed]);

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
        <Banner style={{ backgroundImage: banner }} />
      </HeadingContainer>
      <ContentCol>
        <Profile>
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
          <FollowerCount pubKey={wallet} />
        </Profile>
        <ContentWrapper>{children}</ContentWrapper>
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

const HeadingContainer = styled.header``;

const Profile = styled.div`
  min-width: 348px;
  position: relative;
`;
