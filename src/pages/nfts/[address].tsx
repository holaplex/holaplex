import React, { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useNftActivityLazyQuery, useNftMarketplaceLazyQuery } from '@/graphql/indexerTypes';
import clsx from 'clsx';
import { shortenAddress } from '@/modules/utils/string';
import Link from 'next/link';
import Custom404 from '../404';
import Accordion from '@/components/Accordion';
import MoreDropdown from '@/components/MoreDropdown';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

import { Tag } from '@/assets/icons/Tag';
import Button from '@/components/Button';
import {
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
  OPENSEA_MARKETPLACE_ADDRESS,
  AUCTION_HOUSE_ADDRESSES,
  MARKETPLACE_PROGRAMS,
} from 'src/views/_global/holaplexConstants';
import { DisplaySOL } from 'src/components/CurrencyHelpers';
import Modal from 'src/components/Modal';
import CancelOfferForm from 'src/components/CancelOfferForm';
import { AhListing, Offer, Marketplace, Nft } from '@holaplex/marketplace-js-sdk';
import { useRouter } from 'next/router';
import UpdateOfferForm from '@/components/UpdateOfferForm';
import SellForm from '@/components/SellForm';
import CancelSellForm from '@/components/CancelSellForm';
import BuyForm from '@/components/BuyForm';
import UpdateSellForm from '@/components/UpdateSellForm';
import AcceptOfferForm from '@/components/AcceptOfferForm';
import { format as formatTime } from 'timeago.js';
import { apolloClient } from '@/graphql/apollo';
import { ShareNftDocument, ShareNftQuery } from '@/graphql/indexerTypes.ssr';
import Head from 'next/head';
import { Avatar, AvatarIcons } from 'src/components/Avatar';
import { seededRandomBetween } from '@/modules/utils/random';
import { SolscanIcon } from '@/assets/icons/Solscan';
import { ExplorerIcon } from '@/assets/icons/Explorer';
import NFTFile from '@/components/NFTFile';
import { ClipboardCheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { ButtonSkeleton } from '@/components/Skeletons';
import { DollarSign, Tag as FeatherTag, Zap } from 'react-feather';
import Popover from '../../components/Popover';
import { LightningBoltIcon, TagIcon } from '@heroicons/react/outline';
import { ProfileChip } from '@/components/ProfileChip';
import { getAuctionHouseInfo } from '../../modules/utils/marketplace';

// TODO: update sdk to include marketplaceProgramAddress
export interface AhListingMultiMarketplace extends AhListing {
  marketplaceProgramAddress?: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nftAddress = context?.params?.address ?? '';

  try {
    const { data } = await apolloClient.query<ShareNftQuery>({
      query: ShareNftDocument,
      variables: {
        subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
        address: context?.params?.address,
      },
    });

    const nftToShare = data.nft || data.nftByMintAddress || null;

    const offers = nftToShare?.offers || [];
    const topOffers = offers?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
    const topOffer = topOffers?.[0];

    const listings = nftToShare?.listings || [];
    const topListings =
      listings?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
    const topListing = topListings?.[0];
    return {
      props: {
        address: nftAddress,
        name: nftToShare?.name || nftAddress,
        description: nftToShare?.description || '',
        image:
          nftToShare?.image ||
          `/images/gradients/gradient-${seededRandomBetween(
            new PublicKey(nftAddress).toBytes().reduce((a, b) => a + b, 0) + 1,
            1,
            8
          )}.png`,
        listedPrice: Number(topListing?.price) / LAMPORTS_PER_SOL || 0,
        offerPrice: Number(topOffer?.price) / LAMPORTS_PER_SOL || 0,
      },
    };
  } catch (err) {
    return {
      props: {
        address: nftAddress,
        name: '',
        description: '',
        image: '',
        listedPrice: 0,
        offerPrice: 0,
      },
    };
  }
};

export default function NftByAddress({
  address,
  name,
  description,
  image,
}: {
  address: string;
  name?: string;
  description?: string;
  image?: string;
}) {
  const { publicKey } = useWallet();
  const router = useRouter();

  const [queryNft, { data, loading, called, refetch, error }] = useNftMarketplaceLazyQuery();
  const [queryNftActivity, activityContext] = useNftActivityLazyQuery();

  useEffect(() => {
    if (!data?.nft?.mintAddress) return;

    try {
      queryNftActivity({
        variables: {
          address: data?.nft?.mintAddress,
        },
      });
    } catch (error: any) {
      console.error(error);
    }
  }, [data?.nft?.mintAddress, queryNftActivity]);

  useEffect(() => {
    if (!address) return;

    try {
      queryNft({
        variables: {
          subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
          address,
        },
      });
    } catch (error: any) {
      console.error(error);
      // Bugsnag.notify(error);
    }
  }, [address, queryNft]);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [router, router.push, refetch]);

  const [offerModalVisibility, setOfferModalVisibility] = useState(false);
  const [offerUpdateModalVisibility, setOfferUpdateModalVisibility] = useState(false);
  const [sellModalVisibility, setSellModalVisibility] = useState(false);
  const [sellCancelModalVisibility, setSellCancelModalVisibility] = useState(false);
  const [sellUpdateModalVisibility, setSellUpdateModalVisibility] = useState(false);

  const nft = data?.nft || data?.nftByMintAddress;
  const marketplace = data?.marketplace;

  // has listed via default Holaplex marketplace (disregards others)
  const defaultListing = nft?.listings.find(
    (listing) => listing?.auctionHouse?.address.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
  );

  const otherListings = nft?.listings.filter(
    (listing) => listing.auctionHouse?.address.toString() !== HOLAPLEX_MARKETPLACE_ADDRESS
  );

  const hasDefaultListing = Boolean(defaultListing);
  const offer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasAddedOffer = Boolean(offer);

  const { offers, sortedOffers, topOffers } = useMemo(() => {
    const offers = nft?.offers || [];
    const sortedOffers = Array.from(offers).sort((offerA, offerB) => {
      return offerA.createdAt < offerB.createdAt ? 1 : -1;
    });
    const topOffers = offers?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
    return {
      offers,
      sortedOffers,
      topOffers,
    };
  }, [nft?.offers]);

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const topOffer = topOffers?.[0];
  const hasOffers = Boolean(topOffer);

  const openOfferUpdateModal = () => {
    setOfferModalVisibility(false);
    setOfferUpdateModalVisibility(true);
  };

  const updateListingFromCancel = () => {
    setSellCancelModalVisibility(false);
    setSellUpdateModalVisibility(true);
  };

  const DetailAddressRow = ({
    address,
    title,
    viewOnSite = false,
  }: {
    address?: string;
    title: string;
    viewOnSite?: boolean;
  }) => {
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
      if (linkCopied) {
        const timer = setTimeout(() => {
          setLinkCopied(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [linkCopied]);

    const handleCopyClick = async () => {
      await navigator.clipboard.writeText(address || `Error`);
      setLinkCopied(true);
    };
    return (
      <div className={`flex items-center justify-between`}>
        <p className={`m-0 text-base font-normal text-gray-300`}>{title}</p>
        <div className={`flex flex-row items-center justify-end gap-2`}>
          {viewOnSite && (
            <Link href={`/collections/${address}`}>
              <a target={`_self`}>
                <FeatherIcon
                  icon="folder"
                  aria-hidden="true"
                  className={`h-4 w-4 text-white hover:text-gray-300`}
                />
              </a>
            </Link>
          )}
          <Link href={`https://explorer.solana.com/address/${address}`}>
            <a target={`_blank`}>
              <ExplorerIcon width={16} height={16} className={`ease-in-out hover:text-gray-300`} />
            </a>
          </Link>
          <Link href={`https://solscan.io/account/${address}`}>
            <a target={`_blank`}>
              <SolscanIcon width={16} height={16} className={`ease-in-out hover:text-gray-300`} />
            </a>
          </Link>
          <button
            onClick={handleCopyClick}
            className={`relative m-0 w-24 text-left text-base font-normal text-gray-200 hover:text-gray-300`}
          >
            <Popover
              isShowOnHover={true}
              placement={`top`}
              content={
                <p className={`whitespace-nowrap p-2 text-sm`}>
                  {linkCopied ? `Address copied` : `Copy address`}
                </p>
              }
            >
              <p className={`m-0`}>{shortenAddress(address)}</p>
            </Popover>
          </button>
        </div>
      </div>
    );
  };

  if (called && !nft && !loading) {
    return <Custom404 />;
  }

  return (
    <>
      <div className="container mx-auto px-6 pb-20 md:px-12">
        <Head>
          <meta charSet={`utf-8`} />
          <title>{name} NFT | Holaplex</title>
          {/* Search Engine */}
          <meta property="description" key="description" content={description} />
          <meta property="image" key="image" content={image} />
          {/* Schema */}
          <meta itemProp="name" content={`${name} NFT | Holaplex`} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={image} />
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${name} NFT | Holaplex`} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image:src" content={image} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:site" content="@holaplex" />
          {/* Open Graph */}
          <meta property="og:title" content={`${name} NFT | Holaplex`} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta property="og:url" content={`https://holaplex.com/nfts/${address}`} />
          <meta property="og:site_name" content="Holaplex" />
          <meta property="og:type" content="website" />
        </Head>
        <div className=" text-white">
          <div className="mt-12 mb-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="mb-4 block lg:mb-0 lg:items-center lg:justify-center ">
              <div className="mb-6 block lg:hidden">
                {loading ? (
                  <div className="h-32 w-full rounded-lg bg-gray-800" />
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h1 className="!mb-4 !text-2xl !font-semibold">{nft?.name}</h1>
                      <MoreDropdown address={nft?.address || ''} />
                    </div>

                    <p className="text-lg">{nft?.description}</p>
                  </>
                )}
              </div>
              <div>
                <NFTFile loading={loading} nft={nft as Nft | any} />
                <div className="mt-10 flex flex-col justify-between sm:flex-row sm:flex-nowrap">
                  <div className="flex flex-col">
                    <div className="label mb-4 font-medium text-gray-300">
                      {loading ? <div className="h-4 w-14 rounded bg-gray-800" /> : 'Created by'}
                    </div>
                    <ul className="mb-0 flex h-full items-center">
                      {loading ? (
                        <li>
                          <div className="h-6 w-20 rounded bg-gray-800" />
                        </li>
                      ) : nft?.creators.length === 1 ? (
                        <ProfileChip user={nft.creators[0]} />
                      ) : (
                        <div>{nft?.creators && <AvatarIcons profiles={nft.creators} />}</div>
                      )}
                    </ul>
                  </div>
                  {nft?.collection?.address && (
                    <div
                      className={clsx('mt-10 flex max-w-fit flex-col sm:mt-0', loading && 'hidden')}
                    >
                      <div className="label mb-4 font-medium text-gray-300 sm:self-end">
                        Collection
                      </div>

                      <Link href={`/collections/${nft?.collection?.address}`}>
                        <a className="flex items-center space-x-2 rounded-md py-3 pl-2 pr-4 shadow-2xl shadow-black">
                          {nft?.collection?.image && (
                            <img
                              className="h-8 w-8 rounded-md object-cover"
                              alt={nft.collection?.name}
                              src={nft?.collection.image}
                            />
                          )}
                          <span>{nft.collection.name}</span>
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-8 hidden lg:block">
                {loading ? (
                  <div className="h-32 w-full rounded-lg bg-gray-800" />
                ) : (
                  <>
                    <div className="flex justify-between">
                      <h1 className="mb-4 text-2xl font-semibold">{nft?.name}</h1>
                      <MoreDropdown address={nft?.address || ''} />
                    </div>

                    <p className="text-lg">{nft?.description}</p>
                  </>
                )}
              </div>
              <div className="mb-8 max-w-fit">
                <div className="label mb-4 font-medium text-gray-300">
                  {loading ? <div className="h-4 w-14 rounded bg-gray-800" /> : 'Owned by'}
                </div>
                {nft?.owner && <ProfileChip user={nft?.owner} />}
              </div>
              <div className={`grid grid-cols-1 gap-10`}>
                {/* TODO: cleanup this conditional mess in favor of a component that handles all the different states */}
                {/* Not listed */}
                {!hasDefaultListing && (
                  <div className={`flex flex-col rounded-md bg-gray-800 p-6`}>
                    {isOwner && hasOffers && (
                      <div
                        className={`mb-6 flex w-full items-center justify-between border-b border-gray-700 pb-6`}
                      >
                        <div>
                          <h3 className={`text-base font-medium text-gray-300`}>Highest offer</h3>
                          <DisplaySOL amount={topOffer?.price} />
                        </div>
                        <div className={`flex w-1/2 sm:flex`}>
                          <AcceptOfferForm
                            nft={nft as Nft | any}
                            offer={topOffer as Offer}
                            listing={defaultListing as AhListingMultiMarketplace}
                            marketplace={marketplace as Marketplace}
                            refetch={refetch}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`flex w-full items-center justify-between`}>
                      <div className={`flex items-center`}>
                        <Tag className={`mr-2`} />
                        <h3 className={` text-base font-medium text-gray-300`}>
                          Not Listed {otherListings && otherListings.length > 0 && `on Holaplex`}
                        </h3>
                      </div>
                      {hasAddedOffer && (
                        <ul className={`flex flex-col sm:hidden`}>
                          <li className={`text-base text-gray-300`}>Your offer </li>
                          <DisplaySOL amount={offer?.price} />
                        </ul>
                      )}
                      {!hasAddedOffer && !isOwner && (
                        <div>
                          {loading ? (
                            <ButtonSkeleton />
                          ) : (
                            !Boolean(otherListings) && (
                              <Link href={`/nfts/${nft?.address}/offers/new`}>
                                <a>
                                  <Button>Make offer</Button>
                                </a>
                              </Link>
                            )
                          )}
                        </div>
                      )}
                      {isOwner &&
                        (loading ? (
                          <ButtonSkeleton />
                        ) : (
                          <Button onClick={() => setSellModalVisibility(true)}>List NFT</Button>
                        ))}
                    </div>
                    {offer && (
                      <div
                        className={`mt-6 flex items-center justify-center border-t border-gray-700 pt-6 sm:justify-between`}
                      >
                        <ul className={`mb-0 hidden flex-col sm:flex`}>
                          <li className={`text-base text-gray-300`}>Your offer </li>
                          <DisplaySOL amount={offer?.price} />
                        </ul>
                        <div className={`grid w-full grid-cols-2 gap-4 sm:w-auto`}>
                          <Button secondary onClick={() => setOfferModalVisibility(true)}>
                            Cancel offer
                          </Button>
                          <Button onClick={() => setOfferUpdateModalVisibility(true)}>
                            Update offer
                          </Button>
                        </div>
                      </div>
                    )}
                    {Boolean(otherListings) &&
                      otherListings?.map((otherListing, i) => {
                        const auctionHouseInfo = getAuctionHouseInfo(
                          otherListing as AhListingMultiMarketplace
                        );
                        return (
                          <div
                            key={`listing-${otherListing?.auctionHouse?.address}-${i}`}
                            className={`mt-6 border-t border-gray-700 pt-6`}
                          >
                            {auctionHouseInfo.name === 'Unknown Marketplace' ? (
                              <div>
                                <p
                                  className={`flex items-center justify-center gap-2 text-center text-base font-medium text-gray-300`}
                                >
                                  <span>
                                    <ExclamationCircleIcon className={`h-6 w-6`} />
                                  </span>
                                  This NFT is listed on an unknown AuctionHouse
                                </p>
                              </div>
                            ) : (
                              <>
                                <p
                                  className={`flex flex-row items-center gap-2 text-sm font-medium text-gray-300`}
                                >
                                  Listed on{' '}
                                  <span className={`flex items-center gap-1 font-bold text-white`}>
                                    <img
                                      src={auctionHouseInfo?.logo}
                                      alt={auctionHouseInfo.name}
                                      className={`h-4 w-4 rounded-sm`}
                                    />
                                    {auctionHouseInfo?.name}
                                  </span>
                                </p>
                                <div
                                  className={
                                    'flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-between'
                                  }
                                >
                                  <div>
                                    <h3 className={`text-base font-medium text-gray-300`}>Price</h3>
                                    <DisplaySOL amount={otherListing?.price} />
                                  </div>
                                  <div className={`flex w-full items-center gap-2 sm:w-auto`}>
                                    <Link href={`/nfts/${nft?.address}/offers/new`}>
                                      <a className={`w-full`}>
                                        <Button className={`w-full`} secondary>
                                          Make offer
                                        </Button>
                                      </a>
                                    </Link>
                                    {auctionHouseInfo.link &&
                                    otherListing?.auctionHouse === null ? (
                                      <Link href={`${auctionHouseInfo?.link}${nft?.mintAddress}`}>
                                        <a target={`_blank`}>
                                          <Button>View listing</Button>
                                        </a>
                                      </Link>
                                    ) : (
                                      <BuyForm
                                        loading={loading}
                                        nft={nft as Nft | any}
                                        marketplace={marketplace as Marketplace}
                                        listing={otherListing as AhListingMultiMarketplace}
                                        refetch={refetch}
                                        className={`w-full`}
                                      />
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}

                {hasDefaultListing && (
                  <div className={`flex flex-col rounded-md bg-gray-800 p-6`}>
                    {isOwner && hasOffers && (
                      <div
                        className={`mb-6 flex w-full items-center justify-between border-b border-gray-700 pb-6`}
                      >
                        <div>
                          <h3 className={`text-base font-medium text-gray-300`}>Highest offer</h3>
                          <DisplaySOL amount={topOffer?.price} />
                        </div>
                        <div className={`hidden w-1/2 sm:flex`}>
                          <AcceptOfferForm
                            nft={nft as Nft | any}
                            offer={topOffer as Offer}
                            listing={defaultListing as AhListingMultiMarketplace}
                            marketplace={marketplace as Marketplace}
                            refetch={refetch}
                            className={`w-full`}
                          />
                        </div>
                        <div className={`sm:hidden`}>
                          <h3 className={`flex text-base font-medium text-gray-300`}>Price</h3>
                          <DisplaySOL amount={defaultListing?.price} />
                        </div>
                      </div>
                    )}
                    {!hasOffers && isOwner && (
                      <div
                        className={`mb-6 flex w-full items-center justify-between border-b border-gray-700 pb-6 sm:hidden`}
                      >
                        <div>
                          <h3 className={`text-base font-medium text-gray-300`}>Price</h3>
                          <DisplaySOL amount={defaultListing?.price} />
                        </div>
                        <div>
                          <Button
                            className={`w-full`}
                            onClick={() => setSellUpdateModalVisibility(true)}
                          >
                            Update price
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className={`flex w-full items-center justify-between`}>
                      <div className={`hidden sm:inline-block`}>
                        <h3 className={`text-base font-medium text-gray-300`}>Price</h3>
                        <DisplaySOL amount={defaultListing?.price} />
                      </div>

                      {isOwner ? (
                        <div className={`grid w-full grid-cols-2 gap-6 sm:w-auto sm:gap-4`}>
                          {hasOffers && (
                            <>
                              <div className={`col-span-2 sm:hidden`}>
                                <AcceptOfferForm
                                  nft={nft as Nft | any}
                                  offer={topOffer as Offer}
                                  listing={defaultListing as AhListingMultiMarketplace}
                                  marketplace={marketplace as Marketplace}
                                  refetch={refetch}
                                  className="w-full"
                                />
                              </div>
                              <Button secondary onClick={() => setSellCancelModalVisibility(true)}>
                                Cancel listing
                              </Button>
                              <Button
                                secondary
                                className={`sm:bg-white sm:text-black`}
                                onClick={() => setSellUpdateModalVisibility(true)}
                              >
                                Update price
                              </Button>
                            </>
                          )}
                          {!hasOffers && hasDefaultListing && (
                            <div className={`col-span-2 sm:flex`}>
                              <Button
                                secondary
                                onClick={() => setSellCancelModalVisibility(true)}
                                className={`w-full sm:mr-4`}
                              >
                                Cancel listing
                              </Button>
                              <Button
                                secondary
                                className={`hidden sm:flex sm:bg-white sm:text-black`}
                                onClick={() => setSellUpdateModalVisibility(true)}
                              >
                                Update price
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {hasAddedOffer ? (
                            <>
                              <ul className={`mb-0 flex flex-col items-center sm:hidden`}>
                                <li className={`text-base text-gray-300`}>Your offer </li>
                                <DisplaySOL amount={offer?.price} />
                              </ul>
                              <ul
                                className={`mb-0 flex flex-col  justify-end text-right sm:hidden`}
                              >
                                <li className={`text-right text-base text-gray-300`}>Price</li>
                                <DisplaySOL amount={defaultListing?.price} />
                              </ul>
                            </>
                          ) : (
                            <div className={`flex w-full flex-col sm:hidden`}>
                              <div className={`flex w-full items-center justify-between`}>
                                <ul className={`mb-0 flex flex-col items-center sm:hidden`}>
                                  <li className={`text-base text-gray-300`}>Price</li>
                                  <DisplaySOL amount={defaultListing?.price} />
                                </ul>
                                <div className={`w-1/2 sm:hidden`}>
                                  <BuyForm
                                    loading={loading}
                                    nft={nft as Nft | any}
                                    marketplace={marketplace as Marketplace}
                                    listing={defaultListing as AhListingMultiMarketplace}
                                    refetch={refetch}
                                    className={`w-full`}
                                  />
                                </div>
                              </div>
                              <div className={`mt-4 flex w-full border-t border-gray-700 pt-4`}>
                                {loading ? (
                                  <ButtonSkeleton />
                                ) : (
                                  <Link href={`/nfts/${nft?.address}/offers/new`}>
                                    <a className={`w-full`}>
                                      <Button className={`w-full`} secondary>
                                        Make offer
                                      </Button>
                                    </a>
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}

                          <div
                            className={` ${
                              hasAddedOffer ? `w-1/2` : `grid grid-cols-2`
                            } hidden gap-4 sm:flex`}
                          >
                            {!hasAddedOffer &&
                              (loading ? (
                                <ButtonSkeleton />
                              ) : (
                                <Link href={`/nfts/${nft?.address}/offers/new`}>
                                  <a>
                                    <Button secondary>Make offer</Button>
                                  </a>
                                </Link>
                              ))}
                            <BuyForm
                              loading={loading}
                              nft={nft as Nft | any}
                              marketplace={marketplace as Marketplace}
                              listing={defaultListing as AhListingMultiMarketplace}
                              refetch={refetch}
                              className={`w-full`}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <p className={`m-0 mt-4 text-right text-xs font-medium text-gray-300`}>
                      SOL, ETH, and Credit Card supported
                    </p>
                    {offer && (
                      <div
                        className={`mt-6 flex items-center justify-center border-t border-gray-700 pt-6 sm:justify-between`}
                      >
                        {hasAddedOffer && (
                          <ul className={`mb-0 hidden flex-col items-center sm:flex`}>
                            <li className={`whitespace-nowrap text-base text-gray-300`}>
                              Your offer
                            </li>
                            <DisplaySOL amount={offer?.price} />
                          </ul>
                        )}

                        <div className={`grid w-full grid-cols-2 gap-6 sm:w-auto sm:gap-4`}>
                          <BuyForm
                            loading={loading}
                            nft={nft as Nft | any}
                            marketplace={marketplace as Marketplace}
                            listing={defaultListing as AhListingMultiMarketplace}
                            refetch={refetch}
                            className={`col-span-2 w-full sm:hidden`}
                          />
                          <div
                            className={`col-span-2 grid w-full grid-cols-2 gap-6 sm:w-auto sm:gap-4`}
                          >
                            <Button
                              secondary
                              className={`w-full`}
                              onClick={() => setOfferModalVisibility(true)}
                            >
                              Cancel offer
                            </Button>
                            <Button
                              onClick={() => setOfferUpdateModalVisibility(true)}
                              secondary
                              className={`w-full sm:bg-white sm:text-black`}
                            >
                              Update offer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {Boolean(otherListings) &&
                      otherListings?.map((otherListing, i) => {
                        const auctionHouseInfo = getAuctionHouseInfo(
                          otherListing as AhListingMultiMarketplace
                        );
                        return (
                          <div
                            key={`listing-${otherListing.auctionHouse?.address}-${i}`}
                            className={`mt-6 border-t border-gray-700 pt-6`}
                          >
                            <p
                              className={`flex flex-row items-center gap-2 text-sm font-medium text-gray-300`}
                            >
                              Listed on{' '}
                              <span className={`flex items-center gap-1 font-bold text-white`}>
                                <img
                                  src={auctionHouseInfo?.logo}
                                  alt={auctionHouseInfo.name}
                                  className={`h-4 w-4 rounded-sm`}
                                />
                                {auctionHouseInfo?.name}
                              </span>
                            </p>
                            <div
                              className={
                                'flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-between'
                              }
                            >
                              <div>
                                <h3 className={`text-base font-medium text-gray-300`}>Price</h3>
                                <DisplaySOL amount={otherListing?.price} />
                              </div>
                              <div className={`flex w-full items-center gap-2 sm:w-auto`}>
                                <Link href={`/nfts/${nft?.address}/offers/new`}>
                                  <a className={`w-full`}>
                                    <Button className={`w-full`} secondary>
                                      Make offer
                                    </Button>
                                  </a>
                                </Link>
                                {auctionHouseInfo.link && otherListing.auctionHouse === null ? (
                                  <Link href={`${auctionHouseInfo?.link}${nft?.mintAddress}`}>
                                    <a target={`_blank`}>
                                      <Button>View listing</Button>
                                    </a>
                                  </Link>
                                ) : (
                                  <BuyForm
                                    loading={loading}
                                    nft={nft as Nft | any}
                                    marketplace={marketplace as Marketplace}
                                    listing={otherListing as AhListingMultiMarketplace}
                                    refetch={refetch}
                                    className={`w-full`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {nft?.attributes && nft.attributes.length > 0 && (
                  <div>
                    <Accordion title="Attributes" amount={nft.attributes.length}>
                      <div className="grid grid-cols-2 gap-4">
                        {loading ? (
                          <div>
                            <div className="h-16 rounded bg-gray-800" />
                            <div className="h-16 rounded bg-gray-800" />
                            <div className="h-16 rounded bg-gray-800" />
                            <div className="h-16 rounded bg-gray-800" />
                          </div>
                        ) : (
                          nft?.attributes.map((a) => (
                            <div
                              key={a.traitType}
                              className="max-h-[300px] rounded border border-gray-800 p-4"
                            >
                              <p className="label mb-1 truncate text-base font-medium text-gray-300">
                                {a.traitType}
                              </p>
                              <p className="mb-0 truncate text-ellipsis">{a.value}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </Accordion>
                  </div>
                )}

                {nft?.mintAddress && nft.address && (
                  <div>
                    <Accordion title={`Details`}>
                      <div className={`grid grid-cols-1 gap-4`}>
                        <DetailAddressRow title={`Mint address`} address={nft.mintAddress} />
                        <DetailAddressRow title={`Token address`} address={nft.address} />
                        {nft.collection && (
                          <>
                            <DetailAddressRow
                              title={`Collection`}
                              address={nft.collection.mintAddress}
                            />
                            <DetailAddressRow
                              viewOnSite={true}
                              title={`Collection token address`}
                              address={nft.collection.address}
                            />
                          </>
                        )}

                        {/*                         <DetailAddressRow
                          title={`Auction house`}
                          address={defaultListing?.address}
                        /> */}
                        <div className={`flex items-center justify-between`}>
                          <p className={`m-0 text-base font-normal text-gray-300`}>
                            Creator royalties
                          </p>
                          <p className={`m-0 text-base font-normal text-gray-300`}>
                            {Number(nft.sellerFeeBasisPoints) / 100}%
                          </p>
                        </div>
                        <div className={`flex items-center justify-between`}>
                          <p className={`m-0 text-base font-normal text-gray-300`}>
                            Transaction fee
                          </p>
                          <p className={`m-0 text-base font-normal text-gray-300`}>
                            {Number(marketplace?.auctionHouses[0]?.sellerFeeBasisPoints) / 100}%
                          </p>
                        </div>
                      </div>
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`my-10 flex flex-col justify-between text-sm sm:text-base md:text-lg`}>
            {loading ? (
              <div className="h-32 w-full rounded-lg bg-gray-800" />
            ) : (
              <Accordion title={`Offers`} amount={offers.length} defaultOpen>
                <section className={`w-full`}>
                  {hasOffers && (
                    <header
                      className={`mb-2 grid ${
                        isOwner || hasAddedOffer ? `grid-cols-4` : `grid-cols-3`
                      } items-center px-4`}
                    >
                      <span className={`text-xs text-gray-300`}>WALLET</span>
                      <span className={`text-xs text-gray-300`}>PRICE</span>
                      <span className={`text-xs text-gray-300`}>TIME</span>
                      {isOwner && <span className={`text-xs text-gray-300`}></span>}
                    </header>
                  )}

                  {!hasOffers && (
                    <div className="w-full rounded-lg border border-gray-800 p-10 text-center">
                      <h3>No offers found</h3>
                      <p className="mt- text-gray-500">
                        There are currently no offers on this NFT.
                      </p>
                    </div>
                  )}
                  {hasOffers &&
                    sortedOffers?.map((o) => (
                      <article
                        key={o.id}
                        className={`mb-4 grid rounded border border-gray-800 p-4 ${
                          isOwner || hasAddedOffer ? `grid-cols-4` : `grid-cols-3`
                        }`}
                      >
                        <div className={`flex items-center`}>
                          <Link href={`/profiles/${o.buyer}`}>
                            <a rel={`nofollower`}>
                              {<Avatar address={o.buyer} /> || shortenAddress(o.buyer)}
                            </a>
                          </Link>
                        </div>
                        <div className={`flex items-center`}>
                          <DisplaySOL amount={o.price.toNumber()} />
                        </div>
                        <div className={`flex items-center`}>
                          {formatTime(o.createdAt, `en_US`)}
                        </div>
                        {(hasAddedOffer || isOwner) && (
                          <div className={`flex w-full items-center justify-end gap-2`}>
                            {o.buyer === (publicKey?.toBase58() as string) && !isOwner && (
                              <Button secondary onClick={() => setOfferModalVisibility(true)}>
                                Cancel offer
                              </Button>
                            )}
                            {isOwner && (
                              <AcceptOfferForm
                                nft={nft as Nft | any}
                                offer={o as Offer}
                                listing={defaultListing as AhListingMultiMarketplace}
                                marketplace={marketplace as Marketplace}
                                refetch={refetch}
                                className={`justify-end`}
                              />
                            )}
                          </div>
                        )}
                      </article>
                    ))}
                </section>
              </Accordion>
            )}
          </div>
          <div className={`my-10 flex flex-col justify-between text-sm sm:text-base md:text-lg`}>
            {activityContext.loading ? (
              <div className="h-32 w-full rounded-lg bg-gray-800" />
            ) : (
              <Accordion
                title={`Activity`}
                amount={activityContext.data?.nftByMintAddress?.activities.length}
              >
                <header className={`mb-2 grid grid-cols-4 items-center px-4`}>
                  <span className={`text-xs text-gray-300`}>EVENT</span>
                  <span className={`text-xs text-gray-300`}>WALLET</span>
                  <span className={`text-xs text-gray-300`}>PRICE</span>
                  <span className={`text-xs text-gray-300`}>TIME</span>
                </header>

                {!!activityContext.data?.nftByMintAddress?.activities.length &&
                  activityContext.data?.nftByMintAddress?.activities?.map((a) => {
                    const multipleWallets = a.wallets.length > 1;
                    return (
                      <article
                        key={a.id}
                        className="mb-4 grid grid-cols-4 rounded border border-gray-700 p-4"
                      >
                        <div className="flex self-center">
                          {a.activityType === 'purchase' && (
                            // <FeatherTag  size="18" />
                            <TagIcon className="mr-2 h-4 w-4 self-center text-gray-300" />
                          )}
                          <div>{a.activityType === 'purchase' && 'Sold'}</div>

                          {a.activityType === 'offer' && (
                            // <Zap className="mr-2 self-center text-gray-300" size="18" />
                            <LightningBoltIcon className="mr-2 h-4 w-4 self-center text-gray-300" />
                          )}
                          <div>{a.activityType === 'offer' && 'Offer Made'}</div>
                          {a.activityType === 'listing' && (
                            // <FeatherTag className="mr-2 self-center text-gray-300" size="18" />
                            <TagIcon className="mr-2 h-4 w-4 self-center text-gray-300" />
                          )}
                          <div>{a.activityType === 'listing' && 'Listed'}</div>
                        </div>
                        <div
                          className={clsx('flex items-center self-center ', {
                            '-ml-6': multipleWallets,
                          })}
                        >
                          {multipleWallets && (
                            <img
                              src="/images/svgs/uturn.svg"
                              className="mr-2 w-4 text-gray-300"
                              alt="wallets"
                            />
                          )}
                          <div className="flex flex-col">
                            <a
                              href={`https://holaplex.com/profiles/${a.wallets[0].address}`}
                              rel="nofollower"
                              className="text-sm"
                            >
                              <Avatar
                                border
                                address={a.wallets[0].address}
                                data={{
                                  twitterHandle: a.wallets[0].profile?.handle,
                                  pfpUrl: a.wallets[0]?.profile?.profileImageUrlLowres,
                                }}
                              />
                            </a>
                            {multipleWallets && (
                              <a
                                href={`https://holaplex.com/profiles/${a.wallets[1].address}`}
                                rel="nofollower"
                                className="text-sm"
                              >
                                <Avatar
                                  border
                                  data={{
                                    twitterHandle: a.wallets[1].profile?.handle,
                                    pfpUrl: a.wallets[1]?.profile?.profileImageUrlLowres,
                                  }}
                                  address={a.wallets[1].address}
                                />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="self-center">
                          <span className="sol-amount">
                            {/* TODO: how to support multiple tokens */}
                            <DisplaySOL amount={a.price.toNumber()} />
                          </span>
                        </div>
                        <div className="self-center text-sm">
                          {formatTime(a.createdAt, `en_US`)}
                        </div>
                      </article>
                    );
                  })}
              </Accordion>
            )}
          </div>
        </div>

        {nft && (
          <>
            <Modal
              open={offerModalVisibility}
              setOpen={setOfferModalVisibility}
              title={`Cancel offer`}
            >
              <CancelOfferForm
                nft={nft as Nft | any}
                marketplace={marketplace as Marketplace}
                refetch={refetch}
                offer={offer as Offer}
                setOpen={setOfferModalVisibility}
                updateOffer={openOfferUpdateModal}
              />
            </Modal>
            <Modal
              open={offerUpdateModalVisibility}
              setOpen={setOfferUpdateModalVisibility}
              title={`Update offer`}
            >
              <UpdateOfferForm
                listing={defaultListing as AhListingMultiMarketplace}
                setOpen={setOfferUpdateModalVisibility}
                nft={nft as Nft | any}
                marketplace={marketplace as Marketplace}
                refetch={refetch}
                loading={loading}
                hasListing={hasDefaultListing}
              />
            </Modal>
            <Modal
              open={sellModalVisibility}
              setOpen={setSellModalVisibility}
              title={`List NFT for sale`}
            >
              <SellForm
                setOpen={setSellModalVisibility}
                nft={nft as Nft | any}
                refetch={refetch}
                loading={loading}
                marketplace={marketplace as Marketplace}
              />
            </Modal>
            <Modal
              open={sellCancelModalVisibility}
              setOpen={setSellCancelModalVisibility}
              title="Cancel listing"
            >
              <CancelSellForm
                nft={nft as Nft | any}
                refetch={refetch}
                marketplace={marketplace as Marketplace}
                listing={defaultListing as AhListingMultiMarketplace}
                setOpen={setSellCancelModalVisibility}
                updateListing={updateListingFromCancel}
              />
            </Modal>
            <Modal
              open={sellUpdateModalVisibility}
              setOpen={setSellUpdateModalVisibility}
              title={`Update listing price`}
            >
              <UpdateSellForm
                nft={nft as Nft | any}
                refetch={refetch}
                marketplace={marketplace as Marketplace}
                listing={defaultListing as AhListingMultiMarketplace}
                setOpen={setSellUpdateModalVisibility}
                offer={topOffer as Offer}
              />
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
