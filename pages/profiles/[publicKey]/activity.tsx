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
import { ProfilePageHead } from '../[publicKey]';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const ActivityPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => (
  <ProfileDataProvider profileData={{ publicKey, ...props }}>
    <ProfilePageHead
      publicKey={publicKey}
      twitterProfile={{
        twitterHandle: props.twitterHandle,
        banner: props.banner,
        pfp: props.profilePicture,
      }}
      description="View activity for this, or any other pubkey, in the Holaplex ecosystem."
    />
    <ProfileContainer>
      <ActivityContent />
    </ProfileContainer>
  </ProfileDataProvider>
);

export default ActivityPage;
