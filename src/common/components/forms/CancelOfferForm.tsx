import React, { Dispatch, FC, SetStateAction, useContext, useMemo, useState } from 'react';
import Button from '../elements/Button';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, Marketplace, Offer } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

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

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { trackNFTEvent } = useAnalytics();
  const onCancelOffer = async () => {
    if (offer && nft) {
      toast(`Canceling current offer of ${Number(offer.price) / LAMPORTS_PER_SOL}`);
      await sdk.offers(marketplace.auctionHouse).cancel({ nft, offer, amount: 1 });
    }
  };

  const cancelOfferTx = async () => {
    if (!publicKey || !signTransaction || !offer || !nft) {
      return;
    }

    const offerAmount = Number(offer.price) / LAMPORTS_PER_SOL;

    const newActions: Action[] = [
      {
        name: `Canceling offer for ${Number(offer.price) / LAMPORTS_PER_SOL} SOL...`,
        id: `cancelOffer`,
        action: onCancelOffer,
        param: undefined,
      },
    ];

    trackNFTEvent('NFT Offer Cancelled Init', offerAmount, nft);

    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed cancel offer success`);
        trackNFTEvent('NFT Offer Cancelled Success', offerAmount, nft);
      },
      onActionFailure: async (err) => {
        toast.error(err.message);
        await refetch();
      },
      onComplete: async () => {
        refetch();
        setOpen(false);
      },
    });
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
            loading={isSubmitting || hasActionPending}
            disabled={isSubmitting || hasActionPending}
            htmlType={`submit`}
            secondary
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
