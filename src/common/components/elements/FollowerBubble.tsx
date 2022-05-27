import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import cx from 'classnames';
import { FC } from 'react';
import { TopFollower } from '@/common/context/ProfileData';

type FollowerBubbleProps = {
  isFirst?: boolean;
  follower: TopFollower;
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
        className={cx({
          block: !isFirst,
        })}
      >
        <FollowedByImage
          className="h-8 w-8 rounded-full transition duration-150 ease-in-out hover:z-50 hover:scale-110"
          src={image ?? getPFPFromPublicKey(address!)}
          width={32}
          height={32}
          alt="PFP"
        />
      </a>
    </Link>
  );
};

export const FollowerBubble: FC<FollowerBubbleProps> = ({ isFirst, follower }) => {
  return (
    <Link href={`/profiles/${follower.from.address as string}/nfts`} passHref>
      <a
        className={cx({
          block: !isFirst,
        })}
      >
        <FollowedByImage
          className="h-8 w-8 rounded-full transition duration-150 ease-in-out hover:z-50 hover:scale-110"
          src={
            follower.from?.profile?.profileImageUrl ?? getPFPFromPublicKey(follower.from.address!)
          }
          width={32}
          height={32}
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
