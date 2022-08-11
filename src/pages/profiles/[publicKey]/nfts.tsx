import { GetServerSideProps } from 'next';
import { FC, useMemo, useState } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import clsx from 'clsx';
import { OwnedNfTsQuery, useOwnedNfTsQuery } from '@/graphql/indexerTypes';
import Link from 'next/link';
import TextInput2 from 'src/components/TextInput2';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/views/profiles/getProfileServerSideProps';
import { ProfileDataProvider } from 'src/views/profiles/ProfileDataProvider';
import { imgOpt } from 'src/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  AUCTION_HOUSE_ADDRESSES,
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
  MARKETPLACE_PROGRAMS,
} from 'src/views/_global/holaplexConstants';
import Button from '@/components/Button';
import { DisplaySOL } from 'src/components/CurrencyHelpers';
import Modal from 'src/components/Modal';
import SellForm from 'src/components/SellForm';
import { AhListing, Marketplace, Nft, Offer } from '@holaplex/marketplace-js-sdk';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from 'src/components/OfferForm';
import UpdateSellForm from 'src/components/UpdateSellForm';
import BuyForm from 'src/components/BuyForm';
import UpdateOfferForm from 'src/components/UpdateOfferForm';
import { Avatar } from 'src/components/Avatar';
import { InView } from 'react-intersection-observer';
import { isEmpty, uniq } from 'ramda';
import { TailSpin } from 'react-loader-spinner';
import NoProfileItems, { NoProfileVariant } from '@/components/NoProfileItems';
import ProfileLayout from '@/views/profiles/ProfileLayout';
import GridSelector, { GridSize } from '@/components/GridSelector';
import { AhListingMultiMarketplace } from '../../nfts/[address]';
import { getAuctionHouseInfo } from '../../../modules/utils/marketplace';
import Popover from '../../../components/Popover';

export type OwnedNFT = OwnedNfTsQuery['nfts'][0];

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

export const LoadingNFTCard = () => {
  return (
    <div
      className={`overflow-hidden, animate-pulse rounded-lg border-gray-900 bg-gray-900 p-4 shadow-md shadow-black`}
    >
      <div className={`aspect-square w-full rounded-lg bg-gray-800`} />
      <div className={`flex h-24 items-center py-6 px-4`}>
        <div className={`h-5 w-36 animate-pulse rounded-md bg-gray-700`} />
      </div>
      <div className={`h-20 md:h-36 xl:h-20`}>
        <div
          className={`flex h-full w-full items-center justify-between p-4 md:flex-col md:items-start md:justify-between xl:flex-row xl:items-center xl:justify-between`}
        >
          <div className={`h-5 w-16 animate-pulse rounded-md bg-gray-700`} />

          <div className={`h-10 w-36 animate-pulse rounded-full bg-gray-700`} />
        </div>
      </div>
    </div>
  );
};

