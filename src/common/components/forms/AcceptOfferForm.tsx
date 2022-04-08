import React, { FC } from 'react';
import { Nft, Marketplace, Offer, Listing } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { concat } from 'ramda';
import { toast } from 'react-toastify';

const {
  createSellInstruction,
  createPrintListingReceiptInstruction,
  createExecuteSaleInstruction,
  createPrintPurchaseReceiptInstruction,
  createCancelInstruction,
  createCancelListingReceiptInstruction,
} = AuctionHouseProgram.instructions;

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
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
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

  const acceptOfferTx = async ({ amount }: AcceptOfferFormSchema) => {
    if (!publicKey || !signTransaction || !offer || !nft || !signAllTransactions) {
      return;
    }

    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const tokenMint = new PublicKey(nft.mintAddress);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const auctionHouseTreasury = new PublicKey(marketplace.auctionHouse.auctionHouseTreasury);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);
    const bidReceipt = new PublicKey(offer.address);
    const buyerPubkey = new PublicKey(offer.buyer);

    const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

    const [sellerTradeState, sellerTradeStateBump] =
      await AuctionHouseProgram.findTradeStateAddress(
        publicKey,
        auctionHouse,
        tokenAccount,
        treasuryMint,
        tokenMint,
        Number(offer.price),
        1
      );

    const [buyerTradeState] = await AuctionHouseProgram.findPublicBidTradeStateAddress(
      buyerPubkey,
      auctionHouse,
      treasuryMint,
      tokenMint,
      Number(offer.price),
      1
    );

    const [purchaseReceipt, purchaseReceiptBump] =
      await AuctionHouseProgram.findPurchaseReceiptAddress(sellerTradeState, buyerTradeState);

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(auctionHouse, buyerPubkey);

    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();

    const [freeTradeState, freeTradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );

    const [buyerReceiptTokenAccount] = await AuctionHouseProgram.findAssociatedTokenAccountAddress(
      tokenMint,
      buyerPubkey
    );

    const [listingReceipt, listingReceiptBump] =
      await AuctionHouseProgram.findListingReceiptAddress(sellerTradeState);

    const sellInstructionAccounts = {
      wallet: publicKey,
      tokenAccount,
      metadata,
      authority,
      auctionHouse: auctionHouse,
      auctionHouseFeeAccount: auctionHouseFeeAccount,
      sellerTradeState: sellerTradeState,
      freeSellerTradeState: freeTradeState,
      programAsSigner: programAsSigner,
    };

    const sellInstructionArgs = {
      tradeStateBump: sellerTradeStateBump,
      freeTradeStateBump: freeTradeStateBump,
      programAsSignerBump: programAsSignerBump,
      buyerPrice: offer.price,
      tokenSize: 1,
    };

    const printListingReceiptInstructionAccounts = {
      receipt: listingReceipt,
      bookkeeper: publicKey,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    const printListingReceiptInstructionArgs = {
      receiptBump: listingReceiptBump,
    };

    const executeSaleInstructionAccounts = {
      buyer: buyerPubkey,
      seller: publicKey,
      auctionHouse,
      tokenAccount,
      tokenMint,
      treasuryMint,
      metadata,
      authority,
      sellerTradeState,
      buyerTradeState,
      freeTradeState,
      sellerPaymentReceiptAccount: publicKey,
      escrowPaymentAccount,
      buyerReceiptTokenAccount,
      auctionHouseFeeAccount,
      auctionHouseTreasury,
      programAsSigner,
    };
    const executeSaleInstructionArgs = {
      escrowPaymentBump,
      freeTradeStateBump,
      programAsSignerBump,
      buyerPrice: offer.price,
      tokenSize: 1,
    };
    const executePrintPurchaseReceiptInstructionAccounts = {
      purchaseReceipt,
      listingReceipt,
      bidReceipt,
      bookkeeper: publicKey,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    const executePrintPurchaseReceiptInstructionArgs = {
      purchaseReceiptBump: purchaseReceiptBump,
    };

    const createListingInstruction = createSellInstruction(
      sellInstructionAccounts,
      sellInstructionArgs
    );
    const createPrintListingInstruction = createPrintListingReceiptInstruction(
      printListingReceiptInstructionAccounts,
      printListingReceiptInstructionArgs
    );
    const executeSaleInstruction = createExecuteSaleInstruction(
      executeSaleInstructionAccounts,
      executeSaleInstructionArgs
    );
    const executePrintPurchaseReceiptInstruction = createPrintPurchaseReceiptInstruction(
      executePrintPurchaseReceiptInstructionAccounts,
      executePrintPurchaseReceiptInstructionArgs
    );

    const acceptOfferTxt = new Transaction();
    const cancelListingTxt = new Transaction();

    acceptOfferTxt
      .add(createListingInstruction)
      .add(createPrintListingInstruction)
      .add(
        new TransactionInstruction({
          programId: AuctionHouseProgram.PUBKEY,
          data: executeSaleInstruction.data,
          keys: concat(
            executeSaleInstruction.keys,
            nft.creators.map((creator) => ({
              pubkey: new PublicKey(creator.address),
              isSigner: false,
              isWritable: true,
            }))
          ),
        })
      )
      .add(executePrintPurchaseReceiptInstruction);

    if (listing) {
      const cancelInstructionAccounts = {
        wallet: publicKey,
        tokenAccount,
        tokenMint,
        authority,
        auctionHouse,
        auctionHouseFeeAccount,
        tradeState: new PublicKey(listing.tradeState),
      };
      const cancelListingInstructionArgs = {
        buyerPrice: listing.price,
        tokenSize: 1,
      };

      const cancelListingReceiptAccounts = {
        receipt: new PublicKey(listing.address),
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      };

      const cancelListingInstruction = createCancelInstruction(
        cancelInstructionAccounts,
        cancelListingInstructionArgs
      );

      const cancelListingReceiptInstruction = createCancelListingReceiptInstruction(
        cancelListingReceiptAccounts
      );

      cancelListingTxt.add(cancelListingInstruction).add(cancelListingReceiptInstruction);
    }

    acceptOfferTxt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    acceptOfferTxt.feePayer = publicKey;

    cancelListingTxt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    cancelListingTxt.feePayer = publicKey;

    let signed: Transaction[] | undefined = undefined;

    try {
      signed = await signAllTransactions([acceptOfferTxt, cancelListingTxt]);
    } catch (e: any) {
      toast.error(e.message);
      return;
    }

    let signature: string | undefined = undefined;

    try {
      toast('Sending accept offer transaction to Solana.');

      signature = await connection.sendRawTransaction(signed[0].serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      toast.success('Accept offer was confirmed.');

      toast('Sending cancel listing transaction to Solana.');

      signature = await connection.sendRawTransaction(signed[1].serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      await refetch();
      closeOuter();

      toast.success('Confirmed accept offer.');
    } catch (e: any) {
      toast.error(e.message);
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
