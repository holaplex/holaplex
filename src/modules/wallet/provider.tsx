import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import { useRouter } from 'next/router'
import { isNil, isEmpty } from 'ramda'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import { Solana } from '@/modules/solana/types'
import { initArweave } from '@/modules/arweave'
import arweaveSDK from '@/modules/arweave/client'
import { WalletContext, WalletContextProps } from './context'
import { getBalance } from '@/modules/arweave'
import Arweave from 'arweave'

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

const handleArweaveBalance = async (
  arweave: Arweave,
  setArweaveBalance: Function,
) => {
  try {
    await window.arweaveWallet.connect(['ACCESS_ADDRESS'])
    const address = await window.arweaveWallet.getActiveAddress()

    const balanceResponse = await getBalance(address, arweave)
    
    if (balanceResponse.match(/not found/i)) {
      setArweaveBalance(0)
    } else {
      const balance = parseInt(balanceResponse, 10)
      setArweaveBalance(balance)
    }
  } catch(err) {
    console.log("error getting arweave balance", err)
    throw err
  }

}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const router = useRouter()
  const arweave = initArweave()
  const [verifying, setVerifying] = useState(true)
  const [initializing, setInitialization] = useState(true)
  const [wallet, setWallet] = useState<Wallet>()
  const [solana, setSolana] = useState<Solana>()
  const [arweaveWallet, setArweaveWallet] = useState<any>()
  const [arweaveBalance, setArweaveBalance] = useState<number>(0)
  const [
    arweaveRoadblockVisible,
    displayArweaveRoadblock
  ] = useState<boolean>(false)

  useEffect(() => {
    if (!process.browser || initializing) {
      return
    }

    if (!solana) {
      toast(() => <>Phantom wallet is not installed on your browser. Visit <a href="https://phantom.app">phantom.app</a> to setup your wallet.</>)
      return
    }

    if (!arweaveWallet) {
      toast(() => <>ArConnect wallet is not installed on your browser. Visit <a href="https://arconnect.io">arconnect.io</a> to setup your wallet.</>)
      return
    }

    router.push("/").then(() => {
      setVerifying(false)
    })
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
    if (isNil(solana)) {
      return
    }

    solana.on("connect", () => {
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
        .then( async () => {
          // only connect to arweave if we have a solana connection :-)
          await handleArweaveBalance(
            arweave, 
            setArweaveBalance,
          )
        })
        .catch(() => router.push("/"))
        .finally(() => { 
          setVerifying(false)
        })
    })
  }, [solana])


  const connect = () =>  {
    if (isNil(solana)) {
      return
    }

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
        arweaveBalance,
        solana,
        connect,
        displayArweaveRoadblock,
        arweaveRoadblockVisible,
      }}>
      {children({
        arweaveRoadblockVisible,
        displayArweaveRoadblock,
        arweaveBalance,
        verifying,
        initializing,
        wallet,
        solana,
        connect
        })}
    </WalletContext.Provider>
  )
}
