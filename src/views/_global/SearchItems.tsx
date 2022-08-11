import React, { FC } from 'react';
import { shortenAddress } from '@/modules/utils/string';
import Link from 'next/link';
import clsx from 'clsx';
import { Avatar } from 'src/components/Avatar';
import { DisplaySOL, PriceDisplay } from '../../components/CurrencyHelpers';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface ProfileSearchItemProps {
  address: string;
  handle?: string | null;
  profileImage?: string;
  onClick?: () => void;
  active?: boolean;
}

export const ProfileSearchItem: FC<ProfileSearchItemProps> = ({
  address,
  handle,
  profileImage,
  onClick,
  active,
}) => {
  return (
    <Link href={`/profiles/${address}`}>
      <a
        onClick={onClick}
        className={clsx(
          `flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`,
          active && 'bg-gray-800'
        )}
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
  active?: boolean;
}

export const NFTSearchItem: FC<NFTSearchItemProps> = ({
  image,
  name,
  creatorAddress,
  address,
  creatorHandle,
  onClick,
  active,
}) => {
  return (
    <Link href={`/nfts/${address}`}>
      <a
        onClick={onClick}
        className={clsx(
          `flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`,
          active && 'bg-gray-800'
        )}
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

interface CollectionSearchItem {
  image: string;
  name: string;
  count: number;
  address: string;
  floorPrice?: number;
  onClick?: () => void;
  active?: boolean;
}

export const CollectionSearchItem: FC<CollectionSearchItem> = ({
  image,
  name,
  floorPrice = 0,
  count,
  address,
  onClick,
  active,
}) => {
  return (
    <Link href={`/nfts/${address}`}>
      <a
        onClick={onClick}
        className={clsx(
          `flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`,
          active && 'bg-gray-800'
        )}
      >
        <div className={`flex flex-row items-center gap-6`}>
          <img
            src={image}
            alt={name}
            className={`aspect-square h-10 w-10 overflow-hidden rounded-lg text-sm`}
          />
          <p className={`m-0 text-sm`}>{name}</p>
        </div>
        <div className={`flex items-center justify-end gap-4`}>
          <p className={`m-0 hidden items-center gap-2 text-sm text-gray-300 md:flex`}>
            {count} NFTs
          </p>
          <p className={`m-0 hidden items-center gap-2 text-sm text-gray-300 md:flex`}>
            Floor
            <DisplaySOL className={'m-0'} amount={floorPrice} />
          </p>
        </div>
      </a>
    </Link>
  );
};
