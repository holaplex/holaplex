import { FC, useMemo } from 'react';
import { ButtonV3 } from './Button';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGetAllConnectionsTo } from '@/common/hooks/useGetAllConnectionsTo';
import { useGetAllConnectionsFrom } from '@/common/hooks/useGetAllConnectionsFrom';
import { useConnectTo } from '@/common/hooks/useConnectTo';
import { useDisconnectTo } from '@/common/hooks/useDisconnectTo';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { showFirstAndLastFour, b } from '@/modules/utils/string';
import { SuccessToast } from './SuccessToast';
import { FailureToast } from './FailureToast';

export const FollowerCount: FC<{
  pubKey: string;
}> = ({ pubKey }) => {
  const wallet = useAnchorWallet();
  if (!wallet) return null;
  return <FollowerCountContent wallet={wallet} pubKey={pubKey} />;
};

export const FollowerCountContent: FC<{
  pubKey: string;
  wallet: AnchorWallet;
}> = ({ pubKey, wallet }) => {
  const { connection } = useConnection();
  const walletConnectionPair = useMemo(
    () => ({
      wallet,
      connection,
    }),
    [wallet, connection]
  );
  const allConnectionsTo = useGetAllConnectionsTo(pubKey, walletConnectionPair);
  const allConnectionsFrom = useGetAllConnectionsFrom(pubKey, walletConnectionPair);
  const [connectTo] = useConnectTo(walletConnectionPair, {
    onSuccess: async ({ data: txId, input: toWallet }) => {
      const from = wallet.publicKey;
      const to = new PublicKey(toWallet);
      const [publicKey] = await PublicKey.findProgramAddress(
        [b`connection`, from.toBytes(), to.toBytes()],
        new PublicKey('grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef')
      );
      const mutationData = [
        ...(allConnectionsTo.data ?? []),
        {
          account: {
            from,
            to,
          },
          publicKey,
        },
      ];
      allConnectionsTo.mutate(mutationData, { revalidate: false });
      toast(
        <SuccessToast>
          Followed: {showFirstAndLastFour(toWallet)}, TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>
      );
    },
    onFailure: ({ error, input: toWallet }) => {
      console.error(error);
      toast(
        <FailureToast>
          Unable to follow: {showFirstAndLastFour(toWallet)}, try again later.
        </FailureToast>
      );
    },
  });
  const [disconnectTo] = useDisconnectTo(walletConnectionPair, {
    onSuccess: async ({ data: txId, input: toWallet }) => {
      const from = wallet.publicKey;
      const to = new PublicKey(toWallet);
      const [publicKey] = await PublicKey.findProgramAddress(
        [b`connection`, from.toBytes(), to.toBytes()],
        new PublicKey('grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef')
      );
      allConnectionsTo.mutate(
        (allConnectionsTo.data ?? []).filter((i) => i.publicKey !== publicKey),
        { revalidate: false }
      );
      toast(
        <SuccessToast>
          Unfollowed: {showFirstAndLastFour(toWallet)}, TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>
      );
    },
    onFailure: ({ error, input: toWallet }) => {
      console.error(error);
      toast(
        <FailureToast>
          Unable to unfollow: {showFirstAndLastFour(toWallet)}, try again later.
        </FailureToast>
      );
    },
  });

  const handleUnFollowClick = async () => {
    await disconnectTo(pubKey);
  };
  const handleFollowClick = async () => {
    await connectTo(pubKey);
  };

  const allConnectionsToLoading = !allConnectionsTo.data && !allConnectionsTo.error;
  const allConnectionsFromLoading = !allConnectionsFrom.data && !allConnectionsFrom.error;

  const isLoading = allConnectionsToLoading || allConnectionsFromLoading; // ||
  // connectToStatus.status === 'running' ||
  // disConnectToStatus.status === 'running';
  // commented for hyper-mode ;)

  if (isLoading) return <FollowerCountSkeleton />;
  const isSameWallet = wallet.publicKey.equals(new PublicKey(pubKey));

  const amIFollowing = (allConnectionsTo.data ?? []).some((i) =>
    i.account.from.equals(wallet.publicKey)
  );

  return (
    <div className="mt-9 flex flex-row">
      <div className="flex flex-col">
        <div className="font-bold">{allConnectionsTo.data?.length ?? 0}</div>
        <div className="text-gray-200">Followers</div>
      </div>
      <div className="ml-4 flex flex-col">
        <div className="font-bold">{allConnectionsFrom.data?.length ?? 0}</div>
        <div className="text-gray-200">Following</div>
      </div>
      {isSameWallet ? null : amIFollowing ? (
        <div className="ml-10 flex flex-row items-center justify-center">
          <UnFollowButton onClick={handleUnFollowClick} />
        </div>
      ) : (
        <div className="ml-10 flex flex-row items-center justify-center">
          <ButtonV3 onClick={handleFollowClick}>Follow</ButtonV3>
        </div>
      )}
    </div>
  );
};

const UnFollowButton = styled(ButtonV3)`
  :after {
    content: 'Following';
  }
  :hover {
    :after {
      content: 'Unfollow';
    }
  }
`;

const FollowerCountSkeleton = () => {
  return (
    <div>
      <div>Loading</div>
    </div>
  );
};
