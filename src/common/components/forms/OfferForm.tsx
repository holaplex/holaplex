import React, { FC, useEffect, useState } from 'react';
import { Nft, Marketplace } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';

const { createPublicBuyInstruction, createPrintBidReceiptInstruction, createDepositInstruction } =
  AuctionHouseProgram.instructions;

interface OfferFormSchema {
  amount: string;
}

type None = {};

interface OfferFormProps {
  nft?: Nft | null;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
}

const OfferForm: FC<OfferFormProps> = ({ nft, marketplace, refetch }) => {
  const [loading, setLoading] = useState(false);

  const schema = zod.object({
    amount: zod
      .string()
      .nonempty({ message: `Must enter an amount` })
      .regex(/[0-9]/, { message: `Must be a number` }),
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<OfferFormSchema>({
    resolver: zodResolver(schema),
  });

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const makeOfferTx = async ({ amount }: OfferFormSchema) => {
    if (!publicKey || !signTransaction) {
      return;
    }
    if (!nft) {
      return;
    }

    const buyerPrice = Number(amount) * LAMPORTS_PER_SOL;
    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const tokenMint = new PublicKey(nft.mintAddress);
    const tokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

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

    const [metadata] = await MetadataProgram.findMetadataAccount(tokenMint);

    const txt = new Transaction();

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
      amount: buyerPrice,
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
        buyerPrice,
      }
    );

    const [receipt, receiptBump] = await AuctionHouseProgram.findBidReceiptAddress(buyerTradeState);

    const printBidReceiptInstruction = createPrintBidReceiptInstruction(
      {
        receipt,
        bookkeeper: publicKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump,
      }
    );

    txt.add(depositInstruction).add(publicBuyInstruction).add(printBidReceiptInstruction);

    txt.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    txt.feePayer = publicKey;

    let signed: Transaction | undefined = undefined;

    try {
      signed = await signTransaction(txt);
    } catch (err: any) {
      toast.error(err.message);
      return;
    }

    let signature: string | undefined = undefined;

    try {
      toast('Sending the transaction to Solana.');
      setLoading(true);

      signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      await refetch();

      toast.success('The transaction was confirmed.');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      router.push(`/nfts/${nft.address}`);
    }
  };

  useEffect(() => {
    if (!nft || !publicKey) {
      return;
    }

    if (nft.owner.address === publicKey.toBase58()) {
      router.push(`/nfts/${nft.address}`);
      return;
    }
  }, [publicKey, nft, router.push, router]);

  return (
    <form className={`grow text-left`} onSubmit={handleSubmit(makeOfferTx)}>
      <div className={`mb-6`}>
        <p className={`mb-2 text-base font-medium`}>Amount</p>
        <div className={`sol-input mb-1 rounded-lg border-2 border-gray-800`}>
          <input
            {...register('amount', { required: true })}
            autoFocus
            className={`input w-full bg-gray-900 py-2 text-white`}
            placeholder="Price in SOL"
          />
        </div>
        <div data-testid={`amount-error-msg`} className={`p-2`}>
          {errors.amount?.message && (
            <p className={`text-sm text-red-500`}>{errors.amount.message}</p>
          )}
        </div>
        <div className={`w-full`}>
          <Button
            disabled={loading}
            loading={loading}
            htmlType={`submit`}
            block
            className={`w-full`}
          >
            Make offer
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OfferForm;
