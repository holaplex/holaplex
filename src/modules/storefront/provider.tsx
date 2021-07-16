import React, { useEffect, useState } from 'react'
import { initArweave } from '@/modules/arweave'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import arweaveSDK from '@/modules/arweave/client'
import { isEmpty, reduce } from 'ramda'
import { ArweaveTransaction } from '@/modules/arweave/types'
import { Storefront } from '@/modules/storefront/types'

type StorefrontProviderChildrenProps = {
  searching: boolean;
  storefront?: Storefront;
  ownerAddress?: string;
}

type StorefrontProviderProps = {
  subdomain: string;
  children: (props: StorefrontProviderChildrenProps) => React.ReactElement;
}

export const StorefrontProvider = ({ children, subdomain }: StorefrontProviderProps) => {
  const [searching, setSearching] = useState(false)
  const [storefront, setStorefront] = useState<Storefront>()
  const [ownerAddress, setOwnerAddress] = useState<string>()
  const arweave = initArweave()
  const router = useRouter()

  useEffect(() => {
    if (process.browser) {
      setSearching(true)
      arweaveSDK.query(arweave, arweaveSDK.queries.transactionBySubdomain, { subdomain })
        .then((response: any) => {
          if (isEmpty(response.data.transactions.edges)) {
            toast(() => <>The store does not exist.</>)

            throw new Error("Storefront does not exist")
          }

          const transaction = response.data.transactions.edges[0].node as ArweaveTransaction

          const tags = reduce(
            (acc: any, { name, value }) => {
              acc[name] = value

              return acc
            },
            {},
            transaction.tags,
          )

          const storefront = {
            pubkey: tags["solana:pubkey"],
            subdomain: tags["holaplex:metadata:subdomain"],
            theme: {
              primaryColor: tags["holaplex:theme:color:primary"],
              backgroundColor: tags["holaplex:theme:color:background"],
              titleFont: tags["holaplex:theme:font:title"],
              textFont: tags["holaplex:theme:font:text"],
              logo: {
                url: tags["holaplex:theme:logo:url"],
                name: tags["holaplex:theme:logo:name"],
                type: tags["holaplex:theme:logo:type"]
              }
            },
          } as Storefront

          setStorefront(storefront)
          setOwnerAddress(transaction.owner.address)
          setSearching(false)
        })
        .catch(() => {
          router.push("/")
        })
    }
  }, [])

  return children({ searching, storefront,ownerAddress })
}
