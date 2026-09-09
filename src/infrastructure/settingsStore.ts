// Capa infrastructure: adaptador del puerto ISettingsStore.
// En runtime Tauri persiste en SQLite (plugin-sql); fuera de Tauri (navegador)
// cae a localStorage. La UI solo depende del puerto (domain/ports.ts).

import type { ISettingsStore } from "../domain";
import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from "../domain";
import { getAppDb } from "./sqliteDb";

const LS_KEY = "cloudcerts_theme";

function sanitize(partial: Partial<ThemeSettings>): ThemeSettings {
  return {
    mode: partial.mode ?? DEFAULT_THEME_SETTINGS.mode,
    seed: partial.seed ?? DEFAULT_THEME_SETTINGS.seed,
    font: partial.font ?? DEFAULT_THEME_SETTINGS.font,
  };
}

export async function loadSettings(): Promise<ThemeSettings> {
  try {
    const db = await getAppDb();
    if (db) {
      const rows = await db.select<{ value: string }[]>(
        "SELECT value FROM settings WHERE key = $1",
        ["theme"]
      );
      if (rows.length > 0) {
        return sanitize(JSON.parse(rows[0].value));
      }
    } else {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) return sanitize(JSON.parse(raw));
    }
  } catch (err) {
    console.error("Error cargando configuración:", err);
  }
  return DEFAULT_THEME_SETTINGS;
}

export async function saveSettings(settings: ThemeSettings): Promise<void> {
  try {
    const db = await getAppDb();
    if (db) {
      await db.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES ($1, $2)",
        ["theme", JSON.stringify(settings)]
      );
    } else {
      window.localStorage.setItem(LS_KEY, JSON.stringify(settings));
    }
  } catch (err) {
    console.error("Error guardando configuración:", err);
  }
}

/** Instancia del adaptador (la composition root la inyecta). */
export const settingsStore: ISettingsStore = {
  load: loadSettings,
  save: saveSettings,
};
