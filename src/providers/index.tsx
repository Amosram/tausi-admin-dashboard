import React from 'react';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "@/redux/store";
import { ThemeProvider, useTheme } from './theme-provider';

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const {font} = useTheme();

  return (
    <div className={`font-${font.toLocaleLowerCase().replace(' ', '')}`}>
      {children}
    </div>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider defaultTheme='dark' themeStorageKey='vite-ui-theme'>
          <I18nextProvider i18n={i18n}>
            <AppWrapper>
              {children}
            </AppWrapper>
          </I18nextProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>

  );
};

export default Providers;
