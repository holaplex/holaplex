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
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { shortenAddress } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';

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
        {/* <Image
          className="h-40 object-cover md:h-64"
          alt="banner"
          src={'/' + banner}
          layout="fill"
        /> */}
      </HeadingContainer>
      <ContentCol>
        <div className="relative md:sticky md:top-24 md:h-96 md:w-full md:max-w-xs ">
          {/* <ProfilePictureContainer>
            <ProfilePicture src={pfp} className="bg-gray-900" width={PFP_SIZE} height={PFP_SIZE} />
          </ProfilePictureContainer> */}
          <div className="-mt-12 flex justify-center md:justify-start">
            <ProfilePicture src={pfp} className="bg-gray-900" width={PFP_SIZE} height={PFP_SIZE} />
            {/* <div className="rounded-full !border-4 !border-gray-100">
              <Image
                src={pfp}
                alt="profile picture"
                className="rounded-full !border-4 !border-gray-100 bg-gray-900"
                width={PFP_SIZE}
                height={PFP_SIZE}
              />
            </div> */}
          </div>
          <div className="mt-10 flex justify-center  md:justify-start">
            {/* <WalletPill
              disableBackground
              disableLink
              textOverride={twitterHandle ? `${twitterHandle}` : null}
              publicKey={getPublicKeyFromWalletOnUrl()}
            /> */}
            <ProfileDisplayName
              publicKey={getPublicKeyFromWalletOnUrl()}
              twitterHandle={twitterHandle}
            />
          </div>
          <FollowerCount pubKey={wallet} setShowFollowsModal={setShowFollowsModal} />
        </div>
        <ContentWrapper>
          <ProfileMenu wallet={wallet} />
          {children}
        </ContentWrapper>
        {anchorWallet ? (
          <FollowModal
            visibility={showFollowsModal}
            setVisibility={setShowFollowsModal}
            pubKey={wallet}
            wallet={anchorWallet}
          />
        ) : null}
      </ContentCol>
    </>
  );
};

const ProfileDisplayName = (props: { publicKey: PublicKey | null; twitterHandle?: string }) => {
  const pubkey = props.publicKey?.toBase58();

  const [copied, setCopeied] = useState(false);
  const copyPubKey = async () => {
    if (pubkey) {
      await navigator.clipboard.writeText(pubkey);
      setCopeied(true);
      setTimeout(() => setCopeied(false), 2000);
    }
  };

  return (
    <div className="flex items-center text-2xl font-medium">
      {props.twitterHandle ? (
        <a
          className="hover:text-gray-300"
          target="_blank"
          href={'https://www.twitter.com/' + props.twitterHandle}
          rel="noreferrer"
        >
          @{props.twitterHandle}
        </a>
      ) : (
        <span className="font-mono ">{shortenAddress(pubkey)}</span>
      )}
      {copied ? (
        <CheckIcon className="ml-4 h-7 w-7  hover:text-gray-300" />
      ) : (
        <DuplicateIcon
          className="ml-4 h-7 w-7 cursor-pointer  hover:text-gray-300"
          onClick={copyPubKey}
        />
      )}
    </div>
  );
};

export const PFP_SIZE = 100;
const BOX_SIZE = 1400;

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

const HeadingContainer = styled.header``;
