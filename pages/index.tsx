// naughty
// @ts-nocheck

import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import StorePreview from '@/components/elements/StorePreview';
import FeaturedStoreSDK, { StorefrontFeature } from '@/modules/storefront/featured';
import {
  PageHeader,
  List,
  Space,
  Row,
  Col,
  Typography,
  ListProps,
  Carousel,
  Select,
  SelectProps,
} from 'antd';
import Button from '@/components/elements/Button';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  take,
  compose,
  when,
  add,
  always,
  ifElse,
  filter,
  not,
  pipe,
  is,
  prop,
  descend,
  ascend,
  sortWith,
  equals,
} from 'ramda';
import { IndexerSDK, Listing } from '@/modules/indexer';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  generateListingShell,
  ListingPreview,
  SkeletonListing,
} from '@/common/components/elements/ListingPreview';
import Link from 'next/link';
import { SelectValue } from 'antd/lib/select';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import SocialLinks from '@/common/components/elements/SocialLinks';
import { StorefrontContext } from '@/modules/storefront';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContext } from '@/modules/wallet';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import FeaturedMarketplacesSection from '@/common/components/home/FeaturedMarketplacesSection';
import HeroSection from '@/common/components/home/HeroSection';
import { FilterOptions, SortOptions } from '@/common/components/home/home.interfaces';

const { Title, Text } = Typography;
const Option = Select.Option;

const FEATURED_STOREFRONTS_URL = process.env.FEATURED_STOREFRONTS_URL as string;
const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO as string;
const DAO_LIST_IPFS =
  process.env.NEXT_PUBLIC_DAO_LIST_IPFS ||
  'https://ipfs.cache.holaplex.com/bafkreidnqervhpcnszmjrj7l44mxh3tgd7pphh5c4jknmnagifsm62uel4';

const DAOStoreFrontList = async () => {
  if (WHICHDAO) {
    const response = await fetch(DAO_LIST_IPFS);
    const json = await response.json();
    return json[WHICHDAO];
  }
  return [];
};

const ListingsHeader = styled(PageHeader)`
  position: sticky;
  top: 0;
  z-index: 1;
  background: #161616f3;
  margin: 0 0px;
  padding: 12px 0px;
  backdrop-filter: blur(10px);
  h3 {
    &.ant-typography {
      margin: 0;
    }
  }
`;

interface SelectInlineProps extends SelectProps<SelectValue> {
  label: string;
}

const SelectInline = styled(Select)<SelectInlineProps>`
  width: 165px;
  font-size: 12px;
  line-height: 12px;
  .ant-select-selection-item {
    &:before {
      color: rgba(255, 255, 255, 0.6);
      content: '${({ label }) => label}:';
      display: block;
      font-size: 14px;
      color: grey;
      display: inline-block;
      padding: 0 12px 0 0;
    }
  }
`;

const HeroCarousel = styled(Carousel)`
  .carousel-dots {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: -24px;
    margin-right: -2px;
    justify-content: flex-end;

    @media screen and (max-width: 575px) {
      margin-right: 0;
    }
  }

  .carousel-dots > li > button {
    opacity: 1;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 100%;
  }

  .slick-dots li {
    > button {
      display: block;
      width: 100%;
      color: transparent;
      font-size: 0;
      background: #222;
      border: 0;
      border-radius: 1px;
      outline: none;
      cursor: pointer;
      opacity: 1;
    }

    &.slick-active {
      > button {
        background: #f4f4f4;
        width: 24px;
      }
    }
  }
`;

const HeroCol = styled.div`
  .ant-typography {
    display: block;
    margin: 0 0 0.5rem 0;
  }
`;

