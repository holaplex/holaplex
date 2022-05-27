import React, { Dispatch, FC, SetStateAction, useContext, useMemo } from 'react';
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
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, Listing, AuctionHouse } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '../../context/MultiTransaction';
import { useAnalytics } from '@/common/context/AnalyticsProvider';

interface UpdateOfferFormSchema {
  amount: string;
}

interface UpdateOfferFormProps {
  nft: Nft;
  marketplace: {auctionHouse: AuctionHouse};
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<None>>;
  loading: boolean;
  hasListing: boolean;
  listing: Listing;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: Boolean) => void);
}

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
  const wallet = useWallet();
  const { connection } = useConnection();

  const currOffer = nft?.offers?.find((offer) => offer.buyer === publicKey?.toBase58());
  const hasCurrOffer = Boolean(currOffer);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { runActions, actions, hasActionPending, hasRemainingActions, retryActions } =
    useContext(MultiTransactionContext);
  const { trackNFTEvent } = useAnalytics();
  const onCancelOffer = async () => {
    if (currOffer) {
      toast(`Canceling current offer of ${Number(currOffer.price)}`);
      await sdk.offers(marketplace.auctionHouse).cancel({ nft, offer: currOffer, amount: 1 });
    }
  };

  const onUpdateOffer = async ({ amount }: { amount: number }) => {
    if (amount) {
      toast(`Updating current offer to: ${amount} SOL`);
      await sdk.offers(marketplace.auctionHouse).make({ amount, nft });
    }
  };

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

    const offerAmount = Number(amount);

    const newActions: Action[] = [
      {
        name: `Canceling your original offer...`,
        id: `cancelOffer`,
        action: onCancelOffer,
        param: undefined,
      },
      {
        name: `Creating your updated offer...`,
        id: `updateOffer`,
        action: onUpdateOffer,
        param: { amount: offerAmount },
      },
    ];

    trackNFTEvent('NFT Offer Updated Init', offerAmount, nft);

    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed offer update success`);
        trackNFTEvent('NFT Offer Updated Success', offerAmount, nft);
      },
      onActionFailure: async () => {
        await refetch();
      },
      onComplete: async () => {
        await refetch();
        setOpen(false);
      },
    });
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
                disabled={loading || isSubmitting || hasActionPending}
                loading={loading || isSubmitting || hasActionPending}
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
