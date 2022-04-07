import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Offer, Nft, Marketplace } from '@/types/types';
import Button from '../elements/Button';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction } from '@solana/web3.js';
import { toast } from 'react-toastify';

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

const { createCancelInstruction, createCancelBidReceiptInstruction, createWithdrawInstruction } =
  AuctionHouseProgram.instructions;

const CancelOfferForm: FC<CancelOfferFormProps> = ({
  offer,
  nft,
  marketplace,
  refetch,
  setOpen,
  updateOffer,
}) => {
  const [loading, setLoading] = useState(false);

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const cancelOfferTx = async () => {
    if (!publicKey || !signTransaction || !offer || !nft) {
      return;
    }

    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const tokenMint = new PublicKey(nft.mintAddress);
    const receipt = new PublicKey(offer.address);
    const buyerPrice = Number(offer.price);
    const tradeState = new PublicKey(offer.tradeState);
    const owner = new PublicKey(nft.owner.address);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(auctionHouse, publicKey);

    const txt = new Transaction();

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

    const cancelBidReceiptInstructionAccounts = {
      receipt: receipt,
      instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    const cancelBidInstruction = createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    );

    const cancelBidReceiptInstruction = createCancelBidReceiptInstruction(
      cancelBidReceiptInstructionAccounts
    );

    const withdrawInstructionAccounts = {
      receiptAccount: publicKey,
      wallet: publicKey,
      escrowPaymentAccount,
      auctionHouse,
      authority,
      treasuryMint,
      auctionHouseFeeAccount,
    };

    const withdrawInstructionArgs = {
      escrowPaymentBump,
      amount: buyerPrice,
    };

    const withdrawInstruction = createWithdrawInstruction(
      withdrawInstructionAccounts,
      withdrawInstructionArgs
    );

    txt.add(cancelBidInstruction).add(cancelBidReceiptInstruction).add(withdrawInstruction);

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
      setLoading(true);
      toast('Sending the transaction to Solana.');

      signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      await refetch();
      setLoading(false);

      toast.success('The transaction was confirmed.');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className={`mt-8`}>
      <p className={`text-center`}>Are you sure you want to cancel this offer?</p>
      <div className={`mt-6 grid grid-cols-2 items-center justify-between gap-4`}>
        <div>
          <Button
            className={`w-full`}
            loading={loading}
            disabled={loading}
            secondary
            onClick={cancelOfferTx}
          >
            Cancel offer
          </Button>
        </div>
        <div>
          <Button className={`w-full`} disabled={loading} onClick={updateOffer}>
            Update offer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelOfferForm;
