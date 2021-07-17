import '@/styles/Home.module.css'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import HolaWaves from '@/assets/images/HolaWaves'
import { Space, Row, Col } from 'antd'
import Button from '@/components/elements/Button'
import walletSDK from '@/modules/wallet/client'
import { Solana } from '@/modules/solana/types'

const Logo = styled.div`
  font-size: 90px;
  line-height: 90px;
`;

const Hero = styled(Col)`
  margin: 100px 0 0 0;
`;

const HeroTitle = styled.h1`
  text-align: center;
  font-weight: 800;
  font-size: 68px;
  line-height: 68px;
  color: #fff;
`

const Pitch = styled.h2`
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 0.2px;
  text-align: center;
  font-weight: 300;
  color: rgba(253, 253, 253, 0.6);
`

const PageBackdrop = styled(HolaWaves)`
  position: absolute;
  bottom: 0;
  left:0;
  width: 100%;
  height: 350px;
  z-index: -1;
`
type HomeProps = {
  solana: Solana;
  arweaveWallet: any;
}

export default function Home({ solana, arweaveWallet }: HomeProps) {
  const router = useRouter()

  useEffect(() => {
    if (process.browser) {
      if (!solana) {
        toast(() => <>Phantom wallet is not installed on your browser. Visit <a href="https://phantom.app">phantom.app</a> to setup your wallet.</>)
        return
      }

      if (!arweaveWallet) {
        toast(() => <>ArConnect wallet is not installed on your browser. Visit <a href="https://arconnect.io">arconnect.io</a> to setup your wallet.</>)
        return
      }

      solana.on("connect", () => {
        const solanaPubkey = solana.publicKey.toString()

        arweaveWallet.getActivePublicKey()
          .catch(() => arweaveWallet.connect(['ACCESS_ADDRESS', 'ACCESS_PUBLIC_KEY', 'SIGN_TRANSACTION', 'SIGNATURE']))
          .then(() => walletSDK.find(solanaPubkey))
          .then((wallet: any) => {
            if (!wallet) {
              toast(() => <>Holaplex is in a closed beta but we have added your wallet to the waitlist. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)

              return walletSDK.create(solanaPubkey)
            }

            if (wallet.approved) {
              router.push("/storefronts/new")
            } else {
              toast(() => <>Holaplex is in a closed beta and your wallet has not yet been approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)
            }
          })
      })
    }
  })

  return (
    <Row justify="center">
      <Hero sm={16} md={14} lg={12} xl={10}>
          <Space direction="vertical" align="center">
            <Logo>👋</Logo>
            <HeroTitle>Holaplex</HeroTitle>
            <Pitch>Design, launch, and host your Metaplex NFT marketplace. No coding required!</Pitch>
            {solana && arweaveWallet && (
              <Button type="primary" size="large" onClick={() => solana.connect()}>Create Your Store</Button>
            )}
          </Space>
      </Hero>
      <PageBackdrop />
    </Row>
  )
}
