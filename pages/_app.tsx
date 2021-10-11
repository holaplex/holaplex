import React, { useCallback, useEffect, useState } from 'react'
import App from 'next/app'
import type { AppProps, AppContext } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import { Layout, Space } from 'antd'
import sv from '@/constants/styles'
import { isNil } from 'ramda'
import Loading from '@/components/elements/Loading'
import { WalletProvider } from '@/modules/wallet'
import { StorefrontProvider } from '@/modules/storefront'
import SocialLinks from '@/components/elements/SocialLinks'
import useWindowDimensions from '@/hooks/useWindowDimensions'

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

const { Header, Content } = Layout

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 2px;
  font-weight: 900;
  margin-right: auto;
  a {
    color: ${sv.colors.buttonText};
    &:hover {
      color: ${sv.colors.buttonText}
    }
  }
`

const AppHeader = styled(Header)`
  ${sv.flexRow};
  margin: 0 0 40px 0;
`

const HeaderLinkWrapper = styled.div<{ active: boolean; }>`
  color: ${sv.colors.buttonText};
  ${({ active }) => active && `text-decoration: underline;`}
`

const AppLayout = styled(Layout)`
  overflow-y: auto;
`

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const windowDimensions = useWindowDimensions();

  const track = (category: string, action: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return
    }

    window.gtag('event', action, { event_category: category })
  }

  const onRouteChanged = (path: string) => {
    if (isNil(GOOGLE_ANALYTICS_ID)) {
      return
    }

    window.gtag("config", GOOGLE_ANALYTICS_ID, { page_path: path })
  }

  useEffect(() => {
    if (!process.browser || !GOOGLE_ANALYTICS_ID) {
      return
    }

    router.events.on('routeChangeComplete', onRouteChanged)

    return () => {
      router.events.off('routeChangeComplete', onRouteChanged)
    }
  }, [router.events])

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
                  <AppHeader>
                    <HeaderTitle>
                      {windowDimensions.width > 550 ? (
                        <Link href="/" passHref>
                          👋 Holaplex
                        </Link>
                      ) : (
                        <Link href="/" passHref>
                          👋
                        </Link>
                      )}
                    </HeaderTitle>
                    <Space size="large">
                      <HeaderLinkWrapper active={router.pathname == "/storefronts"}>
                        <Link href="/storefronts" passHref >
                          Stores
                        </Link>
                      </HeaderLinkWrapper>
                      <HeaderLinkWrapper active={false}>
                        <a
                          href="https://docs.google.com/document/d/e/2PACX-1vSMDXh4TbZCR70AqA3O3-pRnvWVBSxE5cFM4LcprS_BHa20aRK8xFLDMwv-2YbZydWYQS1DBl2GBFNX/pub"
                          target="_blank"
                          rel="noreferrer"
                        >
                          FAQ
                        </a>
                      </HeaderLinkWrapper>
                      <HeaderLinkWrapper active={router.pathname == "/about"}>
                        <Link href="/about" passHref >
                          About
                        </Link>
                      </HeaderLinkWrapper>
                      {windowDimensions.width > 550 && <SocialLinks />}
                    </Space>
                  </AppHeader>
                  <Content>
                    <Loading loading={verifying || searching}>
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

export default MyApp