export const NFTCard = ({
  nft,
  marketplace,
  refetch,
  loading = false,
  showName = true,
  newTab = false,
  showCollection = true,
}: {
  nft: OwnedNFT;
  marketplace: Marketplace;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
  loading: boolean;
  showName?: boolean;
  newTab?: boolean;
  showCollection?: boolean;
}) => {
  const { publicKey } = useWallet();
  const [listNFTVisibility, setListNFTVisibility] = useState(false);
  const [updateListingVisibility, setUpdateListingVisibility] = useState(false);
  const [updateOfferVisibility, setUpdateOfferVisibility] = useState(false);

  if (loading) return <LoadingNFTCard />;

  const creatorsCopy = [...nft.creators];
  const sortedCreators = creatorsCopy.sort((a, b) => b.share - a.share);
  const shownCollection = nft?.collection ? nft?.collection : null;
  const shownCreatorAddress = sortedCreators?.length > 0 ? sortedCreators[0].address : null;
  const shownCreatorHandle =
    sortedCreators?.length > 0 ? sortedCreators[0].profile?.handle : undefined;
  const shownCreatorPfpUrl =
    sortedCreators?.length > 0 ? sortedCreators[0].profile?.profileImageUrlLowres : undefined;

  const offers = nft?.offers;
  const topOffers = offers?.slice()?.sort((a, b) => Number(a.price) - Number(b.price));
  const topOffer = topOffers?.[0];
  const addedOffer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasAddedOffer = Boolean(addedOffer);
  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());
  const defaultListing = nft?.listings.find(
    (listing) => listing?.auctionHouse?.address.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
  );

  const otherListings = nft?.listings.filter(
    (listing) => listing.auctionHouse?.address.toString() !== HOLAPLEX_MARKETPLACE_ADDRESS
  );

  const cheapestOtherListing = otherListings.sort((a, b) => a.price - b.price)[0];
  const cheapestOtherListingAhInfo = getAuctionHouseInfo(
    cheapestOtherListing as AhListingMultiMarketplace
  );

  const hasDefaultListing = Boolean(defaultListing);
  const lastSale = nft?.purchases?.[0]?.price;

  return (
    <>
      <div className="relative transform overflow-hidden rounded-lg border-gray-900 bg-gray-900 p-4 shadow-md shadow-black transition duration-[300ms] hover:scale-[1.02]">
        <Link href={`/nfts/${nft.mintAddress}`} scroll={true} passHref>
          <a target={newTab ? `_blank` : `_self`} className={`cursor-pointer`}>
            <div className={`relative `}>
              <img
                src={imgOpt(nft.image, 600)}
                alt={nft.name}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>

            <div className="flex items-center bg-gray-900 py-4">
              <p
                className={clsx('w-max-fit m-0 mb-0 min-h-[28px] truncate text-lg font-bold', {
                  hidden: !showName,
                })}
              >
                {nft.name}
              </p>
            </div>
          </a>
        </Link>
        {(shownCreatorAddress || shownCollection) && (
          <div
            className={`absolute left-4 top-4 flex ${
              shownCollection && showCollection
                ? `flex-col items-start justify-start gap-2`
                : `flex-row items-center gap-2`
            } flex-row  p-4`}
          >
            {shownCollection && showCollection ? (
              <Link href={`/collections/${shownCollection.address}`} passHref>
                <div
                  style={{ backdropFilter: `blur(10px)` }}
                  className="flex transform items-center gap-2 rounded-lg bg-gray-900 bg-opacity-50 p-2 text-gray-300 transition duration-[300ms] hover:scale-[1.02] hover:cursor-pointer"
                >
                  <img
                    src={shownCollection.image}
                    alt={shownCollection.name}
                    className={`h-4 w-4 rounded-md`}
                  />
                  <p className={`m-0 text-sm font-medium text-white`}>{shownCollection.name}</p>
                </div>
              </Link>
            ) : (
              <Link href={`/profiles/${shownCreatorAddress}`}>
                <a className="text-gray-300">
                  <Avatar
                    address={shownCreatorAddress || ''}
                    showAddress={false}
                    border={true}
                    data={{ pfpUrl: shownCreatorPfpUrl, twitterHandle: shownCreatorHandle }}
                  />
                </a>
              </Link>
            )}

            {offers.length > 0 && (
              <div
                className={`flex h-6 items-center rounded-full bg-gray-900 bg-opacity-50 px-2  text-xs font-medium`}
                style={{ backdropFilter: `blur(10px)` }}
              >
                {offers.length} OFFER{offers.length > 1 && `S`}
              </div>
            )}
          </div>
        )}
        <div>
          <div
            className={`flex h-full w-full items-end justify-between md:flex-col md:items-center md:justify-between xl:flex-row xl:items-end xl:justify-between`}
          >
            {!hasDefaultListing &&
              !hasAddedOffer &&
              !Boolean(lastSale) &&
              !Boolean(cheapestOtherListing) && (
                <ul className={`mb-0 flex w-full`}>
                  <li className={`text-sm font-bold text-gray-300 md:text-base`}>Not listed</li>
                </ul>
              )}
            {hasDefaultListing && (
              <ul className={`mb-0 flex w-full items-center justify-between`}>
                <li className={`text-sm font-bold text-gray-300 md:text-base`}>Price</li>
                <DisplaySOL
                  amount={Number(defaultListing?.price)}
                  className="text-sm md:text-base"
                />
              </ul>
            )}
            {Boolean(cheapestOtherListing) && !hasDefaultListing && (
              <div className={`grid w-full grid-cols-1 gap-2`}>
                <ul className={`mb-0 flex w-full items-center justify-between`}>
                  <li
                    className={`flex items-center gap-2 text-sm font-bold text-gray-300 md:text-base`}
                  >
                    <Popover
                      placement={`top`}
                      isShowOnHover={true}
                      content={
                        <p
                          className={
                            'm-0 whitespace-nowrap rounded-lg bg-gray-800 bg-opacity-30 p-2 text-sm text-white'
                          }
                        >
                          {cheapestOtherListingAhInfo.name}
                        </p>
                      }
                    >
                      <span className={`flex items-center gap-1 font-bold text-white`}>
                        <img
                          src={cheapestOtherListingAhInfo?.logo}
                          alt={cheapestOtherListingAhInfo.name}
                          className={`h-4 w-4 rounded-sm`}
                        />
                      </span>
                    </Popover>
                    Listed
                  </li>
                  <DisplaySOL
                    amount={Number(cheapestOtherListing?.price)}
                    className="text-sm md:text-base"
                  />
                </ul>
              </div>
            )}

            {!hasDefaultListing &&
              !hasAddedOffer &&
              Boolean(lastSale) &&
              !Boolean(cheapestOtherListing) && (
                <ul className={`mb-0 flex w-full items-center justify-between`}>
                  <li className={`text-sm font-bold text-gray-300 md:text-base`}>Last sale</li>
                  <DisplaySOL amount={Number(lastSale)} />
                </ul>
              )}

            {!hasDefaultListing && hasAddedOffer && (
              <ul className={`mb-0 flex w-full items-center justify-between`}>
                <li className={`text-sm font-bold text-gray-300 md:text-base`}>Your offer</li>
                <DisplaySOL amount={Number(addedOffer?.price) || 0} />
              </ul>
            )}
          </div>
          <div className={`mt-4`}>
            {isOwner && !hasDefaultListing && (
              <Button className={`w-full`} onClick={() => setListNFTVisibility(true)}>
                List NFT
              </Button>
            )}
            {isOwner && hasDefaultListing && (
              <Button className={`w-full`} onClick={() => setUpdateListingVisibility(true)}>
                Update
              </Button>
            )}

            {!isOwner && hasAddedOffer && (
              <Button
                secondary
                className={`w-full bg-gray-800`}
                onClick={() => setUpdateOfferVisibility(true)}
              >
                Update
              </Button>
            )}
            {!isOwner && !hasAddedOffer && hasDefaultListing && (
              <BuyForm
                loading={loading}
                nft={nft as Nft | any}
                marketplace={marketplace as Marketplace}
                listing={defaultListing as AhListingMultiMarketplace}
                refetch={refetch}
                className={`w-full`}
              />
            )}

            {!isOwner &&
              !hasAddedOffer &&
              cheapestOtherListing &&
              cheapestOtherListing.auctionHouse !== null &&
              !hasDefaultListing && (
                <BuyForm
                  loading={loading}
                  nft={nft as Nft | any}
                  marketplace={marketplace as Marketplace}
                  listing={cheapestOtherListing as AhListingMultiMarketplace}
                  refetch={refetch}
                  className={`w-full`}
                />
              )}

            {!hasDefaultListing &&
              !isOwner &&
              !hasAddedOffer &&
              cheapestOtherListing?.auctionHouse === null &&
              cheapestOtherListingAhInfo.link && (
                <Link href={`${cheapestOtherListingAhInfo.link}/${nft.mintAddress}`}>
                  <a target={`_blank`}>
                    <Button className={`w-full`}>View listing</Button>
                  </a>
                </Link>
              )}
            {!isOwner && !hasAddedOffer && !hasDefaultListing && !Boolean(cheapestOtherListing) && (
              <Link href={`/nfts/${nft?.address}/offers/new`}>
                <a>
                  <Button className={`w-full`}>Make offer</Button>
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Modal open={listNFTVisibility} setOpen={setListNFTVisibility} title={`List NFT for sale`}>
        <SellForm
          setOpen={setListNFTVisibility}
          nft={nft as Nft | any}
          refetch={refetch}
          loading={loading}
          marketplace={marketplace as Marketplace}
        />
      </Modal>
      <Modal
        open={updateListingVisibility}
        setOpen={setUpdateListingVisibility}
        title={`Update listing price`}
      >
        <UpdateSellForm
          nft={nft as Nft | any}
          refetch={refetch}
          marketplace={marketplace as Marketplace}
          listing={defaultListing as AhListingMultiMarketplace}
          setOpen={setUpdateListingVisibility}
          offer={topOffer as Offer}
        />
      </Modal>
      <Modal open={updateOfferVisibility} setOpen={setUpdateOfferVisibility} title={`Update offer`}>
        <UpdateOfferForm
          nft={nft as Nft | any}
          refetch={refetch}
          marketplace={marketplace as Marketplace}
          listing={defaultListing as AhListingMultiMarketplace}
          setOpen={setUpdateOfferVisibility}
          loading={loading}
          hasListing={hasDefaultListing}
        />
      </Modal>
    </>
  );
};

interface NFTGridProps {
  nfts: OwnedNFT[];
  marketplace: Marketplace;
  gridView: GridSize;
  ctaVariant?: NoProfileVariant;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  onLoadMore: (inView: boolean, entry: IntersectionObserverEntry) => Promise<void>;
  hasMore: boolean;
  showCollection?: boolean;
  loading?: boolean;
}

export const NFTGrid: FC<NFTGridProps> = ({
  nfts,
  marketplace,
  gridView,
  refetch,
  onLoadMore,
  hasMore,
  ctaVariant,
  showCollection,
  loading = false,
}) => {
  return (
    <>
      <div
        className={clsx(
          'grid grid-cols-1 gap-6',
          gridView === '1x1'
            ? 'md:grid-cols-2'
            : gridView === '2x2'
            ? 'sm:grid-cols-2 lg:grid-cols-3 '
            : gridView === '4x4'
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : gridView === '6x6'
            ? 'md:grid-cols-6'
            : ''
        )}
      >
        {loading ? (
          <>
            <LoadingNFTCard />
            <LoadingNFTCard />
            <LoadingNFTCard />
            <LoadingNFTCard />
          </>
        ) : (
          <>
            {nfts.length === 0 ? (
              <div className={`col-span-full`}>
                <NoProfileItems variant={ctaVariant} />
              </div>
            ) : (
              nfts.map((nft) => (
                <NFTCard
                  showCollection={showCollection}
                  key={nft.address}
                  nft={nft}
                  refetch={refetch}
                  loading={loading}
                  marketplace={marketplace as Marketplace}
                />
              ))
            )}
          </>
        )}
      </div>
      {hasMore && (
        <InView as="div" threshold={0.1} onChange={onLoadMore}>
          <div className={`my-6 flex w-full items-center justify-center font-bold`}>
            <TailSpin height={50} width={50} color={`grey`} ariaLabel={`loading-nfts`} />
          </div>
        </InView>
      )}
    </>
  );
};

type ListedFilterState = 'all' | 'listed' | 'unlisted' | 'search';

enum ListingFilters {
  ALL,
  LISTED,
  UNLISTED,
}

export const INFINITE_SCROLL_AMOUNT_INCREMENT = 25;
export const INITIAL_FETCH = 25;

function ProfileNFTs(props: WalletDependantPageProps) {
  const { publicKey: pk } = props;
  const [listedFilter, setListedFilter] = useState<ListingFilters>(ListingFilters.ALL);
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridView, setGridView] = useState<GridSize>('4x4');
  const [hasMore, setHasMore] = useState(true);
  const variables = {
    subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
    address: pk,
    limit: INITIAL_FETCH,
    offset: 0,
  };
  const ownedNFTs = useOwnedNfTsQuery({
    variables: variables,
  });
  const refetch = ownedNFTs.refetch;
  const loading = ownedNFTs.loading;
  const fetchMore = ownedNFTs.fetchMore;
  const actualOwnedNFTs = ownedNFTs?.data?.nfts || [];

  const nfts = actualOwnedNFTs.filter((item) => item?.owner?.address === pk);
  const marketplace = ownedNFTs?.data?.marketplace;

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  const listedNfts = useMemo(
    () => nftsToShow.filter((nft) => nft.listings.length > 0),
    [nftsToShow]
  );
  const unlistedNfts = useMemo(
    () => nftsToShow.filter((nft) => nft.listings.length <= 0),
    [nftsToShow]
  );

  const totalCount = useMemo(() => nftsToShow.length, [nftsToShow]);
  const listedCount = useMemo(() => listedNfts.length || 0, [listedNfts]);

  const unlistedCount = useMemo(() => unlistedNfts.length || 0, [unlistedNfts]);

  // Note: unique check to ensure even if duplicates occur on the backend we are removing them
  const filteredNfts =
    listedFilter === ListingFilters.ALL
      ? nftsToShow
      : listedFilter === ListingFilters.LISTED
      ? listedNfts
      : listedFilter === ListingFilters.UNLISTED
      ? unlistedNfts
      : nftsToShow;

  const ListingFilter = ({
    filterToCheck,
    count = 0,
    title,
  }: {
    count: number;
    title: string;
    filterToCheck: ListingFilters;
  }) => {
    return (
      <div
        onClick={() => setListedFilter(filterToCheck)}
        className={`flex w-28 flex-row items-center justify-center gap-2 rounded-full p-2 font-medium ${
          listedFilter === filterToCheck
            ? `bg-gray-800`
            : `cursor-pointer border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800`
        }`}
      >
        <p className={`mb-0 first-letter:text-base`}>{title}</p>
      </div>
    );
  };

  const onLoadMore = async (inView: boolean) => {
    if (!inView || loading || filteredNfts.length <= 0) {
      return;
    }

    const { data: newData } = await fetchMore({
      variables: {
        ...variables,
        limit: INFINITE_SCROLL_AMOUNT_INCREMENT,
        offset:
          filteredNfts.length > INFINITE_SCROLL_AMOUNT_INCREMENT
            ? filteredNfts.length
            : INFINITE_SCROLL_AMOUNT_INCREMENT,
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const prevNfts = prev.nfts;
        const moreNfts = fetchMoreResult.nfts;
        if (isEmpty(moreNfts)) {
          setHasMore(false);
        }

        fetchMoreResult.nfts = [...prevNfts, ...moreNfts];

        return { ...fetchMoreResult };
      },
    });
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col items-center gap-6 bg-gray-900 bg-opacity-80 py-4 backdrop-blur-sm lg:flex-row lg:justify-between lg:gap-4">
        <div className={`flex w-full justify-start gap-4 lg:items-center`}>
          <ListingFilter title={`All`} filterToCheck={ListingFilters.ALL} count={totalCount} />
          <ListingFilter
            title={`Listed`}
            filterToCheck={ListingFilters.LISTED}
            count={listedCount}
          />
          <ListingFilter
            title={`Unlisted`}
            filterToCheck={ListingFilters.UNLISTED}
            count={unlistedCount}
          />
        </div>
        <div className={`flex w-full lg:justify-end`}>
          <TextInput2
            id="owned-search"
            label="owned search"
            hideLabel
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={
              <FeatherIcon
                icon="search"
                aria-hidden="true"
                className={searchFocused ? 'text-white' : 'text-gray-500'}
              />
            }
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <GridSelector gridView={gridView} setGridView={setGridView} />
        </div>
      </div>
      <NFTGrid
        ctaVariant={`collected`}
        hasMore={hasMore && filteredNfts.length > INITIAL_FETCH - 1}
        onLoadMore={onLoadMore}
        nfts={uniq(filteredNfts)}
        gridView={gridView}
        refetch={refetch}
        loading={ownedNFTs.loading}
        marketplace={marketplace as Marketplace}
      />
    </>
  );
}

export default ProfileNFTs;

ProfileNFTs.getLayout = function getLayout(
  profileData: WalletDependantPageProps & { children: JSX.Element }
): JSX.Element {
  return (
    <ProfileDataProvider profileData={profileData}>
      <ProfileLayout profileData={profileData}>{profileData.children}</ProfileLayout>
    </ProfileDataProvider>
  );
};
