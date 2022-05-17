import { ProfileMenu } from '@/common/components/elements/ProfileMenu';
import { mq } from '@/common/styles/MediaQuery';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConnectTwitterButton, WalletIdentityProvider } from '@cardinal/namespaces-components';
import { PublicKey } from '@solana/web3.js';

import { FC, useState } from 'react';
import styled from 'styled-components';
import { FollowerCount } from './FollowerCount';
import { FollowModal, FollowModalVisibility } from './FollowModal';
import { shortenAddress } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';
import { useProfileData } from '@/common/context/ProfileData';

export const ProfileContainer: FC = ({ children }) => {
  const profileData = useProfileData();
  const { banner, profilePicture, twitterHandle } = profileData;

  const [showFollowsModal, setShowFollowsModal] = useState<FollowModalVisibility>('hidden');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  return (
    <WalletIdentityProvider appName="Holaplex" appTwitter="@holaplex">
      <div>
        <header>
          <Banner className="h-40 md:h-64 " style={{ backgroundImage: `url(${banner})` }} />
        </header>
        <div className="container  mx-auto px-6 pb-20 md:px-12 lg:flex">
          <div className="relative lg:sticky lg:top-24 lg:h-96 lg:w-full lg:max-w-xs ">
            <div className="-mt-12 flex justify-center text-center lg:justify-start">
              <div className=" max-w-fit rounded-full border-4 border-gray-900 ">
                <img
                  src={profilePicture}
                  // imgOpt(, 400)
                  className="h-24 w-24 rounded-full  bg-gray-900 "
                  alt="profile picture"
                />
              </div>
            </div>
            <div className="mt-2 flex justify-center lg:justify-start">
              {anchorWallet?.publicKey.toString() == profileData.publicKey.toString() &&
                !twitterHandle && (
                  <ConnectTwitterButton
                    address={new PublicKey(profileData.publicKey)}
                    connection={connection}
                    wallet={anchorWallet}
                    cluster={'mainnet-beta'}
                    variant={'secondary'}
                    style={{ background: 'rgb(33,33,33)', height: '37px', borderRadius: '18px' }}
                  />
                )}
            </div>
            <div className="mt-10 flex justify-center lg:justify-start">
              <ProfileDisplayName />
            </div>
            <FollowerCount setShowFollowsModal={setShowFollowsModal} />
          </div>
          <div className="mt-10 w-full">
            <ProfileMenu />
            {children}
          </div>
          <FollowModal
            wallet={anchorWallet}
            visibility={showFollowsModal}
            setVisibility={setShowFollowsModal}
          />
        </div>
        {/* <Footer /> */}
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
        <CheckIcon className="ml-4 h-7 w-7 hover:text-gray-300" />
      ) : (
        <DuplicateIcon
          className="ml-4 h-7 w-7 cursor-pointer hover:text-gray-300"
          onClick={copyPubKey}
        />
      )}
    </div>
  );
};

export const PFP_SIZE = 100;

const Banner = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  ${mq('lg')} {
    background-size: 100%;
  }
`;
