import styled from 'styled-components';
import Image from 'next/image';
import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { ProfilePopover } from './ProfilePopover';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';

export const ProfileImage = () => {
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

  const profilePictureUrl = connected
    ? walletProfile.data?.profile?.profileImageUrlHighres?.replace('_normal', '')
    : null;
  const [isShowingProfilePopover, setIsShowingProfilePopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(popoverRef, () => setIsShowingProfilePopover(false));
  console.log({ walletProfile });
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={isShowingProfilePopover}
        content={<ProfilePopover ref={popoverRef} />}
      >
        <ProfileImageWrapper onClick={() => setIsShowingProfilePopover((v) => !v)}>
          <Image
            width={40}
            height={40}
            src={profilePictureUrl ?? '/images/gradients/gradient-3.png'}
            alt="Profile Image"
          />
        </ProfileImageWrapper>
      </Popover>
    </>
  );
};

const ProfileImageWrapper = styled.button`
  ${ButtonReset};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 200px;
`;
