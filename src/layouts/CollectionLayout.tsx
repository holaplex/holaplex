import { CollectionRaisedCard } from '@/common/components/collections/CollectionRaisedCard';
import {
  CollectionTabRoute,
  NFTCollection,
} from '@/common/components/collections/collections.util';
import { AvatarIcons } from '@/common/components/elements/Avatar';
import { FollowUnfollowButton } from '@/common/components/elements/FollowUnfollowButton';
import { User } from '@/common/components/feed/feed.utils';
import { ProfileHandle, ProfilePFP } from '@/common/components/feed/FeedCard';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { INITIAL_FETCH } from 'pages/profiles/[publicKey]/nfts';
import React, { ReactElement, useMemo, useState } from 'react';
import {
  GetCollectionQuery,
  useAllConnectionsToQuery,
  useNftsInCollectionQuery,
} from 'src/graphql/indexerTypes';

function CreatorChip(props: { user: User }) {
  return (
    <span className="flex max-w-fit items-center space-x-4 py-3 px-2 text-base font-medium shadow-2xl">
      <ProfilePFP user={props.user} />
      <ProfileHandle user={props.user} />
    </span>
  );
}

export default function CollectionLayout({
  children,
  ...props
}: {
  collectionAddress: string;
  collectionTab: CollectionTabRoute;
  collection: NFTCollection;
  children: ReactElement;
}) {
  const wallet = useAnchorWallet();
  const router = useRouter();

  const { connection } = useConnection();
  const myPubkey = wallet?.publicKey.toBase58();

  const { data: collectionFollowersData } = useAllConnectionsToQuery({
    variables: {
      to: props.collectionAddress,
    },
  });
  const collectionFollowers = collectionFollowersData?.connections || [];

  const amIFollowingThisCollection = !!collectionFollowers.find((f) => f.from.address === myPubkey);

  const creators = props.collection?.creators || [];

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
              <span className="text-base text-gray-300">Collection of X</span>
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

      <div className="w-full   ">
        <div className="flex space-x-1   p-1">
          <Tab1
            title={`NFTs`}
            selected={router.pathname.includes('nfts')}
            url={`/collections3/${props.collectionAddress}/nfts`}
          />
          <Tab1
            title={'About'}
            selected={router.pathname.includes('about')}
            url={`/collections3/${props.collectionAddress}/about`}
          />
        </div>
        <div className="">
          {React.cloneElement(children, {
            ...children.props,
            collectionFollowers,
            creators,
          })}
        </div>
      </div>
    </div>
  );
}

const Tab1 = (props: { url: string; selected: boolean; title: string }) => (
  <Link href={props.url} passHref>
    {/* maybe use shallow in Link */}
    <a
      className={classNames(
        'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
        props.selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
      )}
    >
      {props.title}
    </a>
  </Link>
);
