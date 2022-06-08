import { useCallback, useEffect, useState } from 'react';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { ProfilePreviewData } from '@/types/types';
import {
  useFeaturedProfilesQuery,
} from 'src/graphql/indexerTypes';
import {
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import ProfilePreview from '../elements/ProfilePreviewCard';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 2;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS * CAROUSEL_PAGES;

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

export default function FeaturedProfilesSection(): JSX.Element {
  const wallet: WalletContextState = useWallet();
  // initial value hack to get loading card
  // TODO pass in a loading boolean to bypass loading until the address is known
  const [featuredProfiles, setFeaturedProfiles] = useState<ProfilePreviewData[]>(
    [...Array(N_LISTINGS)].map((_) => ({ address: '', profile: {}, nftCounts: {} }))
  );

  const dataQuery = useFeaturedProfilesQuery({
    variables: {
      userWallet: wallet?.publicKey,
      limit: CAROUSEL_PAGES * CAROUSEL_COLS * CAROUSEL_ROWS,
    },
  });

  // get featured profiles once on page load and anytime later when the wallet has been (dis)connected
  // by making the wallet pubkey one of the dependencies
  useEffect(() => {
    if (dataQuery.data?.followWallets && dataQuery.data.followWallets.length > 0) {
      const profilesToShow = (dataQuery.data.followWallets as ProfilePreviewData[]).filter(
        (p) => !DISALLOWED_PROFILES.includes(p.address)
      );
      setFeaturedProfiles(profilesToShow);
    }
  }, [wallet?.publicKey, setFeaturedProfiles, dataQuery.data?.followWallets]);

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAProfile = useCallback<(profileAddress: string) => void>(
    (profileAddress) => {
      setFeaturedProfiles(featuredProfiles.filter((p) => p.address !== profileAddress));
    },
    [featuredProfiles]
  );

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Profiles to follow</HomeSection.Title>
        {/* //TODO revert once discovery is ready  */}
        {/* <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction> */}
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredProfiles.map((s) => (
            <HomeSectionCarousel.Item key={s.address} className="p-4">
              <ProfilePreview
                address={s.address}
                data={s}
                onInsufficientData={onInsufficientDataForAProfile}
              />
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
}
