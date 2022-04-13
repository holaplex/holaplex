import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { DoubleGrid } from '@/common/components/icons/DoubleGrid';
import { TripleGrid } from '@/common/components/icons/TripleGrid';
import { OwnedNfTsQuery, useOwnedNfTsQuery } from '../../../src/graphql/indexerTypes';
import Link from 'next/link';
import TextInput2 from '@/common/components/elements/TextInput2';
import { Avatar } from '../../nfts/[address]';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { imgOpt } from '../../../src/common/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  HOLAPLEX_MARKETPLACE_ADDRESS,
  HOLAPLEX_MARKETPLACE_SUBDOMAIN,
} from '@/common/constants/marketplace';
import Button from '@/components/elements/Button';
import { DisplaySOL } from '@/components/CurrencyHelpers';
import Modal from '@/components/elements/Modal';
import SellForm from '../../../src/common/components/forms/SellForm';
import { Listing, Marketplace, Nft, Offer } from '@holaplex/marketplace-js-sdk';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from '@/components/forms/OfferForm';
import UpdateSellForm from '@/components/forms/UpdateSellForm';
import BuyForm from '@/components/forms/BuyForm';
import { Tag } from '@/components/icons/Tag';
import UpdateOfferForm from '../../../src/common/components/forms/UpdateOfferForm';

