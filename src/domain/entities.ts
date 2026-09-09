// Capa de dominio: entidades del núcleo. Sin dependencias externas.

import type { Popularity, Priority } from "./priority";

export interface Certification {
  id: string;
  provider: string;
  providerColor: string;
  title: string;
  code: string;
  cost: string;
  defaultPriority: Priority;
  popularity: Popularity;
  summary: string;
  weeks: Week[];
  meta?: CertificationMeta;
}

export interface Week {
  week: number;
  title: string;
  points: string[];
  /** Agrupación opcional del contenido por área de dominio del examen. */
  sections?: WeekSection[];
}

export interface WeekSection {
  /** Área de dominio del examen (nombre según la guía oficial). */
  domain: string;
  /** Ponderación opcional del dominio en el examen (ej. "20%"). */
  weight?: string;
  points: string[];
  /** Nivel cognitivo Bloom 1-6 (toolkit instructional-design: Recognize→Ship). */
  bloom?: BloomLevel;
  /** Nivel Kirkpatrick L1-L4 que evidencia el bloque (Reaction→Results). */
  kirkpatrick?: KirkpatrickLevel;
}

/** Taxonomía de Bloom adaptada a builders (instructional-design-toolkit). */
export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const BLOOM_LABELS: Record<BloomLevel, string> = {
  1: "Remember · Recognize",
  2: "Understand · Explain",
  3: "Apply · Build",
  4: "Analyze · Debug & Evaluate",
  5: "Evaluate · Decide",
  6: "Create · Ship",
};

/** Niveles Kirkpatrick (instructional-design-toolkit). */
export type KirkpatrickLevel = "L1" | "L2" | "L3" | "L4";

export const KIRKPATRICK_LABELS: Record<KirkpatrickLevel, string> = {
  L1: "L1 · Reaction",
  L2: "L2 · Learning",
  L3: "L3 · Behavior",
  L4: "L4 · Results",
};

/** Control de versiones & vigencia del examen (basado en la guía oficial vigente). */
export interface CertificationMeta {
  /** Versión de la guía oficial, p. ej. "Version 2.3 SOA-C02". */
  examVersion: string;
  /** Fecha de emisión/actualización de la guía vigente (ISO). */
  guideDate: string;
  /** URL de la guía oficial del examen. */
  guideSource: string;
  /** Formato del examen (preguntas, duración, tipo). */
  format: string;
  /** Nota de aprobación. */
  passingScore: string;
  /** Dominios del examen con su ponderación. */
  domains: string[];
  /** Nivel de dificultad (ej. "100 · Foundational", "200 · Associate"). */
  level: string;
  /** Años de validez de la certificación. */
  validityYears: number;
  /** Plazo / ventana para recertificarse. */
  recertWindow: string;
  /** Opciones de recertificación. */
  recertOptions: string[];
  /** Descuentos disponibles para recertificación. */
  recertDiscount: string;
  /** Historial de versiones/códigos del examen (control de versiones). */
  versions: { code: string; note: string }[];
  /** PDFs oficiales verificados (guía del examen) con fecha de verificación. */
  verifiedSources: VerifiedSource[];
  /** URL de la insignia oficial (ej. Credly CDN). Opcional. */
  badgeImage?: string;
  /** Roles/career paths donde ubica esta certificación (ej. "Solutions Architect"). */
  careerPaths: string[];
}

/** PDF oficial verificado de la guía del examen. */
export interface VerifiedSource {
  url: string;
  dateLastFetched: string;
  label: string;
}

export interface UserState {
  interested: Record<string, boolean>;
  priority: Record<string, Priority>;
  selectedGuides: string[];
}

export type View = "home" | "progress" | "guides" | "editor" | "badges" | "codelabs" | "mocks";

/** Preferencias visuales (shape de datos; el tema MUI vive en presentation). */
export interface ThemeSettings {
  mode: "light" | "dark";
  seed: string;
  font: string;
}

/** Estado inicial derivado del catálogo (lógica pura de dominio). */
export function defaultPlan(catalog: Certification[]): UserState {
  const interested: Record<string, boolean> = {};
  const priority: Record<string, Priority> = {};
  catalog.forEach((c) => {
    interested[c.id] = true;
    priority[c.id] = c.defaultPriority;
  });
  return {
    interested,
    priority,
    selectedGuides: catalog.some((c) => c.id === "aws-sysops") ? ["aws-sysops"] : [],
  };
}

/** Preferencias visuales por defecto (única fuente de verdad; presentation las reutiliza). */
export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: "dark",
  seed: "#38bdf8",
  font: "ibm-plex-mono",
};

/** Etiqueta de vigencia: 0 años = credencial vitalicia (ej. Azure Fundamentals). */
export function formatValidity(years: number): string {
  if (!years || years <= 0) return "vitalicia";
  return `${years} año${years === 1 ? "" : "s"}`;
}
