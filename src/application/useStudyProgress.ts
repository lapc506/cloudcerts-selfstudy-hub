// Capa application: caso de uso del progreso de estudio.
// Estado optimista en memoria + persistencia vía el puerto IProgressStore.

import { useState, useCallback, useEffect } from "react";
import type { IProgressStore } from "../domain";

export function useStudyProgress(store: IProgressStore) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    store.load().then((d) => {
      if (active) setDone(d);
    });
    return () => {
      active = false;
    };
  }, [store]);

  const toggle = useCallback(
    (id: string) => {
      setDone((prev) => {
        const next = { ...prev };
        if (next[id]) delete next[id];
        else next[id] = true;
        void store.save(next);
        return next;
      });
    },
    [store]
  );

  /** Escritura explícita del progreso en el store. */
  const flush = useCallback(() => {
    setDone((prev) => {
      void store.save(prev);
      return prev;
    });
  }, [store]);

  return { done, toggle, flush };
}
