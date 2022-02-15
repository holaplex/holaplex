import styled from 'styled-components';
import { Close } from '../icons/Close';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { mq } from '@/common/styles/MediaQuery';
import Link from 'next/link';
import { PopoverBoxContents } from './ProfilePopover';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { SelectWalletButton } from '@/common/components/elements/Button';
import { FC } from 'react';

type OnCloseProps = {
  onCloseClick: VoidFunction;
};

export const MobileMenu: FC<OnCloseProps> = ({ onCloseClick }) => {
  const { connected, wallet } = useWallet();
  const hasWalletTypeSelected = wallet?.readyState === WalletReadyState.Installed;
  const connectedAndInstalledWallet = hasWalletTypeSelected && connected;
  return (
    <Container>
      <MobileHeaderContainer>
        <EmojiLogo>👋</EmojiLogo>
        <CloseNavButton onClick={onCloseClick}>
          <Close color="#0e0d0d" />
        </CloseNavButton>
      </MobileHeaderContainer>
      <MenuItems onCloseClick={onCloseClick} />
      <ProfileContainer>
        {connectedAndInstalledWallet ? (
          <PopoverBoxContents onViewProfile={onCloseClick} />
        ) : (
          <SmallConnectButton />
        )}
      </ProfileContainer>
    </Container>
  );
};

const MenuItems: FC<OnCloseProps> = ({ onCloseClick }) => {
  return (
    <ItemsContainer>
      <Link passHref href="/">
        <MenuItemRow onClick={onCloseClick}>Home</MenuItemRow>
      </Link>
      <Link passHref href="/storefront/edit">
        <MenuItemRow onClick={onCloseClick}>Edit store</MenuItemRow>
      </Link>
      <MenuItemButtonRow>Mint NFTs</MenuItemButtonRow>
      <Link passHref href="/about">
        <MenuItemRow onClick={onCloseClick}>About</MenuItemRow>
      </Link>
      <Link passHref href="https://holaplex-support.zendesk.com/hc/en-us">
        <MenuItemRow onClick={onCloseClick} target="_blank" rel="noreferrer">
          FAQ
        </MenuItemRow>
      </Link>
      <Link passHref href="https://holaplex-support.zendesk.com/hc/en-us">
        <MenuItemRow onClick={onCloseClick} target="_blank" rel="noreferrer">
          Terms of service
        </MenuItemRow>
      </Link>
      <Link passHref href="https://holaplex-support.zendesk.com/hc/en-us">
        <MenuItemRow onClick={onCloseClick} target="_blank" rel="noreferrer">
          Privacy policy
        </MenuItemRow>
      </Link>
    </ItemsContainer>
  );
};

const SmallConnectButton = styled(SelectWalletButton)`
  flex: 1;
  width: 100%;
`;

const PaddedContainer = styled.div`
  margin-left: 24px;
  margin-right: 24px;
`;

const ItemsContainer = styled(PaddedContainer)`
  height: 100%;
  margin-left: 12px;
`;

const ProfileContainer = styled(PaddedContainer)`
  margin-bottom: 24px;
`;

const MenuItemRow = styled.a`
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`;

const MenuItemButtonRow = styled.button`
  ${ButtonReset}
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`;

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  background: #171717;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
`;

const CloseNavButton = styled.button`
  ${ButtonReset}
  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmojiLogo = styled.span`
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
`;
