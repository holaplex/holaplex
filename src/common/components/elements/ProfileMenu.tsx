import { FC, Fragment, useState } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cx from 'classnames';
import React from 'react';
import { Tab } from '@headlessui/react';

interface Props {
  wallet: string;
}

export const ProfileMenu: FC<Props> = ({ wallet }) => {
  const router = useRouter();
  const path = router.asPath;
  const routeIndex = path.includes('/nfts') ? 1 : 0;
  const [selectedIndex, setSelectedIndex] = useState(routeIndex);

  return (
    <div className="mb-6  border-b-2  border-gray-800">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="-mb-px h-14">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button className={cx('h-full w-40', selected ? 'border-b-2 border-white' : '')}>
                <Link href={`/profiles/${wallet}/nfts`} passHref>
                  <a
                    className={cx(
                      'flex items-center justify-center',
                      !selected ? 'text-gray-300' : ''
                    )}
                  >
                    <FeatherIcon height={16} width={16} icon="image" className="mr-4" />
                    Owned
                  </a>
                </Link>
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button className={cx('h-full w-40', selected ? 'border-b-2 border-white' : '')}>
                <Link href={`/profiles/${wallet}`} passHref>
                  <a
                    className={cx(
                      'flex items-center justify-center',
                      !selected ? 'text-gray-300' : ''
                    )}
                  >
                    <FeatherIcon height={16} width={16} icon="trending-up" className="mr-4" />
                    Activity
                  </a>
                </Link>
              </button>
            )}
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};
