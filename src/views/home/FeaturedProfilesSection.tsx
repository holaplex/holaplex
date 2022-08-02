import { useMemo } from 'react';
import { HomeSection, HomeSectionCarousel } from 'src/pages/index';
import ProfilePreview, {
  ProfilePreviewData,
  ProfilePreviewLoadingCard,
} from '@/components/ProfilePreviewCard';
import { QueryContext } from '@/hooks/useApolloQuery';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 4;

export type FeaturedProfilesData = ProfilePreviewData[];

export interface FeaturedProfilesSectionProps {
  context: QueryContext<FeaturedProfilesData>;
}

export function FeaturedProfilesSection(props: FeaturedProfilesSectionProps): JSX.Element {
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
          <ProfilePreview address={p.address} context={{ ...props.context, data: p }} />
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
        <HomeSection.HeaderAction href="/discover/profiles">See All</HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {bodyElements}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
