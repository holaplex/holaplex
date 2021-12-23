import React, { useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coingecko, Currency } from '@metaplex/js';
import { WalletContext } from '@/modules/wallet';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import { Listing } from '@/modules/indexer';
import { useRouter } from 'next/router';
import {
  getFormatedListingPrice,
  lamportToSolIsh,
} from '@/common/components/elements/ListingPreview';

export const OLD_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-HLNC4C2YKN';
const BUGSNAG_API_KEY = process.env.NEXT_PUBLIC_BUGSNAG_API_KEY;

type GoogleRecommendedEvent = 'login' | 'sign_up' | 'select_content';
type GoogleEcommerceEvent = 'view_item_list' | 'view_item' | 'select_item';
type AnalyticsAction = GoogleEcommerceEvent | GoogleRecommendedEvent | string; // TODO: will remove string in future

interface AnalyticsUserProperties {
  // user dimensions
  user_id: string; // google reserved
  pubkey: string; // same as user_id, but for use in custom reports
}

interface CustomEventDimensions {
  // event dimensions
  // network: string; // mainnet, devnet, etc.
  // metrics
  sol_value?: number;
}

interface TrackingAttributes extends CustomEventDimensions {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | any[] | null | undefined;
}

export const ga4Event = (
  action: Gtag.EventNames | AnalyticsAction,
  {
    event_category,
    event_label,
    value,
    page_path,
    ...otherAttributes
  }: Gtag.EventParams & { page_path: string; [key: string]: any }
) => {
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    page_path,
    ...otherAttributes,
  });
};

interface IAnalyticsContext {
  track: (action: AnalyticsAction, attributes: TrackingAttributes) => void;
}

const AnalyticsContext = React.createContext<IAnalyticsContext | null>(null);

export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const router = useRouter();
  const [trackingInitialized, setTrackingInitialized] = useState(true);
  const [trackingAccepted, setTrackingAccepted] = useState(true);
  const { wallet } = useContext(WalletContext);
  const pubkey = wallet?.pubkey || '';
  // const pubkey = publicKey?.toBase58() || '';
  // const endpointName = ENDPOINTS.find((e) => e.endpoint === endpoint)?.name;

  let solPrice = 0;

  function initializeTracking() {
    console.log('Initialize analytics');
    new Coingecko().getRate([Currency.SOL], Currency.USD).then((rates) => {
      const solRate = rates[0].rate;
      solPrice = solRate;
    });

    if (GA4_ID) {
      const sendPageView = true;
      gtag('config', GA4_ID, {
        send_page_view: sendPageView,
      });
      if (sendPageView) {
        console.log('Initial google pageview');
      }
      setTrackingInitialized(true);
    }

    if (BUGSNAG_API_KEY) {
      Bugsnag.start({
        appVersion: '0.1.0', // TODO: Link to app version
        apiKey: BUGSNAG_API_KEY,
        plugins: [new BugsnagPluginReact()],
        onError(event) {
          if (pubkey) {
            event.setUser(pubkey);
          }
          if (false) {
            // for later inspiration
            event.addMetadata('company', {
              name: 'Acme Co.',
              country: 'uk',
            });
          }
        },
      });
    }
  }

  function identify() {
    console.log(pubkey ? 'User identified' : 'No user identified');
    if (pubkey) {
      gtag('set', 'user_properties', {
        user_id: pubkey,
        pubkey: pubkey,
      });
    }
  }

  function resetTracking() {
    gtag('set', 'user_properties', {
      user_id: '',
      pubkey: '',
    });
  }

  function pageview(path: string) {
    track('page_view', {
      page_path: path,
    });
    // ga4Event('page_view', {
    //   page_path: path,
    // });
  }

  // initialize (goes first no matter what)
  useEffect(() => {
    if (trackingAccepted) {
      initializeTracking();
    } else {
      resetTracking();
    }
  }, [trackingAccepted]);

  useEffect(() => {
    identify();
  }, [pubkey]);

  // don't entiery trust google to track route changes
  // PS: This does not conflict with the event listner in _app because it is a different function
  useEffect(() => {
    router.events.on('routeChangeComplete', pageview);

    return () => {
      router.events.off('routeChangeComplete', pageview);
    };
  }, [router.events]);

  function track(action: AnalyticsAction, attributes: TrackingAttributes) {
    const { category, label, value, sol_value, ...otherAttributes } = attributes;

    const attrs = {
      event_category: category,
      event_label: label,
      page_location: window.location.href, // not as useful here as in Metaplex, but probably good to keep for consitency
      page_path: router.pathname,
      ...(sol_value && solPrice
        ? {
            value: sol_value * solPrice, //Google Analytics likes this one in USD :)
            sol_value: sol_value,
          }
        : {
            value,
          }),
      ...otherAttributes,
    };

    console.log('track', action, attrs);

    // ga4
    ga4Event(action, attrs);
  }

  // used to track listings as ecommerce items
  function trackRecommendedEcommerceEvent(
    action: GoogleEcommerceEvent,
    listings: Listing[],
    attributes: {
      listId: keyof typeof listNames;
    }
  ) {
    // https://support.google.com/analytics/answer/9267735
    const aggregateSolValue = listings.reduce((acc, l) => acc + getFormatedListingPrice(l), 0);

    switch (action) {
      case 'view_item_list':
        return track(action, {
          item_list_id: attributes.listId,
          item_list_name: listNames[attributes.listId],
          items: addListingsToTrackCall(listings, attributes.listId),
        });
      case 'view_item':
        return track(action, {
          currency: 'USD',
          value: aggregateSolValue * solPrice,
          sol_value: aggregateSolValue,
          items: addListingsToTrackCall(listings, attributes.listId),
        });
      case 'select_item':
        return track(action, {
          item_list_id: attributes.listId,
          item_list_name: listNames[attributes.listId],
          items: addListingsToTrackCall(listings, attributes.listId),
        });
    }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        track,
      }}
    >
      {props.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === null) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

