import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { ListingReceipt, useNftMarketplaceLazyQuery } from '../../src/graphql/indexerTypes';
import cx from 'classnames';
import { shortenAddress } from '../../src/modules/utils/string';
import Link from 'next/link';
import Custom404 from '../404';
import Accordion from '../../src/common/components/elements/Accordion';
import MoreDropdown from '../../src/common/components/elements/MoreDropdown';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { DateTime } from 'luxon';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolIcon } from '../../src/common/components/elements/Price';
import { useWallet } from '@solana/wallet-adapter-react';

import { Tag } from '@/components/icons/Tag';
import Button from '@/components/elements/Button';
import {
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
} from '@/constants/marketplace';
import { DisplaySOL } from '@/components/CurrencyHelpers';
import Modal from '@/components/elements/Modal';
import CancelOfferForm from '@/components/forms/CancelOfferForm';
import { Listing, Marketplace, Nft, Offer } from '@/types/types';
import { useRouter } from 'next/router';
import UpdateOfferForm from '../../src/common/components/forms/UpdateOfferForm';
import SellForm from '../../src/common/components/forms/SellForm';
import CancelSellForm from '../../src/common/components/forms/CancelSellForm';
import BuyForm from '../../src/common/components/forms/BuyForm';
import UpdateSellForm from '../../src/common/components/forms/UpdateSellForm';
import AcceptOfferForm from '../../src/common/components/forms/AcceptOfferForm';
import { format as formatTime } from 'timeago.js';
import { apolloClient } from '../../src/graphql/apollo';
import { ShareNftDocument, ShareNftQuery } from '../../src/graphql/indexerTypes.ssr';
import Head from 'next/head';
import { Avatar, AvatarIcons } from '@/common/components/elements/Avatar';
import { seededRandomBetween } from '../../src/modules/utils/random';
import { SolscanIcon } from '../../src/common/components/icons/Solscan';
import { ExplorerIcon } from '../../src/common/components/icons/Explorer';
import NFTFile from '../../src/common/components/elements/NFTFile';

