import React, { FC, useContext, useMemo } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, Listing, AuctionHouse } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';

interface BuyFormProps {
  nft: Nft;
  marketplace: {auctionHouse: AuctionHouse};
  listing: Listing;
  className?: string;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
}

interface BuyFormSchema {
  amount: number;
}

const BuyForm: FC<BuyFormProps> = ({ nft, marketplace, listing, refetch, className }) => {
  const schema = zod.object({
    amount: zod.number(),
  });

  const { publicKey, signTransaction, select: selectWallet } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: Number(listing?.price),
    },
  });

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { trackNFTEvent } = useAnalytics();

  const onBuy = async () => {
    if (listing && !isOwner && nft) {
      toast(`Buying ${nft.name} for ${Number(listing.price) / LAMPORTS_PER_SOL}`);
      await sdk.listings(marketplace.auctionHouse).buy({ listing, nft });
    }
  };

  const buyTx = async ({ amount }: BuyFormSchema) => {
    if (!publicKey || !signTransaction) {
      selectWallet(PhantomWalletName);
      return;
    }
    if (!listing || isOwner || !nft || !marketplace) {
      return;
    }

    const newActions: Action[] = [
      {
        name: `Buying ${nft.name}...`,
        id: `buyNFT`,
        action: onBuy,
        param: undefined,
      },
    ];

    trackNFTEvent('NFT Bought Init', Number(amount), nft);
    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed buy success`);
        trackNFTEvent('NFT Bought Success', Number(amount), nft);
      },
      onComplete: async () => {
        await refetch();
      },
      onActionFailure: async (err) => {
        await refetch();
        toast.error(err.message);
      },
    });
  };

  if (isOwner) {
    return null;
  }

  return (
    <form className={`flex w-full ${className}`} onSubmit={handleSubmit(buyTx)}>
      <Button
        htmlType={`submit`}
        disabled={isSubmitting || hasActionPending}
        loading={isSubmitting || hasActionPending}
        className={className}
      >
        Buy now
      </Button>
    </form>
  );
};

export default BuyForm;