const sortOptions: {
  [key in FilterOptions]: {
    label: string;
    key: SortOptions;
  }[];
} = {
  all: [
    {
      label: 'New',
      key: SortOptions.RecentlyAdded,
    },
    { key: SortOptions.Trending, label: 'Trending' },
    {
      label: 'High to low',
      key: SortOptions.Expensive,
    },
    {
      label: 'Low to high',
      key: SortOptions.Cheapest,
    },
  ],
  secondary: [
    {
      label: 'New',
      key: SortOptions.RecentlyAdded,
    },
    { key: SortOptions.Trending, label: 'Trending' },
    {
      label: 'High to low',
      key: SortOptions.Expensive,
    },
    {
      label: 'Low to high',
      key: SortOptions.Cheapest,
    },
  ],
  auctions: [
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.Trending, label: 'Trending' },
    { key: SortOptions.Expensive, label: 'High to low' },
    { key: SortOptions.Cheapest, label: 'Low to high' },
    { key: SortOptions.EndingSoonest, label: 'Ending soon' },
  ],
  instant_sale: [
    { key: SortOptions.RecentlyAdded, label: 'New' },
    { key: SortOptions.Expensive, label: 'High to low' },
    { key: SortOptions.Cheapest, label: 'Low to high' },
  ],
};

// @ts-ignore
const isAuction = pipe(prop('endsAt'), is(String));

// @ts-ignore
const isSecondarySale = pipe((item) => item.items[0]?.primarySaleHappened == true);

const currentListingPrice = ifElse(
  isAuction,
  ifElse(pipe(prop('totalUncancelledBids'), equals(0)), prop('priceFloor'), prop('highestBid')),
  prop('instantSalePrice')
);

const filters = {
  [FilterOptions.Auctions]: isAuction,
  [FilterOptions.InstantSale]: pipe(isAuction, not),
  [FilterOptions.All]: pipe(always(true)),
  [FilterOptions.Secondary]: isSecondarySale,
};

const sorts = {
  [SortOptions.EndingSoonest]: [ascend(prop('endsAt')), descend(currentListingPrice)],
  [SortOptions.RecentlyAdded]: [descend(prop('createdAt')), descend(currentListingPrice)],
  [SortOptions.Expensive]: [descend(prop('highestBid')), descend(currentListingPrice)],
  [SortOptions.Cheapest]: [ascend(currentListingPrice), ascend(prop('endsAt'))],
  [SortOptions.Trending]: [descend(prop('totalUncancelledBids')), ascend(prop('endsAt'))],
};

// export async function getStaticProps() {
//   const featuredStorefronts = await FeaturedStoreSDK.lookup(FEATURED_STOREFRONTS_URL);
//   const selectedDaoSubdomains = await DAOStoreFrontList();

//   return {
//     props: {
//       featuredStorefronts,
//       selectedDaoSubdomains,
//     },
//   };
// }

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const featuredStorefronts = await FeaturedStoreSDK.lookup(FEATURED_STOREFRONTS_URL);
  const selectedDaoSubdomains = await DAOStoreFrontList();

  const initialFilterBy: string | undefined =
    Object.values(FilterOptions).includes(context.query.filter || '') && context.query.filter;

  const initialSortBy: string | undefined =
    Object.values(SortOptions).includes(context.query.sort || '') && context.query.sort;

  const initialSearchBy: string[] | undefined = context.query.search
    ?.split(',')
    .map((term) => term.toLowerCase());

  return {
    props: {
      initialFilterBy: initialFilterBy || FilterOptions.Auctions,
      initialSortBy: initialSortBy || SortOptions.Trending,
      initialSearchBy: initialSearchBy || [],
      featuredStorefronts,
      selectedDaoSubdomains,
    },
  };
};

interface HomeProps {
  featuredStorefronts: StorefrontFeature[];
  selectedDaoSubdomains: String[];
  initialSortBy: SortOptions;
  initialFilterBy: FilterOptions;
  initialSearchBy: string[];
}

const getDefaultFilter = () => {
  if (WHICHDAO) {
    return FilterOptions.All;
  }
  return FilterOptions.Auctions;
};

