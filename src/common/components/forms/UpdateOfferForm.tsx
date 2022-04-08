import React, { Dispatch, FC, SetStateAction } from 'react';
import { Nft, Marketplace, Listing } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import NFTPreview from '../elements/NFTPreview';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Tag } from '../icons/Tag';
import { DisplaySOL } from '../CurrencyHelpers';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../elements/Button';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';

interface UpdateOfferFormSchema {
  amount: string;
}

interface UpdateOfferFormProps {
  nft?: Nft;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  loading: boolean;
  hasListing: boolean;
  listing: Listing;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
}

const {
  createCancelInstruction,
  createCancelBidReceiptInstruction,
  createWithdrawInstruction,
  createPublicBuyInstruction,
  createPrintBidReceiptInstruction,
  createDepositInstruction,
} = AuctionHouseProgram.instructions;

const schema = zod.object({
  amount: zod
    .string()
    .nonempty({ message: `Must be an amount` })
    .regex(/^[0-9.]*$/, { message: `Must be a number` }),
});

const UpdateOfferForm: FC<UpdateOfferFormProps> = ({
  nft,
  marketplace,
  refetch,
  loading = false,
  hasListing = false,
  listing,
  setOpen,
}) => {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();

  const currOffer = nft?.offers.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasCurrOffer = Boolean(currOffer);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<UpdateOfferFormSchema>({
    resolver: zodResolver(schema),
  });

  const updateOfferTx = async ({ amount }: UpdateOfferFormSchema) => {
    if (!publicKey || !signTransaction || !currOffer || !nft) {
      return;
    }

    // currOffer
    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const tokenMint = new PublicKey(nft.mintAddress);
    const receipt = new PublicKey(currOffer.address);
    const buyerPrice = Number(currOffer.price);
    const tradeState = new PublicKey(currOffer.tradeState);
    const owner = new PublicKey(nft.owner.address);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

    // updated offer
    const updatedPrice = Number(amount) * LAMPORTS_PER_SOL;

    const [escrowPaymentAccount, escrowPaymentBump] =
      await AuctionHouseProgram.findEscrowPaymentAccountAddress(auctionHouse, publicKey);

    const updateOfferTx = new Transaction();

    // cancel old offer
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

    // new offer
    const [buyerTradeState, tradeStateBump] =
      await AuctionHouseProgram.findPublicBidTradeStateAddress(
        publicKey,
        auctionHouse,
        treasuryMint,
        tokenMint,
        updatedPrice,
        1
      );

    const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

    const depositInstructionAccounts = {
      wallet: publicKey,
      paymentAccount: publicKey,
      transferAuthority: publicKey,
      treasuryMint,
      escrowPaymentAccount,
      authority,
      auctionHouse,
      auctionHouseFeeAccount,
    };
    const depositInstructionArgs = {
      escrowPaymentBump,
      amount: updatedPrice,
    };

    const depositInstruction = createDepositInstruction(
      depositInstructionAccounts,
      depositInstructionArgs
    );

    const publicBuyInstruction = createPublicBuyInstruction(
      {
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
      },
      {
        escrowPaymentBump,
        tradeStateBump,
        tokenSize: 1,
        buyerPrice: updatedPrice,
      }
    );

    const [bidReceipt, receiptBump] = await AuctionHouseProgram.findBidReceiptAddress(
      buyerTradeState
    );

    const printBidReceiptInstruction = createPrintBidReceiptInstruction(
      {
        receipt: bidReceipt,
        bookkeeper: publicKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump,
      }
    );

    updateOfferTx
      .add(cancelBidInstruction)
      .add(cancelBidReceiptInstruction)
      .add(withdrawInstruction)
      .add(depositInstruction)
      .add(publicBuyInstruction)
      .add(printBidReceiptInstruction);
    updateOfferTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    updateOfferTx.feePayer = publicKey;

    // TODO: turn into signAll
    let signedUpdateOffer: Transaction | undefined = undefined;

    try {
      signedUpdateOffer = await signTransaction(updateOfferTx);
    } catch (err: any) {
      toast.error(err.message);
      return;
    }

    let signature: string | undefined = undefined;

    try {
      toast('Sending the update offer transaction to Solana.');

      signature = await connection.sendRawTransaction(signedUpdateOffer.serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      await refetch();

      toast.success('Update offer confirmed.');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      {nft && <NFTPreview loading={loading} nft={nft as Nft | any} />}
      <div className={`mt-8 flex items-start justify-between`}>
        {hasListing ? (
          <div className={`flex flex-col justify-start`}>
            <p className={`mb-2 text-left text-base font-medium text-gray-300`}>Price</p>
            <DisplaySOL
              className={`justify-start text-right font-medium`}
              amount={Number(listing?.price)}
            />
          </div>
        ) : (
          <div className={`flex items-center`}>
            <Tag className={`mr-2`} />
            <h3 className={` text-base font-medium text-gray-300`}>Not Listed</h3>
          </div>
        )}
        <div className={`flex flex-col justify-end`}>
          <p className={`mb-2 text-right text-base font-medium text-gray-300`}>Your last offer</p>
          <DisplaySOL
            className={`justify-end text-right font-medium`}
            amount={Number(currOffer?.price)}
          />
        </div>
      </div>
      <div className={`mt-8`}>
        <form className={`grow text-left`} onSubmit={handleSubmit(updateOfferTx)}>
          <div className={`mb-8`}>
            <p className={`mb-2 text-base font-medium`}>New amount</p>
            <div className={`sol-input mb-1 rounded-lg border-2 border-gray-800`}>
              <input
                {...register('amount', { required: true })}
                autoFocus
                className={`input w-full bg-gray-900 py-2 text-white`}
                placeholder="0.00"
              />
            </div>
            <div data-testid={`amount-error-msg`} className={`p-2`}>
              {errors.amount?.message && (
                <p className={`text-sm text-red-500`}>{errors.amount.message}</p>
              )}
            </div>
            <div className={`mt-8 w-full`}>
              <Button
                disabled={loading || isSubmitting}
                loading={loading || isSubmitting}
                htmlType={`submit`}
                block
                className={`w-full`}
              >
                Update offer
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOfferForm;
