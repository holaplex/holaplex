import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import styled from 'styled-components';
import { Layout, Col, Row } from 'antd';
import { isNil } from 'ramda';
import Loading from '@/components/elements/Loading';
import { WalletProvider } from '@/modules/wallet';
import { StorefrontProvider } from '@/modules/storefront';
import SocialLinks from '@/components/elements/SocialLinks';
import { AppHeader } from '@/common/components/elements/AppHeader';
import { AnalyticsProvider } from '@/modules/ganalytics/AnalyticsProvider';

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const { Header, Content } = Layout;

const AppContent = styled(Content)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AppFooter = styled(Row)`
  padding: 60px 50px 30px;
`;

const AppLayout = styled(Layout)`
  overflow-y: auto;
`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const track = (category: string, action: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return;
    }

    window.gtag('event', action, {
      event_category: category,
      send_to: [GOOGLE_ANALYTICS_ID, 'G-HLNC4C2YKN'],
    });
  };

  const onRouteChanged = (path: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return;
    }
    // keeping this for now to power old GA endpoint. The new one tracks pageviews automatically
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
                <AnalyticsProvider>
                  <AppLayout>
                    <AppHeader />
                    <AppContent>
                      <Loading loading={verifying || searching}>
                        <>
                          <Component {...pageProps} track={track} />
                          <AppFooter justify="center">
                            <Col span={24}>
                              <Row>
                                <Col xs={24} md={8}>
                                  <a href="mailto:hola@holaplex.com">hola@holaplex.com</a>
                                </Col>
                                <Col xs={0} md={8}>
                                  <Row justify="center">
                                    Made with &#10084; on &#160;
                                    <a
                                      href="https://www.metaplex.com"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Metaplex
                                    </a>
                                  </Row>
                                </Col>
                                <Col xs={0} md={8}>
                                  <Row justify="end">
                                    <SocialLinks />
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </AppFooter>
                        </>
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
