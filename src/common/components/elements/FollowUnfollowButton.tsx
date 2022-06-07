import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { FC, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
import classNames from 'classnames';
import { useApolloClient } from '@apollo/client';
import {
  AllConnectionsFromDocument,
  AllConnectionsToDocument,
  IsXFollowingYDocument,
  GetProfileFollowerOverviewDocument,
  GetCollectedByDocument,
  GetConnectedWalletProfileDataDocument,
} from 'src/graphql/indexerTypes';

export type FollowUnfollowSource =
  | 'modalFollowing'
  | 'modalFollowers'
  | 'profileButton'
  | 'feed'
  | 'whotofollow'
  | 'collectedBy';

type FollowUnfollowButtonProps = {
  source: FollowUnfollowSource;
  walletConnectionPair?: {
    wallet: AnchorWallet;
    connection: Connection;
  };
  toProfile: {
    address: string;
    handle?: string;
  };
  type: 'Follow' | 'Unfollow';
  className?: string;
};

export const FollowUnfollowButton: FC<FollowUnfollowButtonProps> = ({
  source,
  type,
  walletConnectionPair: wcProp,
  className,
  toProfile,
}) => {
  const { track } = useAnalytics();
  const queryClient = useQueryClient(); // TODO: Remove
  const apolloClient = useApolloClient();
  const { connection } = useConnection();
  const { connectedProfile } = useConnectedWalletProfile();
  const myWallet = connectedProfile?.pubkey; //  wallet.publicKey.toBase58();
  const toWallet = toProfile.address;

  //! Inelegant I know, but hopefully we can drop the prop entierly and rework this once we have a way to "connect and do action" at the same time
  const walletConnectionPair = (wcProp ?? connectedProfile?.walletConnectionPair)!;

  const sharedTrackingParams = {
    source,
    event_category: 'Profile',
    event_label: type,
    from: myWallet,
    to: toWallet,
  } as const;

  const trackInitiateTransaction = () => track(type + ' initiated', sharedTrackingParams);
  const trackSuccess = () => track(type + ' succeeded', sharedTrackingParams);
  const trackError = () => track(type + ' errored', sharedTrackingParams);

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
        include: [
          AllConnectionsFromDocument,
          AllConnectionsToDocument,
          IsXFollowingYDocument,
          GetProfileFollowerOverviewDocument,
          GetCollectedByDocument,
          GetConnectedWalletProfileDataDocument,
        ],
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
    onError: (error) => {
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
        include: [
          AllConnectionsFromDocument,
          AllConnectionsToDocument,
          IsXFollowingYDocument,
          GetProfileFollowerOverviewDocument,
          GetCollectedByDocument,
          GetConnectedWalletProfileDataDocument,
        ],
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
    onError: (error) => {
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

  return (
    <Button5
      v={type === 'Follow' ? 'primary' : 'secondary'}
      className={classNames('h-8 w-24 lg:h-10 lg:w-28', className)}
      onClick={() => handleClick()}
      loading={loading}
    >
      {type === 'Follow' ? 'Follow' : 'Unfollow'}
    </Button5>
  );
};
