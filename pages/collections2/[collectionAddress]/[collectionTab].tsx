import { Button5 } from '@/common/components/elements/Button2';
import { FilterOptions, SortOptions } from '@/common/components/home/home.interfaces';
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
  useIsXFollowingYQuery,
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

enum TabRoute {
  NFTS = 'nfts',
  ACTIVITY = 'activity',
  ABOUT = 'about',
}
// DTjENPCxVnukLh5wbdBsb3CDttSfQzdNeRyk7dzr6vjr // rejects address
// FbMgyHab7LxdhnSAFueCR9JGdCZKQNornmHEf4vocGGQ // rejects mint address
// 8G1ZSVLf8SW27SiNCLjDph9JSb3uivoypumLxS4adW7D // dgods
// 6XxjKYFbcndh2gDcsUrmZgVEsoDxXMnfsaGY6fpTJzNr // dgods min address

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

  // const queryFilter = (context.query.filter as string) || '';

  // const initialFilterBy: string | undefined =
  //   Object.values(FilterOptions).includes(queryFilter) && context.query.filter;

  // const initialSortBy: string | undefined =
  //   Object.values(SortOptions).includes(context.query.sort || '') && context.query.sort;

  // const initialSearchBy: string[] | undefined = context.query.search
  //   ?.split(',')
  //   .map((term) => term.toLowerCase());

  const { getCollection } = getSdk(graphqlRequestClient);

  const collection = await getCollection({
    address: collectionAddress,
  });

  console.log('query', {
    collectionAddress,
    collectionTab,
    collection,
  });

  return {
    props: {
      collectionAddress,
      collectionTab,
      collection: collection.nft,
      // initialFilterBy: initialFilterBy || FilterOptions.Auctions,
      // initialSortBy: initialSortBy || SortOptions.Trending,
      // initialSearchBy: initialSearchBy || [],
    },
  };
};

export default function CollectionTab(props: CollectionPage) {
  const wallet = useAnchorWallet();
  const [hasMore, setHasMore] = useState(true);
  const { connection } = useConnection();
  const myPubkey = wallet?.publicKey.toBase58();
  const router = useRouter();

  const variables = {
    marketplaceSubdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    collectionMintAddress: props.collection?.mintAddress,
    limit: INITIAL_FETCH,
    offset: 0,
  };

  const { data, loading, fetchMore, refetch } = useNftsInCollectionQuery({
    variables,
  });

  const { data: followersData } = useAllConnectionsToQuery({
    variables: {
      to: props.collectionAddress,
    },
  });
  const followers = followersData?.connections || [];

  const amIFollowingThisCollection = !!followers.find((f) => f.from.address === myPubkey);

  const creators = props.collection?.creators || [];

  const nfts = data?.nfts || [];

  const walletConnectionPair = useMemo(() => ({ wallet, connection }), [wallet, connection]);

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between">
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
              {!connection || !wallet ? null : (
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
                <span className={`mr-2 text-left text-2xl font-semibold`}>{followers.length}</span>

                <AvatarIcons
                  profiles={followers.map((f) => ({
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

      <div className="w-full   ">
        <Tab.Group
          defaultIndex={props.collectionTab === TabRoute.NFTS ? 0 : 1}
          onChange={(index) => {
            console.log('Changed selected tab to:', index);

            router.replace(
              `/collections2/${props.collectionAddress}/${index === 0 ? 'nfts' : 'about'}`
            );
          }}
        >
          <Tab.List className="flex space-x-1   p-1">
            <Tab
              className={classNames(
                'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
                props.collectionTab === 'nfts'
                  ? ' border-white'
                  : 'border-gray-800  text-gray-300 hover:text-white'
              )}
            >
              Nfts {nfts.length}
            </Tab>
            <Tab
              className={classNames(
                'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
                props.collectionTab === 'about'
                  ? ' border-white'
                  : 'border-gray-800  text-gray-300 hover:text-white'
              )}
            >
              About
            </Tab>
          </Tab.List>
          <Tab.Panels className="">
            <Tab.Panel>
              <div className="mt-10">
                <div>Search and filter</div>

                <div className="mt-20 flex ">
                  <div className="mr-10 w-80">Placeholder</div>
                  <NFTGrid
                    ctaVariant={`collection`}
                    hasMore={hasMore && nfts.length > INITIAL_FETCH - 1}
                    onLoadMore={async (inView) => {
                      if (!inView || loading || nfts.length <= 0) {
                        return;
                      }

                      const { data: newData } = await fetchMore({
                        variables: {
                          ...variables,
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
                    marketplace={data?.marketplace}
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

function CollectionNFTs() {
  return <div>NFTs</div>;
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
                  handle: cc.twitterHandle,
                },
              }}
            />
          ))}
        </div>
      </CollectionRaisedCard>
    </div>
  );
}

const Tab1 = (props: { url: string; selected: boolean; title: string }) => (
  <Link href={props.url} passHref>
    {/* maybe use shallow in Link */}
    <a
      className={classNames(
        'w-full  py-2.5 text-center text-sm font-medium text-white ',
        props.selected ? 'border-b border-white' : 'text-gray-300  hover:text-white'
      )}
    >
      {props.title}
    </a>
  </Link>
);
