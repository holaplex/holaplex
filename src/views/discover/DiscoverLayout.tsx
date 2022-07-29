import Tab from '@/components/Tab';
import { CollectionIcon, PhotographIcon, UsersIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

enum TabRoute {
  NFTS = '/discover/nfts',
  COLLECTIONS = '/discover/collections',
  PROFILES = '/discover/profiles',
}

export interface DiscoverPageProps {}

export interface DiscoverLayoutProps<T> {
  content: JSX.Element;
}

export function DiscoverLayout<T>(props: DiscoverLayoutProps<T> & DiscoverPageProps): JSX.Element {
  const router = useRouter();

  return (
    <div className={clsx('mt-10', ['flex flex-col', 'md:flex-row'])}>
      <div className="w-full">
        <div className="sticky flex space-x-1 p-1">
          <Tab
            title="NFTs"
            selected={router.pathname === TabRoute.NFTS}
            url={TabRoute.NFTS}
            icon={PhotographIcon}
          />
          <Tab
            title="Collections"
            selected={router.pathname === TabRoute.COLLECTIONS}
            url={TabRoute.COLLECTIONS}
            icon={CollectionIcon}
          />
          <Tab
            title="Profiles"
            selected={router.pathname === TabRoute.PROFILES}
            url={TabRoute.PROFILES}
            icon={UsersIcon}
          />
        </div>
        <MainContentSection>{props.content}</MainContentSection>
      </div>
    </div>
  );
}

interface MainContentSectionProps {
  children: JSX.Element | JSX.Element[];
}

function MainContentSection(props: MainContentSectionProps): JSX.Element {
  return <div className="flex flex-grow">{props.children}</div>;
}
