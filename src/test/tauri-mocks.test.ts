// Contrato del mock runtime Tauri: mockIPC + spies + mockWindows.
// Patrón literal de la doc oficial (clearMocks global en src/test/setup.ts).
// Ref: https://v2.tauri.app/develop/tests/mocking/
import { expect, test, vi } from "vitest";
import { mockIPC, mockWindows } from "@tauri-apps/api/mocks";
import { invoke } from "@tauri-apps/api/core";
import { getAllWindows, getCurrentWindow } from "@tauri-apps/api/window";

type TauriInternals = { invoke: (...args: never[]) => Promise<unknown> };

function tauriInternals(): TauriInternals {
  return (window as unknown as { __TAURI_INTERNALS__: TauriInternals })
    .__TAURI_INTERNALS__;
}

test("mockIPC intercepta invoke y el spy registra la llamada", async () => {
  mockIPC((cmd, args) => {
    if (cmd === "add") {
      const { a, b } = args as unknown as { a: number; b: number };
      return a + b;
    }
    return null;
  });
  const spy = vi.spyOn(tauriInternals(), "invoke");
  await expect(invoke("add", { a: 12, b: 15 })).resolves.toBe(27);
  expect(spy).toHaveBeenCalled();
});

test("mockWindows simula ventana actual y adicionales", async () => {
  mockWindows("main", "second", "third");
  // getAllWindows() es async: invoca plugin:window|get_all_windows por debajo.
  mockIPC((cmd) => {
    if (cmd === "plugin:window|get_all_windows") {
      return ["main", "second", "third"];
    }
    return null;
  });
  expect(getCurrentWindow().label).toBe("main");
  expect((await getAllWindows()).map((w) => w.label)).toEqual([
    "main",
    "second",
    "third",
  ]);
});
