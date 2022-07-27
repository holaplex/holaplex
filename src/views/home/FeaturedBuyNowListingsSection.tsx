import { useEffect, useMemo, useState } from 'react';
import { LoadingNFTCard, NFTCard, OwnedNFT } from 'src/pages/profiles/[publicKey]/nfts';
import { HomeSection, HomeSectionCarousel } from 'src/pages/index';
import { AuctionHouse, Marketplace } from '@holaplex/marketplace-js-sdk';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { QueryContext } from '@/hooks/useApolloQuery';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS_LARGE_SCREEN: number = 4;
const CAROUSEL_COLS_SMALL_SCREEN: number = 3;
const CAROUSEL_PAGES: number = 3;
const LARGE_SCREEN_THRESHOLD: number = 1350;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS_LARGE_SCREEN * CAROUSEL_PAGES;

export type FeaturedBuyNowListingsData = ListingPreviewData[];

export interface ListingPreviewData {
  auctionHouse: AuctionHouse;
  nft: OwnedNFT;
}

export interface FeaturedBuyNowListingsSectionProps {
  context: QueryContext<FeaturedBuyNowListingsData>;
}

export function FeaturedBuyNowListingsSection(props: FeaturedBuyNowListingsSectionProps) {
  const bodyElements: JSX.Element[] = useMemo(() => {
    if (props.context.loading || !props.context.data) {
      return [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4">
          <LoadingNFTCard />
        </HomeSectionCarousel.Item>
      ));
    } else {
      return props.context.data.map((s) => (
        <HomeSectionCarousel.Item key={s.nft.address} className="p-4">
          <NFTCard
            newTab={false}
            nft={s.nft}
            marketplace={{ auctionHouses: [s.auctionHouse] } as Marketplace}
            refetch={props.context.refetch}
            loading={props.context.loading}
          />
        </HomeSectionCarousel.Item>
      ));
    }
  }, [props.context]);

  const { width: windowWidth } = useWindowDimensions();
  const [carouselCols, setCarouselCols] = useState<number>(CAROUSEL_COLS_LARGE_SCREEN);

  useEffect(() => {
    if (windowWidth < LARGE_SCREEN_THRESHOLD) {
      if (carouselCols !== CAROUSEL_COLS_SMALL_SCREEN) {
        setCarouselCols(CAROUSEL_COLS_SMALL_SCREEN);
      }
    } else if (carouselCols !== CAROUSEL_COLS_LARGE_SCREEN) {
      setCarouselCols(CAROUSEL_COLS_LARGE_SCREEN);
    }
  }, [windowWidth]);

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>What&apos;s hot</HomeSection.Title>
        <HomeSection.HeaderAction href="/discover/nfts?type=buy-now">
          See all
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={carouselCols}>
          {bodyElements}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
