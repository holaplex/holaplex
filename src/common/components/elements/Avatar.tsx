import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import cx from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

export const AvatarIcons = ({ creators }: { creators: { address: string }[] }) => {
  return (
    // wrap the avatars in a container with a small, colored background
    <div className={`inline-flex items-center rounded-full bg-gray-600 bg-opacity-70 p-1`}>
      {creators.slice(0, 4).map(({ address }, i) => (
        <div key={address} className={classNames('h-6 w-6', { '-ml-3': i > 0 })}>
          <AvatarIcon address={address} index={i} />
        </div>
      ))}
      {/* show how many additional creators there are when there are more than 4 */}
      {
        <div
          className={classNames(
            { hidden: creators.length < 5 },
            '-ml-3 flex h-6 items-center rounded-full bg-gray-800 px-1 text-sm text-gray-400 hover:scale-125'
          )}
        >
          {`+${creators.length - 4}`}
        </div>
      }
    </div>
  );
};

export const AvatarIcon = ({ address, index }: { address: string; index: number }) => {
  const { data: twitterHandle } = useTwitterHandle(null, address);
  const [queryWalletProfile, { data }] = useWalletProfileLazyQuery();
  const leftPosPixls = 12;
  const leftPos = index * leftPosPixls;

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {}, [twitterHandle]);
  const profilePictureUrl = data?.profile?.profileImageUrlHighres || null;
  return (
    // Using antd tooltip since no tailwind supported component, replace when better alternative is available
    <Tooltip
      key={address}
      title={twitterHandle || shortenAddress(address)}
      mouseEnterDelay={0.09}
      overlayStyle={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'white',
      }}
    >
      {/* // Need to use style prop for dynamic style application, Tailwind does not support */}
      <div
        className="h-full w-full transition hover:z-10 hover:scale-125"
        style={{ left: leftPos }}
      >
        <Link href={`/profiles/${address}`}>
          <a>
            <img
              src={profilePictureUrl ?? getPFPFromPublicKey(address)}
              alt="Profile Picture"
              className="rounded-full"
            />
          </a>
        </Link>
      </div>
    </Tooltip>
  );
};

export const Avatar = ({
  address,
  showAddress = true,
  border = false,
  size = 'sm',
}: {
  border?: boolean;
  address: string;
  showAddress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };
  const { data: twitterHandle } = useTwitterHandle(null, address);
  const [queryWalletProfile, { data }] = useWalletProfileLazyQuery();
  const { publicKey } = useWallet();
  const isYou = publicKey?.toBase58() === address;
  const displayName = isYou
    ? 'You'
    : twitterHandle
    ? `@${twitterHandle}`
    : showFirstAndLastFour(address);

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  useEffect(() => {}, [twitterHandle]);
  const profilePictureUrl = data?.profile?.profileImageUrlHighres || null;

  return (
    <div className="flex items-center">
      <div className={`flex ${sizes[size]}`}>
        <AvatarImage src={profilePictureUrl ?? getPFPFromPublicKey(address)} border={border} />
      </div>

      {showAddress && (
        <div className={cx('ml-2 text-base', isYou || twitterHandle ? 'font-sans' : 'font-mono')}>
          {displayName}
        </div>
      )}
    </div>
  );
};

export const AvatarImage = ({
  src,
  border = false,
  borderClass = 'border-2 border-gray-900 border-opacity-60',
}: {
  src: string;
  border?: boolean;
  borderClass?: string;
}) => (
  <div
    className={classNames(
      'flex',
      'overflow-clip rounded-full',
      'h-full w-full',
      border && borderClass ? borderClass : undefined
    )}
  >
    <img src={src} alt="Profile Picture" className="min-h-full min-w-full object-cover" />
  </div>
);
