import { parse } from "yaml";
import type {
  BankQuestion,
  FairUseAssessment,
  IMockExamRepository,
  MockDocKind,
  MockExam,
  MockQuestionRef,
  QuestionBank,
} from "../domain";
import { validateBank, validateMock, type MockValidationIssue } from "../domain/mockSchema";
import { certificationRepository } from "./yamlCertificationRepository";

// Capa infrastructure: adaptador del puerto IMockExamRepository.
// Question banks versionados en YAML + mocks que referencian preguntas
// (varios mocks pueden compartir la misma pregunta).

type RawQuestion = {
  id?: string;
  text?: string;
  choices?: { text?: string; justification?: string }[];
  answer?: number[];
  explanation?: string;
  domain?: string;
  bloom?: number;
  tier?: string;
  points?: number;
  sources?: { url?: string; last_revised?: string; last_fetched?: string; note?: string }[];
};

type RawBank = {
  id?: string;
  cert_id?: string;
  title?: string;
  questions?: RawQuestion[];
  fair_use?: {
    work?: string;
    purpose?: string;
    verdict?: string;
    assessed_at?: string;
    factors?: { factor?: string; favoring?: string[]; opposing?: string[] }[];
  };
};

type RawMock = {
  id?: string;
  title?: string;
  cert_id?: string;
  time_minutes?: number;
  passing_percent?: number;
  allow_retry?: boolean;
  questions?: { bank?: string; id?: string }[];
};

