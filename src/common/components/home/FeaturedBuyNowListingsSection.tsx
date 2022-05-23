import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { Nft, useFeaturedBuyNowListingsQuery, useNftCardQuery } from 'src/graphql/indexerTypes';
import { BuyNowListingPreviewData } from '@/types/types';
import { AuctionHouse } from '@holaplex/marketplace-js-sdk';
import useWindowDimensions from '@/common/hooks/useWindowDimensions';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS_LARGE_SCREEN: number = 3;
const CAROUSEL_COLS_SMALL_SCREEN: number = 2;
const CAROUSEL_PAGES: number = 5;
const LARGE_SCREEN_THRESHOLD: number = 1350;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS_LARGE_SCREEN * CAROUSEL_PAGES;

interface FeaturedListing {
  address: string;
  marketplace: string;
}

const FeaturedBuyNowListingsSection: VFC = () => {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const dataQuery = useFeaturedBuyNowListingsQuery({ variables: { limit: N_LISTINGS } });
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
      dataQuery.data.featuredListings.length > 0
    ) {
      setFeaturedListings(
        dataQuery.data.featuredListings
          .filter((v) => v.metadata !== undefined)
          .slice(0, N_LISTINGS)
          .map((v) => ({ address: v.metadata, marketplace: HOLAPLEX_MARKETPLACE_SUBDOMAIN }))
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
}

const NFTCardDataWrapper: VFC<ListingPreviewProps> = ({
  address,
  marketplace,
  onInsufficientData,
}) => {
  const { data, loading, refetch, called } = useNftCardQuery({
    variables: { address: address, subdomain: marketplace },
  });

  if (loading) {
    return <LoadingNFTCard />;
  }

  if (!loading && called && !previewDataAreSufficient(data as BuyNowListingPreviewData)) {
    onInsufficientData(address);
    return <LoadingNFTCard />;
  }

  return (
    <NFTCard
      newTab={false}
      nft={data?.nft as Nft}
      marketplace={{ auctionHouse: data!.marketplace!.auctionHouse! as AuctionHouse }}
      refetch={refetch}
      loading={loading}
    />
  );
};

function previewDataAreSufficient(data: BuyNowListingPreviewData): boolean {
  return (
    data !== undefined &&
    data.marketplace !== undefined &&
    data.marketplace.auctionHouse !== undefined &&
    data.nft !== undefined
  );
}

export default FeaturedBuyNowListingsSection;
