import { createContext, FC, useContext, useState } from 'react';

const AppHeaderSettingsContext = createContext({
  disableMarginBottom: false,
  toggleDisableMarginBottom: () => {},
  turnOffMarginBottom: () => {}
});

export const AppHeaderSettingsProvider: FC = ({ children }) => {
  const [disableMarginBottom, setDisableMarginBottom] = useState(false);
  return (
    <AppHeaderSettingsContext.Provider
      value={{
        disableMarginBottom,
        toggleDisableMarginBottom: () => setDisableMarginBottom(!disableMarginBottom),
        turnOffMarginBottom: () => setDisableMarginBottom(true),
      }}
    >
      {children}
    </AppHeaderSettingsContext.Provider>
  );
};

export const useAppHeaderSettings = () => {
  const context = useContext(AppHeaderSettingsContext);
  if (!context) {
    throw new Error('useAppHeaderSettings must be used within a AppHeaderSettingsProvider');
  }
  return context;
};
