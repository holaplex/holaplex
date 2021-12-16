import React, { useContext, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coingecko, Currency } from '@metaplex/js';
import { WalletContext } from '@/modules/wallet';
import { Listing } from '@/common/components/elements/ListingPreview';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-HLNC4C2YKN';

type GoogleRecommendedEvent = 'login' | 'sign_up' | 'select_content';
type GoogleEcommerceEvent = 'view_item_list' | 'view_item' | 'select_item';

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

const AnalyticsContext = React.createContext<{
  configureAnalytics: (options: CustomEventDimensions) => void;
  pageview: (path: string) => void;
  track: (action: string, attributes: { [key: string]: any }) => void;
} | null>(null);

export function AnalyticsProvider(props: { children: React.ReactNode }) {
  // @ts-ignore
  let gtag: any;
  let solPrice = 0;

  //   const endpointName = ENDPOINTS.find((e) => e.endpoint === endpoint)?.name;
  const { wallet } = useContext(WalletContext);
  const pubkey = wallet?.pubkey || '';
  // const pubkey = publicKey?.toBase58() || '';
  useEffect(() => {
    return
    gtag = window?.gtag;
    // const isStoreOwner = ownerAddress === publicKey?.toBase58();
    // user pubkey / id

    setUserProperties({
      user_id: pubkey,
      pubkey: pubkey,
    });
    new Coingecko().getRate([Currency.SOL], Currency.USD).then((rates) => {
      const solRate = rates[0].rate;
      solPrice = solRate;
    });

    try {
    } catch (error) {}

    // initial config
    configureAnalytics({
      //   network: endpointName,
    });
  }, [
    pubkey,
    // endpointName
  ]);

  function setUserProperties(attributes: AnalyticsUserProperties) {
    gtag('set', 'user_properties', {
      ...attributes,
    });
  }

  function configureAnalytics(options: Partial<CustomEventDimensions>) {
    if (!gtag) return;
    gtag('config', GOOGLE_ANALYTICS_ID, {
      ...options,
      send_page_view: false,
    });
  }

  function pageview(path: string) {
    // Use this only for virtual pageviews, regular ones we get from
    //  GA4 Enhanced page tracking
    if (!gtag) return;
    track('page_view', {
      path,
    });
  }

  function track(
    action: string,
    attributes: {
      category?: string;
      label?: string;
      value?: number;
      sol_value?: number;
      [key: string]: string | number | undefined;
    } & Partial<CustomEventDimensions> = {}
  ) {
    if (!gtag) return;
    const { category, label, sol_value, value, ...otherAttributes } = attributes;
    gtag('event', action, {
      event_category: category,
      event_label: label,
      page_location: window.location.href, // not as useful here as in Metaplex, but probably good to keep for consitency
      ...(sol_value && solPrice
        ? {
            value: sol_value * solPrice, //Google Analytics likes this one in USD :)
            sol_value: sol_value,
          }
        : {
            value,
          }),
      ...otherAttributes,
    });
  }

  // used to track listings as ecommerce items
  function trackEcommerce(action: GoogleEcommerceEvent, listings: Listing[]) {
    gtag('event', action, {
      currency: 'USD',
      value: 7.77,
      // sol_value:
      // items: listings.map(l => ({
      //     item_id: "SKU_12345",
      //      item_name: "Stan and Friends Tee",
      //      affiliation: "Google Store",
      //      coupon: "SUMMER_FUN",
      //      currency: "USD",
      //      discount: 2.22,
      //      index: 5,
      //      item_brand: "Google",
      //      item_category: "Apparel",
      //      item_category2: "Adult",
      //      item_category3: "Shirts",
      //      item_category4: "Crew",
      //      item_category5: "Short sleeve",
      //      item_list_id: "related_products",
      //      item_list_name: "Related Products",
      //      item_variant: "green",
      //      location_id: "L_12345",
      //      price: 9.99,
      //      quantity: 1
      // }))
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
    });
  }

  return (
    <AnalyticsContext.Provider
      value={{
        configureAnalytics,
        track,
        pageview,
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
