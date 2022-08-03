import { GetServerSideProps } from 'next';
import ReactDom from 'react-dom';

import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
import { ProfileDataProvider, useProfileData } from 'src/views/profiles/ProfileDataProvider';
import { useMemo, useState } from 'react';
import { useOffersPageQuery } from '@/graphql/indexerTypes';
import {
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
} from '@/views/_global/holaplexConstants';
import { AhListing, Marketplace, Nft, Offer } from '@holaplex/marketplace-js-sdk';

import Button from '@/components/Button';
import AcceptOfferForm from '@/components/AcceptOfferForm';
import UpdateOfferForm from '@/components/UpdateOfferForm';
import { useWallet } from '@solana/wallet-adapter-react';
import Modal from '@/components/Modal';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import { ActivityCard } from '@/components/ActivityCard';
import { useConnectedWalletProfile } from '@/views/_global/ConnectedWalletProfileProvider';
import {
  LoadingActivitySkeletonBoxCircleLong,
  LoadingActivitySkeletonBoxSquareShort,
} from './activity';

enum OfferFilters {
  ALL,
  MADE,
  RECEIVED,
}

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

const OfferPage = (props: WalletDependantPageProps) => {
  const [query, setQuery] = useState('');
  // const { publicKey: userPK } = useWallet();
  const { connectedProfile } = useConnectedWalletProfile();
  const { publicKey: profilePK } = useProfileData();
  const userPK = connectedProfile?.pubkey;

  const isMe = userPK === profilePK;

  const [showUpdateOfferModal, setShowUpdateOfferModal] = useState(false);
  const [showAcceptOfferModal, setShowAcceptOfferModal] = useState(false);

  const [filter, setFilter] = useState(OfferFilters.ALL);
  const [currNFT, setCurrNFT] = useState<Nft>();

  const { data, loading, refetch } = useOffersPageQuery({
    variables: {
      limit: 200,
      offset: 0,
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: profilePK,
    },
  });

  const marketplace = data?.marketplace;
  const ownedNfts = data?.ownedNFTs;
  const nftsWithSentOffers = data?.nftsWithSentOffers;

  const receivedCount = useMemo(
    () => ownedNfts?.reduce((acc, nft) => acc + nft.offers.filter((o) => o).length, 0) || 0,
    [ownedNfts]
  );

  const sentCount = useMemo(
    () =>
      nftsWithSentOffers?.reduce((acc, nft) => acc + nft.offers.filter((o) => o).length, 0) || 0,
    [nftsWithSentOffers]
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

  function getActivityCard(nft: Nft, offer: Offer) {
    const defaultListing = nft?.listings?.find(
      (listing) => listing?.auctionHouse?.address.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
    );

    const offerIsReceived = nft.owner?.address === profilePK;

    console.log(nft.name, {
      offerIsReceived,
      nft,
    });

    return (
      <ActivityCard
        key={offer.id}
        activity={{
          activityType: 'offer',
          createdAt: offer.createdAt,
          id: offer.id,
          nft: nft as Nft | any,
          wallets: [
            {
              address: offer.buyer as string,
              twitterHandle: '', // twitter handle does not exist on this query, but is being handled inside the activity card component,
            },
          ],
          auctionHouse: {
            address: offer.auctionHouse?.address!,
            treasuryMint: offer.auctionHouse?.treasuryMint!,
          },
          price: offer.price.toNumber(),
        }}
        customActionButton={
          // I made the offer
          offer.buyer === userPK ? (
            <>
              <Button
                onClick={() => {
                  setCurrNFT(nft as Nft | any);
                  setShowUpdateOfferModal(true);
                }}
                secondary
                className={`w-full  bg-gray-800 ease-in hover:bg-gray-700`}
              >
                Update offer
              </Button>
              {ReactDom.createPortal(
                <Modal
                  open={showUpdateOfferModal}
                  setOpen={setShowUpdateOfferModal}
                  title={`Update offer`}
                >
                  <UpdateOfferForm
                    listing={defaultListing as AhListing}
                    setOpen={setShowUpdateOfferModal}
                    nft={currNFT as Nft | any}
                    marketplace={marketplace as Marketplace}
                    refetch={refetch}
                    loading={loading}
                    hasListing={Boolean(defaultListing)}
                  />
                </Modal>,
                document.getElementsByTagName('body')[0]!
              )}
            </>
          ) : // I own the nft and can accept the offer
          offerIsReceived && nft.owner.address === userPK ? (
            <AcceptOfferForm
              listing={defaultListing as AhListing}
              setOpen={setShowAcceptOfferModal}
              nft={currNFT as Nft | any}
              marketplace={marketplace as Marketplace}
              offer={offer as Offer}
              refetch={refetch}
            />
          ) : null
        }
      />
    );
  }

  return (
    <>
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
        {(filter === OfferFilters.ALL || filter === OfferFilters.MADE) &&
          nftsWithSentOffers?.map((nft) => {
            return nft.offers
              .filter((o) => o.buyer === profilePK)
              ?.sort(byDate)
              .map((offer) => getActivityCard(nft as Nft | any, offer as Offer));
          })}

        {(filter === OfferFilters.ALL || filter === OfferFilters.RECEIVED) &&
          ownedNfts?.map((nft) => {
            return nft.offers
              ?.slice()
              ?.sort(byDate)
              .map((offer) => getActivityCard(nft as Nft | any, offer as Offer));
          })}

        {loading && (
          <>
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
            <LoadingActivitySkeletonBoxCircleLong />
            <LoadingActivitySkeletonBoxSquareShort />
          </>
        )}

        {!loading && offerCount === 0 && (
          <div>
            <div className={`flex flex-col justify-center rounded-lg border-2 border-gray-800 p-4`}>
              <span className={`text-center text-2xl font-semibold`}>No offers</span>
              <span className={`mt-2 text-center text-gray-300`}>
                Offers associated with this wallet will show up here
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OfferPage;

OfferPage.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};
