import { ButtonReset } from '@/common/styles/ButtonReset';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import { ChevronRight } from '../icons/ChevronRight';
import { Copy } from '../icons/Copy';

type WalletPillProps = {
  disableBackground?: boolean;
  textOverride?: string | null;
  publicKey?: PublicKey | null;
  disableLink?: boolean;
  onClick?: VoidFunction;
};

export const WalletPill: FC<WalletPillProps> = ({
  disableBackground,
  textOverride,
  publicKey,
  disableLink,
  onClick
}) => {
  const isTwitterHandle = (textOverride?: string | null) =>
    textOverride?.length ? textOverride?.length <= 15 : false;

  if (disableLink) {
    return (
      <ContainerSpan onClick={onClick} disableBackground={disableBackground ?? false}>
        <WalletText monospace={!isTwitterHandle(textOverride)}>
          {isTwitterHandle(textOverride)
            ? `${textOverride}`
            : publicKey
            ? showFirstAndLastFour(publicKey.toBase58())
            : 'DISCONNECTED'}
        </WalletText>
      </ContainerSpan>
    );
  }

  return (
    <Link passHref href={`/activity/${publicKey?.toBase58()}`}>
      <ContainerAnchor onClick={onClick} disableBackground={disableBackground ?? false}>
        <WalletText monospace={!isTwitterHandle(textOverride)}>
          {isTwitterHandle(textOverride)
            ? `${textOverride}`
            : publicKey
            ? showFirstAndLastFour(publicKey.toBase58())
            : 'DISCONNECTED'}
          &nbsp;
          <ChevronRight color='#fff' />
        </WalletText>
      </ContainerAnchor>
    </Link>
  );
};

export const WalletLabel = () => {
  const { publicKey, connecting, disconnecting, connected } = useWallet();
  return (
    <SmallWalletContainer>
      <ConnectionIndicator
        state={connecting || disconnecting ? 'warn' : connected ? 'connected' : 'disconnected'}
      />
      <SmallWalletLabel>
        &nbsp;{publicKey ? showFirstAndLastFour(publicKey.toBase58()) : 'DISCONNECTED'}
      </SmallWalletLabel>
    </SmallWalletContainer>
  );
};

const ConnectionIndicator = styled.div<{ state: 'connected' | 'disconnected' | 'warn' }>`
  width: 8px;
  height: 8px;
  background: ${(props) => {
    switch (props.state) {
      case 'connected':
        return '#00d072';
      case 'disconnected':
        return '#d04200';
      case 'warn':
        return '#d0b100';
    }
  }};
  border-radius: 25px;
  content: '';
`;

const ContainerAnchor = styled.a<{ disableBackground: boolean }>`
  ${({ disableBackground }) =>
    disableBackground
      ? css``
      : css`
          background-color: #262626;
          padding: 8px 12px;
          border-radius: 500px;
        `}
`;

const ContainerSpan = styled.span<{ disableBackground: boolean }>`
  ${({ disableBackground }) =>
    disableBackground
      ? css``
      : css`
          background-color: #262626;
          padding: 8px 12px;
          border-radius: 500px;
        `}
`;

const SmallWalletContainer = styled.div`
  display: inline-flex;
  align-items: center;
  height: 24px;
`;

const SmallWalletLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #a8a8a8;
`;

const WalletText = styled.span<{ monospace?: boolean }>`
  font-family: ${({ monospace }) =>
    monospace ? "'Space Mono', monospace" : "'Inter', sans-serif"};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.02em;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: inline-flex;
`;
