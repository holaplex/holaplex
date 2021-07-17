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
  &:hover {
    ${text.contrast.primary}
  }

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
      window.addEventListener("load", () => {
        setSolana(window.solana)
        setArweaveWallet(window.arweaveWallet)
        setReady(true)
      })
    }
  }, [])

  return (
    ready && (
      <Layout>
        <ToastContainer autoClose={15000} />
        <Header>
          <Link href="/">
            <HeaderTitle>👋 Holaplex</HeaderTitle>
          </Link>
        </Header>
        <Content>
          <Component {...pageProps} solana={solana} arweaveWallet={arweaveWallet} />
        </Content>
      </Layout>
    )
  )
}
export default MyApp