export default function Home({
  featuredStorefronts,
  selectedDaoSubdomains,
  initialSortBy,
  initialFilterBy,
  initialSearchBy,
}: HomeProps) {
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const { storefront, searching } = useContext(StorefrontContext);
  const { connected, connecting } = useWallet();
  const { looking } = useContext(WalletContext);
  const { track } = useAnalytics();
  const [show, setShow] = useState(16);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>(
    Array(5)
      .fill(null)
      .map((_, i) => generateListingShell(i))
  );
  const [displayedListings, setDisplayedListings] = useState<Listing[]>([]);
  const [filterBy, setFilterBy] = useState<FilterOptions>(
    // getDefaultFilter()
    WHICHDAO ? FilterOptions.All : initialFilterBy
  );
  const [sortBy, setSortBy] = useState<SortOptions>(initialSortBy);
  const [searchBy, setSearchBy] = useState<string[]>(initialSearchBy);
  const listingsTopRef = useRef<HTMLInputElement>(null);

  const scrollToListingTop = () => {
    if (!listingsTopRef || !listingsTopRef.current) {
      return;
    }

    listingsTopRef.current.scrollIntoView();
  };

  const loadMoreListings = () => {
    const total = displayedListings.length;

    const next = compose(
      when((next) => next > total, always(total)),
      add(8)
    )(show);

    setShow(next);
  };

  const hasNextPage = show < displayedListings.length;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMoreListings,
    rootMargin: '0px 0px 200px 0px',
  });

  const applyListingFilterAndSort = compose<Listing[], Listing[], Listing[]>(
    filter(filters[filterBy]),
    filter(
      (l: Listing) =>
        !searchBy.length ||
        [l.storeTitle, l.subdomain, l.items.map((i) => i.name)]
          .flat()
          .some((w) => searchBy.some((term) => w.toLowerCase().includes(term)))
    ),
    //@ts-ignore
    sortWith(sorts[sortBy])
  );

  // initial fetch and display
  useEffect(() => {
    async function getListings() {
      const allListings = await IndexerSDK.getListings();
      let daoFilteredListings = allListings;

      if (WHICHDAO) {
        daoFilteredListings = daoFilteredListings.filter((listing) =>
          selectedDaoSubdomains.includes(listing.subdomain)
        );
      }

      setAllListings(daoFilteredListings);
      setFeaturedListings(daoFilteredListings.slice(0, 5));

      setDisplayedListings(applyListingFilterAndSort(daoFilteredListings));

      setLoading(false);
    }

    getListings();
  }, []);

  /*
   * Scroll to top of `Current listings` section
   */
  const scrollToTop = () => {
    listingsTopRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
    track('Current Listings Scroll to top', {
      event_category: 'Discovery',
      filterBy,
      sortBy,
      nrOfListingsOnDisplay: displayedListings.length,
    });
  };

  // update display on new filter or sort
  useEffect(() => {
    if (loading) {
      return;
    }

    setDisplayedListings(applyListingFilterAndSort(allListings));
    setShow(16);
    router.replace(
      router.pathname +
        `?filter=${filterBy}&sort=${sortBy}` +
        (searchBy.length ? `&search=${searchBy.join(',')}` : '')
    );
  }, [filterBy, sortBy, searchBy]);

  return (
    <div className="container mx-auto mt-12 px-6 pb-20  ">
      <section className="flex flex-wrap items-center justify-between ">
        <div className="w-full max-w-xl  md:max-w-3xl">
          <h1 className="text-4xl font-semibold leading-[1.3] md:text-5xl">
            Discover, explore, and collect NFTs from incredible creators on Solana
          </h1>

          <h2 className="mb-8 mt-4 text-xl font-light md:text-2xl">
            Tools built by creators, for creators, owned by creators.
          </h2>

          {connected ? (
            <div className="flex flex-wrap gap-4">
              <Link href={storefront ? '/storefront/edit' : '/storefront/new'} passHref>
                <a>
                  <Button skeleton={looking || searching} className="min-w-[13rem]">
                    {storefront ? 'Edit your store' : 'Create your store'}
                  </Button>
                </a>
              </Link>
            </div>
          ) : (
            <div>
              <Button loading={connecting} onClick={() => setVisible(true)}>
                Connect
              </Button>
            </div>
          )}
          <div className="my-10">
            <SocialLinks />
          </div>
        </div>
        <HeroCol className="max-w-full  md:max-w-md">
          <Text className="mb-0" strong>
            Trending Listings
          </Text>
          <HeroCarousel
            autoplay={true}
            dots={{ className: 'carousel-dots' }}
            dotPosition="top"
            effect="fade"
            className="home-carousel max-w-full "
          >
            {featuredListings.map((listing, i) => (
              <div key={listing.listingAddress} className="max-w-full md:max-w-md">
                <ListingPreview
                  listing={listing}
                  meta={{
                    index: i,
                    list: 'featured-listings',
                    sortBy: sortBy,
                    filterBy: filterBy,
                  }}
                />
              </div>
            ))}
          </HeroCarousel>
        </HeroCol>
      </section>
      <section>
        <FeaturedMarketplacesSection />
      </section>
      <section className="mt-10">
        <div ref={listingsTopRef} />
        <ListingsHeader
          ghost={false}
          title={
            <a onClick={scrollToTop} tabIndex={0} role="button">
              Current listings
            </a>
          }
          extra={[
            <div key="options" className="grid grid-cols-2  gap-4">
              <SelectInline
                dropdownClassName="select-inline-dropdown"
                value={filterBy}
                label="Filter"
                onChange={(nextFilterBy) => {
                  const filter = nextFilterBy as FilterOptions;
                  track('Filter Update', {
                    event_category: 'Discovery',
                    event_label: filter,
                    from: filterBy,
                    to: filter,
                    sortBy,
                    nrOfListingsOnDisplay: displayedListings.length,
                  });
                  setSearchBy([]);
                  setFilterBy(filter);
                  // only reset sortBy if it does not work in the new filter
                  if (!sortOptions[filter].find((s) => s.key === sortBy)) {
                    setSortBy(sortOptions[filter][0].key);
                  }
                  scrollToListingTop();
                }}
              >
                <Option value={FilterOptions.All}>All listings</Option>
                <Option value={FilterOptions.Auctions}>Auctions</Option>
                <Option value={FilterOptions.InstantSale}>Buy now</Option>
                <Option value={FilterOptions.Secondary}>Secondary</Option>
              </SelectInline>
              <SelectInline
                label="Sort"
                dropdownClassName="select-inline-dropdown"
                value={sortBy}
                onChange={(nextSortBy) => {
                  const sort = nextSortBy as SortOptions;
                  track('Sort Update', {
                    event_category: 'Discovery',
                    event_label: sort,
                    from: sortBy,
                    to: sort,
                    filterBy,
                    nrOfListingsOnDisplay: displayedListings.length,
                  });
                  setSearchBy([]);
                  setSortBy(sort);

                  scrollToListingTop();
                }}
              >
                {sortOptions[filterBy].map(({ label, key }) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </SelectInline>
            </div>,
          ]}
        />
        <div className="grid max-w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {take(show, displayedListings).map((listing: Listing, i) => (
            <ListingPreview
              key={listing?.listingAddress}
              listing={listing}
              meta={{
                index: i,
                list: 'current-listings',
                sortBy: sortBy,
                filterBy: filterBy,
              }}
            />
          ))}
          {(hasNextPage || loading) && (
            <>
              <SkeletonListing />
              <SkeletonListing />
              <SkeletonListing />
              <SkeletonListing />
            </>
          )}
        </div>
        <div ref={sentryRef}></div>
      </section>
    </div>
  );
}
