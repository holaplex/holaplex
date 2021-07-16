import React, { useEffect, useState } from 'react'
import walletSDK from '@/modules/wallet/client'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Wallet } from '@/modules/wallet/types'
import { Storefront } from '@/modules/storefront/types'
import sv from '@/constants/styles'
import HandWaving from '@/components/elements/HandWaving'
import { initArweave } from '@/modules/arweave'
import arweaveSDK from '@/modules/arweave/client'
import { ArweaveTransaction } from '@/modules/arweave/types'
import { isEmpty, reduce } from 'ramda'

const Content = styled.div`
  flex: 3;
  min-height: 550px;
  ${sv.flexCenter};
`;

type AuthProviderChildProps = {
  storefront?: Storefront | undefined;
}

type AuthProviderProps = {
  onlyOwner?: Boolean;
  children: (props: AuthProviderChildProps) => React.ReactElement;
}

export const AuthProvider = ({ children, onlyOwner }: AuthProviderProps) => {
  const router = useRouter()
  const arweave = initArweave()
  const [storefront, setStorefront] = useState<Storefront>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (process.browser) {
      window.solana.connect({ onlyIfTrusted: true })
        .then(() => walletSDK.find(window.solana.publicKey.toString()))
        .then((wallet: Wallet) => {
          if (wallet && wallet.approved) {
            return window.arweaveWallet.getActiveAddress()
          } else {
            toast(() => <>Holaplex is in a closed beta and your wallet has not yet been approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)

            throw new Error("Wallet not approved")
          }
        })
        .then((publicKey: string) => {
          if (!onlyOwner) {
            return
          }

          const subdomain = router.query.subdomain as string
            
          return arweaveSDK.query(arweave, arweaveSDK.queries.transactionBySubdomain, { subdomain })
            .then((response: any) => {
              if (isEmpty(response.data.transactions.edges)) {
                toast(() => <>The store does not exist.</>)

                throw new Error("Storefront does not exist")             
              }

              const transaction = response.data.transactions.edges[0].node as ArweaveTransaction

              if (transaction.owner.address !== publicKey) {
                toast(() => <>Only the store owner can edit the theme.</>)

                throw new Error("Not the storefront owner")
              }

              const tags = reduce(
                (acc: any, {name, value }) => { 
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
                  logo : {
                    url: tags["holaplex:theme:logo:url"],
                    name: tags["holaplex:theme:logo:name"],
                    type: tags["holaplex:theme:logo:type"]
                  }
                },
              } as Storefront

              setStorefront(storefront)
            })
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
    loading ? (
      <Content>
        <HandWaving />
      </Content>
    ) : (
      children({ storefront })
    )
  )
}
