// Setup común de tests unitarios (proyecto `unit`, entorno jsdom).
// Patrón oficial Tauri: jsdom no trae WebCrypto y los mocks exigen
// limpiar el estado entre tests (clearMocks).
// Ref: https://v2.tauri.app/develop/tests/mocking/
import { afterEach, beforeAll } from "vitest";
import { randomFillSync } from "node:crypto";
import { clearMocks } from "@tauri-apps/api/mocks";

beforeAll(() => {
  Object.defineProperty(window, "crypto", {
    value: {
      getRandomValues: (buffer: Uint8Array) => randomFillSync(buffer),
    },
  });
});

afterEach(() => {
  clearMocks();
});
