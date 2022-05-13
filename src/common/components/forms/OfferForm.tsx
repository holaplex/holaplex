import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
// import { Nft, Marketplace } from '@/types/types';
import { Nft, Marketplace } from '@holaplex/marketplace-js-sdk';
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
import { initMarketplaceSDK } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

const { createPublicBuyInstruction, createPrintBidReceiptInstruction, createDepositInstruction } =
  AuctionHouseProgram.instructions;

interface OfferFormSchema {
  amount: string;
}

export type None = {};

interface OfferFormProps {
  nft?: Nft | null;
  marketplace: Marketplace;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
  reroute?: boolean;
}

const OfferForm: FC<OfferFormProps> = ({ nft, marketplace, refetch, reroute = true }) => {
  const [loading, setLoading] = useState(false);

  console.log('offer form', {
    nft,
    marketplace,
  });

  const schema = zod.object({
    amount: zod
      .string()
      .nonempty({ message: `Must enter an amount` })
      .regex(/^[0-9.]*$/, { message: `Must be a number` }),
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<OfferFormSchema>({
    resolver: zodResolver(schema),
  });

  const { publicKey, signTransaction } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const router = useRouter();

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { track, trackNFTEvent } = useAnalytics();
  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const onOffer = async (amount: number) => {
    console.log('onOffer', {
      myPubkey: publicKey?.toBase58(),
      nft,
      amount,
      marketplace,
    });
    if (nft) {
      await sdk.offers(marketplace.auctionHouse).make({ amount, nft });
    }
  };

  const makeOfferTx = async ({ amount }: OfferFormSchema) => {
    if (!publicKey || !signTransaction || !nft) {
      return;
    }

    const offerAmount = Number(amount);

    const newActions: Action[] = [
      {
        name: `Making offer of ${amount} SOL for ${nft.name}...`,
        id: `makeOffer`,
        action: onOffer,
        param: offerAmount,
      },
    ];

    trackNFTEvent('NFT Offer Made Init', offerAmount, nft);

    try {
      await runActions(newActions, {
        onActionSuccess: async () => {
          await refetch();
          toast.success(`Confirmed offer success`);
          trackNFTEvent('NFT Offer Made Success', offerAmount, nft);
        },
        onComplete: async () => {
          await refetch();
        },
        onActionFailure: async () => {
          await refetch();
        },
      });
    } catch (err: any) {
    } finally {
      if (reroute === true) router.push(`/nfts/${nft.address}`);
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
            disabled={loading || isSubmitting || hasActionPending}
            loading={loading || isSubmitting || hasActionPending}
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
