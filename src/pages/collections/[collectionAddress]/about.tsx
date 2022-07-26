import { CollectionRaisedCard } from '@/views/collections/CollectionRaisedCard';
import {
  CollectionPageProps,
  getCollectionPageServerSideProps,
} from '@/views/collections/collections.utils';
import { FollowItem } from '@/views/profiles/FollowModal';
import CollectionLayout from 'src/views/collections/CollectionLayout';
import { GetServerSideProps } from 'next';
import React, { ReactNode } from 'react';

export const getServerSideProps: GetServerSideProps<CollectionPageProps> =
  getCollectionPageServerSideProps;

export default function CollectionAboutPage(props: CollectionPageProps) {
  return (
    <div className="mb-20 space-y-20">
      <CollectionRaisedCard>
        <h2 className="text-2xl font-semibold">About this collection</h2>
        <p>{props.collection?.description}</p>
      </CollectionRaisedCard>
      <CollectionRaisedCard>
        <h2 className="text-2xl font-semibold">Creators of this collection</h2>
        <div className="mt-10 space-y-10">
          {props.collection?.creators.map((cc) => (
            <FollowItem
              key={cc.address}
              source="collectionCreators"
              user={{
                address: cc.address,
                profile: cc.profile,
              }}
            />
          ))}
        </div>
      </CollectionRaisedCard>
    </div>
  );
}

CollectionAboutPage.getLayout = function getLayout(
  collectionPageProps: CollectionPageProps & { children: ReactNode }
) {
  return (
    <CollectionLayout {...collectionPageProps}>{collectionPageProps.children}</CollectionLayout>
  );
};
