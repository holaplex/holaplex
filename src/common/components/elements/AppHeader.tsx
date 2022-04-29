import sv from '@/constants/styles';
import Link from 'next/link';
import styled from 'styled-components';
import { Layout, Popover, Space } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { ProfileImage } from './ProfileImage';
import { mq } from '@/common/styles/MediaQuery';
import { MobileMenu } from './MobileMenu';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { Menu as MenuIcon } from '@/components/icons/Menu';
import { ChevronRight } from '../icons/ChevronRight';
import { toast } from 'react-toastify';
import { Check } from '../icons/Check';
import Button from '@/components/elements/Button';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO;

export function AppHeader() {
  const router = useRouter();

  const {
    connected,
    wallet: userWallet,
    connect: connectUserWallet,
    publicKey,
    connecting,
    disconnecting,
  } = useWallet();
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
      <StyledHeader>
        <HeaderTitle>
          <Link href="/" passHref>
            <a>
              👋&nbsp;&nbsp;<span>Holaplex</span>
            </a>
          </Link>
        </HeaderTitle>
        {!WHICHDAO && (
          <LinkRow size="large">
            <HeaderLinkWrapper key="feed" active={router.pathname === '/feed'}>
              <Link href="/feed" passHref>
                <a className="hover:underline focus:underline">Feed</a>
              </Link>
            </HeaderLinkWrapper>
            <HeaderLinkWrapper key="mint-nfts" active={router.pathname === '/nfts/new'}>
              <Link href="/nfts/new" passHref>
                <a className="hover:underline focus:underline">Mint NFTs</a>
              </Link>
            </HeaderLinkWrapper>

            <Popover
              placement="bottom"
              content={
                <div className="flex flex-col space-y-6">
                  <Link href="/about" passHref>
                    <a className="hover:underline">About Holaplex</a>
                  </Link>
                  <Link
                    href="https://docs.google.com/document/d/1jskpoCdDm7DU2IbeXwRhhl5LGiNhonAx2HsmfJlDsEs"
                    passHref
                  >
                    <a className="hover:underline" target="_blank">
                      Terms of Service
                    </a>
                  </Link>

                  <Link
                    href="https://docs.google.com/document/d/12uQU7LbLUd0bY7Nz13-F9cua5Wk8mnRNBlyDzF6gRmo"
                    passHref
                  >
                    <a className="hover:underline" target="_blank">
                      Privacy policy
                    </a>
                  </Link>
                </div>
              }
            >
              <a className="flex items-center">
                About <ChevronRight color="#fff" className="ml-2 rotate-90 " />{' '}
              </a>
            </Popover>
            <Popover
              placement="bottom"
              content={
                <div className="flex flex-col space-y-6">
                  <Link
                    href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407417107475-FAQ"
                    passHref
                  >
                    <a target="_blank" className="hover:underline">
                      FAQ
                    </a>
                  </Link>
                  <Link
                    href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407782141971-Set-Up-A-Store"
                    passHref
                  >
                    <a target="_blank" className="hover:underline">
                      Setting up a store
                    </a>
                  </Link>

                  <Link
                    href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407791450515-Minting-NFTs"
                    passHref
                  >
                    <a target="_blank" className="hover:underline">
                      Minting NFTS
                    </a>
                  </Link>
                  <Link
                    href="https://holaplex-support.zendesk.com/hc/en-us/sections/4407792008979-Selling-NFTs"
                    passHref
                  >
                    <a target="_blank" className="hover:underline">
                      Selling NFTS
                    </a>
                  </Link>
                  <Link href="https://holaplex-support.zendesk.com/hc/en-us/requests/new" passHref>
                    <a target="_blank" className="hover:underline">
                      Submit a support ticket
                    </a>
                  </Link>
                </div>
              }
            >
              <a className="flex items-center">
                Help <ChevronRight color="#fff" className="ml-2 rotate-90 " />{' '}
              </a>
            </Popover>

            {connectedAndInstalledWallet ? (
              <ProfileImage />
            ) : (
              <Button loading={connecting} onClick={() => setVisible(true)} size="small">
                Connect
              </Button>
            )}
          </LinkRow>
        )}
      </StyledHeader>
      <MobileHeader />
    </>
  );
}

const MobileHeader = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  return (
    <>
      <MobileHeaderContainer>
        <Link href="/" passHref>
          <EmojiLogoAnchor>👋</EmojiLogoAnchor>
        </Link>
        <MenuButton onClick={() => setDisplayMenu(true)}>
          <MenuIcon color="#fff" />
        </MenuButton>
      </MobileHeaderContainer>
      {displayMenu ? <MobileMenu onCloseClick={() => setDisplayMenu(false)} /> : null}
    </>
  );
};

const MenuButton = styled.button`
  ${ButtonReset}
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmojiLogoAnchor = styled.a`
  width: 40px;
  height: 40px;
  font-size: 24px;
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

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 2px;
  font-weight: 700;
  margin-right: 2rem;
  flex-grow: 1;
  a {
    display: flex;
    color: ${sv.colors.buttonText};
    &:hover {
      color: ${sv.colors.buttonText};
    }
  }

  span {
    display: none;
  }

  @media screen and (min-width: 550px) {
    span {
      display: block;
    }
  }
`;

const { Header } = Layout;

const StyledHeader = styled(Header)`
  display: none;
  ${mq('md')} {
    ${sv.flexRow};
    margin: 5px;
    padding: 1.25rem;
  }
`;

const HeaderLinkWrapper = styled.div<{ active: boolean }>`
  color: ${sv.colors.buttonText};
  ${({ active }) => active && `text-decoration: underline;`}
`;

const LinkRow = styled(Space)`
  @media screen and (max-width: 550px) {
    .ant-space-item:nth-child(1) {
      display: none;
    }
  }
`;

const CloseButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
