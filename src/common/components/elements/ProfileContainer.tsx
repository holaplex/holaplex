import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { mq } from '@/common/styles/MediaQuery';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { FollowerCount } from './FollowerCount';
import { FollowModal, FollowModalVisibility } from './FollowModal';
import { shortenAddress } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';
import { useProfileData, asProfile } from '@/common/context/ProfileData';
import { CenteredContentCol } from 'pages';

export const ProfileContainer: FC = ({ children }) => {
  const profileData = useProfileData();
  const { banner, profilePicture } = profileData;

  const [showFollowsModal, setShowFollowsModal] = useState<FollowModalVisibility>('hidden');
  const anchorWallet = useAnchorWallet();

  return (
    <div>
      <header>
        <Banner className="h-40 md:h-64 " style={{ backgroundImage: `url(${banner})` }} />
      </header>
      <CenteredContentCol className="flex">
        <div className="relative md:sticky md:top-24 md:h-96 md:w-full md:max-w-xs ">
          <div className="-mt-12 flex justify-center md:justify-start">
            <ProfilePicture
              src={profilePicture}
              className="bg-gray-900"
              width={PFP_SIZE}
              height={PFP_SIZE}
            />
          </div>
          <div className="mt-10 flex justify-center  md:justify-start">
            <ProfileDisplayName />
          </div>
          <FollowerCount
            profile={asProfile(profileData)}
            setShowFollowsModal={setShowFollowsModal}
          />
        </div>
        <ContentWrapper>
          <ProfileMenu />
          {children}
        </ContentWrapper>
        {anchorWallet ? (
          <FollowModal
            visibility={showFollowsModal}
            setVisibility={setShowFollowsModal}
            profile={asProfile(profileData)}
            wallet={anchorWallet}
          />
        ) : null}
      </CenteredContentCol>
    </div>
  );
};

const ProfileDisplayName: FC = () => {
  const { publicKey, twitterHandle } = useProfileData();

  const [copied, setCopeied] = useState(false);
  const copyPubKey = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopeied(true);
      setTimeout(() => setCopeied(false), 2000);
    }
  };

  return (
    <div className="flex items-center text-2xl font-medium">
      {twitterHandle ? (
        <a
          className="hover:text-gray-300"
          target="_blank"
          href={'https://www.twitter.com/' + twitterHandle}
          rel="noreferrer"
        >
          @{twitterHandle}
        </a>
      ) : (
        <span className="font-mono ">{shortenAddress(publicKey)}</span>
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
