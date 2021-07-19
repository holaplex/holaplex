import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Link from 'next/link'
import { Layout, Row, Col } from 'antd'
import sv from '@/constants/styles'
import text from '@/constants/text'

import { Solana } from '@/modules/solana/types'

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

const AppContent = styled(Header)`
  padding: 72px 22px 0;
`

const AppLayout = styled(Layout)`
  overflow-y: auto;
`

declare global {
  interface Window {
    solana: Solana;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)
  const [solana, setSolana] = useState<Solana>()
  const [arweaveWallet, setArweaveWallet] = useState<any>()


  useEffect(() => {
    if (process.browser) {
      console.log("Adding window load listener")
      window.addEventListener("load", () => {
        console.log("On load complete")
        console.log(window.solana)
        console.log(window.arweaveWallet)
        
        setSolana(window.solana)
        setArweaveWallet(window.arweaveWallet)
        setReady(true)
      }, false)
    }
  }, [])

  return (
    ready && (
      <AppLayout>
        <ToastContainer autoClose={15000} />
        <Header>
          <Link href="/">
            <HeaderTitle>👋 Holaplex</HeaderTitle>
          </Link>
        </Header>
        <AppContent>
          <Component {...pageProps} solana={solana} arweaveWallet={arweaveWallet} />
        </AppContent>
      </AppLayout>
    )
  )
}
export default MyApp
