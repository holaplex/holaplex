import React from 'react'
import type { Pipeline } from '@/modules/pipelines'
import { Storefront } from './types'

export type StorefrontContextProps = {
  storefront?: Storefront;
  pipeline?: Pipeline;
  searching: boolean;
}

export const StorefrontContext = React.createContext<StorefrontContextProps>({ searching: false })
