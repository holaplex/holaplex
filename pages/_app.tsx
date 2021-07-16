import React , { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Link from 'next/link'
import sv from '@/constants/styles'
import { Solana } from '@/modules/solana/types'
import {
  GradientContainer,
} from '@/components/elements/StyledComponents'

const Header = styled.div`
  flex: 0 0 ${sv.headerHeight}px;
  width: 100%;
  ${sv.flexCenter};
`;

const HeaderContent = styled.div`
  height: 100%;
  width: 100%;
  max-width: ${sv.grid*134}px;
  ${sv.flexRow};
`;

const Logo = styled.div`
  color: ${sv.colors.buttonText};
  font-size: 24px;
  font-weight: 900;
  margin-right: auto;
`;

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
      console.log('waiting for window to load')
      window.onload = () => {
        console.log('window loaded')
        console.log(window.solana)
        console.log(window.arweaveWallet)

        setSolana(window.solana)
        setArweaveWallet(window.arweaveWallet)
        setReady(true)
      }
    }
  }, [])

  return (
    ready && (
      <GradientContainer>
        <ToastContainer autoClose={15000} />
        <Header>
          <HeaderContent>
            <Logo><Link href="/">👋 Holaplex</Link></Logo>
          </HeaderContent>
        </Header>
        <Component {...pageProps} solana={solana} arweaveWallet={arweaveWallet} />
      </GradientContainer>
    )
  )
}
export default MyApp
