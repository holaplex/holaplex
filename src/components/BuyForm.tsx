import React, { FC, useContext, useMemo, useState } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { None } from './OfferForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Button from './Button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { initMarketplaceSDK, Nft, AhListing, AuctionHouse } from '@holaplex/marketplace-js-sdk';
import { Wallet } from '@metaplex/js';
import { Action, MultiTransactionContext } from '@/views/_global/MultiTransaction';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import Modal from './Modal';
import NFTPreview from './NFTPreview';
import { DisplaySOL } from './CurrencyHelpers';
import ReactDom from 'react-dom';
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { useQuery } from 'react-query';
import { verifyTOS } from '@/modules/crossmint';
import { crossmintConfig } from '@/lib/utils';

interface BuyFormProps {
  nft: Nft;
  marketplace?: { auctionHouses?: AuctionHouse[] };
  listing: AhListing;
  className?: string;
  refetch:
    | ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<None>>)
    | (() => void);
  loading: boolean;
  crossmintEnabled?: boolean;
}

interface BuyFormSchema {
  amount: number;
}

enum PAYMENT_OPTION {
  SOLANA,
  ETHEREUM,
  CREDIT_CARD,
}

const BuyForm: FC<BuyFormProps> = ({
  nft,
  marketplace,
  listing,
  refetch,
  loading,
  className,
  crossmintEnabled = true,
}) => {
  const schema = zod.object({
    amount: zod.number(),
  });

  const { publicKey, signTransaction, select: selectWallet } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: Number(listing?.price),
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(PAYMENT_OPTION.SOLANA);

  const { data, isLoading } = useQuery({
    onSuccess: (data) => {},
    onError: (err) => {},
    queryFn: () => verifyTOS(listing.seller),
  });

  const isOwner = Boolean(nft?.owner?.address === publicKey?.toBase58());

  const { runActions, hasActionPending } = useContext(MultiTransactionContext);

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet as Wallet), [connection, wallet]);
  const { trackNFTEvent } = useAnalytics();

  const onBuy = async () => {
    if (listing && listing.auctionHouse && !isOwner && nft) {
      toast(`Buying ${nft.name} for ${Number(listing.price) / LAMPORTS_PER_SOL}`);

      await sdk
        .transaction()
        .add(sdk.escrow(listing.auctionHouse).desposit({ amount: listing.price.toNumber() }))
        .add(
          sdk.offers(listing.auctionHouse).make({
            amount: listing.price.toNumber(),
            nft,
          })
        )
        .add(sdk.listings(listing.auctionHouse).buy({ listing, nft }))
        .send();
    }
  };

  const buyTx = async ({ amount }: BuyFormSchema) => {
    if (!publicKey || !signTransaction) {
      selectWallet(PhantomWalletName);
      return;
    }
    if (!listing || isOwner || !nft || !marketplace) {
      return;
    }

    const newActions: Action[] = [
      {
        name: `Buying ${nft.name}...`,
        id: `buyNFT`,
        action: onBuy,
        param: undefined,
      },
    ];

    trackNFTEvent('NFT Bought Init', Number(amount), nft);
    await runActions(newActions, {
      onActionSuccess: async () => {
        await refetch();
        toast.success(`Confirmed buy success`);
        trackNFTEvent('NFT Bought Success', Number(amount), nft);
      },
      onComplete: async () => {
        await refetch();
      },
      onActionFailure: async (err) => {
        await refetch();
        toast.error(err.message);
      },
    });
  };

  if (isOwner || !nft || !listing || !listing.auctionHouse) {
    return null;
  }

  if (crossmintEnabled) {
    return (
      <div className={`flex w-full ${className}`}>
        <Button
          onClick={() => setShowForm(true)}
          htmlType={`button`}
          disabled={isSubmitting || hasActionPending}
          loading={isSubmitting || hasActionPending}
          className={className}
        >
          Buy now
        </Button>

        {ReactDom.createPortal(
          <Modal open={showForm} setOpen={setShowForm} title={`Select a payment method`}>
            <form onSubmit={handleSubmit(buyTx)}>
              <div className={`flex w-full flex-col justify-start gap-10`}>
                {nft && <NFTPreview loading={loading || isLoading} nft={nft as Nft | any} />}

                <div className={`flex flex-col gap-2`}>
                  <p className={`m-0 text-base font-medium text-gray-300`}>Price</p>
                  <DisplaySOL className={`font-medium`} amount={listing.price.toNumber()} />
                </div>

                <div className={`grid grid-cols-1 gap-4 lg:grid-cols-3`}>
                  <button
                    onClick={() => setSelectedPaymentOption(PAYMENT_OPTION.SOLANA)}
                    className={`flex h-20 items-center justify-center rounded-lg bg-white ${
                      selectedPaymentOption === PAYMENT_OPTION.SOLANA
                        ? `opacity-100`
                        : `opacity-30 transition duration-200 ease-in-out hover:opacity-60`
                    }`}
                    type={`button`}
                  >
                    <img
                      src={`/images/payment-options/solana-payment.png`}
                      alt={`solana-payment`}
                      className={`h-full w-full object-contain p-6 backdrop-opacity-70`}
                    />
                  </button>
                  <button
                    disabled={!data?.data.accepted}
                    onClick={() => {
                      setSelectedPaymentOption(PAYMENT_OPTION.ETHEREUM);
                    }}
                    className={`h-20 rounded-lg bg-white ${
                      selectedPaymentOption === PAYMENT_OPTION.ETHEREUM
                        ? `opacity-100`
                        : `opacity-30 transition duration-200 ease-in-out hover:opacity-60 ${
                            !data?.data.accepted && `cursor-not-allowed`
                          }`
                    }`}
                    type={`button`}
                  >
                    <img
                      src={`/images/payment-options/ethereum-payment.png`}
                      alt={`eth-payment`}
                      className={`h-full w-full object-contain p-2 backdrop-opacity-70`}
                    />
                  </button>
                  <button
                    disabled={!data?.data.accepted}
                    onClick={() => {
                      setSelectedPaymentOption(PAYMENT_OPTION.CREDIT_CARD);
                    }}
                    className={`h-20 rounded-lg bg-white ${
                      selectedPaymentOption === PAYMENT_OPTION.CREDIT_CARD
                        ? `opacity-100 `
                        : `opacity-30 transition duration-200 ease-in-out hover:opacity-60 ${
                            !data?.data.accepted && `cursor-not-allowed`
                          }`
                    }`}
                    type={`button`}
                  >
                    <img
                      src={`/images/payment-options/creditcard-payment.png`}
                      alt={`creditcard-payment`}
                      className={`h-full w-full rounded-lg object-cover backdrop-opacity-70`}
                    />
                  </button>
                </div>
                {selectedPaymentOption === PAYMENT_OPTION.SOLANA ? (
                  <Button
                    htmlType={`submit`}
                    disabled={loading || isSubmitting || hasActionPending}
                    loading={loading || isSubmitting || hasActionPending}
                    className={`w-full`}
                  >
                    Buy with SOL
                  </Button>
                ) : (
                  <>
                    {selectedPaymentOption === PAYMENT_OPTION.ETHEREUM && (
                      <CrossmintPayButton
                        paymentMethod={`ETH`}
                        collectionTitle={nft.name}
                        collectionDescription={nft.description}
                        clientId={
                          crossmintConfig.clientId ||
                          process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID ||
                          ''
                        }
                        collectionPhoto={nft.image}
                        // @ts-ignore
                        mintConfig={{
                          mintHash: nft.mintAddress,
                          buyPrice: String(listing.price.toNumber() / LAMPORTS_PER_SOL),
                          sellerWallet: listing.seller,
                        }}
                        style={{ borderRadius: 999, paddingTop: 8, paddingBottom: 8 }}
                      />
                    )}
                    {selectedPaymentOption === PAYMENT_OPTION.CREDIT_CARD && (
                      <CrossmintPayButton
                        paymentMethod={`fiat`}
                        collectionTitle={nft.name}
                        collectionDescription={nft.description}
                        clientId={
                          crossmintConfig.clientId ||
                          process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID ||
                          ''
                        }
                        collectionPhoto={nft.image}
                        // @ts-ignore
                        mintConfig={{
                          mintHash: nft.mintAddress,
                          buyPrice: String(listing.price.toNumber() / LAMPORTS_PER_SOL),
                          sellerWallet: listing.seller,
                        }}
                        style={{ borderRadius: 999, paddingTop: 8, paddingBottom: 8 }}
                      />
                    )}
                  </>
                )}
                <div className={`flex flex-col gap-2`}>
                  <p className={`m-0 flex justify-center gap-1 text-center text-xs text-gray-300`}>
                    ETH and fiat options provided by{' '}
                    <a href={`https://crossmint.io`} target={`_blank`}>
                      <img src={`/images/payment-options/crossmint.png`} alt={`crossmint`} />
                    </a>
                  </p>
                  {!data?.data.accepted && (
                    <p
                      className={`m-0 text-center text-xs text-red-500`}
                    >{`Seller hasn't enabled ETH & Credit Card payments`}</p>
                  )}
                </div>
              </div>
            </form>
          </Modal>,
          document.getElementsByTagName('body')[0]!
        )}
      </div>
    );
  }

  return (
    <form className={`flex w-full ${className}`} onSubmit={handleSubmit(buyTx)}>
      <Button
        htmlType={`submit`}
        disabled={isSubmitting || hasActionPending}
        loading={isSubmitting || hasActionPending}
        className={className}
      >
        Buy now
      </Button>
    </form>
  );
};

export default BuyForm;
