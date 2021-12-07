import React, { useContext, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coingecko, Currency } from '@metaplex/js';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-HLNC4C2YKN';

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

const gtag = window.gtag;

export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const { publicKey } = useWallet();
  let solPrice = 0;

  // user pubkey / id
  const pubkey = publicKey?.toBase58() || '';
  //   const endpointName = ENDPOINTS.find((e) => e.endpoint === endpoint)?.name;
  useEffect(() => {
    // const isStoreOwner = ownerAddress === publicKey?.toBase58();

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
