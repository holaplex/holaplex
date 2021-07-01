import React, {ComponentProps, FC} from 'react';
import { Storefront, StorefrontTheme } from '../types'

enum ACTIONS {
  UPDATE_SUBDOMAIN_AVAILABILITY = 'UPDATE_SUBDOMAIN_AVAILABILITY',
  UPDATE_SUBDOMAIN_NAME = 'UPDATE_SUBDOMAIN_NAME',
  THEME_SAVED = 'THEME_SAVED',
  THEME_SAVE_ERROR = 'THEME_SAVE_ERROR',
  STOREFRONT_SAVED = 'STOREFRONT_SAVED',
  STOREFRONT_SAVE_ERROR = 'STOREFRONT_SAVE_ERROR',
}

export type ErrorPayload = { error: string }

export type StorefrontState = {
  subdomain: string;
  desiredStorefrontSubdomain: string;
  available: boolean;
  storefront: Storefront | {};
  error: string;
}

export type StorefrontActions = 
  | { type: ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY, payload: { desiredStorefrontSubdomain: string, available: boolean } }
  | { type: ACTIONS.UPDATE_SUBDOMAIN_NAME, payload: { desiredStorefrontSubdomain: string } }
  | { type: ACTIONS.THEME_SAVE_ERROR, payload: ErrorPayload }
  | { type: ACTIONS.THEME_SAVED, payload: StorefrontTheme }
  | { type: ACTIONS.STOREFRONT_SAVE_ERROR, payload: ErrorPayload }
  | { type: ACTIONS.STOREFRONT_SAVED, payload: Storefront }
  ;
 



function storefrontReducer(state: StorefrontState, action: StorefrontActions): StorefrontState {
  const {type, payload} = action;
  switch (type) {
    case ACTIONS.UPDATE_SUBDOMAIN_NAME: return {
      ...state,
      ...payload
    }
    case ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY: return {
      ...state,
      ...payload
    }
    case ACTIONS.THEME_SAVED: return {
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
    case ACTIONS.STOREFRONT_SAVED: return {
      ...state,
      storefront: {
        ...state.storefront,
        ...payload
      }
    }
    case ACTIONS.THEME_SAVE_ERROR, ACTIONS.STOREFRONT_SAVE_ERROR: return {
      ...state,
      ...payload as ErrorPayload
    }
    default:
      return state;
  }
}
export const StorefrontContext = React.createContext<{
  subdomain: string;
  desiredStorefrontSubdomain: string;
  available: boolean;
  dispatch: React.Dispatch<any>;
}>({
  dispatch: () => null,
  subdomain: '',
  desiredStorefrontSubdomain: '',
  available: false
});

export const useStorefrontContext = () => React.useContext(StorefrontContext);

export const StorefrontContextProvider = ({ children }: { children: JSX.Element }) => {
  const [storefrontState, dispatch] = React.useReducer(storefrontReducer, {
    subdomain: '',
    desiredStorefrontSubdomain: '',
    available: false,
    error: '',
    storefront: {},
  })

  return (
    <StorefrontContext.Provider value={{ dispatch, ...storefrontState }}>
      {children}
    </StorefrontContext.Provider>
  );
}
