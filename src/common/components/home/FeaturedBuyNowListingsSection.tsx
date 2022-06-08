import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { Nft, useFeaturedBuyNowListingsQuery, useNftCardLazyQuery } from 'src/graphql/indexerTypes';
import { AuctionHouse } from '@holaplex/marketplace-js-sdk';
import useWindowDimensions from '@/common/hooks/useWindowDimensions';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS_LARGE_SCREEN: number = 3;
const CAROUSEL_COLS_SMALL_SCREEN: number = 2;
const CAROUSEL_PAGES: number = 3;
const LARGE_SCREEN_THRESHOLD: number = 1350;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS_LARGE_SCREEN * CAROUSEL_PAGES;

interface FeaturedListing {
  address: string;
  marketplace: string;
  data: {
    auctionHouse: AuctionHouse;
    nft: Nft;
  };
}

const FeaturedBuyNowListingsSection: VFC = () => {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const dataQuery = useFeaturedBuyNowListingsQuery({
    variables: { limit: N_LISTINGS, marketplace: HOLAPLEX_MARKETPLACE_SUBDOMAIN },
  });
  const placeholderCards = useMemo(
    () =>
      [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4">
          <LoadingNFTCard />
        </HomeSectionCarousel.Item>
      )),
    []
  );
  const { width: windowWidth } = useWindowDimensions();
  const [carouselCols, setCarouselCols] = useState<number>(CAROUSEL_COLS_LARGE_SCREEN);

  useEffect(() => {
    if (
      dataQuery &&
      !dataQuery.error &&
      !dataQuery.loading &&
      dataQuery.called &&
      dataQuery.data?.featuredListings &&
      dataQuery.data.featuredListings.length > 0 &&
      dataQuery.data.marketplace &&
      dataQuery.data.marketplace.auctionHouse
    ) {
      const auctionHouse: AuctionHouse = dataQuery.data.marketplace.auctionHouse as AuctionHouse;
      setFeaturedListings(
        dataQuery.data.featuredListings
          .filter((v) => v.metadata !== undefined && v.nft !== undefined)
          .slice(0, N_LISTINGS)
          .map((v) => ({
            address: v.metadata,
            marketplace: HOLAPLEX_MARKETPLACE_SUBDOMAIN,
            data: {
              auctionHouse: auctionHouse,
              nft: v.nft as Nft,
            },
          }))
      );
    }
  }, [dataQuery.data]);

  useEffect(() => {
    if (windowWidth < LARGE_SCREEN_THRESHOLD) {
      if (carouselCols !== CAROUSEL_COLS_SMALL_SCREEN) {
        setCarouselCols(CAROUSEL_COLS_SMALL_SCREEN);
      }
    } else if (carouselCols !== CAROUSEL_COLS_LARGE_SCREEN) {
      setCarouselCols(CAROUSEL_COLS_LARGE_SCREEN);
    }
  }, [windowWidth]);

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAListing = useCallback<(nftAddress: string) => void>(
    (nftAddress) => setFeaturedListings(featuredListings.filter((n) => n.address !== nftAddress)),
    [featuredListings]
  );

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>What&apos;s hot</HomeSection.Title>
        {/* //TODO revert once discovery is ready */}
        {/* <HomeSection.HeaderAction external href="https://holaplex.com">
          Discover All
        </HomeSection.HeaderAction> */}
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={carouselCols}>
          {featuredListings.length === 0
            ? placeholderCards
            : featuredListings.map((s) => (
                <HomeSectionCarousel.Item key={s.address} className="p-4">
                  <NFTCardDataWrapper
                    address={s.address}
                    marketplace={s.marketplace}
                    data={s.data}
                    onInsufficientData={onInsufficientDataForAListing}
                  />
                </HomeSectionCarousel.Item>
              ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

interface ListingPreviewProps {
  address: string;
  marketplace: string;
  onInsufficientData: (address: string) => void;
  data?: { auctionHouse: AuctionHouse; nft: Nft };
}

const NFTCardDataWrapper: VFC<ListingPreviewProps> = ({
  address,
  marketplace,
  onInsufficientData,
  data,
}) => {
  const [nftCardQuery, { data: queriedData, loading, refetch, called }] = useNftCardLazyQuery();

  useEffect(() => {
    if (!data && !loading && !called) {
      nftCardQuery({ variables: { subdomain: marketplace, address: address } });
    }
  });

  // query preview data if it wasnt already given
  const { auctionHouse, nft } = useMemo(() => {
    let auctionHouse: AuctionHouse | undefined;
    let nft: Nft | undefined;
    if (data) {
      auctionHouse = data.auctionHouse;
      nft = data.nft;
      if (!previewDataAreSufficient(data.nft, data.auctionHouse)) {
        onInsufficientData(address);
      }
    } else if (!loading && called) {
      const auctionHouseMaybe: AuctionHouse | undefined | null =
        queriedData?.marketplace?.auctionHouse;
      const nftMaybe: Nft | undefined | null = queriedData?.nft as Nft;
      if (!previewDataAreSufficient(nftMaybe, auctionHouseMaybe)) {
        onInsufficientData(address);
      } else {
        auctionHouse = auctionHouseMaybe!;
        nft = nftMaybe;
      }
    }
    return { auctionHouse, nft };
  }, [data, queriedData, address, called, loading, onInsufficientData]);

  if (!auctionHouse || !nft) {
    return <LoadingNFTCard />;
  }

  return (
    <NFTCard
      newTab={false}
      nft={nft!}
      marketplace={{ auctionHouse: auctionHouse! }}
      refetch={refetch}
      loading={loading}
    />
  );
};

function previewDataAreSufficient(
  nft: Nft | undefined | null,
  auctionHouse?: AuctionHouse | undefined | null
): boolean {
  return nft !== undefined && nft !== null && auctionHouse !== undefined && auctionHouse !== null;
}

export default FeaturedBuyNowListingsSection;
