import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { FC } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/client';
import { AllConnectionsFromDocument, AllConnectionsToDocument } from 'src/graphql/indexerTypes';

type FollowUnfollowButtonProps = {
  source: 'modalFrom' | 'modalTo' | 'profileButton' | 'feed' | 'whotofollow';
  walletConnectionPair: {
    wallet: AnchorWallet;
    connection: Connection;
  };
  toProfile: IProfile;
  type: 'Follow' | 'Unfollow';
  className?: string;
};

export const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  source,
  walletConnectionPair,
  toProfile,
  type,
  className,
}) => {
  const { track } = useAnalytics();
  const queryClient = useQueryClient();
  const { connection, wallet } = walletConnectionPair;
  const myWallet = wallet.publicKey.toBase58();
  const toWallet = toProfile.address;

  const sharedTrackingParams = {
    source,
    event_category: 'Profile',
    event_label: 'profile',
    from: myWallet,
    to: toWallet,
  } as const;

  const trackInitiateTransaction = () => track(type + ' initiated', sharedTrackingParams);
  const trackSuccess = () => track(type + ' succeeded', sharedTrackingParams);
  const trackError = () => track(type + ' errored', sharedTrackingParams);
  const apolloClient = useApolloClient();

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
      await connection.confirmTransaction(txId, 'processed');
      await queryClient.invalidateQueries();
      await apolloClient.refetchQueries({
        include: [AllConnectionsFromDocument, AllConnectionsToDocument],
      });

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
    onSuccess: async (txIds, toWallet) => {
      for (const txId of txIds) {
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
        await connection.confirmTransaction(txId, 'processed');
      }

      await queryClient.invalidateQueries();
      await apolloClient.refetchQueries({
        include: [AllConnectionsFromDocument, AllConnectionsToDocument],
      });

      trackSuccess();
      toast(
        <SuccessToast>
          Unfollowed: {showFirstAndLastFour(toWallet)}, Revoke TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txIds[0]}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txIds[0])}
          </a>
          , Close TX:&nbsp;
          <a
            className="font-bold underline"
            href={`https://explorer.solana.com/tx/${txIds[1]}`}
            target="_blank"
            rel="noreferrer"
          >
            {showFirstAndLastFour(txIds[1])}
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

    if (type === 'Follow') {
      connectTo.mutate(pk);
    } else {
      disconnectTo.mutate(pk);
    }
  };

  const loading = connectTo.status === 'loading' || disconnectTo.status === 'loading';

  return type === 'Follow' ? (
    <Button5
      v="primary"
      className={classNames('h-10 w-28', className)}
      onClick={() => handleClick()}
      loading={loading}
    >
      Follow
    </Button5>
  ) : (
    <Button5
      v="secondary"
      className={classNames('h-10 w-28', className)}
      onClick={() => handleClick()}
      loading={loading}
    >
      Unfollow
    </Button5>
  );
};
