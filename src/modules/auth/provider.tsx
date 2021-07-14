import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import sv from '@/constants/styles'
import HandWaving from '@/components/elements/HandWaving'

const Content = styled.div`
  flex: 3;
  min-height: 550px;
  ${sv.flexCenter};
`;

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (process.browser) {
      window.solana.connect({ onlyIfTrusted: true })
      .then(() => walletSDK.find(window.solana.publicKey.toString()))
      .then((wallet: Wallet) => {
        if (wallet && wallet.approved) {
          return window.arweaveWallet.getActivePublicKey()
        } else {
          toast(() => <>Holaplex is in a closed beta and your wallet has not yet been approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)
          
          throw new Error("Wallet not approved")
        }
      })
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        router.push("/")
      });
    }
  }, [])

  return (
    <Content>
      {loading ? (
        <Content>
          <HandWaving />
        </Content>
      ) : (
        children
      )}
    </Content>
}
