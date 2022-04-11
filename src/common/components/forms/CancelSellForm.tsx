import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Listing, Nft, Marketplace } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction } from '@solana/web3.js';
import { toast } from 'react-toastify';

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

const { createCancelListingReceiptInstruction, createCancelInstruction } =
  AuctionHouseProgram.instructions;

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
  const { connection } = useConnection();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const cancelListingTx = async () => {
    if (!listing || !isOwner || !nft || !publicKey || !signTransaction) {
      return;
    }

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

    const txt = new Transaction();

    txt.add(cancelInstruction).add(cancelListingReceiptInstruction);

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
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className={`mt-8`}>
      <p className={`text-center`}>Are you sure you want to cancel this listing?</p>
      <div className={`mt-6 grid grid-cols-2 items-center justify-between gap-4`}>
        <form onSubmit={handleSubmit(cancelListingTx)}>
          <Button
            className={`w-full`}
            loading={isSubmitting}
            disabled={isSubmitting}
            secondary
            htmlType={`submit`}
          >
            Cancel listing
          </Button>
        </form>
        <div>
          <Button className={`w-full`} disabled={isSubmitting} onClick={updateListing}>
            Update price
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelSellForm;
