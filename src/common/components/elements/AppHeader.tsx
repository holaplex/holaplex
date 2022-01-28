import sv from '@/constants/styles';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Layout, Space } from 'antd';
import { useRouter } from 'next/router';
import { WalletContext } from '@/modules/wallet';
import React, { FC, useContext, useState } from 'react';
import Button from '@/common/components/elements/Button';
import { Wallet } from '@/modules/wallet/types';
import { Bell } from '../icons/Bell';
import { ProfileImage } from './ProfileImage';
import { useAppHeaderSettings } from './AppHeaderSettingsProvider';

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
  ${sv.flexRow};
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: ${(props) => (props.disableMarginBottom ? ' 0px' : '40px')};
  padding: 1.25rem;
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

interface Props {
  setShowMintModal: (show: boolean) => void;
  wallet?: Wallet;
}

const WHICHDAO = process.env.NEXT_PUBLIC_WHICHDAO;

export function AppHeader({ setShowMintModal, wallet }: Props) {
  const { disableMarginBottom } = useAppHeaderSettings();
  const router = useRouter();
  const { connect } = useContext(WalletContext);

  const mintModalClick = () => {
    if (!wallet) {
      connect(router.pathname);
    }
    setShowMintModal(true);
  };

  return (
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
            <Button onClick={mintModalClick} type="text" noStyle>
              Mint&nbsp;NFTs
            </Button>
          </HeaderLinkWrapper>
          <HeaderLinkWrapper
            key="edit"
            onClick={() => connect()}
            active={router.pathname == '/storefront/edit'}
          >
            <Link href="/storefront/edit" passHref>
              <a>Edit store</a>
            </Link>
          </HeaderLinkWrapper>
          <HeaderLinkWrapper key="about" active={router.pathname == '/about'}>
            <Link href="/about" passHref>
              <a>About</a>
            </Link>
          </HeaderLinkWrapper>
          <HeaderLinkWrapper key="faq" active={false}>
            <a
              href="https://holaplex-support.zendesk.com/hc/en-us"
              target="_blank"
              rel="noreferrer"
            >
              FAQ
            </a>
          </HeaderLinkWrapper>
          <HeaderLinkWrapper key="activity" active={false}>
            <Link href="/activity" passHref>
              <a>
                <Bell style={{ marginTop: 25 }} color="#fff" />
              </a>
            </Link>
          </HeaderLinkWrapper>
          <ProfileImage />
          {/* {windowDimensions.width > 700 && <SocialLinks />} */}
        </LinkRow>
      )}
    </StyledHeader>
  );
}
