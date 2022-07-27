/* eslint-disable react/display-name */
import styled from 'styled-components';
import Image from 'next/image';
import { forwardRef, useEffect, FC } from 'react';
import {
  useTwitterHandleFromPubKeyQuery,
  useWalletProfileLazyQuery,
} from 'src/graphql/indexerTypes';
import { useWallet } from '@solana/wallet-adapter-react';

import { WalletLabel } from 'src/components/WalletIndicator';
import { SolBalance } from 'src/components/SolBalance';
import { DisconnectWalletButton } from '@/components/Button';

import { getPFPFromPublicKey } from '@/modules/utils/image';
import { ChevronRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';

export const ProfilePopover = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <PopoverBox ref={ref}>
      <PopoverBoxContents />
    </PopoverBox>
  );
});

type PopoverBoxContentsProps = {
  onViewProfile?: VoidFunction;
};

export const PopoverBoxContents: FC<PopoverBoxContentsProps> = ({ onViewProfile }) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const { connected, publicKey } = useWallet();
  const { data } = useTwitterHandleFromPubKeyQuery({
    variables: { pubKey: publicKey?.toBase58() },
  });
  const twitterHandle: string | undefined = data?.wallet?.profile?.handle;

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  const profilePictureUrl = connected
    ? walletProfile.data?.profile?.profileImageUrlHighres?.replace('_normal', '')
    : null;

  return (
    <div className="rounded-lg bg-gray-900 p-5 sm:w-64">
      <FirstRow>
        <div className="flex w-full items-center justify-between">
          <ProfilePicture
            width={PFP_SIZE}
            height={PFP_SIZE}
            src={profilePictureUrl ?? getPFPFromPublicKey(publicKey)}
            alt="Profile Picture"
          />
          <Link href={'/profiles/' + publicKey?.toBase58() + '/nfts'} passHref>
            <a className="ml-5 flex cursor-pointer items-center text-base hover:text-gray-300">
              <span className="">View profile</span>
              &nbsp;
              <ChevronRightIcon className="h-5 w-5" />
            </a>
          </Link>
        </div>
      </FirstRow>
      <div className="mt-6 flex w-full items-center justify-between">
        <SolBalance />
        <WalletLabel />
      </div>
      <div className="w-full">
        <DisconnectWalletButton />
      </div>
    </div>
  );
};

const PFP_SIZE = 80;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PopoverBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 8px; // Since ANTD Popover Inner Content ist like 12x16px
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
`;
