// Capa de dominio: identidad estable de cada punto de estudio y conteo de
// progreso. Lógica pura.

import type { Certification, Week } from "./entities";

/** Id estable de un punto: `${certId}/w${week}/s${section}/p${point}`. */
export function studyItemId(
  certId: string,
  week: number,
  section: number,
  point: number
): string {
  return `${certId}/w${week}/s${section}/p${point}`;
}

/** Todos los ids de una semana (sección -1 = lista plana sin sections). */
export function collectWeekItemIds(certId: string, week: Week): string[] {
  const ids: string[] = [];
  if (week.sections && week.sections.length > 0) {
    week.sections.forEach((s, si) => {
      s.points.forEach((_, pi) => ids.push(studyItemId(certId, week.week, si, pi)));
    });
  } else {
    week.points.forEach((_, pi) => ids.push(studyItemId(certId, week.week, -1, pi)));
  }
  return ids;
}

/** Todos los ids de una certificación. */
export function collectCertItemIds(certId: string, cert: Certification): string[] {
  return cert.weeks.flatMap((w) => collectWeekItemIds(certId, w));
}

/** Cuántos ids están marcados en el mapa de progreso. */
export function countDone(ids: string[], done: Record<string, boolean>): number {
  return ids.reduce((acc, id) => acc + (done[id] ? 1 : 0), 0);
}
