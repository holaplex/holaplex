import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Link from 'next/link'
import { Layout, Row, Col } from 'antd'
import sv from '@/constants/styles'
import Loading from '@/components/elements/Loading'
import { WalletProvider } from '@/modules/wallet'

const { Header } = Layout

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
const AppContent = styled(Header)`
  padding: 72px 22px 0;
`

const AppLayout = styled(Layout)`
  overflow-y: auto;
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer autoClose={15000} />
      <WalletProvider>
        {({ verifying, initializing }) => (
          <AppLayout>
            <Header>
              <Link href="/">
                <HeaderTitle>👋 Holaplex</HeaderTitle>
              </Link>
            </Header>
            <AppContent>
              <Loading loading={verifying || initializing}>
                <Component
                  {...pageProps}
                />
              </Loading>
            </AppContent>
          </AppLayout>
        )}
      </WalletProvider>
    </>
  )
}
export default MyApp
