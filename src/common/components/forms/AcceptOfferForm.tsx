import React, { FC, useContext, useMemo } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { toast } from 'react-toastify';
import { Nft, Marketplace, Offer, Listing, initMarketplaceSDK } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';

interface AcceptOfferFormProps {
  nft: Nft;
  offer: Offer;
  listing?: Listing;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  className?: string;
  closeOuter?: () => void;
}

interface AcceptOfferFormSchema {
  amount: number;
}

const schema = zod.object({
  amount: zod.number(),
});

const AcceptOfferForm: FC<AcceptOfferFormProps> = ({
  nft,
  offer,
  listing,
  marketplace,
  refetch,
  className,
  closeOuter = () => {},
}) => {
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
      amount: Number(offer.price),
    },
  });

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);

  const onAcceptOffer = async () => {
    if (offer) {
      toast(`Accepting offer for ${Number(offer.price) / LAMPORTS_PER_SOL}`);
      if (listing) {
        await sdk.offers(marketplace.auctionHouse).accept({ offer, nft, cancel: [listing] });
      } else {
        await sdk.offers(marketplace.auctionHouse).accept({ offer, nft });
      }
    }
  };

  const acceptOfferTx = async ({ amount }: AcceptOfferFormSchema) => {
    if (!publicKey || !signTransaction || !offer || !nft) {
      return;
    }
    try {
      await onAcceptOffer();
      toast.success(`Confirmed accept offer success`);
      await refetch();
      closeOuter();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form className={`flex w-full ${className}`} onSubmit={handleSubmit(acceptOfferTx)}>
      <Button
        className={className}
        htmlType={`submit`}
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        Accept offer
      </Button>
    </form>
  );
};

export default AcceptOfferForm;
