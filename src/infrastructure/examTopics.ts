// Mapeo verificado de bancos externos (ExamTopics) — generado desde
// /tmp/opencode/examtopics-targets.json el 2026-09-08.
// Solo metadatos (URL + conteo); el contenido de preguntas NO se copia.
export interface PracticeBank {
  code: string;
  title: string;
  url: string;
  questions: number | null;
}

export const EXAMTOPICS_PRACTICE: PracticeBank[] = [
  { code: "CLF-C02", title: "AWS Certified Cloud Practitioner CLF-C02", url: "https://www.examtopics.com/exams/amazon/aws-certified-cloud-practitioner-clf-c02/", questions: 719 },
  { code: "SOA-C02", title: "AWS Certified SysOps Administrator - Associate (SOA-C02)", url: "https://www.examtopics.com/exams/amazon/aws-certified-sysops-administrator-associate/", questions: 478 },
  { code: "SAA-C03", title: "AWS Certified Solutions Architect - Associate SAA-C03", url: "https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-associate-saa-c03/", questions: 1019 },
  { code: "DVA-C02", title: "AWS Certified Developer - Associate DVA-C02", url: "https://www.examtopics.com/exams/amazon/aws-certified-developer-associate-dva-c02/", questions: 557 },
  { code: "SAP-C02", title: "AWS Certified Solutions Architect - Professional SAP-C02", url: "https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-professional-sap-c02/", questions: 529 },
  { code: "DOP-C02", title: "AWS Certified DevOps Engineer - Professional DOP-C02", url: "https://www.examtopics.com/exams/amazon/aws-certified-devops-engineer-professional-dop-c02/", questions: 460 },
  { code: "TA-004", title: "HashiCorp Certified: Terraform Associate (004)", url: "https://www.examtopics.com/exams/hashicorp/terraform-associate-004/", questions: 167 },
  { code: "ACE", title: "Associate Cloud Engineer", url: "https://www.examtopics.com/exams/google/associate-cloud-engineer/", questions: 375 },
  { code: "GenAI-Leader", title: "Generative AI Leader", url: "https://www.examtopics.com/exams/google/generative-ai-leader/", questions: 75 },
  { code: "ADP", title: "Google Cloud Certified - Associate Data Practitioner", url: "https://www.examtopics.com/exams/google/associate-data-practitioner/", questions: 103 },
  { code: "PCA", title: "Professional Cloud Architect on Google Cloud Platform", url: "https://www.examtopics.com/exams/google/professional-cloud-architect/", questions: 360 },
  { code: "PDE", title: "Professional Data Engineer on Google Cloud Platform", url: "https://www.examtopics.com/exams/google/professional-data-engineer/", questions: 349 },
  { code: "CDL", title: "Cloud Digital Leader", url: "https://www.examtopics.com/exams/google/cloud-digital-leader/", questions: 289 },
  { code: "GCP-AIENG", title: "Professional Machine Learning Engineer", url: "https://www.examtopics.com/exams/google/professional-machine-learning-engineer/", questions: 375 },
  { code: "LFCS", title: "Linux Foundation Certified System Administrator", url: "https://www.examtopics.com/exams/linux-foundation/lfcs/", questions: 260 },
  { code: "CKA", title: "Certified Kubernetes Administrator", url: "https://www.examtopics.com/exams/cncf/cka/", questions: 23 },
  { code: "NCA-GENL", title: "Generative AI LLM", url: "https://www.examtopics.com/exams/nvidia/nca-genl/", questions: 96 },
  { code: "NCA-GENM", title: "Generative AI Multimodal", url: "https://www.examtopics.com/exams/nvidia/nca-genm/", questions: 60 },
  { code: "NCA-AIIO", title: "NCA - AI Infrastructure and Operations", url: "https://www.examtopics.com/exams/nvidia/nca-aiio/", questions: 116 },
  { code: "AZ-900", title: "Microsoft Azure Fundamentals", url: "https://www.examtopics.com/exams/microsoft/az-900/", questions: 474 },
  { code: "AI-901", title: "Microsoft Azure AI Fundamentals", url: "https://www.examtopics.com/exams/microsoft/ai-901/", questions: 128 },
  { code: "AZ-104", title: "Microsoft Azure Administrator", url: "https://www.examtopics.com/exams/microsoft/az-104/", questions: 606 },
  { code: "AZ-204", title: "Developing Solutions for Microsoft Azure", url: "https://www.examtopics.com/exams/microsoft/az-204/", questions: 487 },
  { code: "AZ-305", title: "Designing Microsoft Azure Infrastructure Solutions", url: "https://www.examtopics.com/exams/microsoft/az-305/", questions: 286 },
  { code: "CTFL", title: "Certified Tester Foundation Level (CTFL) v4.0", url: "https://www.examtopics.com/exams/istqb/ctfl-v4-0/", questions: 278 },
  { code: "CT-AI", title: "ISTQB Certified Tester - AI Testing", url: "https://www.examtopics.com/exams/istqb/ct-ai/", questions: 119 },
  { code: "CCDV-F", title: "Claude Certified Developer - Foundations", url: "https://www.examtopics.com/exams/anthropic/ccdv-f/", questions: 53 },
];

export function practiceFor(code: string): PracticeBank | undefined {
  return EXAMTOPICS_PRACTICE.find((p) => p.code === code);
}
