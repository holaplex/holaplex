import { useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { LoadingNFTCard, NFTCard } from 'pages/profiles/[publicKey]/nfts';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { HOLAPLEX_MARKETPLACE_SUBDOMAIN } from '@/common/constants/marketplace';
import { Nft, useFeaturedBuyNowListingsQuery, useNftCardQuery } from 'src/graphql/indexerTypes';
import { BuyNowListingPreviewData } from '@/types/types';
import { AuctionHouse } from '@holaplex/marketplace-js-sdk';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 3;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS * CAROUSEL_PAGES;

interface FeaturedListing {
  address: string;
  marketplace: string;
}

const FeaturedBuyNowListingsSection: VFC = () => {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const dataQuery = useFeaturedBuyNowListingsQuery({ variables: { limit: 1000 } });
  const placeholderCards = useMemo(
    () =>
      [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="px-4 md:px-8 pb-16">
          <LoadingNFTCard />
        </HomeSectionCarousel.Item>
      )),
    []
  );

  useEffect(() => {
    if (
      dataQuery &&
      !dataQuery.error &&
      !dataQuery.loading &&
      dataQuery.called &&
      dataQuery.data?.nfts &&
      dataQuery.data.nfts.length > 0
    ) {
      setFeaturedListings(
        dataQuery.data.nfts
          .filter((v) => v.address !== undefined)
          .slice(0, N_LISTINGS)
          .map((v) => ({ address: v.address, marketplace: HOLAPLEX_MARKETPLACE_SUBDOMAIN }))
      );
    }
  }, [dataQuery.data]);

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
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredListings.length === 0
            ? placeholderCards
            : featuredListings.map((s) => (
                <HomeSectionCarousel.Item key={s.address} className="px-4 md:px-8 pb-16">
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
