import { Button5 } from '@/common/components/elements/Button2';
import { FilterOptions, SortOptions } from '@/common/components/home/home.interfaces';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

import { Tab } from '@headlessui/react';
import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import { FollowItem } from '@/common/components/elements/FollowModal';

enum TabRoute {
  NFTS,
  ACTIVITY,
  ABOUT,
}
// DTjENPCxVnukLh5wbdBsb3CDttSfQzdNeRyk7dzr6vjr // rejects address
// FbMgyHab7LxdhnSAFueCR9JGdCZKQNornmHEf4vocGGQ // rejects mint address
// 8G1ZSVLf8SW27SiNCLjDph9JSb3uivoypumLxS4adW7D // dgods
// 6XxjKYFbcndh2gDcsUrmZgVEsoDxXMnfsaGY6fpTJzNr // dgods min address

export const getServerSideProps: GetServerSideProps = async (context) => {
  const collectionId = context.query.collectionId || '';

  const collectionTab = context.query.collectionTab || '';

  console.log('query', {
    q: context.query,
    collectionId,
    collectionTab,
  });

  const queryFilter = (context.query.filter as string) || '';

  const initialFilterBy: string | undefined =
    Object.values(FilterOptions).includes(queryFilter) && context.query.filter;

  const initialSortBy: string | undefined =
    Object.values(SortOptions).includes(context.query.sort || '') && context.query.sort;

  const initialSearchBy: string[] | undefined = context.query.search
    ?.split(',')
    .map((term) => term.toLowerCase());

  return {
    props: {
      collectionId,
      collectionTab,
      initialFilterBy: initialFilterBy || FilterOptions.Auctions,
      initialSortBy: initialSortBy || SortOptions.Trending,
      initialSearchBy: initialSearchBy || [],
    },
  };
};

export default function CollectionTab(props: { collectionId: string; collectionTab: string }) {
  const defaultTabIndex =
    props.collectionTab === 'nfts'
      ? TabRoute.NFTS
      : props.collectionTab === `about`
      ? TabRoute.ABOUT
      : TabRoute.NFTS;

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between">
        <div>
          <div className="flex">
            {/* <img src="" /> */}
            <div className="pulse h-40 w-40 bg-gray-800"></div>
            <div>
              <span className="text-base text-gray-300">Collection of 6</span>
              <h1 className="text-5xl">Opiate series {props.collectionId} </h1>
              <Button5 v="primary">Follow</Button5>
            </div>
          </div>
          @jarwoee
        </div>
        <div className="h-40 w-80 shadow-2xl">Analytics</div>
      </div>

      <div className="w-full   ">
        <div className="flex space-x-1   p-1">
          <Tab1
            title={`NFTs ${6}`}
            selected={props.collectionTab === 'nfts'}
            url={`/collections/${props.collectionId}/nfts`}
          />
          <Tab1
            title={'About'}
            selected={props.collectionTab === 'about'}
            url={`/collections/${props.collectionId}/about`}
          />
        </div>
        <div>
          {props.collectionTab === 'nfts' && <CollectionNFTs />}
          {props.collectionTab === 'about' && <CollectionAbout />}
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

function CollectionAbout() {
  return (
    <div className="mt-20 space-y-20">
      <CollectionRaisedCard>
        <h2 className="text-2xl font-semibold">About this collection</h2>
        <p>
          Our mission here at the academy is simple: Take 10,000 of the smoothest brained apes, put
          them all in one location and let the mayhem ensue. The academy was founded on the
          principles of friendship making, crayon eating and absolute, unregulated, deplorable,
          degenerate behaviour. Welcome fellow apes, to the Degenerate Ape Academy.
        </p>
      </CollectionRaisedCard>
      <CollectionRaisedCard>
        <h2 className="text-2xl font-semibold">Creators of this collection</h2>
        <div className="mt-10 space-y-10">
          {collectionCreators.map((cc) => (
            <FollowItem
              key={cc.address}
              source="collectionCreators"
              user={{
                address: cc.address,
                profile: {
                  handle: cc.handle,
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
