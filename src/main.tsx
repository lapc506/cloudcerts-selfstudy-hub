import React from "react";
import ReactDOM from "react-dom/client";
// Fuente por defecto (carga inicial); el resto bajo demanda vía ensureFontFamily.
// Roboto se eliminó: el tema fija fontFamily global y nunca se renderiza.
import "@fontsource/ibm-plex-mono/300.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/700.css";
import App from "./App";
import AppThemeHost from "./presentation/AppThemeHost";
import { settingsStore } from "./infrastructure/settingsStore";
// Plugin E2E de WebdriverIO (inerte sin driver; requerido por @wdio/tauri-service).
// Ref: https://webdriver.io/docs/desktop-testing/tauri/plugin-setup
import "@wdio/tauri-plugin";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppThemeHost store={settingsStore}>
      <App />
    </AppThemeHost>
  </React.StrictMode>
);