import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import sv from '@/constants/styles'
import { Solana } from '@/modules/solana/types'
import { isNil } from 'ramda'

const Content = styled.div`
  flex: 3;
  min-height: 550px;
  ${sv.flexCenter};
`;

type AuthProviderChildProps = {
  authenticating: boolean; 
}

type AuthProviderProps = {
  onlyArweaveAddress?: string;
  children: (props: AuthProviderChildProps) => React.ReactElement;
  solana: Solana;
  arweaveWallet: any;
}

export const AuthProvider = ({ children, onlyArweaveAddress, solana, arweaveWallet }: AuthProviderProps) => {
  const router = useRouter()
  const [authenticating, setAuthenticating] = useState(true)

  useEffect(() => {
    if (process.browser) {
      if (isNil(solana) || isNil(arweaveWallet)) {
        router.push("/")
        return
      }

      solana.connect({ onlyIfTrusted: true })
        .then(() => walletSDK.find(solana.publicKey.toString()))
        .then((response: any) => {
          const wallet = response as Wallet
          
          if (wallet && wallet.approved) {
            return arweaveWallet.getActiveAddress()
          } else {
            toast(() => <>Holaplex is in a closed beta and your wallet has not yet been approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)

            throw new Error("Wallet not approved")
          }
        })
        .then((publicKey: string) => {
          if (!onlyArweaveAddress) {
            return
          }

          if (onlyArweaveAddress != publicKey) {
            toast(() => <>Your Arweave wallet address is not allowed.</>)

            throw new Error("Arweave address not allowed")
          }
        })
        .then(() => {
          setAuthenticating(false)
        })
        .catch(() => {
          router.push("/")
        });
    }
  }, [])

  return children({ authenticating })
}
