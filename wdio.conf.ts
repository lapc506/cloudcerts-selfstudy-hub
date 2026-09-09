// WebdriverIO E2E contra el binario Tauri real.
// CI-gated: requiere binario release + display (xvfb en Linux).
// Framework mocha (default oficial; evita el caveat BDD describe/it de Nightwatch).
// Ref: https://webdriver.io/docs/desktop-testing/tauri/quick-start/
export const config = {
  runner: "local",
  specs: ["./test/e2e/**/*.spec.ts"],
  maxInstances: 1,

  services: [
    [
      "@wdio/tauri-service",
      {
        appBinaryPath: "./src-tauri/target/release/cloudcerts-selfstudy-hub",
        driverProvider: "embedded",
      },
    ],
  ],

  capabilities: [
    {
      browserName: "tauri",
      "tauri:options": {
        application: "./src-tauri/target/release/cloudcerts-selfstudy-hub",
      },
    },
  ],

  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
