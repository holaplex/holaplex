import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';

export default function FollowUnfollowButton(props: {
  walletConnectionPair: { wallet: AnchorWallet; connection: Connection };
  toWallet: string;
  type: 'Follow' | 'Unfollow';
}) {
  const { track } = useAnalytics();
  const queryClient = useQueryClient();
  const { connection, wallet } = props.walletConnectionPair;
  const myWallet = wallet.publicKey.toBase58();

  const trackInitiate = () =>
    track(props.type + ' initiated', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: props.toWallet,
      source: 'profile',
    });

  const trackSuccess = () =>
    track(props.type + ' succeeded', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: props.toWallet,
      source: 'profile',
    });
  const trackError = () =>
    track(props.type + ' errored', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: props.toWallet,
      source: 'profile',
    });

  const connectTo = useMakeConnection(props.walletConnectionPair, {
    onSuccess: async (txId, toWallet) => {
      toast(
        <SuccessToast>
          Confirming transaction:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>,
        { autoClose: 13_000 }
      );
      await connection.confirmTransaction(txId, 'finalized');
      await queryClient.invalidateQueries();
      trackSuccess();
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
    onError: (error, toWallet) => {
      console.error(error);
      trackError();
      toast(<FailureToast>Unable to follow, try again later.</FailureToast>);
    },
  });

  const disconnectTo = useRevokeConnection(props.walletConnectionPair, {
    onSuccess: async (txId, toWallet) => {
      toast(
        <SuccessToast>
          Confirming transaction:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txId}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txId)}
          </a>
        </SuccessToast>,
        { autoClose: 13_000 }
      );
      await connection.confirmTransaction(txId, 'finalized');
      await queryClient.invalidateQueries();

      trackSuccess();
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
    onError: (error, toWallet) => {
      console.error(error);

      trackError();
      toast(<FailureToast>Unable to unfollow, try again later.</FailureToast>);
    },
  });

  const handleFollowClick = (pubKeyOverride?: string) => {
    const pk = pubKeyOverride ?? props.toWallet; // props.walletConnectionPair.wallet.publicKey.toBase58();
    trackInitiate();
    connectTo.mutate(pk);
  };

  const handleUnFollowClick = (pubKeyOverride?: string) => {
    const pk = pubKeyOverride ?? props.toWallet;
    trackInitiate();
    disconnectTo.mutate(pk);
  };

  const loading = connectTo.status === 'loading' || disconnectTo.status === 'loading';

  return props.type === 'Follow' ? (
    <Button5
      v="primary"
      className="h-10 w-28"
      onClick={() => handleFollowClick()}
      loading={loading}
    >
      Follow
    </Button5>
  ) : (
    <Button5
      v="secondary"
      className="h-10 w-28"
      onClick={() => handleUnFollowClick()}
      loading={loading}
    >
      Unfollow
    </Button5>
  );
}
