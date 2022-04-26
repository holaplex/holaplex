import { Component, FC, Fragment } from 'react';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import React from 'react';
import { Tab } from '@headlessui/react';
import { useProfileData } from '@/common/context/ProfileData';
import { PhotographIcon, TrendingUpIcon } from '@heroicons/react/outline';

enum TabRoute {
  COLLECTED,
  CREATED,
  OFFERS,
  ACTIVITY,
}

export const ProfileMenu: FC = () => {
  const { publicKey } = useProfileData();
  const router = useRouter();

  const defaultTabIndex =
    router.pathname === '/profiles/[publicKey]/activity'
      ? TabRoute.ACTIVITY
      : router.pathname === `/profiles/[publicKey]/created`
      ? TabRoute.CREATED
      : router.pathname === `/profiles/[publicKey]/offers`
      ? TabRoute.OFFERS
      : TabRoute.COLLECTED;

  const tabs = [
    {
      id: TabRoute.COLLECTED,
      title: 'Collected',
      icon: <PhotographIcon className="mr-4 h-5 w-5" />,
      path: `/profiles/${publicKey}/nfts`,
    },
    {
      id: TabRoute.CREATED,
      title: 'Created',
      icon: <FeatherIcon height={16} width={16} icon="plus-square" className="mr-4" />,
      path: `/profiles/${publicKey}/created`,
    },
    {
      id: TabRoute.OFFERS,
      title: 'Offers',
      icon: <FeatherIcon height={16} width={16} icon="dollar-sign" className="mr-4" />,
      path: `/profiles/${publicKey}/offers`,
    },
    {
      id: TabRoute.ACTIVITY,
      title: 'Activity',
      icon: <TrendingUpIcon className="mr-4 h-5 w-5" />,
      path: `/profiles/${publicKey}/activity`,
    },
  ];

  return (
    <div className="mb-2 border-b-2  border-gray-800">
      <Tab.Group defaultIndex={defaultTabIndex}>
        <Tab.List className="-mb-0.5 flex h-14 w-full justify-between overflow-x-auto no-scrollbar  sm:justify-start ">
          {tabs.map((tab) => (
            <Tab as={Fragment} key={tab.id}>
              {({ selected }) => (
                <button
                  onClick={() => router.push(tab.path)}
                  className={cx(
                    'flex h-full w-40 flex-shrink-0 items-center justify-center md:w-1/4',
                    selected ? 'border-b-2 border-white' : 'text-gray-300'
                  )}
                >
                  {tab.icon}
                  {tab.title}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
};
