import { IFeedItem } from '@/modules/feed/feed.interfaces';
import { shortenAddress } from '@/modules/utils/string';
import { Popover } from '@headlessui/react';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { useMemo } from 'react';
import {
  FeedEvent,
  FeedQuery,
  FeedQueryResult,
  useFeedLazyQuery,
  useFeedQuery,
} from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '../elements/FollowUnfollowButton';
import { Spinner } from '../elements/Spinner';
import { NFTS, PROFILES } from './feed.dummy';
import FeedItem from './FeedItem';

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

const FEED_EVENTS = [
  {
    __typename: 'PurchaseEvent',
    feedEventId: 'asdfasdf',
    createdAt: '2022-04-25T15:30:43',
    purchase: {
      buyer: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
      seller: '3XzWJgu5WEU3GV3mHkWKDYtMXVybUhGeFt7N6uwkcezF',
      price: 200000000000,
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
    },
  },
];

export default function FollowingFeed() {
  // const { publicKey: connectedPubkey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const myPubkey = anchorWallet?.publicKey.toBase58();

  const { data, loading, called, refetch } = useFeedQuery({
    fetchPolicy: `no-cache`,
    variables: {
      address: myPubkey,
    },
  });

  console.log('feed', {
    data,
    loading,
  });

  const t = typeof data?.feedEvents;

  return (
    <div className="space-y-24">
      {loading && <Spinner />}
      {
        // @ts-ignore
        data?.feedEvents.concat(FEED_EVENTS).map((fEvent) => (
          // @ts-ignore
          <FeedCard key={fEvent.feedEventId} event={fEvent} anchorWallet={anchorWallet} />
        ))
      }
    </div>
  );
}

// function FeedCardContent(event: FeedEvent) {}

function generateFeedCardAtributes(event: FeedEvent) {
  const base = {
    id: event.feedEventId,
    timestamp: event.createdAt,
    type: event.__typename,
  };
  switch (event.__typename) {
    case 'ListingEvent':
      const solAmount = event.listing?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        sourceUser: {
          address: event.listing?.seller,
          profile: null,
        },
        solAmount,
        nft: event.listing?.nft,
        listing: event.listing,
        content: `Listed at ${event.listing} for ${solAmount}`,
      };
    case 'FollowEvent':
      return {
        ...base,
        sourceUser: {
          address: event.connection?.from.address,
          profile: null,
        },
        toUser: {
          address: event.connection?.to.address,
          profile: null,
        },
      };

    case 'MintEvent':
      return {
        ...base,
        text: 'Created',
        nft: event.nft,
      };
    case 'PurchaseEvent':
      return {
        ...base,
        sourceUser: {
          address: event.purchase?.buyer,
        },
        nft: event.purchase?.nft,
      };
  }
}

function FeedCard(props: { anchorWallet: AnchorWallet; event: FeedEvent }) {
  const attrs = generateFeedCardAtributes(props.event);
  console.log('Feed card', {
    event: props.event,
    attrs,
  });

  const { connection } = useConnection();
  const walletConnectionPair = useMemo(
    () => ({ wallet: props.anchorWallet, connection }),
    [props.anchorWallet, connection]
  );
  if (!attrs) return <div>Can not describe event</div>;

  if (props.event.__typename === 'FollowEvent') {
    return (
      <div className="flex items-center bg-gray-900">
        <ProfilePFP user={attrs.sourceUser} />
        <div className="ml-2">
          <div className="text-base">
            Started following
            {attrs.toUser.profile?.handle || shortenAddress(attrs.toUser.address)}
          </div>
          <div className="flex text-sm">
            <Link href={'/profiles/' + attrs.sourceUser.address + '/nfts'} passHref>
              <a>{attrs.sourceUser.profile?.handle || shortenAddress(attrs.sourceUser.address)}</a>
            </Link>
            <span>{DateTime.fromISO(attrs.timestamp).toRelative()}</span>
          </div>
        </div>
        <div className="ml-auto">
          <FollowUnfollowButton
            source="feed"
            walletConnectionPair={walletConnectionPair}
            toProfile={attrs.toUser.address}
            type="Follow" // needs to be dynamic
          />
        </div>
      </div>
    );
  }

  if (!attrs.nft) return <div>Event is malformed</div>;
  return (
    <div className="relative">
      <img
        className="aspect-square w-full rounded-lg "
        src={attrs.nft?.image}
        alt={attrs.nft?.name}
      />
      <ShareMenu />
      <div className="absolute bottom-16 mb-6 flex items-center text-base">
        <FeedActionBanner event={props.event} />
      </div>
    </div>
  );
}

function FeedActionBanner(props: { event: FeedEvent }) {
  const attrs = generateFeedCardAtributes(props.event);
  if (!attrs.sourceUser) return <div>Can not describe event</div>;

  return (
    <div className="flex bg-gray-900  bg-opacity-40 backdrop-blur-[200px] group-hover:bg-gray-900">
      <ProfilePFP user={attrs.sourceUser} />
      <div>
        <div>{attrs.text}</div>
        <div className="flex text-sm">
          {attrs.sourceUser.address} {DateTime.fromISO(attrs.timestamp).toRelative()}
        </div>
      </div>
    </div>
  );
}

function ProfilePFP({
  user,
}: {
  user: { address: string; profile: { handle: string; pfp: string } };
}) {
  return user.profile?.pfp ? (
    <img
      className={classNames('rounded-full', 'h-6 w-6')}
      src={user.profile.pfp}
      alt={'profile picture for ' + user.profile.handle || user.address}
    />
  ) : (
    <div className={classNames('rounded-full bg-gray-700', 'h-6 w-6')}></div>
  );
}

function ShareMenu() {
  return (
    <Popover className="relative">
      <Popover.Button>Share</Popover.Button>
      <Popover.Panel className="absolute z-10 w-64 -translate-y-32 transform space-y-8  bg-gray-900 px-4 text-white sm:px-0">
        <div>Share NFT to Twitter</div>
        <div>Copy link to NFT</div>
      </Popover.Panel>
      {/* <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
      </Transition> */}
    </Popover>
  );
}
