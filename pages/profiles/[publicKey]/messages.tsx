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
import {Mailbox} from '@usedispatch/client';


//Question - how do we flow in the wallet and connection objects here?
// const mailbox  = new Mailbox(conn, senderWallet);

//Question - whats an example of something which fetches async data to populate the view?

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
