import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
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

function MyApp({ Component, pageProps }: AppProps) {
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
