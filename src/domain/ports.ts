// Capa de dominio: puertos (interfaces). Las implementaciones concretas
// viven en infrastructure; application/presentation solo dependen de esto.

import type { Certification, ThemeSettings, UserState } from "./entities";
import type { ValidationIssue } from "./guideSchema";
import type { MockDocKind, MockExam, QuestionBank } from "./mockExam";
import type { MockValidationIssue } from "./mockSchema";

/** Catálogo de certificaciones y guías (fuente de datos del plan). */
export interface ICertificationRepository {
  list(): Certification[];
  getYaml(id: string): string;
  /** Persiste el YAML editado; false si es inválido o sin 8 semanas. */
  saveYaml(yamlText: string): boolean;
  /** Issues estructurados de la última corrida de validación. */
  getLastValidationIssues(): ValidationIssue[];
}

/** Persistencia del plan del usuario (intereses, prioridades, selección). */
export interface IPlanStore {
  load(): UserState | null;
  save(state: UserState): void;
}

/** Persistencia de las preferencias visuales. */
export interface ISettingsStore {
  load(): Promise<ThemeSettings>;
  save(settings: ThemeSettings): Promise<void>;
}

/** Persistencia del progreso de estudio (checks por punto de contenido). */
export interface IProgressStore {
  load(): Promise<Record<string, boolean>>;
  save(done: Record<string, boolean>): Promise<void>;
}

/** Question banks y mock exams (referencias compartidas a preguntas). */
export interface IMockExamRepository {
  listBanks(): QuestionBank[];
  listMocks(): MockExam[];
  getYaml(kind: MockDocKind, id: string): string;
  /** Persiste el YAML; false si no valida. */
  saveYaml(kind: MockDocKind, yamlText: string): boolean;
  getLastValidationIssues(): MockValidationIssue[];
}
