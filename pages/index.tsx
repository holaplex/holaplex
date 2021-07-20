import '@/styles/Home.module.css'
import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import HolaWaves from '@/assets/images/HolaWaves'
import { Space, Row, Col } from 'antd'
import Button from '@/components/elements/Button'
import { WalletContext } from '@/modules/wallet'
import { Solana } from '@/modules/solana/types'
import { isNil } from 'ramda'

const Logo = styled.div`
  font-size: 90px;
  line-height: 90px;
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

export default function Home() {
  const { solana, arweaveWallet, connect } = useContext(WalletContext)
  const router = useRouter()
  return (
    <Row justify="center">
      <Col sm={16} md={14} lg={12} xl={10}>
        <Space direction="vertical" align="center" size="large">
          <Logo>👋</Logo>
          <HeroTitle>Holaplex</HeroTitle>
          <Pitch>Design, launch, and host your Metaplex NFT marketplace. No coding required!</Pitch>
          {solana && arweaveWallet && (
            <Button type="primary" onClick={() => connect(() => router.push("/storefronts/new"))} size="large">Create Your Store</Button>
          )}
        </Space>
      </Col>
      <PageBackdrop />
    </Row>
  )
}
