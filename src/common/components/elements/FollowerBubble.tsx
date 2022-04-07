import { getPFPFromPublicKey } from '@/modules/utils/image';
import Link from 'next/link';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import cx from 'classnames';
import { Follower } from './FollowerCount';
import { useState, useEffect, FC } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';

type FollowerBubbleProps = {
  isFirst?: boolean;
  follower: Follower;
};

export const FollowerBubble: FC<FollowerBubbleProps> = ({ isFirst, follower }) => {
  const { fromHandle } = follower.twitter;

  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [queryWalletProfile, result] = useWalletProfileLazyQuery();
  useEffect(() => {
    (async () => {
      setStatus('loading');
      try {
        if (fromHandle) {
          queryWalletProfile({
            variables: {
              handle: fromHandle,
            },
          });
        }
      } finally {
        setStatus('done');
      }
    })();
  }, [fromHandle, queryWalletProfile]);

  const isLoading = status === 'loading' || status === 'idle' || result.loading;

  return (
    <Link href={`/profiles/${follower.account.from.toBase58()}`} passHref>
      <a
        className={cx({
          'ml-[-8px] block': !isFirst,
        })}
      >
        {!isLoading ? (
          <FollowedByImage
            className="h-8 w-8 rounded-full"
            src={
              result.data?.profile?.profileImageUrlLowres ??
              getPFPFromPublicKey(follower.account.from)
            }
            width={32}
            height={32}
            alt="PFP"
          />
        ) : (
          <div className='[content: ""] skeleton-animation [background-color: #262626] h-8 w-8 rounded-full' />
        )}
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
