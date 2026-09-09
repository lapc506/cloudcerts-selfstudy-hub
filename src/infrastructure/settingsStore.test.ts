// Integración del adaptador de settings contra SQLite simulado con mockIPC.
// Usa los comandos IPC reales del plugin-sql instalado:
// plugin:sql|load, plugin:sql|execute, plugin:sql|select.
// Ref: https://v2.tauri.app/develop/tests/mocking/
import { beforeEach, expect, test, vi } from "vitest";
import { mockIPC } from "@tauri-apps/api/mocks";
import { DEFAULT_THEME_SETTINGS } from "../domain";

type SqlArgs = {
  db?: number;
  query?: string;
  values?: unknown[];
};

/** Importa el módulo fresco (resetea el singleton dbPromise entre tests). */
async function freshStore() {
  vi.resetModules();
  return import("./settingsStore");
}

beforeEach(() => {
  window.localStorage.clear();
});

test("roundtrip SQLite: save → load vía comandos plugin:sql mockeados", async () => {
  const disk = new Map<string, string>();
  mockIPC((cmd, raw) => {
    const args = (raw ?? {}) as SqlArgs;
    if (cmd === "plugin:sql|load") return 1;
    if (cmd === "plugin:sql|execute") {
      if (args.query?.startsWith("INSERT") && Array.isArray(args.values)) {
        disk.set(String(args.values[0]), String(args.values[1]));
      }
      return [];
    }
    if (cmd === "plugin:sql|select") {
      const v = disk.get("theme");
      return v === undefined ? [] : [{ value: v }];
    }
    return [];
  });

  const first = await freshStore();
  const theme = { ...DEFAULT_THEME_SETTINGS, seed: "test-seed" };
  await first.saveSettings(theme);

  const second = await freshStore();
  expect(await second.loadSettings()).toEqual(theme);
});

test("sin runtime Tauri cae a localStorage", async () => {
  const { saveSettings, loadSettings } = await freshStore();
  await saveSettings(DEFAULT_THEME_SETTINGS);
  // LS_KEY interno del adaptador ("cloudcerts_theme").
  const raw = window.localStorage.getItem("cloudcerts_theme");
  expect(raw).not.toBeNull();
  expect(JSON.parse(raw as string)).toEqual(DEFAULT_THEME_SETTINGS);
  expect(await loadSettings()).toEqual(DEFAULT_THEME_SETTINGS);
});
