import React, { FC, useContext, useMemo } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { toast } from 'react-toastify';
import { Nft, Offer, Listing, initMarketplaceSDK, AuctionHouse } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

interface AcceptOfferFormProps {
  nft: Nft;
  offer: Offer;
  listing?: Listing;
  marketplace: {auctionHouse: AuctionHouse};
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

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { trackNFTEvent } = useAnalytics();
  const onAcceptOffer = async () => {
    if (offer) {
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

    const newActions: Action[] = [
      {
        name: `Accepting offer...`,
        id: `acceptOffer`,
        action: onAcceptOffer,
        param: undefined,
      },
    ];
    trackNFTEvent('NFT Offer Accepted Init', Number(amount), nft);

    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed accept offer success`);
        trackNFTEvent('NFT Offer Accepted Success', Number(amount), nft);
      },
      onComplete: async () => {
        await refetch();
        closeOuter();
      },
      onActionFailure: async (err) => {
        await refetch();
        toast.error(err.message);
      },
    });
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
