import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import { Solana } from '@/modules/solana/types'
import { initArweave } from '@/modules/arweave'
import arweaveSDK from '@/modules/arweave/client'
import { WalletContext, WalletContextProps } from './context'

type WalletProviderProps = {
  wallet?: Wallet,
  solana?: Solana;
  children: (props: WalletContextProps) => React.ReactElement;
}


const upsertWallet = async (pubkey: string) => {
  return walletSDK.find(pubkey)
    .then((wallet: any) => {
      if (!wallet) {
        return walletSDK.create(pubkey)
      }

      return Promise.resolve(wallet)
    })
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const router = useRouter()
  const arweave = initArweave()
  const [verifying, setVerifying] = useState(false)
  const [initializing, setInitialization] = useState(true)
  const [wallet, setWallet] = useState<Wallet>()
  const [solana, setSolana] = useState<Solana>()
  const [arweaveWallet, setArweaveWallet] = useState<any>()
  const [arweaveWalletAddress, setArweaveWalletAddress] = useState<string>()

  useEffect(() => {
    if (process.browser) {
      window.addEventListener("load", () => {
        setSolana(window.solana)
        setArweaveWallet(window.arweaveWallet)
        setInitialization(false)
      }, false)
    }
  }, [])

  const connect = () =>  {
    if (isNil(solana)) {
      toast(() => <>Phantom wallet is not installed on your browser. Visit <a href="https://phantom.app">phantom.app</a> to setup your wallet.</>)
      return
    }

    if (isNil(arweaveWallet)) {
      toast(() => <>ArConnect wallet is not installed on your browser. Visit <a href="https://arconnect.io">arconnect.io</a> to setup your wallet.</>)
      return
    }

    solana.once("connect", () => {
      const solanaPubkey = solana.publicKey.toString()

      upsertWallet(solanaPubkey)
        .then((wallet) => {
          setWallet(wallet);
          return arweaveSDK.using(arweave).storefront.find("solana:pubkey", wallet.pubkey)
        })
        .then((storefront: any) => {
          if (storefront) {
            return router.push("/storefront/edit")
          }

          return router.push("/storefront/new")
        })
        .then(() => arweaveWallet.connect(['ACCESS_ADDRESS']))
        .then(() => arweaveWallet.getActiveAddress())
        .then((address) => {
          setArweaveWalletAddress(address)
        })
        .catch(() => router.push("/"))
        .finally(() => { 
          setVerifying(false)
        })
    })

    setVerifying(true)

    solana.connect()
  }

  return (
    <WalletContext.Provider
      value={{
        verifying,
        initializing,
        wallet,
        arweaveWallet,
        solana,
        connect,
        arweaveWalletAddress
      }}>
      {children({
        verifying,
        initializing,
        wallet,
        solana,
        connect
        })}
    </WalletContext.Provider>
  )
}
