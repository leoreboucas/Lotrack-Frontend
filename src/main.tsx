import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Refine } from "@refinedev/core";
import { dataProvider } from "./providers/dataProvider.ts";
import { authProvider } from "./providers/authProvider.ts";
import { i18nProvider, refineI18nProvider } from "./providers/i18nProvider.ts";
import routerProvider from "@refinedev/react-router";
import { ColorModeProvider } from "./context/colorMode.tsx";
import { accessControlProvider } from "./providers/accessControlProvider.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={refineI18nProvider}
        routerProvider={routerProvider}
        accessControlProvider={accessControlProvider}
        resources={[
          {
            name: "categories",
            meta: { label: i18nProvider.t("navigation.categories") },
            list: "/categories",
            create: "/categories/create",
            edit: "/categories/edit/:id",
            show: "/categories/show/:id",
          },
          {
            name: "products",
            meta: { label: i18nProvider.t("navigation.products") },
            list: "/products",
            create: "/products/create",
            edit: "/products/edit/:id",
            show: "/products/show/:id",
          },
          {
            name: "suppliers",
            meta: { label: i18nProvider.t("navigation.suppliers") },
            list: "/suppliers",
            create: "/suppliers/create",
            edit: "/suppliers/edit/:id",
          },
          {
            name: "lots",
            meta: { label: i18nProvider.t("navigation.lots") },
            list: "/lots",
            create: "/lots/create",
          },
          {
            name: "stock-movements",
            meta: { label: i18nProvider.t("navigation.stockMovements") },
            list: "/",
            create: "/stock-movements/create"
          },
        ]}
      >
        <ColorModeProvider>
        <App />
        </ColorModeProvider>
      </Refine>
    </BrowserRouter>
  </StrictMode>,
);
