// Capa de dominio: value object Prioridad 1–5 (5 = máxima).
// Se muestra como 🎓 repetidos, de mayor a menor. Lógica pura.

/** Prioridad 1–5 (5 = máxima). Se muestra como 🎓 repetidos, de mayor a menor. */
export type Priority = 1 | 2 | 3 | 4 | 5;

function clampPriority(n: number): Priority {
  if (n >= 5) return 5;
  if (n <= 1) return 1;
  return Math.round(n) as Priority;
}

/** Acepta el formato nuevo (1–5) y migra el legado ("High"|"Medium"|"Low"). */
export function parsePriority(v: unknown): Priority {
  if (typeof v === "number" && Number.isFinite(v)) return clampPriority(v);
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "high" || s === "5") return 5;
    if (s === "4") return 4;
    if (s === "medium" || s === "3") return 3;
    if (s === "2") return 2;
    if (s === "low" || s === "1") return 1;
  }
  return 3;
}

/** "🎓".repeat(n), ej. priorityCaps(4) → "🎓🎓🎓🎓". */
export function priorityCaps(p: unknown): string {
  return "🎓".repeat(parsePriority(p));
}

/** Popularidad 1–5 en el mercado (🔥). Atributo por certificación. */
export type Popularity = 1 | 2 | 3 | 4 | 5;

function clampPopularity(n: number): Popularity {
  if (n >= 5) return 5;
  if (n <= 1) return 1;
  return Math.round(n) as Popularity;
}

export function parsePopularity(v: unknown): Popularity {
  if (typeof v === "number" && Number.isFinite(v)) return clampPopularity(v);
  return 3;
}

/** "🔥".repeat(n), ej. popularityFlames(5) → "🔥🔥🔥🔥🔥". */
export function popularityFlames(p: unknown): string {
  return "🔥".repeat(parsePopularity(p));
}
