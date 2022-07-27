import { useEffect, useMemo, useState } from 'react';
import { HomeSection, HomeSectionCarousel } from 'src/pages/index';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { QueryContext } from '@/hooks/useApolloQuery';
import {
  CollectionPreviewCard,
  CollectionPreviewCardData,
  CollectionPreviewLoadingCard,
} from '@/components/CollectionPreviewCard';

const CAROUSEL_ROWS: number = 1;
const CAROUSEL_COLS_LARGE_SCREEN: number = 5;
const CAROUSEL_COLS_SMALL_SCREEN: number = 4;
const CAROUSEL_PAGES: number = 3;
const LARGE_SCREEN_THRESHOLD: number = 1350;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS_LARGE_SCREEN * CAROUSEL_PAGES;

export type FeaturedCollectionsByMarketCapData = CollectionPreviewCardData[];

export interface FeaturedCollectionsByMarketCapSectionProps {
  context: QueryContext<FeaturedCollectionsByMarketCapData>;
}

export function FeaturedCollectionsByMarketCapSection(
  props: FeaturedCollectionsByMarketCapSectionProps
) {
  const bodyElements: JSX.Element[] = useMemo(() => {
    if (props.context.loading || !props.context.data) {
      return [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4">
          <CollectionPreviewLoadingCard />
        </HomeSectionCarousel.Item>
      ));
    } else {
      return props.context.data.map((s) => (
        <HomeSectionCarousel.Item key={s.address} className="p-4">
          <CollectionPreviewCard
            context={{
              data: s,
              loading: props.context.loading,
              error: props.context.error,
              fetchMore: props.context.fetchMore,
              refetch: props.context.refetch,
            }}
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
        <HomeSection.Title>Top marketcap collections</HomeSection.Title>
        <HomeSection.HeaderAction href="/discover/collections?by=marketcap">
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
