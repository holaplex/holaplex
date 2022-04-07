import { FC, Fragment, useState } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cx from 'classnames';
import React from 'react';
import { Tab } from '@headlessui/react';
import { useProfileData } from '@/common/context/ProfileData';

enum TabRoute {
  OWNED,
  ACTIVITY,
}

export const ProfileMenu: FC = () => {
  const { publicKey } = useProfileData();
  const router = useRouter();
  const path = router.asPath;
  const routeIndex = path.includes('/activity') ? TabRoute.ACTIVITY : TabRoute.OWNED;
  const [selectedIndex, setSelectedIndex] = useState(routeIndex);

  return (
    <div className="mb-6  border-b-2  border-gray-800">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="-mb-px flex h-14 w-full justify-between sm:w-auto sm:justify-start ">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                onClick={() => router.push(`/profiles/${publicKey}/nfts`)}
                className={cx(
                  'flex h-full w-1/2 items-center justify-center sm:w-40',
                  selected ? 'border-b-2 border-white' : 'text-gray-300'
                )}
              >
                <FeatherIcon height={16} width={16} icon="image" className="mr-4" />
                Owned
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                onClick={() => router.push(`/profiles/${publicKey}/activity`)}
                className={cx(
                  'flex h-full w-1/2 items-center justify-center align-middle sm:w-40',
                  selected ? 'border-b-2 border-white' : 'text-gray-300'
                )}
              >
                <FeatherIcon height={16} width={16} icon="trending-up" className="mr-4" />
                Activity
              </button>
            )}
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};