const Activities = ({
  listings,
}: {
  listings: Omit<ListingReceipt, 'bookkeeper' | 'tokenSize' | 'bump'>[];
}) => {
  const activities = listings;
  return (
    <>
      <div className="grid grid-cols-4 p-6 opacity-50">
        <div>Event</div>

        <div>Wallets</div>

        <div>Price</div>
        <div className="justify-self-end">Time</div>
      </div>
      {activities.map(({ createdAt, seller, price }) => (
        <div
          key={createdAt}
          className=" mb-4 grid grid-cols-4 items-center rounded border border-gray-700 p-6 last:mb-0"
        >
          <div className="flex items-center">
            <FeatherIcon height={16} width={16} icon="tag" />
            <span className="ml-4">Listed</span>
          </div>
          <Link href={`/profiles/${seller}`}>
            <a>
              <Avatar address={seller} />
            </a>
          </Link>
          <div className="flex items-center ">
            <SolIcon className="h-4 w-4 " stroke="#ffffff" />
            <span className="ml-[6px]">{parseInt(price) / LAMPORTS_PER_SOL}</span>
          </div>
          <div className="justify-self-end">{DateTime.fromISO(createdAt).toRelative()}</div>
        </div>
      ))}
    </>
  );
};

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
    const offers = data.nft?.offers || [];
    const topOffers = offers?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
    const topOffer = topOffers?.[0];

    const listings = data.nft?.listings || [];
    const topListings =
      listings?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
    const topListing = topListings?.[0];

    return {
      props: {
        address: nftAddress,
        name: data.nft?.name || nftAddress,
        description: data.nft?.description || '',
        image:
          data.nft?.image ||
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
  listedPrice,
  offerPrice,
}: {
  address: string;
  name?: string;
  description?: string;
  image?: string;
  listedPrice?: number;
  offerPrice?: number;
}) {
  const { publicKey } = useWallet();
  const router = useRouter();

  const [queryNft, { data, loading, called, refetch, error }] = useNftMarketplaceLazyQuery();

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

  const [imgLoaded, setImgLoaded] = useState(false);
  const [offerModalVisibility, setOfferModalVisibility] = useState(false);
  const [offerUpdateModalVisibility, setOfferUpdateModalVisibility] = useState(false);
  const [sellModalVisibility, setSellModalVisibility] = useState(false);
  const [sellCancelModalVisibility, setSellCancelModalVisibility] = useState(false);
  const [sellUpdateModalVisibility, setSellUpdateModalVisibility] = useState(false);

  const nft = data?.nft;
  const marketplace = data?.marketplace;

  // has listed via default Holaplex marketplace (disregards others)
  const defaultListing = nft?.listings.find(
    (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
  );
  const hasDefaultListing = Boolean(defaultListing);
  const offer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasAddedOffer = Boolean(offer);
  const offers = nft?.offers || [];

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const topOffers = offers?.slice()?.sort((a, b) => Number(b?.price) - Number(a?.price)) || [];
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

  const DetailAddressRow = ({ address, title }: { address?: string; title: string }) => (
    <div className={`flex items-center justify-between`}>
      <p className={`m-0 text-base font-normal text-gray-300`}>{title}</p>
      <div className={`flex flex-row items-center justify-end gap-2`}>
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
        <p className={`m-0 w-24 text-left text-base font-normal text-gray-300`}>
          {shortenAddress(address)}
        </p>
      </div>
    </div>
  );

  if (called && !data?.nft && !loading) {
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
          <meta name="og-title" content={`${name} NFT | Holaplex`} />
          <meta name="og-description" content={description} />
          <meta name="og-image" content={image} />
          <meta name="og-url" content={`https://holaplex.com/nfts/${address}`} />
          <meta name="og-site_name" content="Holaplex" />
          <meta name="og-type" content="product" />
        </Head>
        <div className=" text-white">
          <div className="mt-12 mb-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="mb-4 block lg:mb-0 lg:flex lg:items-center lg:justify-center ">
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
              <NFTFile loading={loading} nft={nft as Nft | any} />
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
              <div className="mb-8 flex flex-1 flex-row justify-between">
                <div>
                  <div className="label mb-1 text-gray-300">
                    {loading ? <div className="h-4 w-14 rounded bg-gray-800" /> : 'Created by'}
                  </div>
                  <ul>
                    {loading ? (
                      <li>
                        <div className="h-6 w-20 rounded bg-gray-800" />
                      </li>
                    ) : nft?.creators.length === 1 ? (
                      <Link href={`/profiles/${nft?.creators[0].address}`}>
                        <a>
                          <Avatar address={nft?.creators[0].address} />
                        </a>
                      </Link>
                    ) : (
                      <div>
                        <AvatarIcons profiles={nft?.creators || []} />
                      </div>
                    )}
                  </ul>
                </div>

                <div
                  className={cx('flex', {
                    hidden: loading,
                  })}
                >
                  <div className="flex flex-1 flex-col items-end">
                    <div className="label mb-1 self-end text-gray-300">
                      {hasDefaultListing ? `Listed by` : `Collected by`}
                    </div>
                    {nft?.owner?.address && (
                      <Link href={`/profiles/${nft?.owner?.address}`}>
                        <a>
                          <Avatar address={nft?.owner?.address} />
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
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
                            listing={defaultListing as Listing}
                            marketplace={marketplace as Marketplace}
                            refetch={refetch}
                            className={`w-full bg-gray-900 `}
                          />
                        </div>
                      </div>
                    )}
                    <div className={`flex w-full items-center justify-between`}>
                      <div className={`flex items-center`}>
                        <Tag className={`mr-2`} />
                        <h3 className={` text-base font-medium text-gray-300`}>Not Listed</h3>
                      </div>
                      {hasAddedOffer && (
                        <ul className={`flex flex-col sm:hidden`}>
                          <li className={`text-base text-gray-300`}>Your offer </li>
                          <DisplaySOL amount={offer?.price} />
                        </ul>
                      )}
                      {!hasAddedOffer && !isOwner && (
                        <div>
                          <Link href={`/nfts/${nft?.address}/offers/new`}>
                            <a>
                              <Button>Make offer</Button>
                            </a>
                          </Link>
                        </div>
                      )}
                      {isOwner && (
                        <Button onClick={() => setSellModalVisibility(true)}>List NFT</Button>
                      )}
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
                            listing={defaultListing as Listing}
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
                                  listing={defaultListing as Listing}
                                  marketplace={marketplace as Marketplace}
                                  refetch={refetch}
                                  className={`w-full`}
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
                                    nft={nft as Nft | any}
                                    marketplace={marketplace as Marketplace}
                                    listing={defaultListing as Listing}
                                    refetch={refetch}
                                    className={`w-full`}
                                  />
                                </div>
                              </div>
                              <div className={`mt-4 flex w-full border-t border-gray-700 pt-4`}>
                                <Link href={`/nfts/${nft?.address}/offers/new`}>
                                  <a className={`w-full`}>
                                    <Button className={`w-full`} secondary>
                                      Make offer
                                    </Button>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          )}

                          <div
                            className={` ${
                              hasAddedOffer ? `w-1/2` : `grid grid-cols-2`
                            } hidden gap-4 sm:flex`}
                          >
                            {!hasAddedOffer && (
                              <Link href={`/nfts/${nft?.address}/offers/new`}>
                                <a>
                                  <Button secondary>Make offer</Button>
                                </a>
                              </Link>
                            )}
                            <BuyForm
                              nft={nft as Nft | any}
                              marketplace={marketplace as Marketplace}
                              listing={defaultListing as Listing}
                              refetch={refetch}
                              className={`w-full`}
                            />
                          </div>
                        </>
                      )}
                    </div>
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
                            nft={nft as Nft | any}
                            marketplace={marketplace as Marketplace}
                            listing={defaultListing as Listing}
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
                              <p className="mb-0 truncate text-ellipsis" title={a.value}>
                                {a.value}
                              </p>
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
                            {Number(marketplace?.auctionHouse?.sellerFeeBasisPoints) / 100}%
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
                    <p className="mt- text-gray-500">There are currently no offers on this NFT.</p>
                  </div>
                )}
                {hasOffers &&
                  offers?.map((o: Offer) => (
                    <article
                      key={o.address}
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
                        <DisplaySOL amount={Number(o.price)} />
                      </div>
                      <div className={`flex items-center`}>{formatTime(o.createdAt, `en_US`)}</div>
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
                              listing={defaultListing as Listing}
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
          </div>
          {/* {loading ? (
          <div className="mb-4 grid grid-cols-4 gap-6 ">
            <LoadingLine $height="56px" />
            <LoadingLine $height="56px" />
            <LoadingLine $height="56px" />
            <LoadingLine $height="56px" />
          </div>
        ) : (
          nft?.listings && (
            <div className="overflow-x-auto ">
              {!nft?.listings.length ? (
                <div className="mt-12 flex flex-col rounded-lg border border-gray-800 p-4 text-center">
                  <span className="text-center text-2xl font-semibold">No activity</span>
                  <span className="mt-2 text-gray-300 ">
                    Activity associated with this NFT will show up here
                  </span>
                </div>
              ) : (
                <Accordion title="Activity" allowHorizOverflow>
                  <div className="mt-8 flex min-w-[700px] flex-col">
                    <Activities listings={nft?.listings} />
                  </div>
                </Accordion>
              )}
            </div>
          )
        )} */}
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
                listing={defaultListing as Listing}
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
              title={`Cancel listing`}
            >
              <CancelSellForm
                nft={nft as Nft | any}
                refetch={refetch}
                marketplace={marketplace as Marketplace}
                listing={defaultListing as Listing}
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
                listing={defaultListing as Listing}
                setOpen={setSellUpdateModalVisibility}
                offer={topOffer as Offer}
              />
            </Modal>
          </>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
}
