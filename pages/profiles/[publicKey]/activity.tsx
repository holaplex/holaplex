import { ActivityContent } from '@/common/components/elements/ActivityContent';
import { GetServerSideProps } from 'next';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import ProfileLayout from '../../../src/common/components/layouts/ProfileLayout';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

function ActivityPage({ publicKey, ...props }: WalletDependantPageProps) {
  return <ActivityContent />;
}

export default ActivityPage;

ActivityPage.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};
