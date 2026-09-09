// Capa infrastructure: conexión SQLite compartida de la app
// (settings + progress en un solo archivo cloudcerts.db).
// Retorna null fuera del runtime Tauri (los adaptadores caen a localStorage).

import Database from "@tauri-apps/plugin-sql";

let dbPromise: Promise<Database | null> | null = null;

export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function getAppDb(): Promise<Database | null> {
  if (!isTauriRuntime()) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = Database.load("sqlite:cloudcerts.db")
      .then(async (db) => {
        await db.execute(
          "CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"
        );
        await db.execute(
          "CREATE TABLE IF NOT EXISTS progress (item_id TEXT PRIMARY KEY, done INTEGER NOT NULL)"
        );
        return db;
      })
      .catch((err) => {
        console.error("Error abriendo SQLite:", err);
        return null;
      });
  }
  return dbPromise;
}
