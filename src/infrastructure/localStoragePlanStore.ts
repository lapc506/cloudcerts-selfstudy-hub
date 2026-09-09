// Capa infrastructure: adaptador del puerto IPlanStore sobre localStorage
// del webview (persistido por Tauri en el data dir de la app).

import type { IPlanStore } from "../domain";
import type { UserState } from "../domain";

const STORAGE_KEY = "cloudcerts_state";

export const localStoragePlanStore: IPlanStore = {
  load(): UserState | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserState;
    } catch {
      return null;
    }
  },
  save(state: UserState): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Error guardando el plan:", err);
    }
  },
};
