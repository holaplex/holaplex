import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from '@/common/components/elements/Spinner';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const ActivityLanding: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/profiles/${publicKey}/nfts`);
  }, []);

  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <Head>
        <title>{showFirstAndLastFour(publicKey)}&apos;s profile | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="View activity for this, or any other pubkey, in the Holaplex ecosystem."
        />
      </Head>
      <ProfileContainer>
        {/* <ActivityContent /> */}
        <div className="flex h-48 w-full items-center justify-center">
          <Spinner />
        </div>
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default ActivityLanding;
