import React from 'react';
import { ThemeProvider } from "./theme";
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "@/redux/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>

  )
}

export default Providers;
