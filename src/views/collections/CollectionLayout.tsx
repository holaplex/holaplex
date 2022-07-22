import { CollectionRaisedCard } from '@/views/collections/CollectionRaisedCard';
import { CollectionPageProps } from '@/views/collections/collections.utils';
import { AvatarIcons } from 'src/components/Avatar';
import { FollowUnfollowButton } from 'src/components/FollowUnfollowButton';
import { User } from 'src/views/alpha/feed.utils';
import { ProfileHandle, ProfilePFP } from 'src/views/alpha/FeedCard';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useMemo } from 'react';
import { useAllConnectionsToQuery, useIsXFollowingYQuery } from 'src/graphql/indexerTypes';
import { ExplorerIcon } from '@/assets/icons/Explorer';
import { SolscanIcon } from '@/assets/icons/Solscan';

function CreatorChip(props: { user: User }) {
  return (
    <span className="flex max-w-fit items-center space-x-4 py-3 px-2 text-base font-medium shadow-2xl">
      <ProfilePFP user={props.user} />
      <ProfileHandle user={props.user} />
    </span>
  );
}

function CollectionLayoutHead(props: {
  name: string;
  image: string;
  description: string;
  address: string;
}) {
  return (
    <Head>
      <meta charSet={`utf-8`} />
      <title>{props.name} Collection | Holaplex</title>
      {/* Search Engine */}
      <meta property="description" key="description" content={props.description} />
      <meta property="image" key="image" content={props.image} />
      {/* Schema */}
      <meta itemProp="name" content={`${props.name} Collection | Holaplex`} />
      <meta itemProp="description" content={props.description} />
      <meta itemProp="image" content={props.image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${props.name} Collection | Holaplex`} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image:src" content={props.image} />
      <meta name="twitter:image" content={props.image} />
      <meta name="twitter:site" content="@holaplex" />
      {/* Open Graph */}
      <meta property="og:title" content={`${props.name} Collection | Holaplex`} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content={props.image} />
      <meta property="og:url" content={`https://holaplex.com/collections/${props.address}`} />
      <meta property="og:site_name" content="Holaplex" />
      <meta property="og:type" content="website" />
    </Head>
  );
}

export default function CollectionLayout({
  children,
  collectionUrlAddress,
  collection,
}: CollectionPageProps & { children: ReactNode }) {
  const wallet = useAnchorWallet();
  const router = useRouter();

  const { connection } = useConnection();
  const myPubkey = wallet?.publicKey.toBase58();

  const { data: collectionFollowersData } = useAllConnectionsToQuery({
    variables: {
      to: collection?.address,
    },
  });

  const collectionFollowers = collectionFollowersData?.connections || [];

  const amIFollowingThisCollection = !!collectionFollowers.find((f) => f.from.address === myPubkey);

  const creators = collection?.creators || [];

  const walletConnectionPair = useMemo(() => {
    if (!wallet) return null;
    return { wallet, connection };
  }, [wallet, connection]);

  return (
    <>
      <CollectionLayoutHead
        address={collection?.address || ``}
        image={collection?.image || ``}
        name={collection?.name || ``}
        description={collection?.description || ``}
      />
      <div className="container lg:mx-auto ">
        <div className="relative flex w-full flex-col items-start lg:flex-row lg:justify-between">
          <div>
            <div className="mx-4 mb-10 flex flex-col lg:mx-0 lg:flex-row">
              <img
                src={collection?.image}
                className="mr-10 aspect-square h-40 w-40 rounded-2xl bg-gray-900 object-cover shadow-2xl ring-8 ring-gray-900"
                alt="Collection logo"
              />
              <div>
                {/* <span className="text-base text-gray-300">Collection of X</span> */}
                <h1 className="mt-4 text-5xl"> {collection?.name} </h1>
                <div className={`flex items-center justify-start gap-6`}>
                  {creators[0]?.profile?.handle && (
                    <Link href={`https://twitter.com/${creators[0]?.profile?.handle}`}>
                      <a target={`_blank`}>
                        <FeatherIcon
                          fill={'white'}
                          icon="twitter"
                          aria-hidden="true"
                          className={`h-4 w-4 text-white hover:text-gray-300`}
                        />
                      </a>
                    </Link>
                  )}

                  <Link href={`https://explorer.solana.com/address/${collection?.mintAddress}`}>
                    <a target={`_blank`}>
                      <ExplorerIcon
                        width={16}
                        height={16}
                        className={`ease-in-out hover:text-gray-300`}
                      />
                    </a>
                  </Link>
                  <Link href={`https://solscan.io/account/${collection?.mintAddress}`}>
                    <a target={`_blank`}>
                      <SolscanIcon
                        width={16}
                        height={16}
                        className={`ease-in-out hover:text-gray-300`}
                      />
                    </a>
                  </Link>
                  {!walletConnectionPair ? null : (
                    <FollowUnfollowButton
                      toProfile={{
                        address: collection?.address!,
                      }}
                      type={amIFollowingThisCollection ? 'Unfollow' : 'Follow'}
                      walletConnectionPair={walletConnectionPair}
                      source="collectionPage"
                    />
                  )}
                </div>
              </div>
            </div>
            {creators.length === 1 ? (
              <CreatorChip user={creators[0]} />
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
          <div className={`absolute top-0 right-0 overflow-hidden lg:hidden`}>
            <CollectionRaisedCard>
              <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-4">
                <div>
                  <div className="cursor-pointer text-sm font-medium text-gray-200">
                    Followed by
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 text-left text-2xl font-semibold`}>
                      {collectionFollowers.length}
                    </span>

                    <AvatarIcons
                      profiles={collectionFollowers.map((f) => ({
                        address: f.from.address,
                        data: {
                          twitterHandle: f.from.profile?.handle,
                          pfpUrl: f.from.profile?.profileImageUrlLowres,
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
          <div className={`hidden lg:flex`}>
            <CollectionRaisedCard>
              <div className="grid grid-cols-2 grid-rows-2 gap-x-5 gap-y-4">
                <div>
                  <div className="cursor-pointer text-sm font-medium text-gray-200">
                    Followed by
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 text-left text-2xl font-semibold`}>
                      {collectionFollowers.length}
                    </span>
                    <AvatarIcons
                      profiles={collectionFollowers.map((f) => ({
                        address: f.from.address,
                        data: {
                          twitterHandle: f.from.profile?.handle,
                          pfpUrl: f.from.profile?.profileImageUrlLowres,
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
        </div>

        <div className="w-full">
          <div className="flex space-x-1 p-1">
            <Tab
              title={`NFTs`}
              selected={router.pathname.includes('nfts')}
              url={`/collections/${collectionUrlAddress}/nfts`}
            />
            <Tab
              title={'About'}
              selected={router.pathname.includes('about')}
              url={`/collections/${collectionUrlAddress}/about`}
            />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}

const Tab = (props: { url: string; selected: boolean; title: string }) => (
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
