// Capa infrastructure: directorio curado de recursos (YAML-first).
// Fuente: src/content/resources.yaml (solo URLs https verificadas).

import { parse } from "yaml";
import rawYaml from "../content/resources.yaml?raw";

export interface ResourceLink {
  label: string;
  url: string;
}

export interface ProviderResources {
  cheatsheets: ResourceLink[];
  labs: ResourceLink[];
  guides: ResourceLink[];
}

export interface ResourceDirectory {
  version: number;
  providers: Record<string, ProviderResources>;
}

export interface ResourceIssue {
  path: string;
  message: string;
}

const GROUPS = ["cheatsheets", "labs", "guides"] as const;

function isHttpsUrl(v: unknown): v is string {
  return typeof v === "string" && /^https:\/\//.test(v);
}

/** Parsea y valida el directorio. Retorna issues (vacío = válido). */
export function loadResourceDirectory(): {
  directory: ResourceDirectory;
  issues: ResourceIssue[];
} {
  const issues: ResourceIssue[] = [];
  const empty: ResourceDirectory = { version: 0, providers: {} };
  let doc: unknown;
  try {
    doc = parse(rawYaml);
  } catch (err) {
    return { directory: empty, issues: [{ path: "(root)", message: `YAML inválido: ${String(err)}` }] };
  }
  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    return { directory: empty, issues: [{ path: "(root)", message: "El directorio debe ser un objeto con version y providers." }] };
  }
  const rec = doc as Record<string, unknown>;
  if (typeof rec["version"] !== "number") {
    issues.push({ path: "version", message: `"version" debe ser un número.` });
  }
  const providers = rec["providers"];
  if (typeof providers !== "object" || providers === null || Array.isArray(providers)) {
    issues.push({ path: "providers", message: `"providers" debe ser un objeto por proveedor.` });
    return { directory: { version: 0, providers: {} }, issues };
  }
  const out: Record<string, ProviderResources> = {};
  for (const [provider, entry] of Object.entries(providers as Record<string, unknown>)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      issues.push({ path: `providers.${provider}`, message: "Debe ser un objeto con cheatsheets/labs/guides." });
      continue;
    }
    const erec = entry as Record<string, unknown>;
    const groups: ProviderResources = { cheatsheets: [], labs: [], guides: [] };
    for (const g of GROUPS) {
      const list = erec[g] ?? [];
      if (!Array.isArray(list)) {
        issues.push({ path: `providers.${provider}.${g}`, message: "Debe ser un array de {label, url}." });
        continue;
      }
      list.forEach((item, i) => {
        const base = `providers.${provider}.${g}[${i}]`;
        if (typeof item !== "object" || item === null || Array.isArray(item)) {
          issues.push({ path: base, message: "Debe ser un objeto {label, url}." });
          return;
        }
        const { label, url } = item as Record<string, unknown>;
        if (typeof label !== "string" || label.trim().length === 0) {
          issues.push({ path: `${base}.label`, message: "label no vacío requerido." });
          return;
        }
        if (!isHttpsUrl(url)) {
          issues.push({ path: `${base}.url`, message: "url https válida requerida." });
          return;
        }
        groups[g].push({ label: label.trim(), url });
      });
    }
    out[provider] = groups;
  }
  return {
    directory: { version: typeof rec["version"] === "number" ? rec["version"] : 0, providers: out },
    issues,
  };
}

const EMPTY_GROUPS: ProviderResources = { cheatsheets: [], labs: [], guides: [] };

/** Recursos de un proveedor ([] si no hay curaduría). */
export function resourcesFor(provider: string): ProviderResources {
  const { directory, issues } = loadResourceDirectory();
  if (issues.length > 0) return EMPTY_GROUPS;
  return directory.providers[provider] ?? EMPTY_GROUPS;
}
