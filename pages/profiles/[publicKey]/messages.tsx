import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { ProfileMessages } from '@/common/components/elements/ProfileMessages';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async context =>
  getPropsForWalletOrUsername(context);

const MessagesPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => (
  <ProfileDataProvider profileData={{ publicKey, ...props }}>
    <Head>
      <title>{showFirstAndLastFour(publicKey)}&apos;s profile | Holaplex</title>
      <meta
        property='description'
        key='description'
        content='View your messages in the Holaplex ecosystem.'
      />
    </Head>
    <ProfileContainer>
      <ProfileMessages />
    </ProfileContainer>
  </ProfileDataProvider>
);

export default MessagesPage;
