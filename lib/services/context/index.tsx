import React, {ComponentProps, FC} from 'react';

enum ACTIONS {
  UPDATE_SUBDOMAIN_AVAILABILITY = 'UPDATE_SUBDOMAIN_AVAILABILITY',
}

export type errorPayload = { error: string }

export type StorefrontState = {
  subdomain: string;
  desiredStorefrontSubdomain: string;
  available: boolean;
}

export type StorefrontActions = 
  | { type: ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY, payload: { desiredStorefrontSubdomain: string, available: boolean } };



function storefrontReducer(state: StorefrontState, action: StorefrontActions): StorefrontState {
  const {type, payload} = action;
  console.log({ type, payload })
  switch (type) {
    case ACTIONS.UPDATE_SUBDOMAIN_AVAILABILITY: return {
      ...state,
      ...payload
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
    available: false
  })

  return (
    <StorefrontContext.Provider value={{ dispatch, ...storefrontState }}>
      {children}
    </StorefrontContext.Provider>
  );
}
