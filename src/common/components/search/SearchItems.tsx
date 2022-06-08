import React, { FC } from 'react';
import { Avatar } from '../elements/Avatar';
import { shortenAddress } from '@/modules/utils/string';
import Link from 'next/link';

interface ProfileSearchItemProps {
  address: string;
  handle?: string | null;
  profileImage?: string;
  onClick?: () => void;
}

export const ProfileSearchItem: FC<ProfileSearchItemProps> = ({
  address,
  handle,
  profileImage,
  onClick,
}) => {
  return (
    <Link href={`/profiles/${address}`}>
      <a
        onClick={onClick}
        className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}
      >
        <div className={`flex flex-row items-center gap-6`}>
          <Avatar size={`md`} address={address} showAddress={false} />
          <p className={`m-0 text-sm`}>{handle ? `@${handle}` : shortenAddress(address)}</p>
        </div>
        <p className={`m-0 hidden text-sm text-gray-300 md:inline-block`}>
          {shortenAddress(address)}
        </p>
      </a>
    </Link>
  );
};

interface NFTSearchItemProps {
  image: string;
  name: string;
  creatorAddress?: string | null;
  creatorHandle?: string | null;
  address: string;
  onClick?: () => void;
}

export const NFTSearchItem: FC<NFTSearchItemProps> = ({
  image,
  name,
  creatorAddress,
  address,
  creatorHandle,
  onClick,
}) => {
  return (
    <Link href={`/nfts/${address}`}>
      <a
        onClick={onClick}
        className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}
      >
        <div className={`flex flex-row items-center gap-6`}>
          <img
            src={image}
            alt={name}
            className={`aspect-square h-10 w-10 overflow-hidden rounded-lg text-sm`}
          />
          <p className={`m-0 text-sm`}>{name}</p>
        </div>
        <p className={`m-0 hidden text-sm text-gray-300 md:inline-block`}>
          {creatorHandle
            ? `@${creatorHandle}`
            : creatorAddress
            ? shortenAddress(creatorAddress)
            : null}
        </p>
      </a>
    </Link>
  );
};
