import { shortenAddress } from '@/modules/utils/string';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FeedQuery, FollowEvent } from 'src/graphql/indexerTypes';

type FeedEventTypes = FeedItem['__typename'];

export type FeedQueryEvent = FeedQuery['feedEvents'][0];

export interface User {
  address: string;
  profile?: {
    handle: string;
    pfp?: string;
  } | null;
}

export interface AggregateEvent {
  feedEventId: string;
  __typename: 'AggregateEvent';
  createdAt: string;
  eventsAggregated: FeedQueryEvent[];
}

export type FeedItem = FeedQueryEvent | AggregateEvent;

export type FeedCardAttributes =
  | {
      id: string;
      createdAt: string;
      type: FeedEventTypes;
      content: string;
      sourceUser: User;
      toUser?: User;
      solAmount?: number;
      nft?: {
        address: string;
        name: string;
        image: string;
        description: string;
        creators: User[];
      } | null;
    }
  | undefined;

export function getHandle(u: User) {
  return (u.profile?.handle && '@' + u.profile?.handle) || shortenAddress(u.address);
}

export function generateFeedCardAtributes(
  event: FeedItem,
  myFollowingList?: string[]
): FeedCardAttributes {
  const base = {
    id: event.feedEventId,
    createdAt: event.createdAt,
    type: event.__typename,
  };
  let solAmount: number | undefined;
  switch (event.__typename) {
    case 'ListingEvent':
      solAmount = event.listing?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        sourceUser: {
          address: event.listing?.seller,
          profile: null,
        },
        solAmount,
        nft: event.listing?.nft,
        // listing: event.listing,
        content: `Listed for ${solAmount} SOL (${event.lifecycle})`,
      };

    case 'FollowEvent':
      const from = event.connection?.from!;
      const to = event.connection?.to!;
      return {
        ...base,
        type: 'FollowEvent',
        content: myFollowingList?.includes(from.address)
          ? 'Was followed by ' + getHandle(from)
          : 'Followed ' + getHandle(from),

        // I thought the source would be from, but aparently it's to
        // sourceUser: event.connection?.from!,
        // toUser: event.connection?.to!,
        sourceUser: to,
        toUser: from,
      };

    case 'MintEvent':
      const creator = event.nft?.creators[0]!;
      return {
        ...base,
        content: 'Created ' + shortenAddress(event.nft?.address),
        sourceUser: {
          address: creator.address,
          profile: creator.profile,
        },
        nft: event.nft,
      };
    case 'PurchaseEvent':
      solAmount = event.purchase?.price / LAMPORTS_PER_SOL;

      return {
        ...base,
        content: 'Bought for ' + solAmount + ' SOL',
        sourceUser: {
          address: event.purchase?.buyer,
        },
        nft: event.purchase?.nft,
      };
    case 'OfferEvent':
      solAmount = event.offer?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        content: 'Offered ' + solAmount + ` SOL (${event.lifecycle})`,
        sourceUser: {
          address: event.offer?.buyer!,
          profile: null,
        },
        nft: event.offer?.nft,
      };
  }
}

export function shouldAggregate(e1: FeedQueryEvent, e2: FeedQueryEvent) {
  if (!e1 || !e2) return false;
  return (
    e1.__typename === 'MintEvent' &&
    e2.__typename === 'MintEvent' &&
    e1.nft?.creators[0].address === e2.nft?.creators[0].address
  );
}

export function shuffleArray<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  const cloneArray = [...array];

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [cloneArray[currentIndex], cloneArray[randomIndex]] = [
      cloneArray[randomIndex],
      cloneArray[currentIndex],
    ];
  }

  return cloneArray;
}
