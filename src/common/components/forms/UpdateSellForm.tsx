import React, { Dispatch, FC, SetStateAction, useContext, useMemo, useRef, useState } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import NFTPreview from '../elements/NFTPreview';
import { PriceDisplay } from '../CurrencyHelpers';
import Button from '../elements/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { FeeItem } from './SellForm';
import AcceptOfferForm from './AcceptOfferForm';
import { initMarketplaceSDK, Nft, Listing, Offer, AuctionHouse } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import Modal from '../elements/Modal';
//@ts-ignore
import * as htmlToImage from 'html-to-image';

import DownloadNFTCard from './DownloadableNFTCard';

interface UpdateSellFormProps {
  nft: Nft;
  marketplace: {auctionHouse: AuctionHouse};
  listing: Listing;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
  offer: Offer;
}

interface UpdateSellFormSchema {
  amount: string;
}

const schema = zod.object({
  amount: zod
    .string()
    .nonempty({ message: `Must be an amount` })
    .regex(/^[0-9.]*$/, { message: `Must be a number` }),
});

const UpdateSellForm: FC<UpdateSellFormProps> = ({
  nft,
  marketplace,
  listing,
  refetch,
  setOpen,
  offer,
}) => {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<UpdateSellFormSchema>({
    resolver: zodResolver(schema),
  });

  const hasOffer = Boolean(offer);
  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());
  const currPrice = String(Number(listing?.price) / LAMPORTS_PER_SOL);

  const listPrice = Number(watch('amount')) * LAMPORTS_PER_SOL;
  const sellerFee = nft?.sellerFeeBasisPoints || 1000;
  const auctionHouseSellerFee = marketplace?.auctionHouse?.sellerFeeBasisPoints || 200;

  const royalties = (listPrice * sellerFee) / 10000;
  const auctionHouseFee = (listPrice * auctionHouseSellerFee) / 10000;

  const [showShare, setShowShare] = useState(false);
  const [updatedPrice, setUpdatePrice] = useState(Number(currPrice));
  const openShareListing = () => {
    setShowShare(true);
  };
  const closeShareListing = () => {
    setShowShare(false);
    setOpen(false);
  };
  const downloadRef = useRef(null);
  const downloadSharableImage = async () => {
    if (window) {
      const data = await htmlToImage.toPng(document.getElementById(`shareNFTCard`) as HTMLElement);
      const link = document.createElement('a');
      link.href = data;
      link.download = `${nft.address}-shared.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { runActions, hasActionPending, clearActions } = useContext(MultiTransactionContext);

  const onCancelListing = async () => {
    if (listing && isOwner && nft) {
      toast(`Canceling listing for ${nft.name}`);
      await sdk.listings(marketplace.auctionHouse).cancel({ nft, listing });
    }
  };

  const onUpdateListing = async ({ amount }: { amount: number }) => {
    if (amount && nft) {
      toast(`Updating current listing to ${amount} SOL`);
      await sdk.listings(marketplace.auctionHouse).post({ amount, nft });
    }
  };

  const updateSellTx = async ({ amount }: UpdateSellFormSchema) => {
    if (!listing || !amount || !nft || !signTransaction || !publicKey || !signAllTransactions) {
      return;
    }

    const numAmount = Number(amount);
    setUpdatePrice(numAmount);
    const newActions: Action[] = [
      {
        name: `Canceling your original listing...`,
        id: `cancelListing`,
        action: onCancelListing,
        param: undefined,
      },
      {
        name: `Creating your updated listing...`,
        id: `updateListing`,
        action: onUpdateListing,
        param: { amount: numAmount },
      },
    ];

    await runActions(newActions, {
      onActionSuccess: async (tx) => {
        console.log(tx);
        await refetch();
        if (tx === `updateListing`) {
          openShareListing();
        }
      },
      onComplete: async () => {
        await refetch();
      },
      onActionFailure: async (err) => {
        await refetch();
        toast.error(err.message);
        // retry transactions
        // retryActions()
      },
    });
  };

  const acceptOffer = () => {
    setOpen(false);
  };

  return (
    <div>
      {nft && <NFTPreview nft={nft as Nft | any} loading={false} />}
      {/* if has */}
      {hasOffer && (
        <div className={`mt-8 flex items-center justify-between`}>
          <PriceDisplay price={Number(offer.price)} title={`Highest offer`} />
          <div>
            <AcceptOfferForm
              nft={nft}
              offer={offer}
              listing={listing}
              marketplace={marketplace}
              refetch={refetch}
              closeOuter={acceptOffer}
            />
          </div>
        </div>
      )}
      <div className={`mt-8`}>
        <form className={`grow text-left`} onSubmit={handleSubmit(updateSellTx)}>
          <div className={`mb-8`}>
            <p className={`mb-2 text-base font-medium`}>New price</p>
            <div className={`sol-input mb-1 rounded-lg border-2 border-gray-800`}>
              <input
                {...register('amount', { required: true })}
                autoFocus
                className={`input w-full bg-gray-900 py-2 text-white`}
                placeholder={currPrice}
              />
            </div>
            <div data-testid={`amount-error-msg`} className={`p-2`}>
              {errors.amount?.message && (
                <p className={`text-sm text-red-500`}>{errors.amount.message}</p>
              )}
            </div>
            <ul className={`mt-6 flex w-full flex-col`}>
              <FeeItem
                title={`Creator royalty`}
                sellerFeeBasisPoints={sellerFee}
                amount={royalties}
              />
              <FeeItem
                title={`Transaction fees`}
                sellerFeeBasisPoints={auctionHouseSellerFee}
                amount={auctionHouseFee}
              />

              <div className={`mt-5 border-t border-gray-700 pt-3`}>
                <FeeItem
                  result={true}
                  title={`You will receive`}
                  sellerFeeBasisPoints={10000 - sellerFee - auctionHouseSellerFee}
                  amount={listPrice - royalties - auctionHouseFee}
                />
              </div>
            </ul>
            <div className={`mt-8 w-full`}>
              <Button
                disabled={isSubmitting || hasActionPending}
                secondary
                loading={isSubmitting || hasActionPending}
                htmlType={`submit`}
                block
                className={`w-full`}
              >
                Update price
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Modal title={`Your listing was updated!`} open={showShare} setOpen={closeShareListing}>
        <div className={`mt-10 mb-16 text-center text-base text-gray-300`}>
          You just updated the price of {nft.name}.<p className={`mb-0`}>Let people know!</p>
        </div>

        <DownloadNFTCard
          listing={listing}
          nft={nft}
          updatedPrice={updatedPrice * LAMPORTS_PER_SOL}
        />
      </Modal>
    </div>
  );
};

export default UpdateSellForm;
