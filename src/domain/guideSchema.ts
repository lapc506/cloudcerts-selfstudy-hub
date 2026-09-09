// Capa de dominio: validador puro del esquema YAML de guías de estudio.
// Sin dependencias (solo tipos del dominio). Patrón inspirado en
// kubetauritrader (dsaf-schema + validator del operator): parseo tipado +
// errores ESTRUCTURADOS con path, no booleanos.

import type { BloomLevel, KirkpatrickLevel } from "./entities";

/** Error o advertencia de validación con ruta estructurada (ej. "weeks[4].sections[0].points[1]"). */
export interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

const KIRKPATRICK_LEVELS: KirkpatrickLevel[] = ["L1", "L2", "L3", "L4"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isBloomLevel(v: unknown): v is BloomLevel {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 6;
}

function isHttpsUrl(v: unknown): boolean {
  if (typeof v !== "string") return false;
  try {
    return new URL(v.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

/** Fecha ISO (YYYY-MM-DD, con opcional hora) parseable. */
function isIsoDateString(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!/^\d{4}-\d{2}-\d{2}([T ].*)?$/.test(t)) return false;
  return !Number.isNaN(Date.parse(t));
}

/**
 * Valida una guía ya parseada desde YAML (forma snake_case).
 * Devuelve la lista de issues (vacía = válida). Los "error" bloquean el
 * guardado; los "warning" son pedagógicos (instructional-design-toolkit)
 * y no bloquean.
 */
export function validateGuide(input: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (path: string, message: string): void => {
    issues.push({ path, message, severity: "error" });
  };
  const warn = (path: string, message: string): void => {
    issues.push({ path, message, severity: "warning" });
  };

  if (!isRecord(input)) {
    err("(root)", "La guía debe ser un objeto con id, provider, title, code, cost, summary, meta y weeks.");
    return issues;
  }

  // ── Raíz: strings no vacíos ──────────────────────────────────────
  const rootStrings = ["id", "provider", "title", "code", "cost"] as const;
  for (const field of rootStrings) {
    if (!isNonEmptyString(input[field])) {
      err(field, `"${field}" debe ser un string no vacío.`);
    }
  }
  if (!isNonEmptyString(input["summary"])) {
    err("summary", `"summary" debe ser un string no vacío.`);
  }

  // ── Raíz: prioridad y popularidad ──────────────────────────────
  const dp = input["default_priority"];
  if (typeof dp !== "number" || !Number.isInteger(dp) || dp < 1 || dp > 5) {
    err("default_priority", `"default_priority" debe ser un entero entre 1 y 5.`);
  }
  const pop = input["popularity"];
  if (pop !== undefined && (typeof pop !== "number" || !Number.isInteger(pop) || pop < 1 || pop > 5)) {
    err("popularity", `"popularity" debe ser un entero entre 1 y 5 si está presente.`);
  }

  // ── Meta ─────────────────────────────────────────────────────────
  const meta = input["meta"];
  if (!isRecord(meta)) {
    err("meta", `"meta" es obligatorio y debe ser un objeto.`);
  } else {
    if (!isNonEmptyString(meta["exam_version"])) {
      err("meta.exam_version", `"meta.exam_version" debe ser un string no vacío.`);
    }
    if (!isHttpsUrl(meta["guide_source"])) {
      err("meta.guide_source", `"meta.guide_source" debe ser una URL https válida.`);
    }
    if (!isNonEmptyString(meta["format"])) {
      err("meta.format", `"meta.format" debe ser un string no vacío.`);
    }
    const domains = meta["domains"];
    if (!Array.isArray(domains) || domains.length === 0) {
      err("meta.domains", `"meta.domains" debe ser un array no vacío de strings.`);
    } else {
      domains.forEach((d, i) => {
        if (!isNonEmptyString(d)) {
          err(`meta.domains[${i}]`, `"meta.domains[${i}]" debe ser un string no vacío.`);
        }
      });
    }
    const vy = meta["validity_years"];
    if (typeof vy !== "number" || !Number.isInteger(vy) || vy < 0 || vy > 5) {
      err("meta.validity_years", `"meta.validity_years" debe ser un entero entre 0 (vitalicia) y 5.`);
    }
    const level = meta["level"];
    if (typeof level !== "string" || !/^\d{3} · .+/.test(level)) {
      err("meta.level", `"meta.level" debe matchear /^\\d{3} · .+/ (ej. "200 · Associate").`);
    }
    const bi = meta["badge_image"];
    if (bi !== undefined && !isHttpsUrl(bi)) {
      err("meta.badge_image", `"meta.badge_image" debe ser una URL https válida si está presente.`);
    }
    const vs = meta["verified_sources"];
    if (!Array.isArray(vs) || vs.length === 0) {
      err("meta.verified_sources", `"meta.verified_sources" debe ser un array no vacío.`);
    } else {
      vs.forEach((s, i) => {
        const base = `meta.verified_sources[${i}]`;
        if (!isRecord(s)) {
          err(base, `"${base}" debe ser un objeto con url y date_last_fetched.`);
          return;
        }
        if (!isHttpsUrl(s["url"])) {
          err(`${base}.url`, `"${base}.url" debe ser una URL https válida.`);
        }
        if (!isIsoDateString(s["date_last_fetched"])) {
          err(`${base}.date_last_fetched`, `"${base}.date_last_fetched" debe ser una fecha ISO válida (YYYY-MM-DD).`);
        }
      });
    }
    const versions = meta["versions"];
    if (versions !== undefined) {
      if (!Array.isArray(versions)) {
        err("meta.versions", `"meta.versions" debe ser un array de {code, note} si está presente.`);
      } else {
        versions.forEach((v, i) => {
          const base = `meta.versions[${i}]`;
          if (!isRecord(v)) {
            err(base, `"${base}" debe ser un objeto {code, note}.`);
            return;
          }
          if (!isNonEmptyString(v["code"])) {
            err(`${base}.code`, `"${base}.code" debe ser un string no vacío.`);
          }
          if (!isNonEmptyString(v["note"])) {
            err(`${base}.note`, `"${base}.note" debe ser un string no vacío.`);
          }
        });
      }
    }
  }

  // ── Semanas ──────────────────────────────────────────────────────
  const weeks = input["weeks"];
  let sectionCount = 0;
  let hasL3L4 = false;
  const taggedBlooms: number[] = [];
  if (!Array.isArray(weeks) || weeks.length !== 8) {
    err("weeks", `"weeks" debe ser un array de EXACTAMENTE 8 semanas.`);
  } else {
    const seen = new Set<number>();
    weeks.forEach((w, wi) => {
      const wpath = `weeks[${wi}]`;
      if (!isRecord(w)) {
        err(wpath, `"${wpath}" debe ser un objeto con week, title y sections.`);
        return;
      }
      const wn = w["week"];
      if (typeof wn !== "number" || !Number.isInteger(wn) || wn < 1 || wn > 8) {
        err(`${wpath}.week`, `"${wpath}.week" debe ser un entero entre 1 y 8.`);
      } else {
        if (seen.has(wn)) {
          err(`${wpath}.week`, `Número de semana duplicado: ${wn} (deben ser 1-8 únicos).`);
        }
        seen.add(wn);
      }
      if (!isNonEmptyString(w["title"])) {
        err(`${wpath}.title`, `"${wpath}.title" debe ser un string no vacío.`);
      }
      const sections = w["sections"];
      if (!Array.isArray(sections) || sections.length === 0) {
        err(`${wpath}.sections`, `La semana debe tener al menos 1 sección.`);
      } else {
        sections.forEach((s, si) => {
          const spath = `${wpath}.sections[${si}]`;
          if (!isRecord(s)) {
            err(spath, `"${spath}" debe ser un objeto con domain y points.`);
            return;
          }
          sectionCount++;
          if (!isNonEmptyString(s["domain"])) {
            err(`${spath}.domain`, `"${spath}.domain" debe ser un string no vacío.`);
          }
          const points = s["points"];
          if (!Array.isArray(points) || points.length === 0) {
            err(`${spath}.points`, `La sección debe tener al menos 1 punto de contenido.`);
          } else {
            points.forEach((p, pi) => {
              if (!isNonEmptyString(p)) {
                err(`${spath}.points[${pi}]`, `"${spath}.points[${pi}]" debe ser un string no vacío.`);
              }
            });
          }
          const bloom = s["bloom"];
          if (bloom !== undefined) {
            if (!isBloomLevel(bloom)) {
              err(`${spath}.bloom`, `"${spath}.bloom" debe ser un entero entre 1 y 6 si está presente.`);
            } else {
              taggedBlooms.push(bloom);
            }
          }
          const kirk = s["kirkpatrick"];
          if (kirk !== undefined) {
            const k = typeof kirk === "string" ? kirk.trim().toUpperCase() : "";
            if (!KIRKPATRICK_LEVELS.includes(k as KirkpatrickLevel)) {
              err(`${spath}.kirkpatrick`, `"${spath}.kirkpatrick" debe ser uno de L1, L2, L3, L4 si está presente.`);
            } else if (k === "L3" || k === "L4") {
              hasL3L4 = true;
            }
          }
          // ── Advertencias pedagógicas por sección ──
          if (!isNonEmptyString(s["weight"])) {
            warn(`${spath}.weight`, `Sección sin ponderación ("weight"): el peso del dominio orienta el estudio.`);
          }
          if (bloom === undefined) {
            warn(spath, `Sección sin etiqueta Bloom: agregá "bloom: 1-6" para explicitar el nivel cognitivo.`);
          }
          if (kirk === undefined) {
            warn(spath, `Sección sin etiqueta Kirkpatrick: agregá "kirkpatrick: L1-L4" para explicitar la evidencia.`);
          }
        });
      }
    });
    for (let n = 1; n <= 8; n++) {
      if (!seen.has(n)) {
        err("weeks", `Falta la semana ${n} (las semanas deben ser 1-8 únicas).`);
      }
    }
  }

  // ── Advertencias pedagógicas globales ────────────────────────────
  if (sectionCount > 0 && !hasL3L4) {
    warn("(guide)", "Sin cobertura L3/L4: ninguna sección evidencia Kirkpatrick L3 (Behavior) o L4 (Results).");
  }
  if (taggedBlooms.length > 0 && taggedBlooms.every((b) => b <= 2)) {
    warn("(guide)", "Perfil Bloom plano: todos los niveles etiquetados son ≤ 2 (solo Remember/Understand).");
  }

  return issues;
}