const listNames = {
  featuredListings: 'Featured listings',
  currentListings: 'Current listings',
};

// static function to augment track event
export function addListingToTrackCall(listing: Listing) {
  return {
    listing_address: listing.listingAddress,
    created_at: listing.createdAt,
    ended: listing.ended,
    highest_bid: lamportToSolIsh(listing.highestBid),
    last_bid_time: listing.lastBidTime,
    price: getFormatedListingPrice(listing),
    is_buy_now: !listing.endsAt,
    is_auction: !!listing.endsAt,
    listing_category: !listing.endsAt ? 'buy_now' : 'auction',
    subdomain: listing.subdomain,
  };
}

function addListingsToTrackCall(listings: Listing[], listId: keyof typeof listNames) {
  return listings.map((l, i) => ({
    item_id: l.listingAddress,
    item_name: l.items[0]?.name,
    affiliation: l.subdomain,
    index: i,
    item_list_id: listId,
    item_list_name: listNames[listId],
    ...addListingToTrackCall(l),
  }));
  // original google recommened event for comparison
  // gtag('event', action,
  // [
  //   {
  //     item_id: "SKU_12345",
  //     item_name: "Stan and Friends Tee",
  //     affiliation: "Google Store",
  //     coupon: "SUMMER_FUN",
  //     currency: "USD",
  //     discount: 2.22,
  //     index: 5,
  //     item_brand: "Google",
  //     item_category: "Apparel",
  //     item_category2: "Adult",
  //     item_category3: "Shirts",
  //     item_category4: "Crew",
  //     item_category5: "Short sleeve",
  //     item_list_id: "related_products",
  //     item_list_name: "Related Products",
  //     item_variant: "green",
  //     location_id: "L_12345",
  //     price: 9.99,
  //     quantity: 1
  //   }
  // ]
  // });
}
