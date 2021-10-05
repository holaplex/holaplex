import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import styled from 'styled-components';
import { Layout } from 'antd';
import { isNil } from 'ramda';
import Loading from '@/components/elements/Loading';
import { WalletProvider } from '@/modules/wallet';
import { StorefrontProvider } from '@/modules/storefront';
import { Content } from 'antd/lib/layout/layout';
import { AppHeader } from '@/components/elements/AppHeader';

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const AppLayout = styled(Layout)`
  overflow-y: auto;
`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname !== '/bulk-upload';

  const track = (category: string, action: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('event', action, { event_category: category });
  };

  const onRouteChanged = (path: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('config', GOOGLE_ANALYTICS_ID, { page_path: path });
  };

  useEffect(() => {
    if (!process.browser || !GOOGLE_ANALYTICS_ID) {
      return;
    }

    router.events.on('routeChangeComplete', onRouteChanged);

    return () => {
      router.events.off('routeChangeComplete', onRouteChanged);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Holaplex | Design and Host Your Metaplex NFT Storefront</title>
      </Head>
      <ToastContainer autoClose={15000} />
      <WalletProvider>
        {({ verifying, wallet }) => (
          <StorefrontProvider wallet={wallet}>
            {({ searching }) => {
              return (
                <AppLayout>
                  {showHeader && <AppHeader />}
                  <Content>
                    <Loading loading={verifying || searching}>
                      <Component {...pageProps} track={track} />
                    </Loading>
                  </Content>
                </AppLayout>
              );
            }}
          </StorefrontProvider>
        )}
      </WalletProvider>
    </>
  );
}

export default MyApp;
