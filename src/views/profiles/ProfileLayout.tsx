import { ProfileMenu } from 'src/components/ProfileMenu';
import { mq } from '@/assets/styles/MediaQuery';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ConnectTwitterButton, WalletIdentityProvider } from '@cardinal/namespaces-components';
import { PublicKey } from '@solana/web3.js';

import { FC, useState } from 'react';
import styled from 'styled-components';

import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { DuplicateIcon, CheckIcon } from '@heroicons/react/outline';
import { useProfileData } from 'src/views/profiles/ProfileDataProvider';
import { FollowerCount } from './FollowerCount';
import { FollowModal, FollowModalVisibility } from './FollowModal';
import { WalletDependantPageProps } from './getProfileServerSideProps';
import Head from 'next/head';
import Link from 'next/link';
import MessagesIcon from 'src/assets/icons/MessagesIcon';
import { FollowUnfollowButtonDataWrapper } from '@/components/ProfilePreviewCard';

const ProfilePageHead = (props: {
  publicKey: string;
  twitterProfile?: {
    twitterHandle?: string | null;
    pfp?: string;
    banner?: string;
  };
  description: string;
}) => {
  const handle = props.twitterProfile?.twitterHandle
    ? '@' + props.twitterProfile?.twitterHandle
    : showFirstAndLastFour(props.publicKey);

  const description = props.description;
  const title = `${handle}'s profile | Holaplex`;
  return (
    <Head>
      <title>{handle}&apos;s profile | Holaplex</title>
      <meta property="description" key="description" content={props.description} />
      <meta property="image" key="image" content={props.twitterProfile?.banner} />
      {/* Schema */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={props.twitterProfile?.banner} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:src" content={props.twitterProfile?.banner} />
      <meta name="twitter:site" content="@holaplex" />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={props.twitterProfile?.banner} />
      <meta property="og:url" content={`https://holaplex.com/profiles/${props.publicKey}/nfts`} />
      <meta property="og:site_name" content="Holaplex" />
      <meta property="og:type" content="website" />
    </Head>
  );
};

interface ProfileLayoutProps {
  children: any;
  profileData: WalletDependantPageProps;
}

const ProfileLayout = ({ children, profileData }: ProfileLayoutProps) => {
  const { banner, profilePicture, twitterHandle, publicKey } = useProfileData();

  const [showFollowsModal, setShowFollowsModal] = useState<FollowModalVisibility>('hidden');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  return (
    <>
      <ProfilePageHead
        publicKey={publicKey}
        twitterProfile={{
          twitterHandle: profileData.twitterHandle,
          banner: profileData.banner,
          pfp: profileData.profilePicture,
        }}
        description="View activity for this, or any other pubkey, in the Holaplex ecosystem."
      />
      <WalletIdentityProvider appName="Holaplex" appTwitter="@holaplex">
        <div>
          <header>
            <Banner className="h-40 md:h-64 " style={{ backgroundImage: `url(${banner})` }} />
          </header>
          <div className="container  mx-auto px-6 pb-20 lg:flex">
            <div className="mlg:mx-0 relative mx-auto w-full max-w-xs lg:sticky lg:top-24 lg:h-96 ">
              <div className="-mt-12 flex  justify-center text-center lg:justify-start lg:gap-12">
                <div className=" flex flex-shrink-0 rounded-full border-4 border-gray-900 ">
                  <img
                    src={profilePicture}
                    // imgOpt(, 400)
                    className="h-24 w-24 rounded-full  bg-gray-900 "
                    alt="profile picture"
                  />
                </div>
                <div className="mt-16 flex justify-center lg:justify-start">
                  {anchorWallet?.publicKey.toString() == publicKey && !twitterHandle && (
                    <ConnectTwitterButton
                      address={new PublicKey(publicKey)}
                      connection={connection}
                      wallet={anchorWallet}
                      cluster={'mainnet-beta'}
                      variant={'secondary'}
                      style={{
                        background: 'rgb(33,33,33)',
                        height: '37px',
                        width: '130px',
                        borderRadius: '18px',
                        padding: 16,
                      }}
                    />
                  )}
                  {anchorWallet?.publicKey.toString() !== publicKey.toString() && (
                    <FollowUnfollowButtonDataWrapper
                      targetPubkey={publicKey.toString()}
                      className={`pointer-events-auto `}
                    />
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-center lg:justify-start">
                <ProfileDisplayName />
              </div>
              <FollowerCount
                wallet={anchorWallet}
                setShowFollowsModal={setShowFollowsModal}
                showButton={false}
              />
              <div className="mt-10 flex justify-center lg:justify-start">
                <Link href={'/messages?address=' + publicKey} passHref>
                  <a className=" flex max-w-fit items-center  space-x-2 rounded-full px-4 py-2 text-base shadow-lg shadow-black hover:text-gray-300 ">
                    <span>Message</span>
                    <MessagesIcon className="h-5 w-5" />
                  </a>
                </Link>
              </div>
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
    </>
  );
};

const ProfileDisplayName: FC = () => {
  const { publicKey, twitterHandle } = useProfileData();

  const [copied, setCopied] = useState(false);
  const copyPubKey = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center text-2xl font-medium">
      {twitterHandle ? (
        <div className={`flex flex-col items-center justify-start gap-4 lg:items-start`}>
          <a
            className="hover:text-gray-300"
            target="_blank"
            href={'https://www.twitter.com/' + twitterHandle}
            rel="noreferrer"
          >
            @{twitterHandle}
          </a>
          <span
            className={`flex max-w-fit cursor-pointer gap-2 rounded-full px-2 py-1 font-mono text-xs shadow-lg shadow-black hover:text-gray-300`}
            onClick={copyPubKey}
          >
            {shortenAddress(publicKey)}{' '}
            {copied ? (
              <CheckIcon className="h-4 w-4 " />
            ) : (
              <DuplicateIcon className="h-4 w-4 cursor-pointer " />
            )}
          </span>
        </div>
      ) : (
        <span className="flex items-center font-mono">
          {shortenAddress(publicKey)}{' '}
          {copied ? (
            <CheckIcon className="ml-4 h-7 w-7 hover:text-gray-300" />
          ) : (
            <DuplicateIcon
              className="ml-4 h-7 w-7 cursor-pointer hover:text-gray-300"
              onClick={copyPubKey}
            />
          )}
        </span>
      )}
    </div>
  );
};

const Banner = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  ${mq('lg')} {
    background-size: 100%;
  }
`;

export default ProfileLayout;
