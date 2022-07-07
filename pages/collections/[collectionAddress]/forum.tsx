import CollectionLayout from '@/views/collections/CollectionLayout';
import {
  CollectionPageProps,
  getCollectionPageServerSideProps,
} from '@/views/collections/collections.utils';
import { GetServerSideProps } from 'next';
import { TopicView, ForumView, DispatchAppProps, DispatchProvider } from '@usedispatch/forum';

import React, { ReactNode, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const getServerSideProps: GetServerSideProps<CollectionPageProps> =
  getCollectionPageServerSideProps;

export default function CollectionForumPage(props: { collection: any; collectionId: string }) {
  const collectionTestId = '5n6jccZ96FqFTxREsosRUnQ7MsQCy1CwcWHwUgWArij6';
  const collectionMintId = props.collection.mintAddress;
  // const collectionId = collectionMintId; // '2G6Hjcoe6EW8Mh1VgiJsDV9f9z3CaCCScUx8hi6voc2i';

  const wallet = useWallet();
  const { connection } = useConnection();

  const forumURL = '/forum';
  function buildForumPath(collectionId: string) {
    return `/collections/${collectionId}${forumURL}`;
  }

  const topicURL = '/topic';
  function buildTopicPath(collectionId: string, topicId: number) {
    return `/collections/${collectionId}${forumURL}/${topicId}`;
  }

  const dispatchProps: DispatchAppProps = {
    wallet: wallet,
    connection: connection,
    buildForumPath: buildForumPath,
    buildTopicPath: buildTopicPath,
    children: <div></div>,
  };

  if (!wallet || !connection || !collectionMintId) return null;

  console.log('collection', {
    c: props.collection,
    collectionMintId,
    wallet,
  });

  return (
    <DispatchProvider {...dispatchProps}>
      <div className="App  ">
        {/* <div>
          <a href={'https://solscan.io/token/' + collectionMintId}>Solscan</a>
          <div>Address: {props.collection.address}</div>
          <div>
            Mint address:
            {collectionMintId}
          </div>
        </div> */}
        {/* <pre>{JSON.stringify(props.collection)}</pre> */}
        <ForumView collectionId={collectionMintId} />
      </div>
    </DispatchProvider>
  );
}

CollectionForumPage.getLayout = function getLayout(
  collectionPageProps: CollectionPageProps & { children: ReactNode }
) {
  return (
    <CollectionLayout {...collectionPageProps}>{collectionPageProps.children}</CollectionLayout>
  );
};
