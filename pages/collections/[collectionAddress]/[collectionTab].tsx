import { Button5 } from '@/common/components/elements/Button2';
import { FilterOptions, SortOptions } from '@/common/components/home/home.interfaces';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import { Tab } from '@headlessui/react';
import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import { FollowItem } from '@/common/components/elements/FollowModal';
import { getSdk } from 'src/graphql/indexerTypes.ssr';
import { graphqlRequestClient } from 'src/graphql/graphql-request';
import { GetCollectionQuery, useNftsInCollectionQuery } from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '@/common/components/elements/FollowUnfollowButton';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { NFTGrid } from 'pages/profiles/[publicKey]/nfts';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';

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

function CreatorBadge() {
  return;
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
  const variables = {
    marketplaceSubdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    collectionMintAddress: props.collection?.mintAddress,
    limit: INITIAL_FETCH,
    offset: 0,
  };

  const { data, loading, fetchMore, refetch } = useNftsInCollectionQuery({
    variables,
  });

  const creators = props.collection?.creators || [];

  const nfts = data?.nfts || [];
  const wallet = useAnchorWallet();
  const [hasMore, setHasMore] = useState(true);
  const { connection } = useConnection();

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
              {!connection ? null : (
                <FollowUnfollowButton
                  toProfile={{
                    address: props.collection?.address!,
                  }}
                  type="Follow"
                  walletConnectionPair={walletConnectionPair}
                  source="collectionPage"
                />
              )}
            </div>
          </div>
          {creators.map((c) => (
            <span key={c.address}>{c.twitterHandle || c.address}</span>
          ))}
        </div>
        <div className="h-40 w-80 shadow-2xl">Analytics</div>
      </div>

      <div className="w-full   ">
        <div className="flex space-x-1   p-1">
          <Tab1
            title={`NFTs ${6}`}
            selected={props.collectionTab === 'nfts'}
            url={`/collections/${props.collectionAddress}/nfts`}
          />
          <Tab1
            title={'About'}
            selected={props.collectionTab === 'about'}
            url={`/collections/${props.collectionAddress}/about`}
          />
        </div>
        <div className="">
          {props.collectionTab === 'nfts' && (
            <div className="flex">
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
          )}
          {props.collectionTab === 'about' && <CollectionAbout collection={props.collection} />}
        </div>
      </div>
    </div>
  );
}

function CollectionNFTs() {
  return <div>NFTs</div>;
}

const collectionCreators = [
  {
    address: 'GeCRaiFKTbFzBV1UWWFZHBd7kKcCDXZK61QvFpFLen66',
  },
  {
    address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H', // kris
    handle: 'kristianeboe',
  },
  {
    address: 'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS', // kayla
    handle: 'itskay_k',
  },
  {
    address: '7oUUEdptZnZVhSet4qobU9PtpPfiNUEJ8ftPnrC6YEaa', // dan
  },
  {
    address: 'FeikG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW', // kevin
    handle: 'misterkevin_rs',
  },
  {
    address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR', // Belle
    handle: 'belle__sol',
  },
  {
    address: '7r8oBPs3vNqgqEG8gnyPWUPgWuScxXyUxtmoLd1bg17F', // Alex
    handle: 'afkehaya',
  },
];

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
