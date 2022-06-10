import { shortenAddress } from '@/modules/utils/string';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { DateTime } from 'luxon';
import {
  BidReceipt,
  FeedQuery,
  ListingReceipt,
  MintEvent,
  PurchaseReceipt,
} from 'src/graphql/indexerTypes';

type FeedEventTypes = FeedItem['__typename'];
export type FeedQueryEvent = FeedQuery['feedEvents'][0];
type QueryNFT =
  | MintEvent['nft']
  | ListingReceipt['nft']
  | PurchaseReceipt['nft']
  | BidReceipt['nft'];

export interface User {
  address: string;
  profile?: {
    handle?: string;
    profileImageUrl?: string;
  } | null;
}

export interface AggregateEvent {
  feedEventId: string;
  __typename: 'AggregateEvent';
  createdAt: string;
  eventsAggregated: FeedQueryEvent[];
  walletAddress: string;
  profile?: FeedQueryEvent['profile'];
}

export interface AggregateSaleEvent extends Omit<AggregateEvent, '__typename'> {
  __typename: 'AggregateSaleEvent';
}

export interface AggregateFollowEvent extends Omit<AggregateEvent, '__typename'> {
  __typename: 'AggregateFollowEvent';
}

export type FeedItem = FeedQueryEvent | AggregateEvent | AggregateSaleEvent | AggregateFollowEvent;

export type FeedCardAttributes =
  | {
      id: string;
      createdAt: string;
      type: FeedEventTypes;
      content: string;
      sourceUser: User;
      toUser?: User;
      solAmount?: number;
      nft?: QueryNFT;
    }
  | undefined;

export function getHandle(u: User) {
  return (u.profile?.handle && '@' + u.profile?.handle) || shortenAddress(u.address);
}

export function generateFeedCardAttributes(
  event: FeedItem,
  myFollowingList?: string[]
): FeedCardAttributes {
  const base = {
    id: event.feedEventId,
    createdAt: event.createdAt,
    type: event.__typename,
    sourceUser: {
      address: event.walletAddress,
      profile: event.profile,
    },
  };
  let solAmount: number | undefined;
  switch (event.__typename) {
    case 'ListingEvent':
      solAmount = event.listing?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        solAmount: solAmount,
        nft: event.listing?.nft as QueryNFT,
        content: `Listed for ${solAmount} SOL`,
      };

    case 'FollowEvent':
      const from = event.connection?.from!;
      const to = event.connection?.to!;
      return {
        ...base,
        type: 'FollowEvent',
        content: myFollowingList?.includes(to.address)
          ? 'was followed by ' + getHandle(to)
          : 'followed ' + getHandle(to),

        // I thought the source would be from, but aparently it's to
        // sourceUser: event.connection?.from!,
        // toUser: event.connection?.to!,
        toUser: to,
      };

    case 'MintEvent':
      const creator = event.nft?.creators[0]!;
      return {
        ...base,
        content: 'created ', //  + shortenAddress(event.nft?.address),
        /*         sourceUser: {
          address: creator.address,
          profile: creator.profile,
        }, */
        nft: event.nft as QueryNFT,
      };
    case 'PurchaseEvent':
      solAmount = event.purchase?.price / LAMPORTS_PER_SOL;

      return {
        ...base,
        content:
          (event.purchase?.buyer === event.walletAddress ? 'bought' : 'sold') +
          ' for ' +
          solAmount +
          ' SOL',
        solAmount,
        /*         sourceUser: {
          address: event.purchase?.buyer,
        }, */
        nft: event.purchase?.nft as QueryNFT,
      };
    case 'OfferEvent':
      solAmount = event.offer?.price / LAMPORTS_PER_SOL;
      return {
        ...base,
        content: 'offered ' + solAmount + ` SOL`,
        solAmount,
        /*      sourceUser: {
          address: event.offer?.buyer!,
          profile: null,
        }, */
        nft: event.offer?.nft as QueryNFT,
      };
  }
}

export const getAggregateProfiles = (aggregateEvent: AggregateEvent): User[] => {
  if (aggregateEvent.eventsAggregated.length < 2) {
    return [
      {
        address: aggregateEvent.walletAddress,
        profile: aggregateEvent.profile,
      },
    ];
  }
  const users: User[] = [];
  aggregateEvent.eventsAggregated.map((user) => {
    if (!users?.find((u) => u?.address === user.walletAddress)) {
      users.push({
        address: user.walletAddress,
        profile: user.profile,
      });
    } else {
      // do nothing
    }
  });
  return users as User[];
};

export const aggregateEventsTime = (events: FeedQueryEvent[]) => {
  let avgTime = 0;
  events.forEach((event) => {
    const date = DateTime.fromISO(event.createdAt).toMillis();
    avgTime += date;
  });
  avgTime = avgTime / events.length;
  const avgDate = DateTime.fromMillis(avgTime);
  return avgDate;
};

export function shouldAggregateFollows(e1: FeedQueryEvent, e2: FeedQueryEvent, e3: FeedQueryEvent) {
  // for now

  if (!e1 || !e2 || !e3) return false;

  return (
    e1.__typename === e2.__typename &&
    e2.__typename == e3.__typename &&
    // e1.walletAddress === e2.walletAddress &&
    // e2.walletAddress === e3.walletAddress &&
    e1.__typename === 'FollowEvent' &&
    e2.__typename === 'FollowEvent' &&
    e3.__typename === 'FollowEvent'
  );
}

export const shouldAggregateSaleEvents = (
  e1: FeedQueryEvent,
  e2: FeedQueryEvent,
  e3: FeedQueryEvent
) => {
  if (!e1 || !e2 || !e3) return false;

  const isNFTEvent = (e: FeedQueryEvent): boolean => {
    return (
      e.__typename === 'ListingEvent' ||
      e.__typename === 'OfferEvent' ||
      e.__typename === 'PurchaseEvent' ||
      e.__typename === 'MintEvent'
    );
  };

  return (
    e1.__typename === e2.__typename &&
    e2.__typename == e3.__typename &&
    e1.walletAddress === e2.walletAddress &&
    e2.walletAddress === e3.walletAddress &&
    isNFTEvent(e1) &&
    isNFTEvent(e2) &&
    isNFTEvent(e3)
  );
};

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
