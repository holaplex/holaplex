import React, { FC } from 'react';
import { Avatar, AvatarImage } from '../elements/Avatar';
import { shortenAddress } from '@/modules/utils/string';
import Link from 'next/link';
import { VERIFIED_COLLECTIONS } from '../../constants/search';
import { Verified } from '../icons/Verified';

interface ProfileSearchItemProps {
  address: string;
  handle?: string | null;
  profileImage?: string;
}

export const ProfileSearchItem: FC<ProfileSearchItemProps> = ({
  address,
  handle,
  profileImage,
}) => {
  const verifiedProfile = VERIFIED_COLLECTIONS.find((profile) => profile.address === address);
  if (verifiedProfile) {
    return (
      <Link href={`/profiles/${address}`}>
        <a
          className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}
        >
          <div className={`flex flex-row items-center gap-6`}>
            <div className={`h-10 w-10`}>
              <AvatarImage src={verifiedProfile.profileImage} />
            </div>

            <p className={`m-0 flex flex-row items-center gap-2 text-sm`}>
              {verifiedProfile.profile}{' '}
              <span className={`text-white`}>
                <Verified />
              </span>
            </p>
          </div>
          <p className={`m-0 hidden text-sm text-gray-300 md:inline-block`}>
            {shortenAddress(address)}
          </p>
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/profiles/${address}`}>
      <a className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}>
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
}

export const NFTSearchItem: FC<NFTSearchItemProps> = ({
  image,
  name,
  creatorAddress,
  address,
  creatorHandle,
}) => {
  const verifiedProfile = VERIFIED_COLLECTIONS.find(
    (profile) => profile.address === creatorAddress
  );
  if (verifiedProfile) {
    return (
      <Link href={`/nfts/${address}`}>
        <a
          className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}
        >
          <div className={`flex flex-row items-center gap-6`}>
            <img
              src={image}
              alt={name}
              className={`aspect-square h-10 w-10 overflow-hidden rounded-lg text-sm`}
            />
            <p className={`m-0 flex flex-row items-center gap-2 text-sm text-sm`}>
              {name}{' '}
              <span className={`text-white`}>
                <Verified />
              </span>
            </p>
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
  }

  return (
    <Link href={`/nfts/${address}`}>
      <a className={`flex flex-row items-center justify-between rounded-lg p-4 hover:bg-gray-800`}>
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
