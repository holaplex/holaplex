import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import Button from '../elements/Button';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, Marketplace, Offer } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';

interface CancelOfferFormProps {
  offer: Offer;
  nft?: Nft;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
  updateOffer: () => void;
}

const CancelOfferForm: FC<CancelOfferFormProps> = ({
  offer,
  nft,
  marketplace,
  refetch,
  setOpen,
  updateOffer,
}) => {
  const { publicKey, signTransaction } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);

  const onCancelOffer = async () => {
    if (offer && nft) {
      toast(`Canceling current offer of ${Number(offer.price)}`);
      await sdk.offers(marketplace.auctionHouse).cancel({ nft, offer, amount: 1 });
    }
  };

  const cancelOfferTx = async () => {
    if (!publicKey || !signTransaction || !offer || !nft) {
      return;
    }
    try {
      await onCancelOffer();
      toast.success(`Confirmed cancel offer success`);
      await refetch();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className={`mt-8`}>
      <p className={`text-center`}>Are you sure you want to cancel this offer?</p>
      <form
        className={`mt-6 grid grid-cols-2 items-center justify-between gap-4`}
        onSubmit={handleSubmit(cancelOfferTx)}
      >
        <div>
          <Button
            className={`w-full`}
            loading={isSubmitting}
            disabled={isSubmitting}
            htmlType={`submit`}
            secondary
            onClick={cancelOfferTx}
          >
            Cancel offer
          </Button>
        </div>
        <div>
          <Button className={`w-full`} disabled={isSubmitting} onClick={updateOffer}>
            Update offer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CancelOfferForm;
