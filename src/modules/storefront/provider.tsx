import React, { useEffect, useState } from 'react'
import { initArweave } from '@/modules/arweave'
import arweaveSDK from '@/modules/arweave/client'
import { isNil } from 'ramda'
import { Storefront } from '@/modules/storefront/types'
import { Wallet } from '@/modules/wallet/types'
import type { Pipeline } from '@/modules/pipelines/types'
import { PipelineSDK } from '@/modules/pipelines'
import { StorefrontContext } from './context'

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
  pipeline?: Pipeline;
}

type StorefrontProviderProps = {
  wallet?: Wallet;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
}

export const StorefrontProvider = ({ wallet, children }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false)
  const [storefront, setStorefront] = useState<Storefront>()
  const [pipeline, setPipeline] = useState<Pipeline>()
  const arweave = initArweave()

  useEffect(() => {
    if (!process.browser || !wallet)  {
      return
    }

    setSearching(true)

    arweaveSDK.using(arweave).storefront.find("solana:pubkey", wallet.pubkey)
      .then((storefront) => {
        if (isNil(storefront)) {
          return
        }

        setStorefront(storefront)

        return storefront
      })
      .then((storefront) => PipelineSDK.get(storefront?.id as string))
      .then(pipeline => {
        setPipeline(pipeline)
      })
      .finally(() => {
        setSearching(false)
      })
  }, [wallet])

  return (
    <StorefrontContext.Provider value={{ searching, storefront, pipeline }}>
      {children({ searching, storefront, pipeline })}
    </StorefrontContext.Provider>
  )
}
