// Capa infrastructure: adaptador del puerto IProgressStore.
// En runtime Tauri persiste en SQLite (tabla progress de cloudcerts.db);
// fuera de Tauri cae a localStorage.

import type { IProgressStore } from "../domain";
import { getAppDb } from "./sqliteDb";

const LS_KEY = "cloudcerts_progress";

export const sqliteProgressStore: IProgressStore = {
  async load(): Promise<Record<string, boolean>> {
    const db = await getAppDb();
    if (db) {
      try {
        const rows = await db.select<{ item_id: string; done: number }[]>(
          "SELECT item_id, done FROM progress"
        );
        return Object.fromEntries(rows.map((r) => [r.item_id, r.done === 1]));
      } catch (err) {
        console.error("Error leyendo progreso:", err);
        return {};
      }
    }
    try {
      return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "{}") as Record<
        string,
        boolean
      >;
    } catch {
      return {};
    }
  },

  async save(done: Record<string, boolean>): Promise<void> {
    const db = await getAppDb();
    if (db) {
      try {
        const entries = Object.entries(done).filter(([, d]) => d);
        await db.execute("DELETE FROM progress WHERE done = 0");
        for (const [id] of entries) {
          await db.execute(
            "INSERT OR REPLACE INTO progress (item_id, done) VALUES ($1, 1)",
            [id]
          );
        }
      } catch (err) {
        console.error("Error guardando progreso:", err);
      }
      return;
    }
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(done));
    } catch (err) {
      console.error("Error guardando progreso:", err);
    }
  },
};
