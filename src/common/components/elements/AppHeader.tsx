import sv from '@/constants/styles';
import Link from 'next/link';
import styled from 'styled-components';
import { Layout, Popover, Space } from 'antd';
import { useRouter } from 'next/router';
import { WalletContext } from '@/modules/wallet';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SelectWalletButton } from '@/common/components/elements/Button';
import { Wallet } from '@/modules/wallet/types';
import { useAppHeaderSettings } from './AppHeaderSettingsProvider';
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
import { Close } from '../icons/Close';

interface Props {
  setShowMintModal: (show: boolean) => void;
  wallet?: Wallet;
}

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO;

export function AppHeader({ setShowMintModal, wallet }: Props) {
  const { disableMarginBottom } = useAppHeaderSettings();
  const router = useRouter();
  const { connected, wallet: userWallet, connect: connectUserWallet, publicKey } = useWallet();
  const { connect } = useContext(WalletContext);
  const [didShowConnectedToast, setDidShowConnectedToast] = useState(false);
  const hasWalletTypeSelected = userWallet?.readyState === WalletReadyState.Installed;
  const connectedAndInstalledWallet = hasWalletTypeSelected && connected;

  const handleViewProfile = useCallback(() => {
    router.push(`/profiles/${publicKey!.toBase58()}`);
  }, [publicKey, router]);

  useEffect(() => {
    if (!connected || didShowConnectedToast) {
      return;
    }
    setDidShowConnectedToast(true);
    toast(
      <>
        <CloseButtonContainer>
          <Check color="#32D583" />
        </CloseButtonContainer>
        &nbsp;Wallet connected successfully! View profile
      </>,
      {
        onClick: handleViewProfile,
        hideProgressBar: true,
        autoClose: 10000,
        position: 'bottom-center',
        closeButton: () => (
          <CloseButtonContainer>
            <Close color="#fff" />
          </CloseButtonContainer>
        ),
        bodyStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style: {
          background: 'rgba(22, 22, 22, 0.8)',
          backdropFilter: 'blur(40px)',
          color: 'white',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
        },
      }
    );
  }, [connected, didShowConnectedToast, handleViewProfile]);

  useEffect(() => {
    if (!hasWalletTypeSelected || connected) return;
    connectUserWallet();
  }, [connectUserWallet, connected, hasWalletTypeSelected]);

  const mintModalClick = () => {
    if (!wallet) {
      connect(router.pathname);
    }
    setShowMintModal(true);
  };

  return (
    <>
      <StyledHeader disableMarginBottom={disableMarginBottom}>
        <HeaderTitle>
          <Link href="/" passHref>
            <a>
              👋&nbsp;&nbsp;<span>Holaplex</span>
            </a>
          </Link>
        </HeaderTitle>
        {!WHICHDAO && (
          <LinkRow size="large">
            <HeaderLinkWrapper key="mint-nfts" active={false}>
              {/* <Button onClick={mintModalClick} type="text" noStyle>
                Mint&nbsp;NFTs
              </Button> */}
              <a className="hover:underline focus:underline" onClick={mintModalClick}>
                Mint NFTs
              </a>
            </HeaderLinkWrapper>
            <HeaderLinkWrapper
              key="edit"
              onClick={() => connect()}
              active={router.pathname == '/storefront/edit'}
            >
              <Link href="/storefront/edit" passHref>
                <a className="hover:underline focus:underline">Edit store</a>
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
              {/* href https://holaplex-support.zendesk.com/hc/en-us */}
              <a className="flex items-center">
                Help <ChevronRight color="#fff" className="ml-2 rotate-90 " />{' '}
              </a>
            </Popover>
            {/* <HeaderLinkWrapper key="about" active={router.pathname == '/about'}>
              <Link href="/about" passHref>
                <a>About old</a>
              </Link>
            </HeaderLinkWrapper> */}
            {/* <HeaderLinkWrapper key="faq" active={false}>
              <a
                href="https://holaplex-support.zendesk.com/hc/en-us"
                target="_blank"
                rel="noreferrer"
              >
                FAQ
              </a>
            </HeaderLinkWrapper> */}
            {connectedAndInstalledWallet ? <ProfileImage /> : <SelectWalletButton />}
            {/* {windowDimensions.width > 700 && <SocialLinks />} */}
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

type CustomHeaderProps = {
  disableMarginBottom?: boolean;
};

const StyledHeader = styled(Header)<CustomHeaderProps>`
  display: none;
  ${mq('md')} {
    ${sv.flexRow};
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: ${(props) => (props.disableMarginBottom ? ' 0px' : '40px')};
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
