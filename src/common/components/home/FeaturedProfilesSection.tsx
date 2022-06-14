import { useMemo } from 'react';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import ProfilePreview, {
  ProfilePreviewData,
  ProfilePreviewLoadingCard,
} from '../elements/ProfilePreviewCard';
import { QueryContext } from './query';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;

export type FeaturedProfilesData = ProfilePreviewData[];

export interface FeaturedProfilesSectionProps {
  context: QueryContext<FeaturedProfilesData>;
}

export default function FeaturedProfilesSection(props: FeaturedProfilesSectionProps): JSX.Element {
  const bodyElements: JSX.Element[] = useMemo(() => {
    if (props.context.loading || !props.context.data) {
      return [...Array(CAROUSEL_COLS * CAROUSEL_ROWS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-4">
          <ProfilePreviewLoadingCard />
        </HomeSectionCarousel.Item>
      ));
    } else {
      return props.context.data.map((p) => (
        <HomeSectionCarousel.Item key={p.address} className="p-4">
          <ProfilePreview
            address={p.address}
            context={{ data: p, loading: props.context.loading, error: props.context.error }}
          />
        </HomeSectionCarousel.Item>
      ));
    }
  }, [props.context]);

  if (props.context.error) {
    return <></>;
  }

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Profiles to follow</HomeSection.Title>
        <HomeSection.HeaderAction href="/discover/profiles">Discover All</HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {bodyElements}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