const bankYaml: Record<string, string> = {
  "soa-c02-bank-01": `
id: soa-c02-bank-01
cert_id: aws-sysops
title: "Banco SOA-C02: operaciones y despliegue (muestra de estudio)"
fair_use:
  work: "Preguntas de muestra originales redactadas para este banco; no reproduce exámenes reales ni contenido de terceros"
  purpose: "Autoestudio personal sin fines comerciales dentro de la app"
  verdict: "likely-fair"
  assessed_at: "2026-09-08"
  factors:
    - factor: "Purpose"
      favoring: ["Research", "Scholarship", "Transformative use (preguntas y explicaciones originales)"]
      opposing: []
    - factor: "Nature"
      favoring: ["Published work", "Factual work (escenarios operativos)"]
      opposing: []
    - factor: "Amount"
      favoring: ["Small quantity (6 muestras, no el examen completo)"]
      opposing: []
    - factor: "Market effect"
      favoring: ["No significant effect (contenido propio, no sustituye el examen)"]
      opposing: []
questions:
  - id: soa-q01
    text: "Un ALB devuelve errores 5xx intermitentes y querés alertar al equipo antes que a los usuarios. ¿Qué métrica y destino configuran la alarma más directa?"
    choices:
      - text: "CPUUtilization del target group con notificación a SQS"
        justification: "Incorrecta: el CPU no refleja errores HTTP y SQS es una cola para sistemas, no un canal de alerta a personas."
      - text: "HTTPCode_Target_5XX_Count del ALB con notificación a SNS"
        justification: "Correcta: la documentación confirma que esta métrica cuenta los 5xx generados por los targets (estadística Sum) y SNS distribuye la alerta al equipo."
      - text: "RequestCount del ALB con notificación a EventBridge"
        justification: "Incorrecta: RequestCount mide volumen de tráfico, no errores; no dispara por respuestas 5xx."
      - text: "HealthyHostCount con notificación a SES"
        justification: "Incorrecta: hosts saludables no indican errores 5xx y SES es email transaccional, no un canal de alertas operativas."
    answer: [1]
    explanation: "HTTPCode_Target_5XX_Count mide errores generados por los targets detrás del ALB y SNS distribuye la alerta al equipo. CPUUtilization no refleja errores HTTP; RequestCount solo cuenta tráfico; SES envía emails, no es un canal de alertas operativas."
    domain: "Monitoring, Logging and Remediation"
    bloom: 3
    tier: foundation
    sources:
      - url: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html
        date_last_fetched: "2026-09-08"
        note: Tabla HTTPCode_Target_5XX_Count: errores generados por los targets, estadística Sum
  - id: soa-q02
    text: "Un Auto Scaling Group reemplaza instancias en loop. Los health checks del target group fallan aunque la app responde. ¿Qué revisás primero?"
    choices:
      - text: "El path y el grace period del health check del target group"
        justification: "Correcta: un path inexistente o un grace menor al arranque marca healthy como unhealthy (docs: HealthCheckPath, thresholds, UnhealthyThresholdCount=2) y el ASG recicla en loop."
      - text: "El tipo de instancia del Launch Template"
        justification: "Incorrecta: el tipo de instancia no explica health checks fallidos cuando la app sí responde."
      - text: "Las reglas de NACL de las subnets públicas"
        justification: "Incorrecta: NACLs restrictivas bloquearían también el tráfico real, pero la app responde."
      - text: "El período de retención de CloudTrail"
        justification: "Incorrecta: CloudTrail es auditoría de API, irrelevante para el health checking del ALB."
    answer: [0]
    explanation: "Un path inexistente o un grace period menor al boot de la app marca healthy como unhealthy y el ASG recicla en loop. El tipo de instancia, las NACLs y CloudTrail no explican health checks fallidos con app respondiendo."
    domain: "Deployment, Provisioning and Automation"
    bloom: 3
    tier: foundation
    sources:
      - url: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
        date_last_fetched: "2026-09-08"
        note: HealthCheckPath, thresholds y Matcher: path y códigos que definen un target healthy
  - id: soa-q03
    text: "Tenés que parchar 200 instancias EC2 sin abrir SSH y con ventana de mantenimiento nocturna. ¿Qué combinación lo resuelve?"
    choices:
      - text: "Session Manager + Run Command manual por instancia"
        justification: "Incorrecta: el enfoque manual no escala a 200 instancias ni da ventana programada o reporte de compliance."
      - text: "Patch Manager con Maintenance Windows y patch baselines"
        justification: "Correcta: la documentación confirma operaciones Scan/Install programadas por baseline sin SSH, con reportes de compliance."
      - text: "User data con yum update en cada reboot"
        justification: "Incorrecta: user data solo corre al lanzar la instancia; no parcha flota en curso ni reporta."
      - text: "Golden AMI reconstruida a mano cada mes"
        justification: "Incorrecta: reconstrucción manual costosa, sin automatización ni compliance centralizado."
    answer: [1]
    explanation: "Patch Manager aplica baselines en ventanas programadas sin SSH y reporta compliance. Session Manager manual no escala; user data solo corre al lanzar; AMIs manuales son operativamente costosas."
    domain: "Deployment, Provisioning and Automation"
    bloom: 3
    tier: application
    sources:
      - url: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html
        date_last_fetched: "2026-09-08"
        note: Patch baselines + Maintenance Windows para Scan/Install en flotas sin SSH
  - id: soa-q04
    text: "CloudFormation reporta drift porque alguien cambió un security group a mano. ¿Cuál es la respuesta correcta a largo plazo?"
    choices:
      - text: "Ignorar el drift: los cambios manuales siempre ganan"
        justification: "Incorrecta: ignorarlo acumula deuda y complica updates y deletes del stack."
      - text: "Detectar el drift, revertir el cambio manual y gestionar el recurso solo vía template"
        justification: "Correcta: la documentación define drift como diferencia con el template y pide volver a sincronizar para preservar IaC."
      - text: "Borrar el stack y recrearlo cada semana"
        justification: "Incorrecta: recrear es disruptivo e innecesario frente a una corrección puntual."
      - text: "Desactivar la detección de drift para evitar el ruido"
        justification: "Incorrecta: ciega al equipo ante cambios fuera de banda sin resolver la causa."
    answer: [1]
    explanation: "El drift se detecta y se corrige volviendo al template como única fuente de verdad; así se preserva IaC. Ignorarlo o desactivar la detección acumula deuda; recrear el stack es disruptivo."
    domain: "Deployment, Provisioning and Automation"
    bloom: 4
    tier: application
    sources:
      - url: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html
        date_last_fetched: "2026-09-08"
        note: Drift = actual difiere del template; se resuelve volviendo al template
  - id: soa-q05
    text: "Instancias en subnet privada descargan parches de S3 y la factura del NAT Gateway se disparó. ¿Qué cambio reduce el costo manteniendo la conectividad?"
    choices:
      - text: "Un Gateway VPC Endpoint para S3 con route table asociada"
        justification: "Correcta: la documentación confirma conectividad a S3 sin IGW/NAT y sin cargo adicional, vía prefix list en la route table."
      - text: "Un segundo NAT Gateway en otra AZ"
        justification: "Incorrecta: duplica el costo por GB procesado en vez de reducirlo."
      - text: "Security groups más permisivos en las instancias"
        justification: "Incorrecta: los security groups no cambian el routing hacia S3."
      - text: "Mover las instancias a subnets públicas con EIP"
        justification: "Incorrecta: expone las instancias a internet y mantiene el costo de transferencia."
    answer: [0]
    explanation: "El Gateway Endpoint enruta a S3 por la red de AWS sin pasar por el NAT (sin costo por GB procesado). Más NATs aumentan el costo; abrir security groups no cambia el routing; mover a públicas expone las instancias."
    domain: "Networking and Content Delivery"
    bloom: 4
    tier: integration
    sources:
      - url: https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
        date_last_fetched: "2026-09-08"
        note: Gateway endpoints a S3/DynamoDB sin IGW/NAT, sin cargo adicional
  - id: soa-q06
    text: "Cost Explorer muestra EC2 on-demand estables 24/7 desde hace un año. ¿Qué combinación baja más el costo sin perder capacidad?"
    choices:
      - text: "Pasar todo a Spot y aceptar interrupciones"
        justification: "Incorrecta: Spot es interrumpible; no sirve para carga estable 24/7 que debe mantenerse."
      - text: "Compute Savings Plans de 1-3 años + rightsizing con Compute Optimizer"
        justification: "Correcta: la documentación confirma hasta 72% de ahorro con commit de cómputo/hora, y Compute Optimizer ajusta el tamaño."
      - text: "Duplicar instancias para repartir carga"
        justification: "Incorrecta: duplicar capacidad duplica el costo sin bajar el unitario."
      - text: "Cambiar la región cada trimestre"
        justification: "Incorrecta: migrar de región no ahorra y suma costo de transferencia y operación."
    answer: [1]
    explanation: "Carga estable 24/7: Savings Plans descuentan el commit y Compute Optimizer ajusta el tamaño. Spot es para interrumpible; duplicar sube el costo; cambiar de región no ahorra."
    domain: "Cost and Performance Optimization"
    bloom: 3
    tier: application
    sources:
      - url: https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html
        date_last_fetched: "2026-09-08"
        note: Commit 1/3 años de cómputo/hora, hasta 72% vs On-Demand
`,
};

