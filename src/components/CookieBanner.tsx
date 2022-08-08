import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import Button from './Button';
import Modal from './Modal';
import { Switch } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/outline';
import CookieSettings from './CookieSettings';

export const COOKIES_ACCEPTED = 'holaplex_cookies_acceptance';
export const ANALYTICS_ACCEPTED = 'holaplex_analytics_cookies_acceptance';
export const PREFERENCE_ACCEPTED = 'holaplex_preference_cookies_acceptance';

export function useCookieSettings() {
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIES_ACCEPTED,
    ANALYTICS_ACCEPTED,
    PREFERENCE_ACCEPTED,
  ]);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [tempDecline, setTempDecline] = useState<boolean>(false);

  const setCookieSettings = ({
    analyticsCookies,
    essentialCookies = true,
    preferenceCookies,
  }: {
    analyticsCookies: boolean;
    essentialCookies: boolean;
    preferenceCookies: boolean;
  }) => {
    setCookie('holaplex_analytics_cookies_acceptance', analyticsCookies);
    setCookie('holaplex_cookies_acceptance', essentialCookies);
    setCookie('holaplex_preference_cookies_acceptance', preferenceCookies);
    setOpenSettings(false);
  };

  const acceptAll = () => {
    setCookie('holaplex_analytics_cookies_acceptance', true);
    setCookie('holaplex_cookies_acceptance', true);
    setCookie('holaplex_preference_cookies_acceptance', true);
    setOpenSettings(false);
  };

  const declineCookies = () => {
    setCookie('holaplex_analytics_cookies_acceptance', false);
    setCookie('holaplex_cookies_acceptance', false);
    setCookie('holaplex_preference_cookies_acceptance', false);
    setTempDecline(true);
    setOpenSettings(false);
  };

  return {
    cookies,
    setCookie,
    removeCookie,
    setCookieSettings,
    openSettings: setOpenSettings,
    isSettingsOpen: openSettings,
    isDeclined: tempDecline,
    declineCookies,
    acceptAllCookies: acceptAll,
  };
}

const CookieBanner = () => {
  const { cookies, openSettings, isSettingsOpen, isDeclined, declineCookies, acceptAllCookies } =
    useCookieSettings();

  if (cookies[COOKIES_ACCEPTED] === 'true' || isDeclined || typeof window === undefined) {
    return null;
  } else {
    return (
      <>
        <div className={`fixed bottom-5 z-50 flex w-full justify-center`}>
          <div
            className={` mx-4 flex max-w-3xl flex-col items-center justify-between gap-2 rounded-lg bg-gray-800 bg-opacity-60 p-2 backdrop-blur-lg sm:flex-row`}
          >
            <div className={'flex items-center gap-2'}>
              <img
                src={'/images/hola-logo.svg'}
                alt={'hola-logo'}
                className={'h-6 w-6 animate-waving'}
              />

              <p className={'m-0 text-sm font-normal text-white'}>
                We use cookies to personalize your browsing experience and analyze site traffic.
                Read our{' '}
                <a
                  target={`_blank`}
                  className={`font-bold`}
                  href={`https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo/edit`}
                >
                  privacy policy
                </a>
                &nbsp;for details on how we use this data.
              </p>
            </div>
            <div className={`flex items-center gap-4`}>
              <Button secondary={true} size={'small'} onClick={() => openSettings(true)}>
                Decline
              </Button>
              <Button size={'small'} onClick={acceptAllCookies}>
                Accept
              </Button>
            </div>
          </div>
        </div>
        <CookieSettings
          openSettings={isSettingsOpen}
          setOpenSettings={openSettings}
          decline={declineCookies}
        />
      </>
    );
  }
};

export default CookieBanner;
