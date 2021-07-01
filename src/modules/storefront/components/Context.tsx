import React, {ComponentProps, FC} from 'react';
import { Storefront, StorefrontTheme } from '../types'

enum ACTIONS {
  UPDATE_PUBKEY = 'UPDATE_PUBKEY',
  SAVE_PUBKEY = 'SAVE_PUBKEY',
  PUBKEY_SAVED = 'PUBKEY_SAVED',
  PUBKEY_SAVE_ERROR = 'PUBKEY_SAVE_ERROR',
  UPDATE_SUBDOMAIN_AVAILABILITY = 'UPDATE_SUBDOMAIN_AVAILABILITY',
  UPDATE_SUBDOMAIN_NAME = 'UPDATE_SUBDOMAIN_NAME',
  THEME_SAVED = 'THEME_SAVED',
  THEME_SAVE_ERROR = 'THEME_SAVE_ERROR',
  STOREFRONT_SAVED = 'STOREFRONT_SAVED',
  STOREFRONT_SAVE_ERROR = 'STOREFRONT_SAVE_ERROR',
  LOGO_UPDATED = 'LOGO_UPDATED',
}

export type ErrorPayload = { error: string }

export type StorefrontState = {
  subdomain: string;
  available: boolean;
  storefront: Storefront | {};
  error: string;
  pubkey: string;
}

export type StorefrontActions = 
  | { type: ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY, payload: { desiredStorefrontSubdomain: string, available: boolean } }
  | { type: ACTIONS.UPDATE_SUBDOMAIN_NAME, payload: { desiredStorefrontSubdomain: string } }
  | { type: ACTIONS.THEME_SAVE_ERROR, payload: ErrorPayload }
  | { type: ACTIONS.THEME_SAVED, payload: StorefrontTheme }
  | { type: ACTIONS.STOREFRONT_SAVE_ERROR, payload: ErrorPayload }
  | { type: ACTIONS.LOGO_UPDATED, payload: { logoPath: string } }
  | { type: ACTIONS.STOREFRONT_SAVED, payload: Storefront }
  | { type: ACTIONS.UPDATE_PUBKEY, payload: { pubkey: string } }
  | { type: ACTIONS.SAVE_PUBKEY, payload: { pubkey:  string } }
  | { type: ACTIONS.PUBKEY_SAVE_ERROR, payload: ErrorPayload }
  | { type: ACTIONS.PUBKEY_SAVED, payload: StorefrontTheme };


function storefrontReducer(state: StorefrontState, action: StorefrontActions): StorefrontState {
  const {type, payload} = action;
  switch (type) {
    case ACTIONS.UPDATE_PUBKEY: case ACTIONS.SAVE_PUBKEY: {
      return {
        ...state,
        ...payload
      }
    }
    case ACTIONS.UPDATE_SUBDOMAIN_NAME: return {
      ...state,
      ...payload
    }
    case ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY: return {
      ...state,
      ...payload
    }
    case ACTIONS.THEME_SAVED: case ACTIONS.LOGO_UPDATED: return {
      ...state,
      storefront: {
        ...state.storefront,
        theme: {
          // Not sure why TS is angry here.
          // @ts-ignore 
          ...state.storefront.theme,
          ...payload
        }
      }
    }
    case ACTIONS.STOREFRONT_SAVED: case ACTIONS.PUBKEY_SAVED: return {
      ...state,
      storefront: {
        ...state.storefront,
        ...payload
      }
    }
    case ACTIONS.THEME_SAVE_ERROR: case ACTIONS.STOREFRONT_SAVE_ERROR: case ACTIONS.PUBKEY_SAVE_ERROR: return {
      ...state,
      ...payload as ErrorPayload
    }
    default:
      return state;
  }
}
export const StorefrontContext = React.createContext<{
  subdomain: string;
  available: boolean;
  dispatch: React.Dispatch<any>;
  pubkey: string;
}>({
  dispatch: () => null,
  subdomain: '',
  available: false,
  pubkey: ''
});

export const useStorefrontContext = () => React.useContext(StorefrontContext);

export const StorefrontContextProvider = ({ children }: { children: JSX.Element }) => {
  const [storefrontState, dispatch] = React.useReducer(storefrontReducer, {
    subdomain: '',
    pubkey: '',
    available: false,
    error: '',
    storefront: {},
  })
  console.log(storefrontState)
  return (
    <StorefrontContext.Provider value={{ dispatch, ...storefrontState }}>
      {children}
    </StorefrontContext.Provider>
  );
}
