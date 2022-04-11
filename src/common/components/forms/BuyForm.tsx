import React, { FC } from 'react';
import { Nft, Marketplace, Listing } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { toast } from 'react-toastify';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { concat } from 'ramda';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';

const {
  createPublicBuyInstruction,
  createPrintBidReceiptInstruction,
  createExecuteSaleInstruction,
  createPrintPurchaseReceiptInstruction,
} = AuctionHouseProgram.instructions;

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
  const { connection } = useConnection();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: Number(listing.price),
    },
  });

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const buyTx = async ({ amount }: BuyFormSchema) => {
    if (!publicKey || !signTransaction) {
      return;
    }

    if (!listing || isOwner || !nft || !marketplace) {
      return;
    }

    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const seller = new PublicKey(listing.seller);
    const tokenMint = new PublicKey(nft.mintAddress);
    const auctionHouseTreasury = new PublicKey(marketplace.auctionHouse.auctionHouseTreasury);
    const listingReceipt = new PublicKey(listing.address);
    const sellerPaymentReceiptAccount = new PublicKey(listing.seller);
    const sellerTradeState = new PublicKey(listing.tradeState);
    const buyerPrice = Number(listing.price);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

    const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(auctionHouse, publicKey);

    const [buyerTradeState, tradeStateBump] =
      await AuctionHouseProgram.findPublicBidTradeStateAddress(
        publicKey,
        auctionHouse,
        treasuryMint,
        tokenMint,
        buyerPrice,
        1
      );
    const [freeTradeState, freeTradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      seller,
      auctionHouse,
      tokenAccount,
      treasuryMint,
      tokenMint,
      0,
      1
    );
    const [programAsSigner, programAsSignerBump] =
      await AuctionHouseProgram.findAuctionHouseProgramAsSignerAddress();
    const [buyerReceiptTokenAccount] = await AuctionHouseProgram.findAssociatedTokenAccountAddress(
      tokenMint,
      publicKey
    );

    const [bidReceipt, bidReceiptBump] = await AuctionHouseProgram.findBidReceiptAddress(
      buyerTradeState
    );
    const [purchaseReceipt, purchaseReceiptBump] =
      await AuctionHouseProgram.findPurchaseReceiptAddress(sellerTradeState, buyerTradeState);

    const publicBuyInstructionAccounts = {
      wallet: publicKey,
      paymentAccount: publicKey,
      transferAuthority: publicKey,
      treasuryMint,
      tokenAccount,
      metadata,
      escrowPaymentAccount,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
      buyerTradeState,
    };
    const publicBuyInstructionArgs = {
      tradeStateBump,
      escrowPaymentBump,
      buyerPrice,
      tokenSize: 1,
    };

    const executeSaleInstructionAccounts = {
      buyer: publicKey,
      seller,
      tokenAccount,
      tokenMint,
      metadata,
      treasuryMint,
      escrowPaymentAccount,
      sellerPaymentReceiptAccount,
      buyerReceiptTokenAccount,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
      auctionHouseTreasury,
      buyerTradeState,
      sellerTradeState,
      freeTradeState,
      programAsSigner,
    };

    const executeSaleInstructionArgs = {
      escrowPaymentBump,
      freeTradeStateBump,
      programAsSignerBump,
      buyerPrice,
      tokenSize: 1,
    };

    const printBidReceiptAccounts = {
      bookkeeper: publicKey,
      receipt: bidReceipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };
    const printBidReceiptArgs = {
      receiptBump: bidReceiptBump,
    };

    const printPurchaseReceiptAccounts = {
      bookkeeper: publicKey,
      purchaseReceipt,
      bidReceipt,
      listingReceipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };
    const printPurchaseReceiptArgs = {
      purchaseReceiptBump,
    };

    const publicBuyInstruction = createPublicBuyInstruction(
      publicBuyInstructionAccounts,
      publicBuyInstructionArgs
    );
    const printBidReceiptInstruction = createPrintBidReceiptInstruction(
      printBidReceiptAccounts,
      printBidReceiptArgs
    );
    const executeSaleInstruction = createExecuteSaleInstruction(
      executeSaleInstructionAccounts,
      executeSaleInstructionArgs
    );
    const printPurchaseReceiptInstruction = createPrintPurchaseReceiptInstruction(
      printPurchaseReceiptAccounts,
      printPurchaseReceiptArgs
    );

    const txt = new Transaction();

    txt
      .add(publicBuyInstruction)
      .add(printBidReceiptInstruction)
      .add(
        new TransactionInstruction({
          programId: AuctionHouseProgram.PUBKEY,
          data: executeSaleInstruction.data,
          keys: concat(
            executeSaleInstruction.keys,
            nft?.creators.map((creator) => ({
              pubkey: new PublicKey(creator.address),
              isSigner: false,
              isWritable: true,
            }))
          ),
        })
      )
      .add(printPurchaseReceiptInstruction);

    txt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    txt.feePayer = publicKey;

    let signed: Transaction | undefined = undefined;

    try {
      signed = await signTransaction(txt);
    } catch (e: any) {
      toast.error(e.message);
      return;
    }

    let signature: string | undefined = undefined;

    try {
      toast('Sending the transaction to Solana.');

      signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      await refetch();

      toast.success('The transaction was confirmed.');
    } catch (e: any) {
      toast.error(e.message);
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
