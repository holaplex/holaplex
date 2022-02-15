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
import customData from '../customData';

const { Content } = Layout;

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

  return (
    <>
      <Head>
        <title>{customData.appName}</title>
      </Head>
      <ToastContainer autoClose={15000} />
      <WalletProvider>
        {({ verifying, wallet }) => (
          <StorefrontProvider wallet={wallet}>
            {({ searching }) => {
              return (
                <AppLayout>
                  <AppHeader />
                  <AppContent>
                    <Loading loading={verifying || searching}>
                      <>
                        <Component {...pageProps} />
                        <AppFooter justify="center">
                          <SocialLinks />
                        </AppFooter>
                      </>
                    </Loading>
                  </AppContent>
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
