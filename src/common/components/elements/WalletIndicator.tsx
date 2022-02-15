import { ButtonReset } from '@/common/styles/ButtonReset';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import { ChevronRight } from '../icons/ChevronRight';
import { Copy } from '../icons/Copy';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { Check } from '../icons/Check';

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
  onClick,
}) => {
  const isTwitterHandle = (textOverride?: string | null) =>
    textOverride?.length ? textOverride?.length <= 15 : false;

  const twitterandle = isTwitterHandle(textOverride);

  if (disableLink) {
    return (
      <ContainerSpan onClick={onClick} disableBackground={disableBackground ?? false}>
        <WalletText monospace={!isTwitterHandle(textOverride)}>
          {isTwitterHandle(textOverride) ? (
            <a href={'https://twitter.com/' + textOverride} className="hover:underline">
              {`@${textOverride}`}
            </a>
          ) : publicKey ? (
            showFirstAndLastFour(publicKey.toBase58())
          ) : (
            'DISCONNECTED'
          )}
        </WalletText>
      </ContainerSpan>
    );
  }

  return (
    <Link passHref href={`/profiles/${publicKey?.toBase58()}`}>
      <ContainerAnchor onClick={onClick} disableBackground={disableBackground ?? false}>
        <WalletText monospace={!twitterandle} twitterHandle={twitterandle ? textOverride! : ''}>
          {twitterandle
            ? `${textOverride}`
            : publicKey
            ? showFirstAndLastFour(publicKey.toBase58())
            : 'DISCONNECTED'}
          &nbsp;
          <ChevronRight color="#fff" />
        </WalletText>
      </ContainerAnchor>
    </Link>
  );
};

export const WalletLabel = () => {
  const { publicKey, connecting, disconnecting, connected } = useWallet();
  const handleLabelClick = async () => {
    if (publicKey?.toBase58().length) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      toast(
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <Check color="#32D583" className="mr-2" />
            <div>Wallet address copied to clipboard.</div>
          </div>
        </div>
      );
    }
  };
  return (
    <button onClick={handleLabelClick} className="inline-flex h-6 items-center">
      <div
        className={cx(
          "h-2 w-2 rounded-full content-['']",
          { 'bg-[#00d072]': connected },
          { 'bg-[#d04200]': !connected },
          { 'bg-[#d0b100]': connecting || disconnecting }
        )}
      />
      <span className="inline-flex items-center font-['Space_Mono'] text-[12px] leading-[16px] tracking-[0.02em] text-gray-300">
        &nbsp;{publicKey ? showFirstAndLastFour(publicKey.toBase58()) : 'DISCONNECTED'}&nbsp;
        <Copy className="h-2 w-2" />
      </span>
    </button>
  );
};

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

type WalletTextProps = {
  monospace: boolean;
  twitterHandle?: string;
};

const WalletText: FC<WalletTextProps> = ({ monospace, twitterHandle, children }) => {
  const classes = cx(
    'text-white, inline-flex items-center justify-center text-center text-[16px] leading-[24px] tracking-[0.02em]',
    { ["font-['Space_Mono']"]: monospace },
    { ["font-['Inter']"]: !monospace }
  );
  if (twitterHandle?.length) {
    return (
      <a
        className={classes}
        href={`https://twitter.com/${twitterHandle}`}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }
  return <span className={classes}>{children}</span>;
};
