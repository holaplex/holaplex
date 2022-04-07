import React, { Dispatch, FC, SetStateAction } from 'react';
import { Nft, Marketplace, Listing, Offer } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import NFTPreview from '../elements/NFTPreview';
import { PriceDisplay } from '../CurrencyHelpers';
import Button from '../elements/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';
import { FeeItem } from './SellForm';

const {
  createCancelListingReceiptInstruction,
  createCancelInstruction,
  createSellInstruction,
  createPrintListingReceiptInstruction,
} = AuctionHouseProgram.instructions;

interface UpdateSellFormProps {
  nft: Nft;
  marketplace: Marketplace;
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
  const { publicKey, signTransaction } = useWallet();
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
  const currPrice = String(Number(listing.price) / LAMPORTS_PER_SOL);

  const listPrice = Number(watch('amount')) * LAMPORTS_PER_SOL;

  const royalties = (listPrice * nft?.sellerFeeBasisPoints) / 10000;
  const auctionHouseFee = (listPrice * marketplace.auctionHouse.sellerFeeBasisPoints) / 10000;

  const updateSellTx = async ({ amount }: UpdateSellFormSchema) => {
    if (!listing || !amount || !nft || !signTransaction || !publicKey) {
      return;
    }

    // cancel listing
    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const tokenMint = new PublicKey(nft.mintAddress);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const receipt = new PublicKey(listing.address);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);
    const buyerPrice = Number(listing.price);

    const [tradeState] = await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      buyerPrice,
      1
    );

    const cancelInstructionAccounts = {
      wallet: publicKey,
      tokenAccount,
      tokenMint,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
      tradeState,
    };
    const cancelInstructionArgs = {
      buyerPrice,
      tokenSize: 1,
    };

    const cancelListingReceiptAccounts = {
      receipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    const cancelInstruction = createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    );
    const cancelListingReceiptInstruction = createCancelListingReceiptInstruction(
      cancelListingReceiptAccounts
    );

    const cancelTxt = new Transaction();

    cancelTxt.add(cancelInstruction).add(cancelListingReceiptInstruction);

    cancelTxt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    cancelTxt.feePayer = publicKey;

    // update listing
    const updatedPrice = Number(amount) * LAMPORTS_PER_SOL;
    const associatedTokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

    const [sellerTradeState, tradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      associatedTokenAccount,
      treasuryMint,
      tokenMint,
      updatedPrice,
      1
    );

    const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const [freeTradeState, freeTradeBump] = await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      associatedTokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );

    const updateTxt = new Transaction();

    const sellInstructionArgs = {
      tradeStateBump,
      freeTradeStateBump: freeTradeBump,
      programAsSignerBump: programAsSignerBump,
      buyerPrice: updatedPrice,
      tokenSize: 1,
    };

    const sellInstructionAccounts = {
      wallet: publicKey,
      tokenAccount: associatedTokenAccount,
      metadata: metadata,
      authority: authority,
      auctionHouse: auctionHouse,
      auctionHouseFeeAccount: auctionHouseFeeAccount,
      sellerTradeState: sellerTradeState,
      freeSellerTradeState: freeTradeState,
      programAsSigner: programAsSigner,
    };

    const sellInstruction = createSellInstruction(sellInstructionAccounts, sellInstructionArgs);

    const [listReceipt, receiptBump] = await AuctionHouseProgram.findListingReceiptAddress(
      sellerTradeState
    );

    const printListingReceiptInstruction = createPrintListingReceiptInstruction(
      {
        receipt: listReceipt,
        bookkeeper: publicKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump,
      }
    );

    updateTxt.add(sellInstruction).add(printListingReceiptInstruction);

    updateTxt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    updateTxt.feePayer = publicKey;

    // TODO: turn into sign all
    let signedCancelListing: Transaction | undefined = undefined;
    let signedUpdateListing: Transaction | undefined = undefined;

    try {
      signedCancelListing = await signTransaction(cancelTxt);
      signedUpdateListing = await signTransaction(updateTxt);
    } catch (err: any) {
      toast.error(err.message);
      return;
    }

    let signature: string | undefined = undefined;
    try {
      toast('Sending the cancel listing transaction to Solana.');

      signature = await connection.sendRawTransaction(signedCancelListing.serialize());

      await connection.confirmTransaction(signature, `confirmed`);

      toast.success(`Cancel listing confirmed`);

      toast(`Sending update listing transaction to Solana`);

      signature = await connection.sendRawTransaction(signedUpdateListing.serialize());

      await connection.confirmTransaction(signature, `confirmed`);

      await refetch();

      toast.success('Update listing confirmed.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      {nft && <NFTPreview nft={nft as Nft | any} loading={false} />}
      {/* if has */}
      {hasOffer && (
        <div className={`mt-8 flex items-center justify-between`}>
          <PriceDisplay price={Number(offer.price)} title={`Highest offer`} />
          <Button htmlType={`button`}>Accept Offer</Button>
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
                sellerFeeBasisPoints={nft?.sellerFeeBasisPoints}
                amount={royalties}
              />
              <FeeItem
                title={`Transaction fees`}
                sellerFeeBasisPoints={marketplace.auctionHouse.sellerFeeBasisPoints}
                amount={auctionHouseFee}
              />

              <div className={`mt-5 border-t border-gray-700 pt-3`}>
                <FeeItem
                  result={true}
                  title={`You will receive`}
                  sellerFeeBasisPoints={
                    10000 -
                    nft?.sellerFeeBasisPoints -
                    marketplace.auctionHouse.sellerFeeBasisPoints
                  }
                  amount={listPrice - royalties - auctionHouseFee}
                />
              </div>
            </ul>
            <div className={`mt-8 w-full`}>
              <Button
                disabled={isSubmitting}
                secondary
                loading={isSubmitting}
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
    </div>
  );
};

export default UpdateSellForm;
