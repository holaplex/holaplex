import React, { useCallback, useEffect, useState } from 'react'
import App from 'next/app'
import Head from 'next/head'
import type { AppProps, AppContext } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Link from 'next/link'
import { Layout } from 'antd'
import sv from '@/constants/styles'
import type { GoogleTracker } from '@/modules/ganalytics/types'
import Loading from '@/components/elements/Loading'
import { WalletProvider } from '@/modules/wallet'
import { StorefrontProvider } from '@/modules/storefront'

const { Header, Content } = Layout

const HeaderTitle = styled.a`
  font-size: 24px;
  line-height: 2px;
  font-weight: 900;
  margin-right: auto;
  color: ${sv.colors.buttonText};
  &:hover {
    color: ${sv.colors.buttonText}
  }

`

const AppLayout = styled(Layout)`
  overflow-y: auto;
`

interface MyAppProps extends AppProps {
  googleAnalyticsId?: string;
}

declare global {
  interface Window {
    dataLayer: any;
  }
}

function MyApp({ Component, pageProps, googleAnalyticsId }: MyAppProps) {
  const router = useRouter()

  const gtag = (...args: any[]) => { window.dataLayer.push(args); }
  const track = (...args: any[]) => { gtag('send', 'event', ...args) }

  useEffect(() => {
    if (!process.browser || !googleAnalyticsId) {
      return
    }
    console.log("run google analytics app init")
    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date())

    gtag('config', googleAnalyticsId)

    const onRouteChanged = (path: string) => {
      gtag("set", "page", path)
      gtag("send", "pageview")
    }

    router.events.on('routeChangeComplete', onRouteChanged)
  }, [googleAnalyticsId])

  return (
    <>
      <Head>
        {googleAnalyticsId && (<script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />)}
      </Head>
      <ToastContainer autoClose={15000} />
      <WalletProvider>
        {({ verifying, initializing, wallet }) => (
          <StorefrontProvider verifying={verifying} wallet={wallet}>
            {({ searching }) => {
              return (
                <AppLayout>
                  <Header>
                    <Link href="/" passHref>
                      <HeaderTitle>👋 Holaplex</HeaderTitle>
                    </Link>
                  </Header>
                  <Content>
                    <Loading loading={verifying || initializing || searching}>
                      <Component
                        {...pageProps}
                        track={track}
                      />
                    </Loading>
                  </Content>
                </AppLayout>
              )
            }}
          </StorefrontProvider>
        )}
      </WalletProvider>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID

  return { ...appProps, googleAnalyticsId }
}

export default MyApp