type OwnedNFT = OwnedNfTsQuery['nfts'][0];

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const NFTCard = ({
  nft,
  marketplace,
  refetch,
  loading = false,
}: {
  nft: OwnedNFT;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  loading: boolean;
}) => {
  const { publicKey } = useWallet();
  const creatorsCopy = [...nft.creators];
  const sortedCreators = creatorsCopy.sort((a, b) => b.share - a.share);
  const shownCreatorAddress = sortedCreators.length > 0 ? sortedCreators[0].address : null;

  const offers = nft?.offers;
  const topOffers = offers?.sort((a, b) => Number(a.price) - Number(b.price));
  const topOffer = topOffers?.[0];
  const addedOffer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasAddedOffer = Boolean(addedOffer);
  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());
  const defaultListing = nft?.listings.find(
    (listing) => listing.auctionHouse.toString() === HOLAPLEX_MARKETPLACE_ADDRESS
  );
  const hasDefaultListing = Boolean(defaultListing);
  const lastSale = nft?.purchases?.[0]?.price;

  const [listNFTVisibility, setListNFTVisibility] = useState(false);
  const [updateListingVisibility, setUpdateListingVisibility] = useState(false);
  const [updateOfferVisibility, setUpdateOfferVisibility] = useState(false);

  return (
    <>
      <div className="transform overflow-hidden rounded-lg border-gray-800 shadow-2xl transition duration-[300ms] hover:scale-[1.02]">
        <Link href={`/nfts/${nft.address}`} passHref>
          <div className={`cursor-pointer`}>
            <div className={`relative `}>
              <img
                src={imgOpt(nft.image, 600)}
                alt={nft.name}
                className="aspect-square h-80 w-full object-cover"
              />
              {shownCreatorAddress && (
                <div className={`absolute left-0 top-0 flex flex-row items-center pl-5 pt-5`}>
                  <Link href={`/profiles/${shownCreatorAddress}`}>
                    <a className="text-gray-300">
                      <Avatar address={shownCreatorAddress} showAddress={false} />
                    </a>
                  </Link>

                  {offers.length > 0 && (
                    <div className={`ml-2 rounded-full bg-gray-800 px-2 py-1 font-mono text-sm`}>
                      {offers.length} OFFERS
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-24 bg-gray-900 py-6 px-4">
              <p className="w-max-fit m-0 mb-2 min-h-[28px] truncate text-lg font-bold">
                {nft.name}
              </p>
            </div>
          </div>
        </Link>
        <div className={`h-20`}>
          <div className={`flex w-full items-center justify-between p-5`}>
            {hasDefaultListing && (
              <ul className={`mb-0 flex flex-col`}>
                <li className={`text-sm font-bold text-gray-300`}>Price</li>
                <DisplaySOL amount={Number(defaultListing?.price)} />
              </ul>
            )}
            {!hasDefaultListing && !hasAddedOffer && Boolean(lastSale) && (
              <ul className={`mb-0 flex flex-col`}>
                <li className={`text-sm font-bold text-gray-300`}>Last sale</li>
                <DisplaySOL amount={Number(lastSale)} />
              </ul>
            )}
            {!hasDefaultListing && !hasAddedOffer && !Boolean(lastSale) && (
              <div className={`flex items-center`}>
                <Tag className={`mr-2`} />
                <h3 className={` text-base font-medium text-gray-300`}>Not Listed</h3>
              </div>
            )}
            {!hasDefaultListing && hasAddedOffer && (
              <ul className={`mb-0 flex flex-col`}>
                <li className={`text-sm font-bold text-gray-300`}>Your offer</li>
                <DisplaySOL amount={Number(addedOffer?.price) || 0} />
              </ul>
            )}

            {isOwner && !hasDefaultListing && (
              <Button onClick={() => setListNFTVisibility(true)}>List NFT</Button>
            )}
            {isOwner && hasDefaultListing && (
              <Button onClick={() => setUpdateListingVisibility(true)}>Update listing</Button>
            )}
            {!isOwner && !hasAddedOffer && hasDefaultListing && (
              <div>
                <BuyForm
                  nft={nft as Nft | any}
                  marketplace={marketplace}
                  listing={defaultListing as Listing}
                  refetch={refetch}
                  className={`w-full`}
                />
              </div>
            )}
            {!isOwner && hasAddedOffer && (
              <Button
                secondary
                className={`bg-gray-800`}
                onClick={() => setUpdateOfferVisibility(true)}
              >
                Update offer
              </Button>
            )}
            {!isOwner && !hasAddedOffer && !hasDefaultListing && (
              <Link href={`/nfts/${nft?.address}/offers/new`}>
                <a>
                  <Button>Make offer</Button>
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
          marketplace={marketplace}
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
          listing={defaultListing as Listing}
          setOpen={setUpdateListingVisibility}
          offer={topOffer as Offer}
        />
      </Modal>
      <Modal open={updateOfferVisibility} setOpen={setUpdateOfferVisibility} title={`Update offer`}>
        <UpdateOfferForm
          nft={nft as Nft | any}
          refetch={refetch}
          marketplace={marketplace as Marketplace}
          listing={defaultListing as Listing}
          setOpen={setUpdateOfferVisibility}
          loading={loading}
          hasListing={hasDefaultListing}
        />
      </Modal>
    </>
  );
};

const NFTGrid = ({
  nfts,
  marketplace,
  gridView,
  refetch,
  loading = false,
}: {
  nfts: OwnedNFT[];
  marketplace: Marketplace;
  gridView: '2x2' | '3x3';
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  loading?: boolean;
}) => {
  return (
    <div
      className={cx(
        'grid grid-cols-1 gap-6',
        gridView === '2x2' ? 'md:grid-cols-2' : 'md:grid-cols-3'
      )}
    >
      {nfts.map((nft) => (
        <NFTCard
          key={nft.address}
          nft={nft}
          refetch={refetch}
          loading={loading}
          marketplace={marketplace}
        />
      ))}
    </div>
  );
};

type ListedFilterState = 'all' | 'listed' | 'unlisted' | 'search';

const ProfileNFTs: NextPage<WalletDependantPageProps> = (props) => {
  const { publicKey: pk } = props;
  // const [listedFilter, setListedFilter] = useState<ListedFilterState>('search');
  // const [showSearchField, toggleSearchField] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridView, setGridView] = useState<'2x2' | '3x3'>('3x3');
  const ownedNFTs = useOwnedNfTsQuery({
    variables: {
      subdomain: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
      address: pk,
      limit: 100,
      offset: 0,
    },
  });
  const refetch = ownedNFTs.refetch;
  const nfts = ownedNFTs?.data?.nfts || [];
  const marketplace = ownedNFTs?.data?.marketplace;

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  // const [selectedNFT, setSelectedNFT] = useState(nfts[0]);

  const GridSelector = () => {
    return (
      <div className="ml-4 hidden rounded-lg border-2 border-solid border-gray-800 md:flex">
        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '2x2',
          })}
          onClick={() => setGridView('2x2')}
        >
          <DoubleGrid
            className={gridView !== '2x2' ? 'transition hover:scale-110 ' : ''}
            color={gridView === '2x2' ? 'white' : '#707070'}
          />
        </button>

        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '3x3',
          })}
          onClick={() => setGridView('3x3')}
        >
          <TripleGrid
            className={gridView !== '3x3' ? 'transition hover:scale-110' : ''}
            color={gridView === '3x3' ? 'white' : '#707070'}
          />
        </button>
      </div>
    );
  };

  return (
    <ProfileDataProvider profileData={props}>
      <Head>
        <title>{showFirstAndLastFour(pk)}&apos;s NFTs | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer>
        <div className="mb-4 flex">
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
          <GridSelector />
        </div>
        <NFTGrid
          nfts={nftsToShow}
          gridView={gridView}
          refetch={refetch}
          loading={ownedNFTs.loading}
          marketplace={marketplace as Marketplace}
        />
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default ProfileNFTs;