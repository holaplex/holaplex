import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { ProfileImage } from './ProfileImage';
import { mq } from '@/common/styles/MediaQuery';
import { MobileMenu } from './MobileMenu';
import { Menu as MenuIcon } from '@/components/icons/Menu';
import { toast } from 'react-toastify';
import { Check } from '../icons/Check';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import SearchBar from '../search/SearchBar';
import DialectNotificationsButton from './DialectNotificationsButton';
import classNames from 'classnames';
import { Button5 } from './Button2';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CollectionIcon,
  LightBulbIcon,
  PhotographIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { isTouchScreenOnly } from '@/common/utils';

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO;

export function AppHeader() {
  const router = useRouter();

  const { connected, wallet: userWallet, publicKey, connecting } = useWallet();
  const hasWalletTypeSelected =
    userWallet?.readyState === WalletReadyState.Installed ||
    userWallet?.readyState === WalletReadyState.Loadable;
  const connectedAndInstalledWallet = hasWalletTypeSelected && connected;

  const { setVisible } = useWalletModal();

  const handleViewProfile = useCallback(() => {
    router.push(`/profiles/${publicKey!.toBase58()}/nfts`);
  }, [publicKey, router]);

  useEffect(() => {
    if (connected) {
      toast(
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white" onClick={handleViewProfile}>
            <Check color="#32D583" className="mr-2" />
            <div>
              Wallet connected successfully!{' '}
              <span className="font-semibold underline">View profile</span>
            </div>
          </div>
        </div>,
        {
          toastId: 'connection-success',
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <>
      <nav
        className={`hidden flex-row items-center justify-between gap-6 bg-transparent px-6 py-4 md:flex`}
      >
        <div className={`flex w-full flex-row items-center gap-10 py-1 text-2xl font-bold`}>
          <Link href="/" passHref>
            <a className={`font-bold`}>
              👋&nbsp;&nbsp;<span>Holaplex</span>
            </a>
          </Link>
          <SearchBar />
        </div>
        {!WHICHDAO && (
          <div className={`flex min-w-fit flex-row items-center justify-end gap-6`}>
            <DiscoverMenu />

            {connectedAndInstalledWallet && (
              <>
                <DialectNotificationsButton />
                <ProfileImage />
                {/* eslint-disable-next-line @next/next/link-passhref */}
                <Link href="/nfts/new">
                  <Button5 v="primary" key="create" disabled={router.pathname === '/nfts/new'}>
                    Create
                  </Button5>
                </Link>
              </>
            )}
            {!connectedAndInstalledWallet && (
              <Button5
                v="primary"
                loading={connecting}
                onClick={() => setVisible(true)}
                className={classNames(`min-h-full text-lg font-medium`, {
                  hidden: connectedAndInstalledWallet,
                })}
              >
                Connect
              </Button5>
            )}
          </div>
        )}
      </nav>
      <MobileHeader />
    </>
  );
}

function DiscoverMenu(): JSX.Element {
  const [isTouchAndShowItems, setIsTouchAndShowItems] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [forceHide, setForceHide] = useState<boolean>(false);

  useEffect(() => {
    setIsTouch(isTouchScreenOnly());
  }, [setIsTouch]);

  const onClickHeader = useCallback(() => {
    if (isTouch) setIsTouchAndShowItems(!isTouchAndShowItems);
  }, [isTouchAndShowItems, isTouch]);

  const onClickHideTemporarily = useCallback(() => {
    setIsTouchAndShowItems(false);
    setForceHide(true);
    setTimeout(() => setForceHide(false), 100);
  }, []);

  let containerDisplayClasses: string | undefined;
  let buttonDisplayBasedTextClasses: string;
  let arrowDownDisplayClasses: string;
  let arrowUpDisplayClasses: string;
  let itemContainerDisplayClasses: string;
  if (!isTouch) {
    containerDisplayClasses = 'group';
    buttonDisplayBasedTextClasses = 'text-gray-300 hover:text-white focus:text-white group-hover:text-white group-focus:text-white';
    arrowDownDisplayClasses = forceHide ? 'block' : 'block group-hover:hidden group-focus:hidden';
    arrowUpDisplayClasses = forceHide ? 'hidden' : 'hidden group-hover:block group-focus:block';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'hidden group-hover:block group-focus:block';
  } else if (isTouchAndShowItems) {
    buttonDisplayBasedTextClasses = 'text-white group-focus:text-white';
    arrowDownDisplayClasses = forceHide ? 'block' : 'hidden group-focus:block';
    arrowUpDisplayClasses = forceHide ? 'hidden' : 'block group-focus:hidden';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'block group-focus:block';
  } else {
    buttonDisplayBasedTextClasses = 'text-gray-300 group-focus:text-white';
    arrowDownDisplayClasses = 'block';
    arrowUpDisplayClasses = 'hidden';
    itemContainerDisplayClasses = forceHide ? 'hidden' : 'hidden group-focus:block';
  }

  return (
    <div
      className={classNames('relative inline-block', containerDisplayClasses)}
      // setTimeout is a hack to allow the click to propagate to the menu item before closing
      onBlur={() => setTimeout(() => setIsTouchAndShowItems(false), 50)}
    >
      {/* Header */}
      <button
        className={classNames('flex flex-row flex-nowrap items-center justify-center', [
          'text-lg font-medium',
          buttonDisplayBasedTextClasses,
        ])}
        onClick={onClickHeader}
      >
        Discover
        <ChevronDownIcon className={classNames('ml-2 h-4 w-4', arrowDownDisplayClasses)} />
        <ChevronUpIcon className={classNames('ml-2 h-4 w-4', arrowUpDisplayClasses)} />
      </button>

      {/* Options */}
      <ul
        className={classNames(
          itemContainerDisplayClasses,
          'absolute left-1/2 z-20 -translate-x-1/2',
          'list-none overflow-clip',
          'rounded-b-lg shadow-lg shadow-black'
        )}
      >
        <li onClick={onClickHideTemporarily}>
          <MenuLink href="/alpha">
            <LightBulbIcon className="h-5 w-5" />
            <span>Alpha</span>
          </MenuLink>
        </li>
        <li onClick={onClickHideTemporarily}>
          <MenuLink href="/discover/nfts">
            <PhotographIcon className="h-5 w-5" />
            <span>NFTs</span>
          </MenuLink>
        </li>
        {/* TODO restore once collection discovery is ready */}
        {/* <li onClick={onClickHideTemporarily}>
          <MenuLink href="/discover/collections">
            <CollectionIcon className="h-5 w-5" />
            <span>Collections</span>
          </MenuLink>
        </li> */}
        <li onClick={onClickHideTemporarily}>
          <MenuLink href="/discover/profiles">
            <UsersIcon className="h-5 w-5" />
            <span>Profiles</span>
          </MenuLink>
        </li>
      </ul>
    </div>
  );

  function MenuLink(props: { children: JSX.Element[]; href: string }): JSX.Element {
    return (
      <Link href={props.href}>
        <a
          className={classNames(
            'w-full',
            'flex flex-row flex-nowrap justify-start',
            'space-x-4 p-4',
            'text-lg',
            'bg-gray-900 hover:bg-gray-700 focus:bg-gray-700'
          )}
        >
          {props.children}
        </a>
      </Link>
    );
  }
}

const MobileHeader = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  return (
    <>
      <MobileHeaderContainer>
        <div className={`mr-4 flex w-full flex-row items-center gap-4 text-2xl`}>
          <Link href="/" passHref>
            <EmojiLogoAnchor>👋</EmojiLogoAnchor>
          </Link>
          <SearchBar />
        </div>
        <button
          className="flex items-center justify-center rounded-full shadow-lg shadow-black hover:bg-gray-800"
          onClick={() => setDisplayMenu(true)}
        >
          <MenuIcon color="#fff" />
        </button>
      </MobileHeaderContainer>
      {displayMenu ? <MobileMenu onCloseClick={() => setDisplayMenu(false)} /> : null}
    </>
  );
};

const EmojiLogoAnchor = styled.a`
  width: 40px;
  height: 40px;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobileHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  min-height: 72px;
  ${mq('md')} {
    display: none;
  }
`;
