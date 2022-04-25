import React, { Dispatch, FC, SetStateAction, useContext, useMemo, useState } from 'react';
import { initMarketplaceSDK, Nft, Marketplace, Listing } from '@holaplex/marketplace-js-sdk';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';

interface CancelSellFormProps {
  listing: Listing;
  nft: Nft;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
  updateListing: () => void;
}

const CancelSellForm: FC<CancelSellFormProps> = ({
  listing,
  nft,
  marketplace,
  refetch,
  setOpen,
  updateListing,
}) => {
  const [loading, setLoading] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const onCancelListing = async () => {
    if (listing && isOwner && nft) {
      toast(`Canceling listing for ${nft.name}`);
      await sdk.listings(marketplace.auctionHouse).cancel({ listing, nft });
    }
  };

  const cancelListingTx = async () => {
    if (!listing || !isOwner || !nft || !publicKey || !signTransaction) {
      return;
    }

    const newActions: Action[] = [
      {
        name: `Canceling listing for ${nft.name}...`,
        id: `cancelListing`,
        action: onCancelListing,
        param: undefined,
      },
    ];

    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed cancel listing success`);
      },
      onComplete: async () => {
        await refetch();
        setOpen(false);
      },
      onActionFailure: async (err) => {
        await refetch();
      },
    });
  };

  return (
    <div className={`mt-8`}>
      <p className={`text-center`}>Are you sure you want to cancel this listing?</p>
      <div className={`mt-6 grid grid-cols-2 items-center justify-between gap-4`}>
        <form onSubmit={handleSubmit(cancelListingTx)}>
          <Button
            className={`w-full`}
            loading={isSubmitting || hasActionPending}
            disabled={isSubmitting || hasActionPending}
            secondary
            htmlType={`submit`}
          >
            Cancel listing
          </Button>
        </form>
        <div>
          <Button
            className={`w-full`}
            disabled={isSubmitting || hasActionPending}
            onClick={updateListing}
          >
            Update price
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelSellForm;
