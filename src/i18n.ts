import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from './translations/en.json';


i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en : {
        translation: enTranslation
      },

    },

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: true
    }
  });

export default i18n;

