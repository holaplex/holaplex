import { ActivityContent } from '@/common/components/elements/ActivityContent';
import { GetServerSideProps, NextPage } from 'next';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { ProfilePageHead } from '../[publicKey]';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

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
