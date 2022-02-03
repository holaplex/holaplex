/* eslint-disable react/display-name */
import styled from 'styled-components';
import Image from 'next/image';
import { Settings } from '../icons/Settings';
import { WalletPill } from './WalletIndicator';
import { MiniWallet } from './MiniWallet';
import { forwardRef, useEffect } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { useWallet } from '@solana/wallet-adapter-react';

export const ProfilePopover = forwardRef<HTMLDivElement>((_, ref) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const { connected, publicKey } = useWallet();
  const { data: twitterHandle } = useTwitterHandle(publicKey);

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  const profilePictureUrl = connected ? walletProfile.data?.profile?.profileImageUrlHighres : null;
  const textOverride = connected ? twitterHandle : null;

  return (
    <PopoverBox ref={ref}>
      <FirstRow>
        <div>
          <ProfilePicture
            width={PFP_SIZE}
            height={PFP_SIZE}
            src={profilePictureUrl ?? '/images/gradients/gradient-3.png'}
            alt="Profile Picture"
          />
        </div>
        <div>
          <Settings />
        </div>
      </FirstRow>
      <SecondRow>
        <WalletPill disableBackground textOverride={textOverride} />
      </SecondRow>
      <Divider />
      <MiniWallet />
    </PopoverBox>
  );
});

const PFP_SIZE = 80;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SecondRow = styled.div`
  margin-top: 24px;
`;

const Divider = styled.div`
  position: static;
  width: 100%;
  top: 176.5px;
  background: #707070;
  height: 1px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  margin: 24px 0px;
`;

const PopoverBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  padding: 12px; // Since ANTD Popover Inner Content ist like 12x16px
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
`;
