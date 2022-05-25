import styled from 'styled-components';
import Image from 'next/image';
import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { ProfilePopover } from './ProfilePopover';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';
import { useTwitterHandleFromPubKeyQuery, useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPFPFromPublicKey } from '@/modules/utils/image';

export const ProfileImage = () => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();

  const { connected, publicKey } = useWallet();
  const {data} = useTwitterHandleFromPubKeyQuery({variables: {pubKey: publicKey?.toBase58()}});
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
  const [isShowingProfilePopover, setIsShowingProfilePopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(popoverRef, () => setIsShowingProfilePopover(false));

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={isShowingProfilePopover}
        content={<ProfilePopover ref={popoverRef} />}
      >
        <button
          onClick={() => setIsShowingProfilePopover((v) => !v)}
          className="flex items-center justify-center overflow-hidden rounded-full shadow-lg shadow-black ring-4 ring-gray-900 transition-transform  hover:scale-125"
        >
          <img
            width={44}
            height={44}
            src={profilePictureUrl ?? getPFPFromPublicKey(publicKey)}
            className={` `}
            alt="Profile Image"
          />
        </button>
      </Popover>
    </>
  );
};

const ProfileImageWrapper = styled.button`
  ${ButtonReset};
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 200px;
`;
