import FiltersSection, { FilterProps } from '@/common/components/layouts/Filters';
import Tab from '@/common/components/layouts/Tab';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

export interface DiscoverPageProps {}

export interface DiscoverLayoutProps<T> {
  filters: FilterProps<T>[];
  content: JSX.Element;
}

export function DiscoverLayout<T>(props: DiscoverLayoutProps<T> & DiscoverPageProps): JSX.Element {
  const router = useRouter();

  return (
    <div className={classNames('mt-10', ['flex flex-col px-2', 'md:flex-row md:px-20'])}>
      <FiltersSection>
        {props.filters.map((f) => (
          <FiltersSection.Filter key={f.title} {...f} />
        ))}
      </FiltersSection>
      <div className="w-full">
        <div className="flex space-x-1 p-1">
          <Tab title={`NFTs`} selected={router.pathname.includes('discover/nfts')} url={`/discover/nfts`} />
          <Tab
            title={'Collections'}
            selected={router.pathname.includes('discover/collections')}
            url={`/discover/collections`}
          />
          <Tab
            title={'Profiles'}
            selected={router.pathname.includes('discover/profiles')}
            url={`/discover/profiles`}
          />
        </div>
        <MainContentSection>
            {props.content}
        </MainContentSection>
      </div>
    </div>
  );
}

interface MainContentSectionProps {
  children: JSX.Element | JSX.Element[];
}

function MainContentSection(props: MainContentSectionProps): JSX.Element {
  return <div className="flex flex-grow border border-white">{props.children}</div>;
}

DiscoverLayout.MainContentSection = MainContentSection;
