import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { getPFPFromPublicKey } from '@/modules/utils/image';
import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import cx from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';

export const AvatarIcons = ({ creators }: { creators: { address: string }[] }) => {
  return (
    <div className="relative">
      {creators.map(({ address }, i) => (
        <AvatarIcon address={address} index={i} key={address} />
      ))}
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
      <li
        className="absolute list-none transition hover:z-10 hover:scale-125"
        style={{ left: leftPos }}
      >
        <Link href={`/profiles/${address}`}>
          <a>
            <img
              src={profilePictureUrl ?? getPFPFromPublicKey(address)}
              alt="Profile Picture"
              className="h-6 w-6 rounded-full"
            />
          </a>
        </Link>
      </li>
    </Tooltip>
  );
};

export const Avatar = ({
  address,
  showAddress = true,
  border = false,
}: {
  border?: boolean;
  address: string;
  showAddress?: boolean;
}) => {
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
      <div
        className={`flex h-6 w-6 rounded-full ${
          border && `border-2 border-gray-900 border-opacity-60`
        }`}
      >
        <img
          src={profilePictureUrl ?? getPFPFromPublicKey(address)}
          alt="Profile Picture"
          className="rounded-full"
        />
      </div>

      {showAddress && (
        <div className={cx('ml-2 text-base', isYou || twitterHandle ? 'font-sans' : 'font-mono')}>
          {displayName}
        </div>
      )}
    </div>
  );
};
