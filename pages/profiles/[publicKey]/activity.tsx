import { ActivityContent } from 'src/components/ActivityContent';
import { GetServerSideProps } from 'next';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
import { ProfileDataProvider } from 'src/views/profiles/ProfileDataProvider';
import ProfileLayout from '../../../src/views/profiles/ProfileLayout';

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
