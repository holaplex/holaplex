import React, { useContext, useEffect, useState } from 'react';
import { Coingecko, Currency } from '@metaplex/js';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import { Listing } from '@/modules/indexer';
import { useRouter } from 'next/router';
import {
  getFormatedListingPrice,
  lamportToSolIsh,
} from '@/common/components/elements/ListingPreview';
import mixpanel from 'mixpanel-browser';
import Script from 'next/script';
import { useWallet } from '@solana/wallet-adapter-react';

export const OLD_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-HLNC4C2YKN';
const BUGSNAG_API_KEY = process.env.NEXT_PUBLIC_BUGSNAG_API_KEY;
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
export const META_ID = process.env.NEXT_PUBLIC_META_ID;
// Reference implementation https://github.com/vercel/next.js/tree/canary/examples/with-facebook-pixel

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

export interface TrackingAttributes extends CustomEventDimensions {
  event_category: 'Global' | 'Storefront' | 'Discovery' | 'Minter' | 'Misc' | 'Profile';
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | any[] | null | undefined;
}

export const ga4Event = (
  action: AnalyticsAction,
  { event_category, event_label, value, page_path, ...otherAttributes }: TrackingAttributes
) => {
  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    page_path,
    ...otherAttributes,
  });
};

export type TrackingFunctionSignature = (
  action: AnalyticsAction,
  attributes: TrackingAttributes
) => void;

interface IAnalyticsContext {
  track: TrackingFunctionSignature;
}

const AnalyticsContext = React.createContext<IAnalyticsContext | null>(null);

export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const router = useRouter();
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [trackingAccepted, setTrackingAccepted] = useState(true);
  const [lastPubkeyConnected, setLastPubkeyConnected] = useState<string | undefined>(undefined);

  const wallet = useWallet();
  const pubkey = wallet.publicKey?.toBase58();

  useEffect(() => {
    if (pubkey) {
      track('Wallet Connection Made', {
        event_category: 'Global',
        pubkey,
      });
    } else if (!pubkey && lastPubkeyConnected) {
      track('Wallet Connection Broken', {
        event_category: 'Global',
        pubkey: lastPubkeyConnected,
      });
    }
    setLastPubkeyConnected(pubkey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey]);

  let solPrice = 0;

  function initializeTracking() {
    new Coingecko().getRate([Currency.SOL], Currency.USD).then((rates) => {
      const solRate = rates[0].rate;
      solPrice = solRate;
    });

    if (GA4_ID && window.gtag) {
      window.gtag('config', GA4_ID, {
        send_page_view: true,
      });
    }

    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: true,
      });
    }

    if (BUGSNAG_API_KEY) {
      const devEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
      Bugsnag.start({
        appVersion: '0.1.0', // TODO: Link to app version
        apiKey: BUGSNAG_API_KEY,
        releaseStage: devEnv || 'unknown',
        plugins: [new BugsnagPluginReact()],
        onError(event) {
          if (pubkey) {
            event.setUser(pubkey);
          }
        },
      });
    }
    setTrackingInitialized(true);
  }

  function identify() {
    if (window.gtag && pubkey) {
      window.gtag('set', 'user_properties', {
        user_id: pubkey,
        pubkey: pubkey,
      });
    }
    if (MIXPANEL_TOKEN && pubkey) {
      mixpanel.identify(pubkey);
      mixpanel.people.set_once({
        pubkey,
      });
    }
  }

  function resetTracking() {
    window.gtag('set', 'user_properties', {
      user_id: '',
      pubkey: '',
    });
    mixpanel.reset();
  }

  function pageview(path: string) {
    // @ts-ignore // need ignore here to enforce event_category and event_label elsewhere
    track('page_view', {
      page_path: path,
    });
    if (window.fbq && META_ID) {
      window.fbq('track', 'PageView');
    }
  }

  // initialize (goes first no matter what)
  useEffect(() => {
    if (META_ID && window.fbq && !trackingInitialized) {
      window.fbq('init', META_ID);
      window.fbq('track', 'PageView');
    }
    if (trackingAccepted && !trackingInitialized) {
      initializeTracking();
    } else {
      // resetTracking();
    }
  }, [trackingInitialized, trackingAccepted]);

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
    try {
      const { value, sol_value, ...otherAttributes } = attributes;

      const attrs = {
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

      // ga4
      if (GA4_ID) {
        ga4Event(action, attrs);
      }

      if (MIXPANEL_TOKEN) {
        mixpanel.track(action, {
          ...attrs,
          // need to attach additional these here as Mixpanel does not support super properties without persitence
        });
      }
      if (META_ID && window.fbq && action !== 'page_view') {
        window.fbq('trackCustom', action, attrs);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        track,
      }}
    >
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
         
          `,
        }}
      />
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

// static function to augment track event
export function addListingToTrackCall(listing: Listing) {
  return {
    listingAddress: listing.listingAddress,
    createdAt: listing.createdAt,
    ended: listing.ended,
    highestBid: lamportToSolIsh(listing.highestBid),
    nrOfBids: listing.totalUncancelledBids,
    lastBidTime: listing.lastBidTime,
    price: getFormatedListingPrice(listing),
    isBuyNow: !listing.endsAt,
    isAuction: !!listing.endsAt,
    listingCategory: !listing.endsAt ? 'buy_now' : 'auction',
    subdomain: listing.subdomain,
    isSecondarySale: listing.primarySaleHappened,
    hasParticipationNFTs: listing.items.length,
  };
}

function addListingsToTrackCall(listings: Listing[], listId: string) {
  return listings.map((l, i) => ({
    item_id: l.listingAddress,
    item_name: l.items[0]?.name,
    affiliation: l.subdomain,
    index: i,
    item_list_id: listId,
    item_list_name: listId,
    ...addListingToTrackCall(l),
  }));
}
