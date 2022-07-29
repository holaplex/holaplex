import React, { Dispatch, FC, SetStateAction, useContext, useMemo } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from './Button';
import { toast } from 'react-toastify';
import {
  Nft,
  Offer,
  AhListing,
  initMarketplaceSDK,
  Marketplace,
} from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '@/views/_global/MultiTransaction';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';

interface AcceptOfferFormProps {
  nft: Nft;
  offer: Offer;
  listing?: AhListing;
  marketplace: Marketplace;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
  className?: string;
  setOpen?: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
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
  setOpen,
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

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { trackNFTEvent } = useAnalytics();

  const onAcceptOffer = async () => {
    if (!offer || !offer.auctionHouse || !nft) {
      return;
    }
    toast('Sending the transaction to Solana.');
    await sdk
      .transaction()
      .add(
        sdk.offers(offer.auctionHouse).accept({
          nft,
          offer,
        })
      )
      .send();
  };

  const onCancelListing = async () => {
    if (!listing || !offer.auctionHouse || !nft) {
      return;
    }

    await sdk.transaction().add(sdk.listings(offer.auctionHouse).cancel({ listing, nft })).send();
  };

  const acceptOfferTx = async ({ amount }: AcceptOfferFormSchema) => {
    if (!publicKey || !signTransaction || !offer || !nft) {
      return;
    }

    let newActions: Action[] = [
      {
        name: `Accepting offer...`,
        id: `acceptOffer`,
        action: onAcceptOffer,
        param: undefined,
      },
    ];
    if (listing) {
      newActions = [
        ...newActions,
        {
          name: 'Cancel previous listing...',
          id: 'cancelListing',
          action: onCancelListing,
          param: undefined,
        },
      ];
    }
    trackNFTEvent('NFT Offer Accepted Init', Number(amount), nft);

    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed accept offer success`);
        trackNFTEvent('NFT Offer Accepted Success', Number(amount), nft);
      },
      onComplete: async () => {
        await refetch();
        if (setOpen) {
          setOpen(false);
        }
      },
      onActionFailure: async (err) => {
        console.log('Accept Offer Failed', err);
        toast.error(err.message);
      },
    });
  };

  return (
    <form
      className={`flex w-full justify-center ${className}`}
      onSubmit={handleSubmit(acceptOfferTx)}
    >
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
