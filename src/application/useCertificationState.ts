// Capa application: caso de uso del plan de certificaciones.
// Orquesta el dominio (defaultPlan, parsePriority) con el puerto IPlanStore.
// No importa infrastructure: el store concreto lo inyecta la composition root.

import { useState, useCallback, useEffect } from "react";
import type { Certification, IPlanStore, Priority, UserState } from "../domain";
import { defaultPlan, parsePriority } from "../domain";

function load(store: IPlanStore, catalog: Certification[]): UserState {
  if (typeof window === "undefined") return defaultPlan(catalog);
  const base = defaultPlan(catalog);
  const parsed = store.load();
  if (!parsed) return base;
  const storedPriorities = (parsed.priority ?? {}) as Record<string, unknown>;
  const migrated: Record<string, Priority> = { ...base.priority };
  for (const [k, v] of Object.entries(storedPriorities)) {
    migrated[k] = parsePriority(v);
  }
  return {
    interested: { ...base.interested, ...(parsed.interested ?? {}) },
    priority: migrated,
    selectedGuides: parsed.selectedGuides ?? base.selectedGuides,
  };
}

export function useCertificationState(store: IPlanStore, catalog: Certification[]) {
  const [state, setState] = useState<UserState>(() => load(store, catalog));

  useEffect(() => {
    store.save(state);
  }, [store, state]);

  const toggleInterest = useCallback((id: string, checked: boolean) => {
    setState((s) => ({ ...s, interested: { ...s.interested, [id]: checked } }));
  }, []);

  const changePriority = useCallback((id: string, val: Priority) => {
    setState((s) => ({ ...s, priority: { ...s.priority, [id]: val } }));
  }, []);

  const toggleGuideSelection = useCallback((id: string) => {
    setState((s) => {
      const has = s.selectedGuides.includes(id);
      return {
        ...s,
        selectedGuides: has
          ? s.selectedGuides.filter((g) => g !== id)
          : [...s.selectedGuides, id],
      };
    });
  }, []);

  const setSelectedGuides = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, selectedGuides: ids }));
  }, []);

  /** Escritura explícita del plan en el store (además del auto-guardado). */
  const flush = useCallback(() => {
    setState((s) => {
      store.save(s);
      return s;
    });
  }, [store]);

  return {
    state,
    toggleInterest,
    changePriority,
    toggleGuideSelection,
    setSelectedGuides,
    flush,
  };
}
