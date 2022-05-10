import { shortenAddress } from '@/modules/utils/string';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  BidReceipt,
  FeedQuery,
  FollowEvent,
  ListingEvent,
  ListingReceipt,
  MintEvent,
  OfferEvent,
  PurchaseReceipt,
} from 'src/graphql/indexerTypes';

type FeedEventTypes = FeedItem['__typename'];
type Profile = MintEvent['profile'];
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
      nft?: QueryNFT;
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
          ? 'Was followed by ' + getHandle(to)
          : 'Followed ' + getHandle(to),

        // I thought the source would be from, but aparently it's to
        // sourceUser: event.connection?.from!,
        // toUser: event.connection?.to!,
        toUser: to,
      };

    case 'MintEvent':
      const creator = event.nft?.creators[0]!;
      return {
        ...base,
        content: 'Created ', //  + shortenAddress(event.nft?.address),
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
        content: 'Bought for ' + solAmount + ' SOL',
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
        content: 'Offered ' + solAmount + ` SOL`,
        solAmount,
        /*      sourceUser: {
          address: event.offer?.buyer!,
          profile: null,
        }, */
        nft: event.offer?.nft as QueryNFT,
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
