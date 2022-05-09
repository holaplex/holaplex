import React, { FC } from 'react';
import { Avatar } from '../elements/Avatar';
import { shortenAddress } from '@/modules/utils/string';
import Link from 'next/link';

interface ProfileSearchItemProps {
    address: string;
    handle?: string;
    profileImage?: string;
}

export const ProfileSearchItem: FC<ProfileSearchItemProps> = ({address, handle, profileImage}) => {
    return (
        <Link href={`/profiles/${address}`}>
            <a className={`p-4 flex flex-row items-center justify-between hover:bg-gray-800 rounded-lg`}>
                <div className={`flex gap-6 flex-row items-center`}>
                    <Avatar size={`md`} address={address} showAddress={false}/>
                    <p className={`text-sm m-0`}>{handle ? `@${handle}` : shortenAddress(address)}</p>
                </div>
                <p className={`hidden md:inline-block text-sm text-gray-300 m-0`}>{shortenAddress(address)}</p>
            </a>
        </Link>
    )
}

interface NFTSearchItemProps {
    image: string;
    name: string;
    creatorAddress: string;
    creatorHandle?: string | null;
    address: string;
}

export const NFTSearchItem: FC<NFTSearchItemProps> = ({image, name, creatorAddress, address, creatorHandle}) => {
    return (
        <Link href={`/nfts/${address}`}>
            <a className={`p-4 flex flex-row items-center justify-between hover:bg-gray-800 rounded-lg`}>
                <div className={`flex gap-6 flex-row items-center`}>
                    <img src={image} alt={name} className={`w-10 h-10 rounded-lg aspect-square`}/>
                    <p className={`text-sm m-0`}>{name}</p>
                </div>
                <p className={`hidden md:inline-block text-sm text-gray-300 m-0`}>{creatorHandle ? `@${creatorHandle}` : shortenAddress(creatorAddress)}</p>
            </a>
        </Link>
    )
}