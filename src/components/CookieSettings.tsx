import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Button from './Button';
import Modal from './Modal';
import { Switch } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/outline';
import { useCookieSettings } from './CookieBanner';

const CookieSettings = (props: {
  openSettings: boolean;
  setOpenSettings:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<Boolean>>
    | ((open: Boolean) => void);

  decline: () => void;
}) => {
  const { setCookieSettings, cookies } = useCookieSettings();

  // cookie defaults
  const [essentialCookies, setEssentialCookies] = useState<boolean>(
    cookies.holaplex_cookies_acceptance === 'true' || true
  );
  const [analyticsCookies, setAnalyticsCookies] = useState<boolean>(
    cookies.holaplex_analytics_cookies_acceptance === 'true' || true
  );
  const [preferenceCookies, setPreferenceCookies] = useState<boolean>(
    cookies.holaplex_preference_cookies_acceptance === 'true' || false
  );

  useEffect(() => {
    setAnalyticsCookies(cookies.holaplex_analytics_cookies_acceptance === 'true');
    setPreferenceCookies(cookies.holaplex_preference_cookies_acceptance === 'true');
  }, [cookies]);

  const saveSettings = () => {
    setCookieSettings({
      analyticsCookies,
      preferenceCookies,
      essentialCookies,
    });
    props.setOpenSettings(false);
  };

  return (
    <Modal open={props.openSettings} setOpen={props.setOpenSettings} title={'Cookie settings'}>
      <div className={`flex flex-col gap-2`}>
        <p className={'m-0 border-b border-gray-700 pb-2 text-sm'}>
          We use cookies, some of them are essentials, others are optional.{' '}
          <a
            target={`_blank`}
            href={`https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo/`}
            className={`font-bold`}
          >
            Learn more
          </a>
        </p>
        <form onSubmit={saveSettings} className={`flex flex-col gap-4`}>
          <div className={'flex items-center justify-between gap-2'}>
            <div className={'flex flex-col gap-2'}>
              <h6 className={'m-0 text-base'}>Essential</h6>
              <p className={'m-0 text-xs text-gray-300'}>
                {
                  "Necessary for the website to function properly and can't be deactivated, these include:"
                }
              </p>
              <ul className={'m-0 text-gray-100'}>
                <li className={'text-xs'}>
                  - Session cookies to remember your latest connected wallet and other connected
                  accounts.
                </li>
                <li className={'text-xs'}>- Persistent settings such as language, theme, etc...</li>
                <li className={'text-xs'}>
                  - Saved items like nft shopping cart, recently visited profiles, etc...
                </li>
              </ul>
            </div>
            <Switch
              disabled={true}
              checked={essentialCookies}
              onChange={() => setEssentialCookies(true)}
              className={`relative inline-flex h-6 w-11 items-center justify-center rounded-full bg-gray-800`}
            >
              <span className={`flex h-4 w-4 rounded-full `}>
                <LockClosedIcon className={'text-white'} />
              </span>
            </Switch>
          </div>
          <div className={'flex items-center justify-between gap-2'}>
            <div className={'flex flex-col gap-2'}>
              <h6 className={'m-0 text-base'}>Analytics</h6>
              <p className={'m-0 text-xs text-gray-300'}>
                Used to provide usage insights to our teams and technical partners
              </p>
            </div>
            <Switch
              checked={analyticsCookies}
              onChange={(state: boolean) => setAnalyticsCookies(state)}
              className={`${
                analyticsCookies ? 'bg-amber-500' : 'bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  analyticsCookies ? 'translate-x-6' : 'translate-x-1'
                } t inline-block h-4 w-4 transform rounded-full bg-white duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          <div className={'flex items-center justify-between gap-2'}>
            <div className={'flex flex-col gap-2'}>
              <h6 className={'m-0 text-base'}>Preference</h6>
              <p className={'m-0 text-xs text-gray-300'}>
                To personalize your content and experience
              </p>
            </div>
            <Switch
              checked={preferenceCookies}
              onChange={(state: boolean) => setPreferenceCookies(state)}
              className={`${
                preferenceCookies ? 'bg-amber-500' : 'bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  preferenceCookies ? 'translate-x-6' : 'translate-x-1'
                } t inline-block h-4 w-4 transform rounded-full bg-white duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          <div className={`mt-8 flex justify-between gap-4`}>
            <Button className={'w-full'} secondary={true} onClick={props.decline}>
              Decline
            </Button>
            <Button className={'w-full'} onClick={saveSettings}>
              Save settings
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CookieSettings;
