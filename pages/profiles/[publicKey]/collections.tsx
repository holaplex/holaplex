import { GetServerSideProps } from 'next';
import React from 'react';
import CollectionCard from '../../../src/common/components/collections/CollectionCard';
import ProfileLayout from '../../../src/common/components/layouts/ProfileLayout';
import { ProfileDataProvider } from '../../../src/common/context/ProfileData';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '../../../src/modules/server-side/getProfile';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

function CollectionsPage({ publicKey, ...props }: WalletDependantPageProps) {
  return (
    <div className={`mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3`}>
      <CollectionCard
        address={'FbMgyHab7LxdhnSAFueCR9JGdCZKQNornmHEf4vocGGQ'}
        name={`Solana Monke Rejects`}
        amount={6000}
        image={`https://fz2ooqyvd4vuknw6veebcewtz6r2cznvmvnveihrywp6xu4mxy3q.arweave.net/LnTnQxUfK0U23qkIERLTz6OhZbVlW1Ig8cWf69OMvjc`}
      />
    </div>
  );
}

export default CollectionsPage;

CollectionsPage.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};
