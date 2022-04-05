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

export const FollowerBubble: FC<FollowerBubbleProps> = ({ isFirst, follower }) => {
  return (
    <Link href={`/profiles/${follower.pubKey}`} passHref>
      <a
        className={cx({
          'ml-[-8px] block': !isFirst,
        })}
      >
        <FollowedByImage
          className="h-8 w-8 rounded-full"
          src={
            follower.profileInfo?.images?.profileImageUrlLowres ??
            getPFPFromPublicKey(follower.pubKey)
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
