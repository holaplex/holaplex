import { CollectionRaisedCard } from '@/views/collections/CollectionRaisedCard';
import { CollectionPageProps } from '@/views/collections/collections.utils';
import { AvatarIcons } from 'src/components/Avatar';
import { FollowUnfollowButton } from 'src/components/FollowUnfollowButton';
import { User } from 'src/views/alpha/feed.utils';
import { ProfileHandle, ProfilePFP } from 'src/views/alpha/FeedCard';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useMemo } from 'react';
import { useAllConnectionsToQuery, useIsXFollowingYQuery } from 'src/graphql/indexerTypes';
import { ExplorerIcon } from '@/assets/icons/Explorer';
import { SolscanIcon } from '@/assets/icons/Solscan';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { ProfileChip } from '@/components/ProfileChip';

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
      <div className="container mx-auto mt-10 px-6 xl:mt-20">
        <div className="relative  mb-10 flex w-full flex-col items-start lg:flex-row lg:justify-between">
          <div className="  flex w-full flex-col items-center lg:mx-0 lg:flex-row">
            <img
              src={collection?.image}
              className="mb-10 aspect-square h-28 w-28 rounded-2xl bg-gray-900 object-cover shadow-2xl ring-8 ring-gray-900 lg:mb-0 lg:mr-10"
              alt="Collection logo"
            />
            <div>
              {/* <span className="text-base text-gray-300">Collection of X</span> */}
              <h1 className="mb-6 text-5xl"> {collection?.name} </h1>
              <div className={`flex items-center justify-center gap-6 lg:justify-start`}>
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
            <div className={`lg:ml-auto`}>
              <div className="rounded-2xl p-4 shadow-2xl">
                <div>
                  <div className="mb-4 cursor-pointer text-sm font-medium text-gray-200">
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
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start">
          {creators.length === 1 ? (
            <ProfileChip user={creators[0]} />
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

        <div className="mt-10 w-full pb-20">
          <div className="mb-6 flex space-x-1 p-1">
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
      className={clsx(
        'w-full  border-b py-2.5 text-center text-sm font-medium text-white ',
        props.selected ? ' border-white' : 'border-gray-800  text-gray-300 hover:text-white'
      )}
    >
      {props.title}
    </a>
  </Link>
);
