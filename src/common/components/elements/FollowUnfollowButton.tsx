import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { useAnalytics } from '@/modules/ganalytics/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { FC } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';

type FollowUnfollowButtonProps = {
  source: 'modalFrom' | 'modalTo' | 'profileButton';
  walletConnectionPair: {
    wallet: AnchorWallet;
    connection: Connection;
  };
  toWallet: string;
  type: 'Follow' | 'Unfollow';
};

export const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  source,
  walletConnectionPair,
  toWallet,
  type,
}) => {
  const { track } = useAnalytics();
  const queryClient = useQueryClient();
  const { connection, wallet } = walletConnectionPair;
  const myWallet = wallet.publicKey.toBase58();

  const trackInitiateTransaction = () =>
    track(type + ' initiated', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: toWallet,
      source: 'profile',
    });

  const trackSuccess = () =>
    track(type + ' succeeded', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: toWallet,
      source: 'profile',
    });

  const trackError = () =>
    track(type + ' errored', {
      event_category: 'Profile',
      event_label: 'profile',
      from: myWallet,
      to: toWallet,
      source: 'profile',
    });

  const connectTo = useMakeConnection(walletConnectionPair, {
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

  const disconnectTo = useRevokeConnection(walletConnectionPair, {
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

  const handleClick = (pubKeyOverride?: string) => {
    const pk = pubKeyOverride ?? toWallet;
    trackInitiateTransaction();

    console.log('initiate', type, {
      from: myWallet,
      toWallet,
    });
    if ((type = 'Follow')) {
      connectTo.mutate(pk);
    } else {
      disconnectTo.mutate(pk);
    }

    // kris NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H
    // alex
    // belle 2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR
    // ryan 8iGmtE26nBETcxiL6rp1Sn6ZJ8F6ZzTKLW6GL9BGPPHe
    // scuba 3XzWJgu5WEU3GV3mHkWKDYtMXVybUhGeFt7N6uwkcezF
    // damian GYNT1qUj9Ew45WpHaVZqGSz7R97ve2EjJEEfTcNVrJvQ

    // check list
    // ! follow profile page OK, also !!!
    // ! unfillow profile page !!!
    // ! follow modal !!!, but also OK
    // * unfollow modal OK
    // follow many modal (with confirmation inbetweent) !!!
    // * unfollow many modal OK
  };

  const loading = connectTo.status === 'loading' || disconnectTo.status === 'loading';

  if (!loading) {
    console.log('loaded', type, 'button', {
      from: myWallet,
      toWallet,
    });
  }

  return type === 'Follow' ? (
    <Button5 v="primary" className="h-10 w-28" onClick={() => handleClick()} loading={loading}>
      Follow
    </Button5>
  ) : (
    <Button5 v="secondary" className="h-10 w-28" onClick={() => handleClick()} loading={loading}>
      Unfollow
    </Button5>
  );
};
