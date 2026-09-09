// Capa infrastructure: proyectos de portafolio por certificación (YAML-first).
// Fuente: src/content/projects.yaml (solo URLs https verificadas).

import { parse } from "yaml";
import rawYaml from "../content/projects.yaml?raw";

export interface PortfolioProject {
  name: string;
  tier: string;
  hours: string;
  url: string;
}

export interface PortfolioRoadmap {
  label: string;
  url: string;
}

export interface CertPortfolio {
  projects: PortfolioProject[];
  roadmaps: PortfolioRoadmap[];
}

export interface PortfolioIssue {
  path: string;
  message: string;
}

function isHttpsUrl(v: unknown): v is string {
  return typeof v === "string" && /^https:\/\//.test(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Parsea y valida el directorio. Retorna issues (vacío = válido). */
export function loadPortfolioDirectory(): {
  certs: Record<string, CertPortfolio>;
  issues: PortfolioIssue[];
} {
  const issues: PortfolioIssue[] = [];
  let doc: unknown;
  try {
    doc = parse(rawYaml);
  } catch (err) {
    return { certs: {}, issues: [{ path: "(root)", message: `YAML inválido: ${String(err)}` }] };
  }
  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    return { certs: {}, issues: [{ path: "(root)", message: "El directorio debe ser un objeto con certs." }] };
  }
  const certs = (doc as Record<string, unknown>)["certs"];
  if (typeof certs !== "object" || certs === null || Array.isArray(certs)) {
    return { certs: {}, issues: [{ path: "certs", message: `"certs" debe ser un objeto por cert id.` }] };
  }
  const out: Record<string, CertPortfolio> = {};
  for (const [certId, entry] of Object.entries(certs as Record<string, unknown>)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      issues.push({ path: `certs.${certId}`, message: "Debe ser un objeto con projects/roadmaps." });
      continue;
    }
    const erec = entry as Record<string, unknown>;
    const projects: PortfolioProject[] = [];
    const roadmaps: PortfolioRoadmap[] = [];
    const plist = erec["projects"] ?? [];
    if (!Array.isArray(plist)) {
      issues.push({ path: `certs.${certId}.projects`, message: "Debe ser un array." });
    } else {
      plist.forEach((p, i) => {
        const base = `certs.${certId}.projects[${i}]`;
        if (typeof p !== "object" || p === null || Array.isArray(p)) {
          issues.push({ path: base, message: "Debe ser {name, tier, hours, url}." });
          return;
        }
        const { name, tier, hours, url } = p as Record<string, unknown>;
        if (!isNonEmptyString(name) || !isNonEmptyString(tier) || !isNonEmptyString(hours)) {
          issues.push({ path: base, message: "name, tier y hours no vacíos requeridos." });
          return;
        }
        if (!isHttpsUrl(url)) {
          issues.push({ path: `${base}.url`, message: "url https válida requerida." });
          return;
        }
        projects.push({ name: name.trim(), tier: tier.trim(), hours: hours.trim(), url });
      });
    }
    const rlist = erec["roadmaps"] ?? [];
    if (!Array.isArray(rlist)) {
      issues.push({ path: `certs.${certId}.roadmaps`, message: "Debe ser un array." });
    } else {
      rlist.forEach((r, i) => {
        const base = `certs.${certId}.roadmaps[${i}]`;
        if (typeof r !== "object" || r === null || Array.isArray(r)) {
          issues.push({ path: base, message: "Debe ser {label, url}." });
          return;
        }
        const { label, url } = r as Record<string, unknown>;
        if (!isNonEmptyString(label)) {
          issues.push({ path: `${base}.label`, message: "label no vacío requerido." });
          return;
        }
        if (!isHttpsUrl(url)) {
          issues.push({ path: `${base}.url`, message: "url https válida requerida." });
          return;
        }
        roadmaps.push({ label: label.trim(), url });
      });
    }
    out[certId] = { projects, roadmaps };
  }
  return { certs: out, issues };
}

const EMPTY: CertPortfolio = { projects: [], roadmaps: [] };

/** Portafolio de una certificación (vacío si no hay curaduría). */
export function portfolioFor(certId: string): CertPortfolio {
  const { certs, issues } = loadPortfolioDirectory();
  if (issues.length > 0) return EMPTY;
  return certs[certId] ?? EMPTY;
}
