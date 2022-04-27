import type { ReactElement } from 'react';
import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';

import FeedLayout from '@/layouts/FeedLayout';
import { useFeedQuery } from 'src/graphql/indexerTypes';
import { FeedCard } from '@/common/components/feed/FeedCard';
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: {
//     },
//   };
// };

// export const FEED_ITEMS: IFeedItem[] = [
//   {
//     id: 'asdf',
//     type: 'OUTBID',
//     timestamp: '2022-03-14T15:00:00Z',
//     sourceUser: PROFILES.wga,
//     toUser: PROFILES.kayla, //
//     solAmount: 20,
//     nft: {
//       creator: PROFILES.sleepr,
//       address: 'sjjxjcjvxcv',
//       imageURL:
//         'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
//       name: 'Afternoon Surprise',
//       storeSubdomain: 'sleepr',
//     },
//   },
//   {
//     id: 'asssdf',
//     type: 'BID_MADE',
//     timestamp: '2022-03-14T10:00:00Z',
//     sourceUser: PROFILES.wga,
//     solAmount: 20,
//     nft: {
//       creator: [PROFILES.sik],
//       address: 'sjjxjcjvxcvsfafasdf',
//       imageURL:
//         'https://assets.holaplex.tools/ipfs/bafybeidpfnobrzwdj53nlpdd2ryz4yignl4viloxkjb2a2rnpuo5a27ppq?width=600',
//       name: 'Battle of Hoth',
//       storeSubdomain: 'sika',
//     },
//   },
//   {
//     id: 'asssdfasdasd',
//     type: 'SALE_PRIMARY',
//     timestamp: '2022-03-12T10:00:00Z',
//     sourceUser: PROFILES.wga,
//     solAmount: 18,
//     nft: NFTS.yoshida,
//   },
// ];

// FBNrpSJiM2FCTATss2N6gN9hxaNr6EqsLvrGBAi9cKW7 // folluther
// 2BNABAPHhYAxjpWRoKKnTsWT24jELuvadmZALvP6WvY4 // ghostfried
// GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS // kayla
// 2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR // belle

const FEED_EVENTS = [
  {
    __typename: 'FollowEvent',
    feedEventId: '4dd91759-9f97-4984-9666-b71e33c9ffab',
    graphConnectionAddress: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
    createdAt: '2022-04-26T14:47:44.819201+00:00',
    connection: {
      address: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
      from: {
        address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
        profile: null,
      },
      to: {
        address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
        profile: {
          handle: 'belle__sol',
        },
      },
    },
  },
  {
    __typename: 'FollowEvent',
    feedEventId: '4dd91759-9f97-4984-9666-b71e33c9ffsab',
    graphConnectionAddress: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTadiLSo',
    createdAt: '2022-04-27T14:47:44.819201+00:00',
    connection: {
      address: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
      from: {
        address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
        profile: null,
      },
      to: {
        address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
        profile: {
          handle: 'belle__sol',
        },
      },
    },
  },
  {
    __typename: 'OfferEvent',
    feedEventId: '94d2a65b-6547-4b09-ad02-ee8dba82da79',
    createdAt: '2022-04-25T20:39:53.332329+00:00',
    offer: {
      buyer: 'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS',
      price: 250000000,
      nft: {
        address: '4SET3vVDsCHYCYQaRrWrDHBJojkLtAxvMe18suPr7Ycf',
        name: 'DreamerKid',
        image:
          'https://assets2.holaplex.tools/ipfs/bafkreiahhvowe5lfdtdjsltyvvgy6emen3lfrzfrszv5g5jzmapalw2mda?width=600',
        // 'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
        description: 'my description',
        creators: [
          {
            address: 'asdfasdf',
            twitterHandle: 'fffffff',
          },
        ],
        mintAddress: 'fasdfasdfsaf',
      },
    },
  },
  {
    __typename: 'PurchaseEvent',
    feedEventId: 'asdfasdf',
    createdAt: '2022-04-25T15:30:43',
    purchase: {
      buyer: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
      seller: '3XzWJgu5WEU3GV3mHkWKDYtMXVybUhGeFt7N6uwkcezF',
      price: 1500000000000,
      nft: {
        name: 'Somyed',
        image:
          'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
        description: 'asdfasdf',
      },
    },
  },
  {
    __typename: 'MintEvent',
    feedEventId: 'asdfasdfsss',
    createdAt: '2022-04-25T11:30:43',
    nft: {
      name: 'Yogi',
      image:
        'https://assets.holaplex.tools/ipfs/bafybeidpfnobrzwdj53nlpdd2ryz4yignl4viloxkjb2a2rnpuo5a27ppq?width=600',
      description: 'asdfasdasdasdf',
      creators: [
        {
          address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
          profile: {
            handle: 'kristianeboe',
            pfp: 'https://pbs.twimg.com/profile_images/1502268999316525059/nZNPG8GX_bigger.jpg',
          },
        },
      ],
    },
  },
];

const FeedPage = () => {
  const anchorWallet = useAnchorWallet();

  const myPubkey = anchorWallet?.publicKey.toBase58();

  const { data, loading, called, refetch } = useFeedQuery({
    fetchPolicy: `no-cache`,
    variables: {
      address: myPubkey,
    },
  });

  if (!myPubkey) return null;

  console.log('feed', {
    data,
    loading,
  });

  return (
    <>
      <Head>
        <title>Personal feed | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Your personalized feed for all things Holaplex and Solana"
        />
      </Head>

      <div className="space-y-20">
        {/* {loading && (
        <div className="flex h-96 w-full items-center justify-center">
          <Spinner />
        </div>
      )} */}
        {
          // @ts-ignore
          // data?.feedEvents.concat(FEED_EVENTS)
          FEED_EVENTS.map((fEvent) => (
            // @ts-ignore
            <FeedCard key={fEvent.feedEventId} event={fEvent} anchorWallet={anchorWallet} />
          ))
        }
      </div>
    </>
  );
};

export default FeedPage;

FeedPage.getLayout = function getLayout(page: ReactElement) {
  return <FeedLayout>{page}</FeedLayout>;
};
