import { useCallback, useEffect, useMemo, useState } from 'react';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import ProfilePreview from '../elements/ProfilePreviewCard';
import { QueryContext, useFeaturedProfiles } from '@/common/hooks/home';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;

export default function FeaturedProfilesSection(): JSX.Element {
  const queryContext: QueryContext<string[]> = useFeaturedProfiles();
  const [excludedProfiles, setExcludedProfiles] = useState<string[]>([]);

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAProfile = useCallback<(profileAddress: string) => void>(
    (profileAddress) => {
      excludedProfiles.push(profileAddress);
      setExcludedProfiles(excludedProfiles);
    },
    [excludedProfiles]
  );

  const featuredProfiles: string[] = (queryContext.data ?? []).filter(a => !excludedProfiles.includes(a));

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Profiles to follow</HomeSection.Title>
        <HomeSection.HeaderAction href="/discover/profiles">
          Discover All
        </HomeSection.HeaderAction>
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredProfiles.map((a) => (
            <HomeSectionCarousel.Item key={a} className="p-4">
              <ProfilePreview
                address={a}
                onInsufficientData={onInsufficientDataForAProfile}
              />
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
