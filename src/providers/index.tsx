import React from 'react';
import { ThemeProvider } from "./theme";
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  )
}

export default Providers;
