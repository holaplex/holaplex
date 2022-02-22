import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { testData } from '@/common/components/elements/test-nft-data';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { PublicKey } from '@solana/web3.js';
import { Button, Divider, Input, Menu, Row } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
//@ts-ignore
import FeatherIcon from 'feather-icons-react';
import { Combobox } from '@headlessui/react';
import cx from 'classnames';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      wallet: context.query.wallet,
    },
  };
};

const NFTCard = ({ nft }: { nft: any }) => {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-800">
      <img src={nft.image} alt={nft.name} className="h-80 object-cover" />
      <div className="h-24 bg-gray-900 py-6 px-4">
        <p className="text-xl">{nft.name}</p>
      </div>
    </div>
  );
};

const NFTGrid = ({ nfts }: { nfts: any }) => {
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {nfts.map((nft: any) => (
        <NFTCard key={nft.name} nft={nft} />
      ))}
    </div>
  );
};

type ListedFilterState = 'all' | 'listed' | 'unlisted' | 'search';

const ProfileNFTs = ({ wallet }: { wallet: string }) => {
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  const nfts = testData;
  const total = nfts.length;
  // const listedNfts = nfts.filter((nft) => nft.listed);
  // const listedTotal = listedNfts.length;
  // const unlistedNfts = nfts.filter((nft) => !nft.listed);
  // const unlistedTotal = unlistedNfts.length;
  const [listedFilter, setListedFilter] = useState<ListedFilterState>('search');
  const [showSearchField, toggleSearchField] = useState(false);

  const [input, setInput] = useState(true);

  const [query, setQuery] = useState('');

  const nftsToShow =
    query === ''
      ? nfts
      : nfts.filter((nft) => nft.name.toLowerCase().includes(query.toLowerCase()));

  // const handleListedClick = (e) => {
  //   setListedFilter(e.key);
  //   e.key === 'all'
  //     ? setNFTSToShow(nfts)
  //     : e.key === 'listed'
  //     ? setNFTSToShow(listedNfts)
  //     : setNFTSToShow(unlistedNfts);
  // };

  const [selectedNFT, setSelectedNFT] = useState(nfts[0]);
  // const onSearchChange = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setNFTSToShow();
  //   setListedFilter('search');
  // };

  // const onSearchKeyDown = (e) => {
  //   if (e.keyCode === 8 && e.target.value.length < 1) {
  //     toggleSearchField(false);
  //   }
  // };

  // const onSearchEnter = () => {
  //   toggleSearchField(false);
  // };

  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s NFTs | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <div className="relative flex h-8">
          <Combobox value={selectedNFT} onChange={setSelectedNFT}>
            {({ open }) => (
              <>
                <FeatherIcon
                  icon="search"
                  className={cx(
                    'absolute bottom-1.5 left-2.5 h-5 w-5 text-gray-800',
                    open ? 'text-white' : ''
                  )}
                />
                <Combobox.Input
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-9/12 rounded-lg border-2 border-solid border-gray-800 bg-transparent pl-10 placeholder-gray-800 shadow-none focus:border-2 focus:border-white focus:shadow-none"
                  placeholder="Search"
                />
              </>
            )}
          </Combobox>
        </div>
        <NFTGrid nfts={nftsToShow} />
      </ProfileContainer>
    </>
  );
};

export default ProfileNFTs;

// const ToolBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   height: 32px;
// `;

// const StyledMenu = styled(Menu)`
//   background: transparent;
//   font-size: 16px;

//   .ant-menu-item {
//     border-radius: 8px;
//     display: flex;
//     align-items: center;

//     &:not(:last-child) {
//       margin-right: 8px;
//     }
//   }

//   .ant-menu-item-selected,
//   .ant-menu-item:hover,
//   .ant-menu-item-active,
//   .ant-menu-item-active:hover,
//   .ant-menu-submenu-title:hover {
//     background: #262626;
//   }

//   .ant-menu-item::after {
//     border-bottom: none;
//     content: none;
//   }
// `;

// const StyledMenuItem = styled(Menu.Item)`
//   &:not(.ant-menu-item-selected) {
//     span {
//       color: #a8a8a8;
//     }
//   }

//   ant-menu-title-content {
//     display: flex;
//   }
// `;

// const StyledSearchField = styled(Input)`
//   max-width: 300px;
// `;

// const ListingMenu = () => (
//   <StyledMenu onClick={handleListedClick} selectedKeys={[listedFilter]} mode="horizontal">
//     <StyledMenuItem key="all">
//       All <Divider type="vertical" /> {total}
//     </StyledMenuItem>
//     <StyledMenuItem key="listed">
//       Listed <Divider type="vertical" /> {listedTotal}
//     </StyledMenuItem>
//     <StyledMenuItem key="unlisted">
//       Unlisted <Divider type="vertical" /> {unlistedTotal}
//     </StyledMenuItem>
//   </StyledMenu>
// );
