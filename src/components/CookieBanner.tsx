import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import ReactDom from 'react-dom';
import Button from './Button';

export const COOKIES_ACCEPTED = 'holaplex_cookies_acceptance';

const CookieBanner = () => {
  const [cookies, setCookie, removeCookie] = useCookies([COOKIES_ACCEPTED]);
  const [tempDecline, setTempDecline] = useState<boolean>(false);

  if (cookies[COOKIES_ACCEPTED] === 'true' || tempDecline) {
    return null;
  } else {
    return (
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
              We use cookies to personalize your browsing experience and analyze site traffic. Read
              our{' '}
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
            <Button secondary={true} size={'small'} onClick={() => setTempDecline(true)}>
              Decline
            </Button>
            <Button size={'small'} onClick={() => setCookie(COOKIES_ACCEPTED, 'true')}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default CookieBanner;
