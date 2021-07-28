import React, { useCallback, useEffect, useState } from 'react'
import App from 'next/app'
import type { AppProps, AppContext } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Link from 'next/link'
import { Layout } from 'antd'
import sv from '@/constants/styles'
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

function MyApp({ Component, pageProps, googleAnalyticsId }: MyAppProps) {
  const router = useRouter()

  const track = (category: string, action: string) => { window.gtag('event', action, { event_category: category }) }

  useEffect(() => {
    if (!process.browser || !window.gtag) {
      return
    }
    console.log("on register google")

    const onRouteChanged = (path: string) => {
      console.log(googleAnalyticsId, path)
      window.gtag("config", googleAnalyticsId, { page_path: path })
    }

    router.events.on('routeChangeComplete', onRouteChanged)
  }, [])

  return (
    <>
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
