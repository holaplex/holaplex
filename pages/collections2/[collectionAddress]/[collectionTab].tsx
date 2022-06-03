import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { Fragment, useMemo, useState } from 'react';

import { Tab } from '@headlessui/react';
import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import { FollowItem } from '@/common/components/elements/FollowModal';
import { getSdk } from 'src/graphql/indexerTypes.ssr';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import {
  GetCollectionQuery,
  useAllConnectionsToQuery,
  useNftsInCollectionQuery,
} from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '@/common/components/elements/FollowUnfollowButton';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { NFTGrid } from 'pages/profiles/[publicKey]/nfts';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { ProfileHandle, ProfilePFP } from '@/common/components/feed/FeedCard';
import { User } from '@/common/components/feed/feed.utils';
import { AvatarIcons } from '@/common/components/elements/Avatar';
import { CollectedBy } from '@/common/components/elements/FollowerCount';
import { useRouter } from 'next/router';
import { AuctionHouse, Listing, Marketplace, Nft, Offer } from '@holaplex/marketplace-js-sdk';

enum TabRoute {
  NFTS = 'nfts',
  ACTIVITY = 'activity',
  ABOUT = 'about',
}
// DTjENPCxVnukLh5wbdBsb3CDttSfQzdNeRyk7dzr6vjr // rejects address
// FbMgyHab7LxdhnSAFueCR9JGdCZKQNornmHEf4vocGGQ // rejects mint address
// 8G1ZSVLf8SW27SiNCLjDph9JSb3uivoypumLxS4adW7D // dgods
// 6XxjKYFbcndh2gDcsUrmZgVEsoDxXMnfsaGY6fpTJzNr // dgods min address
// okay bears mint // BKY3nztnk29ugvyMXtFyXVDvUp4uenUt9oBC6bMq97yA

// http://localhost:3001/collections/DTjENPCxVnukLh5wbdBsb3CDttSfQzdNeRyk7dzr6vjr/nfts

type NFTCollection = GetCollectionQuery['nft'];

interface CollectionPage {
  collectionAddress: string;
  collectionTab: TabRoute;
  collection: NFTCollection;
}

const INFINITE_SCROLL_AMOUNT_INCREMENT = 25;
const INITIAL_FETCH = 25;

function CreatorChip(props: { user: User }) {
  return (
    <span className="flex max-w-fit items-center space-x-4 py-3 px-2 text-base font-medium shadow-2xl">
      <ProfilePFP user={props.user} />
      <ProfileHandle user={props.user} />
    </span>
  );
}

export const getServerSideProps: GetServerSideProps<CollectionPage> = async (context) => {
  const collectionAddress = (context.query.collectionAddress || '') as string;

  const collectionTab = context.query.collectionTab as TabRoute;

  const { getCollection } = getSdk(graphqlRequestClient);

  const collection = await getCollection({
    address: collectionAddress,
  });

  return {
    props: {
      collectionAddress,
      collectionTab,
      collection: collection.nft,
    },
  };
};

