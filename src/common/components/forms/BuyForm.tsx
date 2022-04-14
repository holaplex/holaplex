import React, { FC, useMemo } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, Marketplace, Listing } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';

interface BuyFormProps {
  nft: Nft;
  marketplace: Marketplace;
  listing: Listing;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  className?: string;
}

interface BuyFormSchema {
  amount: number;
}

const BuyForm: FC<BuyFormProps> = ({ nft, marketplace, listing, refetch, className }) => {
  const schema = zod.object({
    amount: zod.number(),
  });

  const { publicKey, signTransaction } = useWallet();
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

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);

  const onBuy = async () => {
    if (listing && !isOwner && nft) {
      toast(`Buying ${nft.name} for ${Number(listing.price) / LAMPORTS_PER_SOL}`);
      await sdk.listings(marketplace.auctionHouse).buy({ listing, nft });
    }
  };

  const buyTx = async ({ amount }: BuyFormSchema) => {
    if (!publicKey || !signTransaction) {
      return;
    }
    if (!listing || isOwner || !nft || !marketplace) {
      return;
    }
    try {
      await onBuy();
      toast.success(`Confirmed buy success`);
      await refetch();
      return;
    } catch (err: any) {
      toast.error(err.message);
      return;
    }
  };

  if (isOwner) {
    return null;
  }

  return (
    <form className={`flex w-full ${className}`} onSubmit={handleSubmit(buyTx)}>
      <Button
        htmlType={`submit`}
        disabled={isSubmitting}
        loading={isSubmitting}
        className={className}
      >
        Buy now
      </Button>
    </form>
  );
};

export default BuyForm;
