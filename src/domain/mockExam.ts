// Capa de dominio: question banks y mock exams (alineado al toolkit
// instructional-design: quiz scenario-based, explicaciones que enseñan,
// tiers Foundation/Application/Integration, passing 70%, retry).

/** Tier de dificultad del ítem (write-quiz protocol). */
export type QuestionTier = "foundation" | "application" | "integration";

export interface BankQuestion {
  id: string;
  text: string;
  choices: BankChoice[];
  /** Índices (0-based) de las respuestas correctas. */
  answer: number[];
  /** Explicación que enseña (2-3 oraciones): por qué es correcta y por qué no las demás. */
  explanation: string;
  domain?: string;
  bloom?: number;
  tier?: QuestionTier;
  /** Puntaje de la pregunta (Canvas: points_possible). Default 1. */
  points?: number;
  /** Citas oficiales donde se valida la respuesta (URL + fechas). */
  sources?: QuestionJustificationCitationSource[];
}

/** Opción con su justificación individual (por qué es correcta o no). */
export interface BankChoice {
  text: string;
  justification: string;
  /** Citas oficiales de esta justificación (URL + fechas). */
  sources?: QuestionJustificationCitationSource[];
}

/** Cita de documentación oficial que respalda la justificación de una respuesta. */
export interface QuestionJustificationCitationSource {
  url: string;
  /** Fecha de última revisión del documento fuente (si la publica). */
  lastRevised?: string;
  /** Fecha en que se verificó la cita. */
  lastFetched: string;
  note?: string;
}

export interface QuestionBank {
  id: string;
  certId: string;
  title: string;
  questions: BankQuestion[];
  /** Evaluación fair-use (checklist UChicago de 4 factores). Opcional. */
  fairUse?: FairUseAssessment;
}

/** Evaluación fair-use estilo UChicago Copyright Information Center. */
export interface FairUseAssessment {
  /** Obra evaluada (descripción). */
  work: string;
  /** Uso propuesto (descripción). */
  purpose: string;
  /** Veredicto global. */
  verdict: "likely-fair" | "needs-review" | "avoid";
  /** Fecha ISO de la evaluación. */
  assessedAt: string;
  /** Los 4 factores con casillas marcadas. */
  factors: FairUseFactor[];
}

export interface FairUseFactor {
  factor: string;
  favoring: string[];
  opposing: string[];
}

export interface MockQuestionRef {
  bank: string;
  id: string;
}

export interface MockExam {
  id: string;
  title: string;
  certId: string;
  timeMinutes: number;
  passingPercent: number;
  allowRetry: boolean;
  /** Referencias a preguntas (varios mocks pueden compartir la misma). */
  questions: MockQuestionRef[];
}

export type MockDocKind = "bank" | "mock";
