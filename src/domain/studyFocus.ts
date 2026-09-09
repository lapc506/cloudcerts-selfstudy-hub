// Capa de dominio: foco de estudio y chuleta derivadas de la guía + progreso.
// Lógica pura (sin UI): qué dominio pesa más pendiente y qué semana sigue.

import type { Certification } from "./entities";
import { studyItemId } from "./progress";

export interface DomainFocus {
  domain: string;
  weight: number;
  total: number;
  remaining: number;
}

export interface CheatsheetDomain {
  domain: string;
  weight: number;
  points: string[];
}

/** Extrae el número de un peso ("24%" → 24, ausente → 0). */
export function parseWeightPercent(w: unknown): number {
  if (typeof w !== "string") return 0;
  const m = w.match(/([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

/** Dominios con puntos pendientes, ordenados por peso × pendiente (desc). */
export function collectDomainFocus(
  certId: string,
  cert: Certification,
  done: Record<string, boolean>
): DomainFocus[] {
  const map = new Map<string, DomainFocus>();
  cert.weeks.forEach((w) => {
    const sections =
      w.sections && w.sections.length > 0
        ? w.sections.map((s, si) => ({ domain: s.domain, weight: s.weight, points: s.points, si }))
        : [{ domain: `Semana ${w.week}`, weight: undefined, points: w.points, si: -1 }];
    sections.forEach((s) => {
      const ids = s.points.map((_, pi) => studyItemId(certId, w.week, s.si, pi));
      const remaining = ids.filter((id) => !done[id]).length;
      const prev = map.get(s.domain) ?? { domain: s.domain, weight: 0, total: 0, remaining: 0 };
      prev.total += ids.length;
      prev.remaining += remaining;
      prev.weight = Math.max(prev.weight, parseWeightPercent(s.weight));
      map.set(s.domain, prev);
    });
  });
  return [...map.values()]
    .filter((f) => f.remaining > 0)
    .sort((a, b) => b.weight * b.remaining - a.weight * a.remaining);
}

/** Primera semana con puntos pendientes (null si la guía está completa). */
export function firstIncompleteWeek(
  certId: string,
  cert: Certification,
  done: Record<string, boolean>
): number | null {
  for (const w of cert.weeks) {
    const sections =
      w.sections && w.sections.length > 0
        ? w.sections.map((s, si) => ({ points: s.points, si }))
        : [{ points: w.points, si: -1 }];
    const pending = sections.some((s) =>
      s.points.some((_, pi) => !done[studyItemId(certId, w.week, s.si, pi)])
    );
    if (pending) return w.week;
  }
  return null;
}

/** Agrupa los puntos por dominio (para la chuleta imprimible). */
export function compileCheatsheet(cert: Certification): CheatsheetDomain[] {
  const map = new Map<string, CheatsheetDomain>();
  cert.weeks.forEach((w) => {
    const sections =
      w.sections && w.sections.length > 0
        ? w.sections.map((s) => ({ domain: s.domain, weight: s.weight, points: s.points }))
        : [{ domain: `Semana ${w.week}`, weight: undefined, points: w.points }];
    sections.forEach((s) => {
      const prev = map.get(s.domain) ?? { domain: s.domain, weight: 0, points: [] };
      prev.points.push(...s.points);
      prev.weight = Math.max(prev.weight, parseWeightPercent(s.weight));
      map.set(s.domain, prev);
    });
  });
  return [...map.values()].sort((a, b) => b.weight - a.weight);
}
