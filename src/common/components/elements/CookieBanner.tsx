import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { TRACKING_ACCEPTED_LOCALSTORAGE_KEY } from '@/modules/ganalytics/AnalyticsProvider';
import React from 'react';

export default function CookieBanner({ trackingAccepted, setTrackingAccepted }: any) {
  //   const [trackingAccepted, setTrackingAccepted] = useLocalStorage<boolean | undefined>(
  //     TRACKING_ACCEPTED_LOCALSTORAGE_KEY,
  //     undefined
  //   );

  return trackingAccepted === undefined ? (
    <div className="absolute inset-x-0 bottom-8  z-50 mx-auto flex  max-w-sm flex-col   items-center  justify-center space-y-4 rounded-lg bg-gray-900 bg-opacity-80 p-2 sm:flex-row sm:justify-between md:max-w-3xl md:space-y-0">
      <div className="flex max-w-xl  flex-wrap items-center justify-center text-sm text-white sm:flex-nowrap">
        {/* <img src="" alt="" className="mr-4" /> */}
        <span className="mr-4 text-3xl">👋</span>
        <p>
          We use cookies to analyze site traffic. Read our &nbsp;
          <a href="#" className="font-bold">
            privacy policy
          </a>
          &nbsp;for details on how we use this data.
        </p>
      </div>
      <div>
        <button className="mr-4 text-sm" onClick={() => setTrackingAccepted(false)}>
          Decline
        </button>
        <button
          className="rounded-full bg-white px-4 py-2 text-sm text-black"
          onClick={() => setTrackingAccepted(true)}
        >
          Accept
        </button>
      </div>
    </div>
  ) : null;
}
