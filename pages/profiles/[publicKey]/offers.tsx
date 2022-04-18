import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import TextInput2 from '../../../src/common/components/elements/TextInput2';
import { useState } from 'react';
import { useOffersPageQuery } from '../../../src/graphql/indexerTypes';
import {
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
} from '../../../src/common/constants/marketplace';
import { imgOpt } from '../../../src/common/utils';
import Link from 'next/link';
import { Listing, Marketplace, Nft, Offer } from '@holaplex/marketplace-js-sdk';
import { DisplaySOL } from '../../../src/common/components/CurrencyHelpers';
import { format as formatTime } from 'timeago.js';
import Button from '../../../src/common/components/elements/Button';
import AcceptOfferForm from '../../../src/common/components/forms/AcceptOfferForm';
import UpdateOfferForm from '../../../src/common/components/forms/UpdateOfferForm';
import { useWallet } from '@solana/wallet-adapter-react';
import Modal from '../../../src/common/components/elements/Modal';
import { TextSkeleton } from '../../../src/common/components/elements/Skeletons';

enum OfferFilters {
  ALL,
  MADE,
  RECEIVED,
}

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const OfferPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const [query, setQuery] = useState('');
  const { publicKey: userPK } = useWallet();

  const [showUpdateOfferModal, setShowUpdateOfferModal] = useState(false);
  const [filter, setFilter] = useState(OfferFilters.ALL);

  const { data, loading, refetch } = useOffersPageQuery({
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: publicKey,
    },
  });
  const marketplace = data?.marketplace;
  const receivedOffers = data?.receivedOffers;
  const sentOffers = data?.sentOffers;

  let receivedCount = 0;
  let sentCount = 0;

  receivedOffers?.forEach((nft) => {
    nft.offers.forEach((offer) => {
      if (offer) {
        receivedCount += 1;
      }
    });
  });

  sentOffers?.forEach((nft) => {
    nft.offers.forEach((offer) => {
      if (offer) {
        sentCount += 1;
      }
    });
  });

  const offerCount = receivedCount + sentCount;

  const OfferFilter = ({
    filterToCheck,
    count = 0,
    title,
  }: {
    count: number;
    title: string;
    filterToCheck: OfferFilters;
  }) => {
    return (
      <div
        onClick={() => setFilter(filterToCheck)}
        className={`flex  flex-row items-center justify-between rounded-lg font-medium ${
          filter === filterToCheck
            ? `bg-gray-800`
            : `cursor-pointer bg-gray-900 text-gray-300 hover:bg-gray-800`
        } p-1`}
      >
        <p className={`mb-0 border-r-2 border-gray-300 px-2 text-base`}>{title}</p>
        <p className={`mb-0 px-2 text-base`}>{count}</p>
      </div>
    );
  };

  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <Head>
        <title>{showFirstAndLastFour(publicKey)}&apos;s offers | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="View offers for this, or any other pubkey, in the Holaplex ecosystem."
        />
      </Head>
      <ProfileContainer>
        <div className={`mb-8 mt-6 grid grid-cols-3 gap-6 lg:flex`}>
          <OfferFilter title={`All`} count={offerCount} filterToCheck={OfferFilters.ALL} />
          <OfferFilter title={`Made`} count={sentCount} filterToCheck={OfferFilters.MADE} />
          <OfferFilter
            title={`Received`}
            count={receivedCount}
            filterToCheck={OfferFilters.RECEIVED}
          />
        </div>
        <div className={`grid grid-cols-1 gap-4`}>
          {(filter === OfferFilters.ALL || filter === OfferFilters.RECEIVED) &&
            receivedOffers?.map((receivedOffer) => {
              const defaultListing = receivedOffer?.listings.find(
                (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
              );
              return receivedOffer.offers?.map((offer) => (
                <div
                  key={offer.address}
                  className={`flex h-28 flex-row justify-between rounded-lg border border-gray-800 p-4`}
                >
                  <div className={`flex items-center justify-start`}>
                    <img
                      src={imgOpt(receivedOffer?.image, 800)!}
                      className={`h-20 rounded-lg`}
                      alt={receivedOffer?.name}
                    />
                    <div>
                      <div className={`ml-4 flex flex-col justify-center`}>
                        <p className={`mb-0 text-base text-gray-300`}>
                          <Link href={`/profiles/${offer.buyer}/offers`}>
                            <a className={`text-white hover:text-gray-300`}>
                              {offer.buyer === userPK?.toBase58()
                                ? `You`
                                : `@${shortenAddress(offer.buyer)}`}
                            </a>
                          </Link>{' '}
                          offered{' '}
                          <span className={`text-white`}>
                            <DisplaySOL amount={offer.price} iconVariant={`small`} />
                          </span>{' '}
                          for{' '}
                          <Link href={`/nfts/${receivedOffer.address}`}>
                            <a className={`text-white hover:text-gray-300`}>{receivedOffer.name}</a>
                          </Link>
                        </p>
                        <p className={`mb-0 mt-2 text-base text-gray-500`}>
                          {formatTime(offer.createdAt, `en_US`)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center`}>
                    {Boolean(receivedOffer?.owner?.address === userPK?.toBase58()) && (
                      <AcceptOfferForm
                        nft={receivedOffer as Nft | any}
                        offer={offer as Offer}
                        listing={defaultListing as Listing}
                        marketplace={marketplace as Marketplace}
                        refetch={refetch}
                      />
                    )}

                    {Boolean(offer.buyer === userPK?.toBase58()) && (
                      <div>
                        <Button
                          onClick={() => setShowUpdateOfferModal(true)}
                          secondary
                          className={`bg-gray-800 ease-in hover:bg-gray-700`}
                        >
                          Update offer
                        </Button>
                        <Modal
                          open={showUpdateOfferModal}
                          setOpen={setShowUpdateOfferModal}
                          title={`Update offer`}
                        >
                          <UpdateOfferForm
                            listing={defaultListing as Listing}
                            setOpen={setShowUpdateOfferModal}
                            nft={receivedOffer as Nft | any}
                            marketplace={marketplace as Marketplace}
                            refetch={refetch}
                            loading={loading}
                            hasListing={Boolean(defaultListing)}
                          />
                        </Modal>
                      </div>
                    )}
                  </div>
                </div>
              ));
            })}
          {(filter === OfferFilters.ALL || filter === OfferFilters.MADE) &&
            sentOffers?.map((sentOffer) => {
              const defaultListing = sentOffer?.listings.find(
                (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
              );
              return sentOffer.offers?.map((offer) => (
                <div
                  key={offer.address}
                  className={`flex h-28 flex-row justify-between rounded-lg border border-gray-800 p-4`}
                >
                  <div className={`flex items-center justify-start`}>
                    <img
                      src={imgOpt(sentOffer?.image, 400)!}
                      className={`h-20 rounded-lg`}
                      alt={sentOffer?.name}
                    />
                    <div>
                      <div className={`ml-4 flex flex-col justify-center`}>
                        <p className={`mb-0 text-base text-gray-300`}>
                          <Link href={`/profiles/${offer.buyer}/offers`}>
                            <a className={`text-white hover:text-gray-300`}>
                              {offer.buyer === userPK?.toBase58()
                                ? `You`
                                : `@${shortenAddress(offer.buyer)}`}{' '}
                            </a>
                          </Link>{' '}
                          offered{' '}
                          <span className={`text-white`}>
                            <DisplaySOL amount={offer.price} iconVariant={`small`} />
                          </span>{' '}
                          for{' '}
                          <Link href={`/nfts/${sentOffer.address}`}>
                            <a className={`text-white hover:text-gray-300`}>{sentOffer.name}</a>
                          </Link>
                        </p>
                        <p className={`mb-0 mt-2 text-base text-gray-500`}>
                          {formatTime(offer.createdAt, `en_US`)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center`}>
                    {Boolean(offer.buyer === userPK?.toBase58()) && (
                      <div>
                        <Button
                          onClick={() => setShowUpdateOfferModal(true)}
                          secondary
                          className={`bg-gray-800 ease-in hover:bg-gray-700`}
                        >
                          Update offer
                        </Button>
                        <Modal
                          open={showUpdateOfferModal}
                          setOpen={setShowUpdateOfferModal}
                          title={`Update offer`}
                        >
                          <UpdateOfferForm
                            listing={defaultListing as Listing}
                            setOpen={setShowUpdateOfferModal}
                            nft={sentOffer as Nft | any}
                            marketplace={marketplace as Marketplace}
                            refetch={refetch}
                            loading={loading}
                            hasListing={Boolean(defaultListing)}
                          />
                        </Modal>
                      </div>
                    )}
                  </div>
                </div>
              ));
            })}
          {offerCount <= 0 && (
            <div>
              <div
                className={`flex flex-col justify-center rounded-lg border-2 border-gray-800 p-4`}
              >
                <span className={`text-center text-2xl font-semibold`}>No offers</span>
                <span className={`mt-2 text-center text-gray-300`}>
                  Offers associated with this wallet will show up here
                </span>
              </div>
            </div>
          )}
        </div>
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default OfferPage;
