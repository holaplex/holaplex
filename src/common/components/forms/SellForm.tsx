import React, { Dispatch, FC, SetStateAction } from 'react';
import { Nft, Marketplace } from '@/types/types';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { LoadingBox, LoadingContainer } from '../elements/LoadingPlaceholders';
import NFTPreview from '../elements/NFTPreview';
import { DisplaySOL } from '../CurrencyHelpers';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from '../elements/Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AuctionHouseProgram } from '@metaplex-foundation/mpl-auction-house';
import { MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { toast } from 'react-toastify';

const { createSellInstruction, createPrintListingReceiptInstruction } =
  AuctionHouseProgram.instructions;

interface SellFormSchema {
  amount: string;
}

interface SellFormProps {
  nft?: Nft;
  marketplace: Marketplace;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  loading: boolean;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
}

const schema = zod.object({
  amount: zod
    .string()
    .nonempty({ message: `Must be an amount` })
    .regex(/^[0-9.]*$/, { message: `Must be a number` }),
});

const FeeItem = ({
  sellerFeeBasisPoints,
  amount,
  title,
  result = false,
}: {
  result?: boolean;
  title: string;
  sellerFeeBasisPoints: number;
  amount: number;
}) => {
  return (
    <li className={`mb-0 mt-2 flex justify-between `}>
      <p className={`mb-0 text-base ${result ? `text-white` : `text-gray-300`}`}>{title}</p>
      <div className={`mb-0 flex justify-end`}>
        <p className={`mb-0 mr-2 text-base ${result ? `text-white` : `text-gray-300`}`}>
          {sellerFeeBasisPoints / 100}%
        </p>
        <DisplaySOL
          iconVariant={`small`}
          amount={amount}
          className={`text-base font-normal ${result ? `text-white` : `text-gray-300`}`}
        />
      </div>
    </li>
  );
};

const SellForm: FC<SellFormProps> = ({ nft, marketplace, refetch, loading, setOpen }) => {
  const { publicKey, signTransaction } = useWallet();

  const { connection } = useConnection();

  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SellFormSchema>({
    resolver: zodResolver(schema),
  });

  if (!nft || !marketplace) {
    return null;
  }

  const listPrice = Number(watch('amount')) * LAMPORTS_PER_SOL;

  const royalties = (listPrice * nft?.sellerFeeBasisPoints) / 10000;
  const auctionHouseFee = (listPrice * marketplace.auctionHouse.sellerFeeBasisPoints) / 10000;

  const sellTx = async ({ amount }: SellFormSchema) => {
    if (!publicKey || !signTransaction || !nft || !amount) {
      return;
    }

    const buyerPrice = Number(amount) * LAMPORTS_PER_SOL;
    const auctionHouse = new PublicKey(marketplace.auctionHouse.address);
    const authority = new PublicKey(marketplace.auctionHouse.authority);
    const auctionHouseFeeAccount = new PublicKey(marketplace.auctionHouse.auctionHouseFeeAccount);
    const treasuryMint = new PublicKey(marketplace.auctionHouse.treasuryMint);
    const tokenMint = new PublicKey(nft.mintAddress);

    const associatedTokenAccount = new PublicKey(nft.owner.associatedTokenAccountAddress);

    const [sellerTradeState, tradeStateBump] = await AuctionHouseProgram.findTradeStateAddress(
      publicKey,
      auctionHouse,
      associatedTokenAccount,
      treasuryMint,
      tokenMint,
      buyerPrice,
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

    const txt = new Transaction();

    const sellInstructionArgs = {
      tradeStateBump,
      freeTradeStateBump: freeTradeBump,
      programAsSignerBump: programAsSignerBump,
      buyerPrice,
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

    const [receipt, receiptBump] = await AuctionHouseProgram.findListingReceiptAddress(
      sellerTradeState
    );

    const printListingReceiptInstruction = createPrintListingReceiptInstruction(
      {
        receipt,
        bookkeeper: publicKey,
        instruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      {
        receiptBump,
      }
    );

    txt.add(sellInstruction).add(printListingReceiptInstruction);

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
    <div>
      {nft && <NFTPreview loading={loading} nft={nft as Nft | any} />}
      <div className={`mt-8 flex items-start justify-between`}>
        <div className={`flex flex-col justify-start`}>
          <p className={`text-base font-medium text-gray-300`}>Floor price</p>
          <DisplaySOL className={`font-medium`} amount={Number(LAMPORTS_PER_SOL)} />
        </div>
        <div className={`flex flex-col justify-end`}>
          <p className={`text-base font-medium text-gray-300`}>Average sale price</p>
          <div className={`ml-2`}>
            <DisplaySOL className={`font-medium`} amount={Number(LAMPORTS_PER_SOL)} />
          </div>
        </div>
      </div>
      <div className={`mt-8`}>
        <form className={`grow text-left`} onSubmit={handleSubmit(sellTx)}>
          <p className={`mb-2 text-base font-medium`}>Price</p>
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
                  10000 - nft?.sellerFeeBasisPoints - marketplace.auctionHouse.sellerFeeBasisPoints
                }
                amount={listPrice - royalties - auctionHouseFee}
              />
            </div>
          </ul>
          <div className={`mt-12 w-full`}>
            <Button
              disabled={loading || isSubmitting}
              loading={loading || isSubmitting}
              htmlType={`submit`}
              block
              className={`w-full`}
            >
              List NFT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellForm;
