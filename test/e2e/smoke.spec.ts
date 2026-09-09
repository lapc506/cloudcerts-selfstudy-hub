// Smoke E2E: la app real arranca y renderiza el shell.
// Se ejecuta con: npm run test:e2e (requiere `npx tauri build` previo + display).
import { $, browser, expect } from "@wdio/globals";

describe("CloudCerts SelfStudy Hub", () => {
  it("muestra la ventana principal con el título del producto", async () => {
    await browser.pause(800);
    await expect(browser).toHaveTitle(/CloudCert/);
    await expect(await $("#root")).toExist();
  });
});
