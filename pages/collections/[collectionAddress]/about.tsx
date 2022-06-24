import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import {
  CollectionPageProps,
  getCollectionPageServerSideProps,
} from '@/common/components/collections/collections.utils';
import { FollowItem } from '@/common/components/elements/FollowModal';
import CollectionLayout from '@/layouts/CollectionLayout';
import { GetServerSideProps } from 'next';
import React, { ReactElement, ReactNode } from 'react';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { GetCollectionQuery } from 'src/graphql/indexerTypes';
import { getSdk } from 'src/graphql/indexerTypes.ssr';

export const getServerSideProps: GetServerSideProps<CollectionPageProps> =
  getCollectionPageServerSideProps;

export default function CollectionAboutPage(props: CollectionPageProps) {
  return (
    <div className="mt-20 mb-20 space-y-20">
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
