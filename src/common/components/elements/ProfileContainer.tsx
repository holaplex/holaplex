import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { mq } from '@/common/styles/MediaQuery';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConnectTwitterButton, WalletIdentityProvider } from '@cardinal/namespaces-components';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { FollowerCount } from './FollowerCount';
import { FollowModal, FollowModalVisibility } from './FollowModal';
import { shortenAddress } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';
import { useProfileData, asProfile } from '@/common/context/ProfileData';
import { CenteredContentCol } from 'pages';
import Footer from '../home/Footer';

export const ProfileContainer: FC = ({ children }) => {
  const profileData = useProfileData();
  const { banner, profilePicture } = profileData;

  const [showFollowsModal, setShowFollowsModal] = useState<FollowModalVisibility>('hidden');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  return (
    <WalletIdentityProvider
    appName="Holaplex"
    appTwitter="@holaplex"
  >
    <div>
      <header>
        <Banner className='h-40 md:h-64 ' style={{ backgroundImage: `url(${banner})` }} />
      </header>
      <CenteredContentCol className='lg:flex'>
        <div className='relative lg:sticky lg:top-24 lg:h-96 lg:w-full lg:max-w-xs '>
          <div className='flex flex-row justify-center -mt-12 lg:justify-start'>
            <div>
            <ProfilePicture
              src={profilePicture}
              className='bg-gray-900'
              width={PFP_SIZE}
              height={PFP_SIZE}
            />
            </div>
            <div className='mt-[70px] ml-4 grow'>
            { anchorWallet?.publicKey.toString() == profileData.publicKey.toString()  && 
            <ConnectTwitterButton
              address={new PublicKey(profileData.publicKey)}
              connection={connection}
              wallet={anchorWallet}
              cluster={"mainnet-beta"}
              variant={"secondary"}
              style={{"background": "rgb(33,33,33)", "height":"37px", "borderRadius": "18px"}}
            />}
            </div>
          </div>
          <div className='flex justify-center mt-10 lg:justify-start'>
            <ProfileDisplayName />
          </div>
          <FollowerCount
            profile={asProfile(profileData)}
            setShowFollowsModal={setShowFollowsModal}
          />
        </div>
        <div className='w-full mt-10'>
          <ProfileMenu />
          {children}
        </div>
        {anchorWallet ? (
          <FollowModal
            visibility={showFollowsModal}
            setVisibility={setShowFollowsModal}
            profile={asProfile(profileData)}
            wallet={anchorWallet}
          />
        ) : null}
      </CenteredContentCol>
      <Footer />
    </div>
    </WalletIdentityProvider>
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
    <div className='flex items-center text-2xl font-medium'>
      {twitterHandle ? (
        <a
          className='hover:text-gray-300'
          target='_blank'
          href={'https://www.twitter.com/' + twitterHandle}
          rel='noreferrer'
        >
          @{twitterHandle}
        </a>
      ) : (
        <span className='font-mono '>{shortenAddress(publicKey)}</span>
      )}
      {copied ? (
        <CheckIcon className='ml-4 h-7 w-7 hover:text-gray-300' />
      ) : (
        <DuplicateIcon
          className='ml-4 cursor-pointer h-7 w-7 hover:text-gray-300'
          onClick={copyPubKey}
        />
      )}
    </div>
  );
};

export const PFP_SIZE = 100;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
  border: 5px solid #161616 !important;
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
