import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { CreatedNfTsQuery, useCreatedNfTsQuery } from '../../../src/graphql/indexerTypes';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '../../../src/modules/server-side/getProfile';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import cx from 'classnames';
import { DoubleGrid } from '@/components/icons/DoubleGrid';
import { TripleGrid } from '@/components/icons/TripleGrid';
import { ProfileDataProvider } from '../../../src/common/context/ProfileData';
import Head from 'next/head';
import { showFirstAndLastFour } from '../../../src/modules/utils/string';
import { ProfileContainer } from '../../../src/common/components/elements/ProfileContainer';
import TextInput2 from '../../../src/common/components/elements/TextInput2';
import { NFTGrid } from './nfts';

type CreatedNFT = CreatedNfTsQuery['nfts'][0];

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getPropsForWalletOrUsername(context);

const CreatedNFTs: NextPage<WalletDependantPageProps> = (props) => {
  const { publicKey } = props;
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridView, setGridView] = useState<'2x2' | '3x3'>('3x3');
  const createdNFTs = useCreatedNfTsQuery({
    variables: {
      creator: publicKey,
      limit: 100,
      offset: 0,
    },
  });
  const nfts = createdNFTs?.data?.nfts || [];

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  const GridSelector = () => {
    return (
      <div className="ml-4 hidden rounded-lg border-2 border-solid border-gray-800 md:flex">
        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '2x2',
          })}
          onClick={() => setGridView('2x2')}
        >
          <DoubleGrid
            className={gridView !== '2x2' ? 'transition hover:scale-110 ' : ''}
            color={gridView === '2x2' ? 'white' : '#707070'}
          />
        </button>

        <button
          className={cx('flex w-10 items-center justify-center', {
            'bg-gray-800': gridView === '3x3',
          })}
          onClick={() => setGridView('3x3')}
        >
          <TripleGrid
            className={gridView !== '3x3' ? 'transition hover:scale-110' : ''}
            color={gridView === '3x3' ? 'white' : '#707070'}
          />
        </button>
      </div>
    );
  };

  return (
    <ProfileDataProvider profileData={props}>
      <Head>
        <title>{showFirstAndLastFour(publicKey)}&apos;s NFTs | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer>
        <div className="mb-4 flex">
          <TextInput2
            id="owned-search"
            label="owned search"
            hideLabel
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={
              <FeatherIcon
                icon="search"
                aria-hidden="true"
                className={searchFocused ? 'text-white' : 'text-gray-500'}
              />
            }
            placeholder="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <GridSelector />
        </div>
        <NFTGrid nfts={nftsToShow} gridView={gridView} />
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default CreatedNFTs;
