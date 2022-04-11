import { IFeedItem } from '@/modules/feed/feed.interfaces';
import React from 'react';
import { NFTS, PROFILES } from './feed.dummy';
import FeedItem from './FeedItem';

export const FEED_ITEMS: IFeedItem[] = [
  {
    id: 'asdf',
    type: 'OUTBID',
    timestamp: '2022-03-14T15:00:00Z',
    sourceUser: PROFILES.wga,
    toUser: PROFILES.kayla, //
    solAmount: 20,
    nft: {
      creator: PROFILES.sleepr,
      address: 'sjjxjcjvxcv',
      imageURL:
        'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
      name: 'Afternoon Surprise',
      storeSubdomain: 'sleepr',
    },
  },
  {
    id: 'asssdf',
    type: 'BID_MADE',
    timestamp: '2022-03-14T10:00:00Z',
    sourceUser: PROFILES.wga,
    solAmount: 20,
    nft: {
      creator: PROFILES.sik,
      address: 'sjjxjcjvxcvsfafasdf',
      imageURL:
        'https://assets.holaplex.tools/ipfs/bafybeidpfnobrzwdj53nlpdd2ryz4yignl4viloxkjb2a2rnpuo5a27ppq?width=600',
      name: 'Battle of Hoth',
      storeSubdomain: 'sika',
    },
  },
  {
    id: 'asssdfasdasd',
    type: 'SALE_PRIMARY',
    timestamp: '2022-03-12T10:00:00Z',
    sourceUser: PROFILES.wga,
    solAmount: 18,
    nft: NFTS.yoshida,
  },
];

export default function FollowingFeed() {
  return (
    <div className="space-y-24">
      {FEED_ITEMS.map((fi) => (
        <FeedItem key={fi.id} fi={fi} />
      ))}
    </div>
  );
}
