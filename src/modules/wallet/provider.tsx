import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import { Solana } from '@/modules/solana/types'
import { WalletContext, WalletContextProps } from './context'

type WalletProviderProps = {
  wallet?: Wallet,
  children: (props: WalletContextProps) => React.ReactElement;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [initializing, setInitialization] = useState(true)
  const [wallet, setWallet] = useState<Wallet>()
  const [solana, setSolana] = useState<Solana>()
  const [arweaveWallet, setArweaveWallet] = useState<any>()

  useEffect(() => {
    if (!process.browser || initializing) {
      return
    }

    if (!solana) {
      toast(() => <>Phantom wallet is not installed on your browser. Visit <a href="https://phantom.app">phantom.app</a> to setup your wallet.</>)
    }

    if (!arweaveWallet) {
      toast(() => <>ArConnect wallet is not installed on your browser. Visit <a href="https://arconnect.io">arconnect.io</a> to setup your wallet.</>)
    }

    router.push("/")
  }, [initializing])

  useEffect(() => {
    if (process.browser) {
      window.addEventListener("load", () => {
        setSolana(window.solana)
        setArweaveWallet(window.arweaveWallet)
        setInitialization(false)
      }, false)
    }
  }, [])

  useEffect(() => {
    const handleRoutChange = () => {
      if (verifying) {
        setVerifying(false)
      }
    }

    router.events.on('routeChangeComplete', handleRoutChange)
    return () => {
      router.events.off('routeChangeComplete', handleRoutChange)
    }
  }, [router])

  const connect = (cb?: () => any) => {
    if (isNil(solana)) {
      return
    }
    setVerifying(true)
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
            setWallet(wallet)
            cb && cb()
          } else {
            toast(() => <>Holaplex is in a closed beta and your wallet has not yet been approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)
            router.push("/")
          }
        })
    })

    solana.connect()
  }

  return (
    <WalletContext.Provider value={{ verifying, initializing, wallet, arweaveWallet, solana, connect }}>
      {children({ verifying, initializing, wallet, connect })}
    </WalletContext.Provider>
  )
}
