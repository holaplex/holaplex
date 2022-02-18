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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      wallet: context.query.wallet,
    },
  };
};

const NFTCard = ({ nft }) => {
  return (
    <div>
      <img src={nft.image} alt="nft" />
      <Description>
        <p>{nft.name}</p>
      </Description>
    </div>
  );
};

const NFTGrid = ({ nfts }) => {
  return (
    <StyledNFTGrid>
      {nfts.map((nft) => (
        <NFTCard key={nft.name} nft={nft} />
      ))}
    </StyledNFTGrid>
  );
};

type ListedFilterState = 'all' | 'listed' | 'unlisted' | 'search';

const ProfileNFTs = ({ wallet }: { wallet: string }) => {
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  const nfts = testData;
  const total = nfts.length;
  const listedNfts = nfts.filter((nft) => nft.listed);
  const listedTotal = listedNfts.length;
  const unlistedNfts = nfts.filter((nft) => !nft.listed);
  const unlistedTotal = unlistedNfts.length;
  const [listedFilter, setListedFilter] = useState<ListedFilterState>('all');
  const [showSearchField, toggleSearchField] = useState(false);
  const searchFieldRef = useRef<any>(null);

  const [input, setInput] = useState(true);

  const [nftsToShow, setNFTSToShow] = useState(nfts);

  const handleListedClick = (e) => {
    setListedFilter(e.key);
    e.key === 'all'
      ? setNFTSToShow(nfts)
      : e.key === 'listed'
      ? setNFTSToShow(listedNfts)
      : setNFTSToShow(unlistedNfts);
  };

  const onSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setNFTSToShow(nfts.filter((nft) => nft.name.toLowerCase().includes(value)));
    setListedFilter('search');

    console.log('keycode', e.key);
  };

  const onSearchKeyDown = (e) => {
    if (e.keyCode === 8 && e.target.value.length < 1) {
      toggleSearchField(false);
    }
  };

  const onSearchEnter = () => {
    toggleSearchField(false);
  };

  const ListingMenu = () => (
    <StyledMenu onClick={handleListedClick} selectedKeys={[listedFilter]} mode="horizontal">
      <StyledMenuItem key="all">
        All <Divider type="vertical" /> {total}
      </StyledMenuItem>
      <StyledMenuItem key="listed">
        Listed <Divider type="vertical" /> {listedTotal}
      </StyledMenuItem>
      <StyledMenuItem key="unlisted">
        Unlisted <Divider type="vertical" /> {unlistedTotal}
      </StyledMenuItem>
    </StyledMenu>
  );

  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s profile | Holaplex</title>
        <meta property="description" key="description" content="View owned and created NFTs" />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <ToolBar>
          <ListingMenu />

          <StyledSearchField
            onChange={onSearchChange}
            onPressEnter={onSearchEnter}
            onKeyDown={onSearchKeyDown}
            style={{ display: showSearchField ? 'inherit' : 'none' }}
            ref={searchFieldRef}
          />
          <button
            onClick={() => toggleSearchField(true)}
            style={{ display: showSearchField ? 'none' : 'inherit' }}
          >
            <FeatherIcon icon="search" />
          </button>
        </ToolBar>
        <NFTGrid nfts={nftsToShow} />
      </ProfileContainer>
    </>
  );
};

export default ProfileNFTs;

const StyledNFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;

  img {
    width: 300px;
    height: 320px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ToolBar = styled.div`
  display: flex;
  justify-content: space-between;
  height: 32px;
`;

const StyledMenu = styled(Menu)`
  background: transparent;
  font-size: 16px;

  .ant-menu-item {
    border-radius: 8px;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  .ant-menu-item-selected,
  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu-item-active:hover,
  .ant-menu-submenu-title:hover {
    background: #262626;
  }

  .ant-menu-item::after {
    border-bottom: none;
    content: none;
  }
`;

const StyledMenuItem = styled(Menu.Item)`
  &:not(.ant-menu-item-selected) {
    span {
      color: #a8a8a8;
    }
  }

  ant-menu-title-content {
    display: flex;
  }
`;

const StyledSearchField = styled(Input)`
  max-width: 300px;
`;

const Description = styled.div`
  background: #171717;
  height: 96px;
  padding: 24px 16px;
  p {
    font-size: 20px;
  }
`;
