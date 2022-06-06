import FiltersSection, { FilterProps } from '@/common/components/layouts/Filters';
import Tab from '@/common/components/layouts/Tab';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

enum TabRoute {
  NFTS = '/discover/nfts',
  COLLECTIONS = '/discover/collections',
  PROFILES = '/discover/profiles',
}

export interface DiscoverPageProps {}

export interface DiscoverLayoutProps<T> {
  filters: FilterProps<T>[];
  content: JSX.Element;
}

export function DiscoverLayout<T>(props: DiscoverLayoutProps<T> & DiscoverPageProps): JSX.Element {
  const router = useRouter();

  return (
    <div className={classNames('mt-10', ['flex flex-col px-2', 'md:flex-row md:px-20'])}>
      <div className={classNames('mb-10', 'md:mb-0 md:sticky md:top-0 md:h-screen')}>
        <FiltersSection>
          {props.filters.map((f) => (
            <FiltersSection.Filter key={f.title} {...f} />
          ))}
        </FiltersSection>
      </div>
      <div className="w-full">
        <div className="flex space-x-1 p-1">
          <Tab title="NFTs" selected={router.pathname === TabRoute.NFTS} url={TabRoute.NFTS} />
          <Tab
            title="Collections"
            selected={router.pathname === TabRoute.COLLECTIONS}
            url={TabRoute.COLLECTIONS}
          />
          <Tab
            title="Profiles"
            selected={router.pathname === TabRoute.PROFILES}
            url={TabRoute.PROFILES}
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