export default function CollectionTab(props: CollectionPage) {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [hasMore, setHasMore] = useState(true);
  const myPubkey = wallet?.publicKey.toBase58();

  const nftsInCollectionVariables = {
    marketplaceSubdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    collectionMintAddress: props.collection?.mintAddress,
    limit: INITIAL_FETCH,
    offset: 0,
  };

  const { data, loading, fetchMore, refetch } = useNftsInCollectionQuery({
    variables: nftsInCollectionVariables,
  });

  const { data: collectionFollowersData } = useAllConnectionsToQuery({
    variables: {
      to: props.collectionAddress,
    },
  });

  const collectionFollowers = collectionFollowersData?.connections || [];

  const amIFollowingThisCollection = useMemo(
    () => !!collectionFollowers.find((f) => f.from.address === myPubkey),
    [collectionFollowers, myPubkey]
  );

  const creators = props.collection?.creators || [];

  const nfts = data?.nfts || [];

  const walletConnectionPair = useMemo(() => {
    if (!wallet) return null;
    return { wallet, connection };
  }, [wallet, connection]);

  return (
    <div className="container mx-auto ">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-10 flex">
            <img
              src={props.collection?.image}
              className="mr-10 h-40 w-40 rounded-2xl bg-gray-900 shadow-2xl ring-8 ring-gray-900"
              alt="Collection logo"
            />
            <div>
              <span className="text-base text-gray-300">Collection of {nfts.length}</span>
              <h1 className="mt-4 text-5xl"> {props.collection?.name} </h1>
              {!walletConnectionPair ? null : (
                <FollowUnfollowButton
                  toProfile={{
                    address: props.collection?.address!,
                  }}
                  type={amIFollowingThisCollection ? 'Unfollow' : 'Follow'}
                  walletConnectionPair={walletConnectionPair}
                  source="collectionPage"
                />
              )}
            </div>
          </div>
          {creators.length === 1 ? (
            <CreatorChip
              user={{
                address: creators[0].address,
                profile: {
                  handle: creators[0].profile?.handle,
                  profileImageUrl: creators[0].profile?.profileImageUrlLowres,
                },
              }}
            />
          ) : (
            <AvatarIcons
              profiles={
                creators.map((cc) => ({
                  address: cc.address,
                  data: {
                    twitterHandle: cc.profile?.handle,
                    pfpUrl: cc.profile?.profileImageUrlLowres,
                  },
                })) || []
              }
            />
          )}
        </div>
        <CollectionRaisedCard>
          <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-4">
            <div>
              <div className="cursor-pointer text-sm font-medium text-gray-200">Followed by</div>
              <div className="flex items-center">
                <span className={`mr-2 text-left text-2xl font-semibold`}>
                  {collectionFollowers.length}
                </span>

                <AvatarIcons
                  profiles={collectionFollowers.map((f) => ({
                    address: f.from.address,
                    data: {
                      twitterHandle: f.from.profile?.handle,
                      pfpUrl: f.from.profile?.profileImageUrl,
                    },
                  }))}
                />
              </div>
            </div>

            {/* 
            <div>
              // ! Need to think about this some more, might need a new query
              <div>Collected by</div>
              <CollectedBy creatorPubkey={creators[0].address} />
            </div>
              */}
            {/* <div>Floor price</div>
            <div>Total volume</div> */}
          </div>
        </CollectionRaisedCard>
      </div>

      <div className="w-full">
        <Tab.Group
          defaultIndex={props.collectionTab === TabRoute.NFTS ? 0 : 1}
          onChange={(index) => {
            // this does trigger a new getServersideQuery, but it is not noticable for the user
            router.replace(
              `/collections2/${props.collectionAddress}/${index === 0 ? 'nfts' : 'about'}`
            );
          }}
        >
          <Tab.List className="flex space-x-1 p-1">
            {/* This could be made into a list of tabs that is mapped into the Tab component, to avoid further duplication */}
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
                    selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
                  )}
                >
                  NFTs
                  {/* {nfts.length} We need to know the numer of nfts in the collection, not just the amount rendered on screen */}
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
                    selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
                  )}
                >
                  About
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="mt-10">
                <div>Search and filter</div>
                <div className="mt-20 flex ">
                  <div className="mr-10 w-80">Sidebar Placeholder</div>
                  <NFTGrid
                    ctaVariant={`collectionPage`}
                    hasMore={hasMore && nfts.length > INITIAL_FETCH - 1}
                    onLoadMore={async (inView) => {
                      if (!inView || loading || nfts.length <= 0) {
                        return;
                      }

                      const { data: newData } = await fetchMore({
                        variables: {
                          ...nftsInCollectionVariables,
                          limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
                          offset: nfts.length + INFINITE_SCROLL_AMOUNT_INCREMENT,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          const prevNfts = prev.nfts;
                          const moreNfts = fetchMoreResult.nfts;
                          if (!moreNfts.length) {
                            setHasMore(false);
                          }

                          fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

                          return { ...fetchMoreResult };
                        },
                      });
                    }}
                    nfts={nfts}
                    gridView={'3x3'}
                    refetch={refetch}
                    loading={loading}
                    marketplace={data?.marketplace as Marketplace}
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <CollectionAbout collection={props.collection} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

function CollectionAbout(props: { collection: NFTCollection }) {
  return (
    <div className="mt-20 space-y-20">
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
                profile: {
                  handle: cc.profile?.handle,
                  profileImageUrl: cc.profile?.profileImageUrlLowres,
                } as any,
              }}
            />
          ))}
        </div>
      </CollectionRaisedCard>
    </div>
  );
}
