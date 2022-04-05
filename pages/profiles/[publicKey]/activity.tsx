import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

const ActivityPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
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
        <ActivityContent />
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default ActivityPage;
