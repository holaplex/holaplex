import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.less';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import styled from 'styled-components';
import { Layout } from 'antd';
import { isNil } from 'ramda';
import Loading from '@/components/elements/Loading';
import { WalletProvider } from '@/modules/wallet';
import { StorefrontProvider } from '@/modules/storefront';
import { AppHeader } from '@/common/components/elements/AppHeader';
import {
  AnalyticsProvider,
  OLD_GOOGLE_ANALYTICS_ID,
  GA4_ID,
} from '@/modules/ganalytics/AnalyticsProvider';
import MintModal from '@/common/components/elements/MintModal';

const { Content } = Layout;

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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showMintModal, setShowMintModal] = useState(false);

  const track = (category: string, action: string) => {
    if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('event', action, {
      event_category: category,
      send_to: [OLD_GOOGLE_ANALYTICS_ID, GA4_ID],
    });
  };

  const onRouteChanged = (path: string) => {
    if (isNil(OLD_GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('config', OLD_GOOGLE_ANALYTICS_ID, { page_path: path });
  };

  useEffect(() => {
    if (!process.browser || !OLD_GOOGLE_ANALYTICS_ID) {
      return;
    }

    router.events.on('routeChangeComplete', onRouteChanged);

    return () => {
      router.events.off('routeChangeComplete', onRouteChanged);
    };
  }, [router.events]);

  useEffect(() => {
    if (router.query.action === 'mint') {
      setShowMintModal(true);
    }
  }, [router.query.action, setShowMintModal]);

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
      <ToastContainer autoClose={15000} />
      <WalletProvider>
        {({ verifying, wallet }) => (
          <StorefrontProvider wallet={wallet}>
            {({ searching }) => {
              return (
                <AnalyticsProvider>
                  <AppLayout>
                    <AppHeader setShowMintModal={setShowMintModal} wallet={wallet} />
                    <AppContent>
                      {showMintModal && wallet && (
                        <MintModal
                          wallet={wallet}
                          show={showMintModal}
                          onClose={() => setShowMintModal(false)}
                        />
                      )}
                      <Loading loading={verifying || searching}>
                        <ContentWrapper>
                          <Component {...pageProps} track={track} />
                        </ContentWrapper>
                      </Loading>
                    </AppContent>
                  </AppLayout>
                </AnalyticsProvider>
              );
            }}
          </StorefrontProvider>
        )}
      </WalletProvider>
    </>
  );
}

export default MyApp;
