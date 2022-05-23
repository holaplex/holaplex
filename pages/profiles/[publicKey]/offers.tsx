import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import TextInput2 from '../../../src/common/components/elements/TextInput2';
import { useMemo, useState } from 'react';
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
import { ProfilePageHead } from '../[publicKey]';

enum OfferFilters {
  ALL,
  MADE,
  RECEIVED,
}

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

const OfferPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const [query, setQuery] = useState('');
  const { publicKey: userPK } = useWallet();

  const [showUpdateOfferModal, setShowUpdateOfferModal] = useState(false);
  const [filter, setFilter] = useState(OfferFilters.ALL);
  const [currNFT, setCurrNFT] = useState<Nft>();

  const { data, loading, refetch } = useOffersPageQuery({
    variables: {
      limit: 200,
      offset: 0,
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: publicKey,
    },
  });
  const marketplace = data?.marketplace;
  const receivedOffers = data?.receivedOffers;
  const sentOffers = data?.sentOffers;

  const receivedCount = useMemo(
    () => receivedOffers?.reduce((acc, nft) => acc + nft.offers.filter((o) => o).length, 0) || 0,
    [receivedOffers]
  );

  const sentCount = useMemo(
    () => sentOffers?.reduce((acc, nft) => acc + nft.offers.filter((o) => o).length, 0) || 0,
    [sentOffers]
  );

  const offerCount = receivedCount + sentCount;

  function byDate(
    a: { createdAt: string | number | Date },
    b: { createdAt: string | number | Date }
  ) {
    //chronologically by year, month, then day
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); //timestamps
  }

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
        className={`flex w-28 flex-row items-center justify-center gap-2 rounded-full p-2 font-medium ${
          filter === filterToCheck
            ? `bg-gray-800`
            : `cursor-pointer border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800`
        }`}
      >
        <p className={`mb-0 first-letter:text-base`}>{title}</p>
      </div>
    );
  };

  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <ProfilePageHead
        publicKey={publicKey}
        twitterProfile={{
          twitterHandle: props.twitterHandle,
          banner: props.banner,
          pfp: props.profilePicture,
        }}
        description="View offers for this, or any other pubkey, in the Holaplex ecosystem."
      />
      <ProfileContainer>
        <div className="sticky top-0 z-10 mb-2 flex flex-col items-center gap-6 bg-gray-900 py-4 lg:flex-row lg:justify-between lg:gap-4">
          <div className={`flex w-full justify-start gap-4 lg:items-center`}>
            <OfferFilter title={`All`} count={offerCount} filterToCheck={OfferFilters.ALL} />
            <OfferFilter title={`Made`} count={sentCount} filterToCheck={OfferFilters.MADE} />
            <OfferFilter
              title={`Received`}
              count={receivedCount}
              filterToCheck={OfferFilters.RECEIVED}
            />
          </div>
        </div>
        <div className={`grid grid-cols-1 gap-4`}>
          {(filter === OfferFilters.ALL || filter === OfferFilters.RECEIVED) &&
            receivedOffers?.map((receivedOffer) => {
              const defaultListing = receivedOffer?.listings.find(
                (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
              );
              return receivedOffer.offers
                ?.slice()
                ?.sort(byDate)
                .map((offer) => (
                  <div
                    key={offer.address}
                    className={`flex  flex-row justify-between rounded-lg border border-gray-800 p-4`}
                  >
                    <div className={`flex items-center justify-start`}>
                      <Link href={'/nfts/' + receivedOffer.address}>
                        <a className="flex-shrink-0">
                          <img
                            src={imgOpt(receivedOffer?.image, 600)!}
                            className={`aspect-square h-20 rounded-lg object-cover`}
                            alt={receivedOffer?.name}
                          />
                        </a>
                      </Link>
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
                              <a className={`text-white hover:text-gray-300`}>
                                {receivedOffer.name}
                              </a>
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
                            onClick={() => {
                              setCurrNFT(receivedOffer as Nft | any);
                              setShowUpdateOfferModal(true);
                            }}
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
                              nft={currNFT as Nft | any}
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

              return sentOffer.offers
                ?.slice()
                ?.sort(byDate)
                .map((offer) => (
                  <div
                    key={offer.address}
                    className={`flex  flex-row flex-wrap justify-between rounded-lg border border-gray-800 p-4`}
                  >
                    <div className={`flex items-center justify-start`}>
                      <Link href={'/nfts/' + sentOffer.address}>
                        <a className="flex-shrink-0">
                          <img
                            src={imgOpt(sentOffer?.image, 400)!}
                            className={`aspect-square h-20 rounded-lg`}
                            alt={sentOffer?.name}
                          />
                        </a>
                      </Link>
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
                            onClick={() => {
                              setCurrNFT(sentOffer as Nft | any);
                              setShowUpdateOfferModal(true);
                            }}
                            secondary
                            className={`w-full  bg-gray-800 ease-in hover:bg-gray-700 md:w-auto `}
                          >
                            Update offer
                          </Button>
                          <Modal
                            key={sentOffer.address}
                            open={showUpdateOfferModal}
                            setOpen={setShowUpdateOfferModal}
                            title={`Update offer`}
                          >
                            <UpdateOfferForm
                              listing={defaultListing as Listing}
                              setOpen={setShowUpdateOfferModal}
                              nft={currNFT as Nft | any}
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
