import React, { SetStateAction, Dispatch } from 'react';
import { Storefront } from './types';

export type StorefrontContextProps = {
  storefront?: Storefront;
  searching: boolean;
};

export const StorefrontContext = React.createContext<StorefrontContextProps>({ searching: false });
