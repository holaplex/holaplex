import { useEffect, useMemo, useState, VFC } from 'react';
import { HomeSection, HomeSectionCarousel } from 'pages/home-v2-wip';
import { IndexerSDK, Listing } from '@/modules/indexer';
import { ListingPreview, SkeletonListing } from '../elements/ListingPreview';
import { FilterOptions, SortOptions } from './home.interfaces';

const CAROUSEL_ROWS: number = 1;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 5;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS * CAROUSEL_PAGES;

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO as string;
const DAO_LIST_IPFS =
  process.env.NEXT_PUBLIC_DAO_LIST_IPFS ||
  'https://ipfs.cache.holaplex.com/bafkreidnqervhpcnszmjrj7l44mxh3tgd7pphh5c4jknmnagifsm62uel4';

const FeaturedAuctionsSection: VFC = () => {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const placeholderCards = useMemo(
    () =>
      [...Array(N_LISTINGS)].map((_, i) => (
        <HomeSectionCarousel.Item key={i} className="p-3 duration-300 hover:scale-[1.02] md:p-4">
          <SkeletonListing />
        </HomeSectionCarousel.Item>
      )),
    []
  );

  useEffect(() => {
    getAndPrepListings()
      .then((listings) => {
        setFeaturedListings(listings);
      })
      .catch((e) => console.log('Unable to load featured auctions', e));
  }, []);

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
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredListings.length === 0
            ? placeholderCards
            : featuredListings.map(
                (listing, i) =>
                  (
                    <HomeSectionCarousel.Item
                      key={listing.listingAddress}
                      className="p-3 duration-300 hover:scale-[1.02] md:p-4"
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
                  ) || placeholderCards
              )}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

// TODO: this was adapted from the v1 homepage and should probably be replaced with
//  a graph-ql version at some point
async function getAndPrepListings(): Promise<Listing[]> {
  async function DAOStoreFrontList() {
    if (WHICHDAO) {
      const response = await fetch(DAO_LIST_IPFS);
      const json = await response.json();
      return json[WHICHDAO];
    }
    return [];
  }

  function isAuction(listing: Listing): boolean {
    return listing.endsAt !== undefined && listing.endsAt !== null && listing.endsAt.trim() !== '';
  }

  function compareListingsForSort(a: Listing, b: Listing): number {
    const aBids: number = a.totalUncancelledBids ? a.totalUncancelledBids : 0;
    const bBids: number = b.totalUncancelledBids ? b.totalUncancelledBids : 0;
    if (aBids != bBids) {
      // primarily sort by most bids first
      return bBids - aBids;
    } else {
      // secondarily sort by ending soonest
      const aEnd: number = a.endsAt ? Date.parse(a.endsAt) : Number.MAX_SAFE_INTEGER;
      const bEnd: number = b.endsAt ? Date.parse(b.endsAt) : Number.MAX_SAFE_INTEGER;
      return aEnd - bEnd;
    }
  }

  function applyListingFilterAndSort(listings: Listing[]): Listing[] {
    const result: Listing[] = listings.filter(isAuction);
    result.sort(compareListingsForSort);
    return result;
  }

  const selectedDaoSubdomains = await DAOStoreFrontList();
  const allListings = await IndexerSDK.getListings();
  let daoFilteredListings = allListings;

  if (WHICHDAO) {
    daoFilteredListings = daoFilteredListings.filter((listing) =>
      selectedDaoSubdomains.includes(listing.subdomain)
    );
  }

  return applyListingFilterAndSort(daoFilteredListings).slice(0, N_LISTINGS);
}

export default FeaturedAuctionsSection;
