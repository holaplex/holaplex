import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Storefront } from '@/modules/storefront/types'
import { Wallet } from '@/modules/wallet/types'

type AuthProviderProps = {
  storefront?: Storefront;
  wallet?: Wallet;
  children: React.ReactElement;
}

export const AuthProvider = ({ children, storefront, wallet }: AuthProviderProps) => {
  const [authenticating, setAuthenticating] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!wallet) {
      toast(() => <>Your wallet does not exist or still is not approved. Email the team at <a href="mailto:hola@holaplex.com">hola@holaplex.com</a> to join the beta.</>)
      router.push("/")
      return
    }

    if (!storefront) {
      toast(() => <>Could not find storefront.</>)
      router.push("/")
      return
    }

    if (storefront.pubkey === wallet.pubkey) {
      setAuthenticating(false)
    }
  }, [])

  useEffect(() => {
    const handleRoutChange = () => {
      if (authenticating) {
        setAuthenticating(false)
      }
    }

    router.events.on('routeChangeComplete', handleRoutChange)
    return () => {
      router.events.off('routeChangeComplete', handleRoutChange)
    }
  }, [router])

  if (authenticating) {
    return <></>
  }

  return children
}
