import React, { useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.less';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import styled from 'styled-components';
import { Layout } from 'antd';
import { isNil } from 'ramda';
import { WalletProviderDeprecated } from '@/modules/wallet';
import { StorefrontProvider } from '@/modules/storefront';
import { AppHeader } from '@/common/components/elements/AppHeader';
import { Close } from '@/common/components/icons/Close';
import {
  AnalyticsProvider,
  OLD_GOOGLE_ANALYTICS_ID,
  GA4_ID,
} from '@/common/context/AnalyticsProvider';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider as WalletProviderSolana,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ApolloProvider } from '@apollo/client';

import { QueryClient, QueryClientProvider } from 'react-query';

import '@solana/wallet-adapter-react-ui/styles.css';
import { MarketplaceProvider } from '@/modules/marketplace';
import '@fontsource/material-icons';
import { useApollo } from 'src/graphql/apollo';

const { Content } = Layout;

const getSolanaNetwork = () => {
  return (process.env.NEXT_PUBLIC_SOLANA_ENDPOINT ?? '').toLowerCase().includes('devnet')
    ? WalletAdapterNetwork.Devnet
    : WalletAdapterNetwork.Mainnet;
};

const track = (category: string, action: string) => {
  if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    send_to: [OLD_GOOGLE_ANALYTICS_ID, GA4_ID],
  });
};

const HolaplexApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const onRouteChanged = (path: string) => {
    if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('config', OLD_GOOGLE_ANALYTICS_ID, { page_path: path });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' || !OLD_GOOGLE_ANALYTICS_ID) {
      return;
    }
    router.events.on('routeChangeComplete', onRouteChanged);
    return () => {
      router.events.off('routeChangeComplete', onRouteChanged);
    };
  }, [router.events]);

  const network = getSolanaNetwork();
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT!;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter({ params: { network } }),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const queryClient = useMemo(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    []
  );

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <title>Tools built by creators, for creators, owned by creators | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="Discover, explore, and collect NFTs from incredible creators on Solana. Tools built by creators, for creators, owned by creators."
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
          position={'bottom-center'}
          className="bottom-4 w-full max-w-full  font-sans text-sm text-white sm:right-4 sm:left-auto sm:w-96 sm:translate-x-0 "
          toastClassName="bg-gray-900 bg-opacity-80 rounded-lg items-center"
          closeButton={() => <Close color="#fff" />}
        />
        <ToastContainer
          autoClose={5000}
          hideProgressBar={true}
          position={'bottom-center'}
          className="bottom-4 w-full max-w-full  font-sans text-sm text-white sm:right-4 sm:left-auto sm:w-96 sm:translate-x-0 "
          toastClassName="bg-gray-900 bg-opacity-80 rounded-lg items-center"
          closeButton={() => <Close color="#fff" />}
        />
        <ApolloProvider client={apolloClient}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProviderSolana wallets={wallets} autoConnect>
              <WalletModalProvider>
                <WalletProviderDeprecated>
                  {({ wallet }) => (
                    <StorefrontProvider wallet={wallet}>
                      {({}) => {
                        return (
                          <MarketplaceProvider wallet={wallet}>
                            {() => (
                              <AnalyticsProvider>
                                <AppLayout>
                                  <div className="w-full items-center justify-center bg-[#005BBB] p-6 text-[#FFD500] sm:flex">
                                    Help the people of Ukraine through SOL donations.
                                    <a
                                      href="https://donate.metaplex.com/"
                                      className="ml-4 inline items-center justify-center underline transition-transform sm:flex sm:h-10 sm:rounded-full sm:bg-[#FFD500] sm:px-6 sm:text-[#005BBB] sm:no-underline sm:hover:scale-[1.02] sm:hover:text-[#005BBB]"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Learn more
                                    </a>
                                  </div>
                                  <AppHeader />
                                  <AppContent>
                                    <ContentWrapper>
                                      <Component {...pageProps} track={track} />
                                    </ContentWrapper>
                                  </AppContent>
                                </AppLayout>
                              </AnalyticsProvider>
                            )}
                          </MarketplaceProvider>
                        );
                      }}
                    </StorefrontProvider>
                  )}
                </WalletProviderDeprecated>
              </WalletModalProvider>
            </WalletProviderSolana>
          </ConnectionProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </>
  );
};

export default HolaplexApp;

const AppContent = styled(Content)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  padding-bottom: 3rem;
`;

const AppLayout = styled(Layout)`
  overflow-y: auto;
`;
