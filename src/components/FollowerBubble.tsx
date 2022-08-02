import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import clsx from 'clsx';
import { FC } from 'react';
import { WalletProfile } from '@/views/profiles/follow.utils';

type FollowerBubbleProps = {
  isFirst?: boolean;
  follower: WalletProfile;
};

type FollowBubbleImageProps = {
  image: string;
  address: string;
  isFirst?: boolean;
};

export const FollowerBubbleImage: FC<FollowBubbleImageProps> = ({ isFirst, image, address }) => {
  return (
    <Link href={`/profiles/${address as string}/nfts`} passHref>
      <a
        className={clsx({
          block: !isFirst,
        })}
      >
        <FollowedByImage
          className="h-6 w-6 rounded-full transition duration-150 ease-in-out hover:z-50 hover:scale-110"
          src={image ?? getPFPFromPublicKey(address!)}
          width={24}
          height={24}
          alt="PFP"
        />
      </a>
    </Link>
  );
};

export const FollowerBubble: FC<FollowerBubbleProps> = ({ isFirst, follower }) => {
  return (
    <Link href={`/profiles/${follower.address as string}/nfts`} passHref>
      <a
        className={clsx({
          block: !isFirst,
        })}
      >
        <FollowedByImage
          className="h-6 w-6  rounded-full transition duration-150 ease-in-out hover:z-50 hover:scale-110"
          src={follower?.profile?.profileImageUrlLowres ?? getPFPFromPublicKey(follower.address!)}
          width={24}
          height={24}
          alt="PFP"
        />
      </a>
    </Link>
  );
};

const FollowedByImage = styled(Image)<{ isFirst?: boolean }>`
  ${({ isFirst }) =>
    !isFirst &&
    css`
      border: 1.5px solid #161616 !important;
    `}
`;