const mockYaml: Record<string, string> = {
  "soa-mock-01": `
id: soa-mock-01
title: "SOA-C02 Simulacro Rápido (6 preguntas)"
cert_id: aws-sysops
time_minutes: 20
passing_percent: 70
allow_retry: true
questions:
  - bank: soa-c02-bank-01
    id: soa-q01
  - bank: soa-c02-bank-01
    id: soa-q02
  - bank: soa-c02-bank-01
    id: soa-q03
  - bank: soa-c02-bank-01
    id: soa-q04
  - bank: soa-c02-bank-01
    id: soa-q05
  - bank: soa-c02-bank-01
    id: soa-q06
`,
  "soa-mock-02": `
id: soa-mock-02
title: "SOA-C02 Mini Drill (3 preguntas compartidas)"
cert_id: aws-sysops
time_minutes: 10
passing_percent: 70
allow_retry: true
questions:
  - bank: soa-c02-bank-01
    id: soa-q01
  - bank: soa-c02-bank-01
    id: soa-q03
  - bank: soa-c02-bank-01
    id: soa-q05
`,
};

function fromYaml<T>(raw: string): T | null {
  try {
    return parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeQuestion(raw: RawQuestion): BankQuestion {
  return {
    id: raw.id ?? "",
    text: raw.text ?? "",
    choices: (raw.choices ?? []).map((c) => ({
      text: c.text ?? "",
      justification: c.justification ?? "",
    })),
    answer: (raw.answer ?? []).filter((a) => Number.isInteger(a)),
    explanation: raw.explanation ?? "",
    domain: raw.domain ?? "",
    bloom: typeof raw.bloom === "number" ? raw.bloom : undefined,
    tier:
      raw.tier === "foundation" || raw.tier === "application" || raw.tier === "integration"
        ? raw.tier
        : undefined,
    points: typeof raw.points === "number" && raw.points > 0 ? Math.round(raw.points) : undefined,
    sources: (raw.sources ?? []).map((s) => ({
      url: s.url ?? "",
      lastRevised: s.last_revised ?? "",
      lastFetched: s.last_fetched ?? "",
      note: s.note ?? "",
    })),
  };
}

function normalizeBank(raw: RawBank): QuestionBank {
  const fu = raw.fair_use;
  return {
    id: raw.id ?? "unknown",
    certId: raw.cert_id ?? "",
    title: raw.title ?? "Banco",
    questions: (raw.questions ?? []).map(normalizeQuestion),
    fairUse:
      fu && typeof fu.verdict === "string" && typeof fu.assessed_at === "string"
        ? {
            work: fu.work ?? "",
            purpose: fu.purpose ?? "",
            verdict: fu.verdict as FairUseAssessment["verdict"],
            assessedAt: fu.assessed_at,
            factors: (fu.factors ?? []).map((f) => ({
              factor: f.factor ?? "",
              favoring: f.favoring ?? [],
              opposing: f.opposing ?? [],
            })),
          }
        : undefined,
  };
}

function normalizeMock(raw: RawMock): MockExam {
  const refs: MockQuestionRef[] = (raw.questions ?? []).map((r) => ({
    bank: r.bank ?? "",
    id: r.id ?? "",
  }));
  return {
    id: raw.id ?? "unknown",
    title: raw.title ?? "Mock",
    certId: raw.cert_id ?? "",
    timeMinutes: raw.time_minutes ?? 0,
    passingPercent: raw.passing_percent ?? 70,
    allowRetry: raw.allow_retry ?? true,
    questions: refs,
  };
}

function parseBank(text: string): QuestionBank | null {
  const raw = fromYaml<RawBank>(text);
  return raw ? normalizeBank(raw) : null;
}

function parseMock(text: string): MockExam | null {
  const raw = fromYaml<RawMock>(text);
  return raw ? normalizeMock(raw) : null;
}

function questionKeys(): Set<string> {
  const keys = new Set<string>();
  for (const text of Object.values(bankYaml)) {
    const bank = parseBank(text);
    bank?.questions.forEach((q) => keys.add(`${bank.id}:${q.id}`));
  }
  return keys;
}

function certIds(): string[] {
  return certificationRepository.list().map((c) => c.id);
}

/** Issues estructurados de la última corrida de validación. */
let lastValidationIssues: MockValidationIssue[] = [];

/** Devuelve los issues de la última validación de saveYaml (copia). */
export function getLastMockValidationIssues(): MockValidationIssue[] {
  return [...lastValidationIssues];
}

function saveDoc(kind: MockDocKind, yamlText: string): boolean {
  const store = kind === "bank" ? bankYaml : mockYaml;
  const parsed = fromYaml<RawBank & RawMock>(yamlText);
  if (!parsed) {
    lastValidationIssues = [
      { path: "(root)", message: "El YAML no pudo parsearse (sintaxis inválida).", severity: "error" },
    ];
    return false;
  }
  lastValidationIssues =
    kind === "bank"
      ? validateBank(parsed)
      : validateMock(parsed, { certIds: certIds(), questionKeys: questionKeys() });
  if (lastValidationIssues.some((i) => i.severity === "error")) return false;
  const id = (parsed as { id?: string }).id ?? "";
  if (!id) {
    lastValidationIssues = [...lastValidationIssues, { path: "id", message: `"id" es obligatorio.`, severity: "error" }];
    return false;
  }
  store[id] = yamlText;
  return true;
}

/** Resuelve las referencias de un mock a preguntas (cruza bancos). */
export function resolveMockQuestions(mock: MockExam): BankQuestion[] {
  const byKey = new Map<string, BankQuestion>();
  for (const text of Object.values(bankYaml)) {
    const bank = parseBank(text);
    bank?.questions.forEach((q) => byKey.set(`${bank.id}:${q.id}`, q));
  }
  return mock.questions
    .map((r) => byKey.get(`${r.bank}:${r.id}`))
    .filter((q): q is BankQuestion => !!q);
}

export const mockExamRepository: IMockExamRepository = {
  listBanks: () =>
    Object.values(bankYaml)
      .map(parseBank)
      .filter((b): b is QuestionBank => !!b && b.id !== "unknown"),
  listMocks: () =>
    Object.values(mockYaml)
      .map(parseMock)
      .filter((m): m is MockExam => !!m && m.id !== "unknown"),
  getYaml: (kind, id) => (kind === "bank" ? bankYaml[id] : mockYaml[id]) ?? "",
  saveYaml: (kind, yamlText) => saveDoc(kind, yamlText),
  getLastValidationIssues: () => getLastMockValidationIssues(),
};
