import { useEffect, useMemo, useState } from 'react';
import { HomeSection, HomeSectionCarousel } from 'src/pages/index';
import { Listing } from '@/modules/indexer';
import { ListingPreview, SkeletonListing } from '../../components/ListingPreview';
import { FilterOptions, SortOptions } from './home.interfaces';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { QueryContext } from '@/hooks/useApolloQuery';

const CAROUSEL_ROWS: number = 1;
const CAROUSEL_COLS_LARGE_SCREEN: number = 3;
const CAROUSEL_COLS_SMALL_SCREEN: number = 2;
const CAROUSEL_PAGES: number = 3;
const LARGE_SCREEN_THRESHOLD: number = 1350;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS_LARGE_SCREEN * CAROUSEL_PAGES;

export type FeaturedAuctionsSectionData = Listing[];

export interface FeaturedAuctionsSectionProps {
  context: QueryContext<FeaturedAuctionsSectionData>;
}

export function FeaturedAuctionsSection(props: FeaturedAuctionsSectionProps): JSX.Element {
  const { width: windowWidth } = useWindowDimensions();
  const [carouselCols, setCarouselCols] = useState<number>(CAROUSEL_COLS_LARGE_SCREEN);

  const bodyElements: JSX.Element[] = useMemo(() => {
    if (props.context.loading || !props.context.data) {
      return [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4 duration-300 hover:scale-[1.02]">
          <SkeletonListing />
        </HomeSectionCarousel.Item>
      ));
    } else {
      return props.context.data.map((listing, i) => (
        <HomeSectionCarousel.Item
          key={listing.listingAddress}
          className="p-4 duration-300 hover:scale-[1.02]"
        >
          <ListingPreview
            key={listing.listingAddress}
            listing={listing}
            meta={{
              index: i,
              list: 'featured-listings',
              sortBy: SortOptions.Trending,
              filterBy: FilterOptions.Auctions,
            }}
          />
        </HomeSectionCarousel.Item>
      ));
    }
  }, [props.context]);

  useEffect(() => {
    if (windowWidth < LARGE_SCREEN_THRESHOLD) {
      if (carouselCols !== CAROUSEL_COLS_SMALL_SCREEN) {
        setCarouselCols(CAROUSEL_COLS_SMALL_SCREEN);
      }
    } else if (carouselCols !== CAROUSEL_COLS_LARGE_SCREEN) {
      setCarouselCols(CAROUSEL_COLS_LARGE_SCREEN);
    }
  }, [windowWidth, carouselCols]);

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Trending auctions</HomeSection.Title>
        {/* //TODO revert once discovery is ready */}
        {/* <HomeSection.HeaderAction external href="https://holaplex.com">
          Discover All
        </HomeSection.HeaderAction> */}
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={carouselCols}>
          {bodyElements}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
