import React, { useEffect, useState } from 'react'
import { initArweave } from '@/modules/arweave'
import arweaveSDK from '@/modules/arweave/client'
import { isNil } from 'ramda'
import { Storefront } from '@/modules/storefront/types'
import { Wallet } from '@/modules/wallet/types'
import { useRouter } from 'next/router'
import { StorefrontContext } from './context'

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
}

type StorefrontProviderProps = {
  subdomain: string;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
}

export const StorefrontProvider = ({ subdomain, children }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(true)
  const [storefront, setStorefront] = useState<Storefront>()
  const arweave = initArweave()
  const router = useRouter()

  useEffect(() => {
    if (!process.browser) {
      return
    }

    const subdomain = router.query.subdomain as string

    arweaveSDK.search(arweave).storefront("holaplex:metada:subdomain", subdomain)
      .then((storefront) => {
        if (isNil(storefront)) {
          setSearching(false)

          return
        }

        setStorefront(storefront)
        setSearching(false)
      })
  }, [subdomain])

  return (
    <StorefrontContext.Provider value={{ searching, storefront }}>
      {children({ searching, storefront })}
    </StorefrontContext.Provider>
  )
}
