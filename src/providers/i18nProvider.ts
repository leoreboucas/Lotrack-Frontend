import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import type { I18nProvider } from "@refinedev/core";

import appMessages from "../messages.json";
import loginMessages from "../pages/login/messages.json";
import categoryMessages from "../pages/categories/messages.json";
import productMessages from "../pages/products/messages.json";
import supplierMessages from "../pages/suppliers/messages.json";
import lotMessages from "../pages/lots/messages.json";
import stockMovementMessages from "../pages/stockMovements/messages.json";
import layoutMessages from "../layout/messages.json";

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  resources: {
    "pt-BR": {
      translation: {
        ...appMessages,
        ...loginMessages,
        ...categoryMessages,
        ...productMessages,
        ...supplierMessages,
        ...lotMessages,
        ...stockMovementMessages,
        ...layoutMessages,
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const i18nProvider = i18n;

export const refineI18nProvider: I18nProvider = {
  translate: (key, options) => i18next.t(key, options) as string,
  changeLocale: (locale) => i18next.changeLanguage(locale),
  getLocale: () => i18next.language,
};
