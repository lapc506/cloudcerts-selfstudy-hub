import { parse } from "yaml";
import { validateGuide, type ValidationIssue } from "../domain/guideSchema";
import type {
  BloomLevel,
  Certification,
  CertificationMeta,
  ICertificationRepository,
  KirkpatrickLevel,
} from "../domain";
import { parsePriority, parsePopularity } from "../domain";

type RawMeta = {
  exam_version?: string;
  guide_date?: string;
  guide_source?: string;
  format?: string;
  passing_score?: string;
  domains?: string[];
  level?: string;
  validity_years?: number;
  recert_window?: string;
  recert_options?: string[];
  recert_discount?: string;
  versions?: { code?: string; note?: string }[];
  verified_sources?: { url?: string; date_last_fetched?: string; label?: string }[];
  badge_image?: string;
  career_paths?: string[];
};

type RawCert = {
  id?: string;
  provider?: string;
  provider_color?: string;
  title?: string;
  code?: string;
  cost?: string;
  default_priority?: "High" | "Medium" | "Low" | number;
  popularity?: number;
  summary?: string;
  meta?: RawMeta;
  weeks?: {
    week?: number;
    title?: string;
    points?: string[];
    sections?: { domain?: string; weight?: string; points?: string[]; bloom?: number; kirkpatrick?: string }[];
  }[];
};

const certificationsYaml: Record<string, string> = {
  "aws-clf": `
id: aws-clf
provider: AWS
provider_color: "#ff9900"
title: AWS Certified Cloud Practitioner
code: CLF-C02
cost: "$100 USD"
default_priority: 4
popularity: 5
summary: Fundamentos globales de AWS, modelos de precios, seguridad de la nube y servicios base (EC2, S3, RDS, IAM).
meta:
  exam_version: "Version 1.0 CLF-C02"
  guide_date: "2023-11-27"
  guide_source: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf"
  format: "65 preguntas (50 evaluadas + 15 de control) · 90 min · Multiple choice / Multiple response"
  level: "100 · Foundational"
  career_paths:
    - "Cloud Fundamentals"
  passing_score: "700 / 1000"
  domains:
    - "Cloud Concepts: 24%"
    - "Security and Compliance: 30%"
    - "Cloud Technology and Services: 34%"
    - "Billing, Pricing, and Support: 12%"
  validity_years: 3
  recert_window: "Dentro de los 3 años de vigencia · AWS Cloud Quest elegible con 6 meses restantes · Skill Builder con 90 días restantes"
  recert_options:
    - "Retomar la versión vigente de CLF-C02"
    - "Aprobar un examen Associate o Professional (renueva CLF por 3 años)"
    - "AWS Cloud Quest: Recertify Cloud Practitioner (gratuito, extiende 3 años)"
    - "Mantenimiento por AWS Skill Builder (+1 año, requiere suscripción activa)"
  recert_discount: "Cupón de 50% de descuento en tu cuenta AWS (Benefits section) para el examen de recertificación"
  versions:
    - code: "CLF-C01"
      note: "Versión anterior (fuera de vigencia)"
    - code: "CLF-C02"
      note: "Versión vigente desde nov 2023"
  verified_sources:
    - url: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Cloud Practitioner Exam Guide (CLF-C02)"
    - url: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Cloud Practitioner (CLF-C02) Exam Guide (awsstatic)"
    - url: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Cloud Practitioner Certification Page"
  badge_image: "https://images.credly.com/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png"
weeks:
  - week: 1
    title: Conceptos Cloud & Arquitectura Global AWS
    sections:
      - domain: "Cloud Concepts"
        weight: "24%"
        points:
          - "Modelos IaaS, PaaS, SaaS y diferencias clave."
          - "Regiones, Availability Zones y Edge Locations."
          - "Shared Responsibility Model (responsabilidad compartida)."
          - "AWS Well-Architected Framework: los 6 pilares."
  - week: 2
    title: Cómputo, Almacenamiento & Redes
    sections:
      - domain: "Cloud Technology and Services"
        weight: "34%"
        points:
          - "EC2: Instance types, AMIs, Security Groups."
          - "S3: Buckets, Lifecycle policies, Versioning."
          - "Lambda: serverless fundamentals y triggers."
          - "VPC: Subnets, Route Tables, Internet/NAT Gateways."
  - week: 3
    title: Seguridad, IAM & Bases de Datos
    sections:
      - domain: "Security and Compliance"
        weight: "30%"
        points:
          - "IAM Users, Groups, Roles, Policies (JSON)."
          - "KMS, Shield, WAF, GuardDuty basics."
      - domain: "Cloud Technology and Services"
        weight: "34%"
        points:
          - "RDS: Multi-AZ y Read Replicas."
          - "DynamoDB: capacity modes y DAX."
  - week: 4
    title: Facturación, Costos & Simulacros
    sections:
      - domain: "Billing, Pricing, and Support"
        weight: "12%"
        points:
          - "Cost Explorer, Budgets, Pricing Calculator."
          - "Support Plans comparativa."
          - "CloudWatch metrics y alarms básicas."
          - "Simulacro de examen: 65 preguntas."
  - week: 5
    title: Servicios de Aplicación y Containers
    sections:
      - domain: "Cloud Technology and Services"
        weight: "34%"
        points:
          - "ECS y Fargate: conceptos de contenedores."
          - "Elastic Beanstalk: despliegue managed."
          - "SQS y SNS: mensajería desacoplada."
          - "CloudFront: CDN y distribución de contenido."
  - week: 6
    title: Herramientas de Desarrollo y DevOps
    sections:
      - domain: "Cloud Technology and Services"
        weight: "34%"
        points:
          - "CodeCommit, CodeBuild, CodeDeploy."
          - "CloudFormation: templates básicos."
          - "AWS CLI y Management Console."
          - "Elastic Beanstalk vs CloudFormation."
  - week: 7
    title: Monitoreo, Gobernanza y Cumplimiento
    sections:
      - domain: "Cloud Technology and Services"
        weight: "34%"
        points:
          - "CloudWatch Logs, Metrics, Dashboards."
      - domain: "Security and Compliance"
        weight: "30%"
        points:
          - "AWS Config y CloudTrail."
          - "Organizations y Control Tower."
          - "Inspector y compliance frameworks."
  - week: 8
    title: Repaso Final y Estrategia de Examen
    sections:
      - domain: "Repaso general (todos los dominios)"
        points:
          - "Repaso de servicios core por dominio."
          - "Estrategias de examen y gestión del tiempo."
          - "Simulacro final completo (65 preguntas)."
          - "Revisión de áreas débiles y certificación."
`,
  "aws-sysops": `
id: aws-sysops
provider: AWS
provider_color: "#ff9900"
title: AWS Certified SysOps Administrator – Associate
code: SOA-C02
cost: "$150 USD"
default_priority: 4
popularity: 4
summary: Monitoreo con CloudWatch, automatización con SSM y CloudFormation, solución de problemas en VPC y resiliencia.
meta:
  exam_version: "Version 2.3 SOA-C02"
  guide_date: "2023-03-28"
  guide_source: "https://d1.awsstatic.com/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf"
  format: "65 preguntas (50 evaluadas + 15 de control, sin labs) · 130 min · Multiple choice / Multiple response"
  level: "200 · Associate"
  career_paths:
    - "Cloud Operations"
    - "SysOps Administrator"
  passing_score: "720 / 1000"
  domains:
    - "Monitoring, Logging and Remediation: 20%"
    - "Reliability and Business Continuity: 16%"
    - "Deployment, Provisioning and Automation: 18%"
    - "Security and Compliance: 16%"
    - "Networking and Content Delivery: 18%"
    - "Cost and Performance Optimization: 12%"
  validity_years: 3
  recert_window: "Dentro de los 3 años de vigencia · mantenimiento Skill Builder dentro de los 90 días previos al vencimiento"
  recert_options:
    - "Retomar la versión vigente de SOA-C02"
    - "Aprobar un examen de nivel superior (Professional/Specialty) renueva la Associate"
    - "Mantenimiento por AWS Skill Builder (+1 año, 500 pts + 1 actividad práctica)"
  recert_discount: "Cupón de 50% de descuento en tu cuenta AWS (Benefits section) para el examen de recertificación"
  versions:
    - code: "SOA-C01"
      note: "Versión anterior (fuera de vigencia)"
    - code: "SOA-C02"
      note: "Versión vigente (guía v2.3)"
    - code: "SOA-C03"
      note: "Reemplaza a SOA-C02 desde el 29-sep-2025 (SysOps Administrator Associate → CloudOps Engineer Associate)"
  verified_sources:
    - url: "https://d1.awsstatic.com/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified SysOps Administrator - Associate (SOA-C02) Exam Guide"
    - url: "https://d1.awsstatic.com/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Sample-Questions_C02.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified SysOps Administrator - Associate (SOA-C02) Sample Questions"
  badge_image: "https://images.credly.com/images/f0d3fbb9-bfa7-4017-9989-7bde8eaf42b1/image.png"
weeks:
  - week: 1
    title: CloudWatch Agent y Métricas Custom
    sections:
      - domain: "Monitoring, Logging and Remediation"
        weight: "20%"
        points:
          - "CloudWatch Agent: instalación y configuración."
          - "Custom Metrics con put-metric-data."
          - "Log Groups, Metric Filters y Alarms."
          - "Dashboards personalizados para operaciones."
  - week: 2
    title: SSM Session Manager y Automation
    sections:
      - domain: "Deployment, Provisioning and Automation"
        weight: "18%"
        points:
          - "SSM Session Manager: acceso sin SSH."
          - "Run Command y State Manager."
          - "Patch Manager: parchado automatizado."
          - "Parameter Store y Secrets Manager."
  - week: 3
    title: CloudFormation - Templates y Drift
    sections:
      - domain: "Deployment, Provisioning and Automation"
        weight: "18%"
        points:
          - "Estructura de templates YAML/JSON."
          - "Parameters, Mappings, Conditions."
          - "Drift Detection y Rollbacks."
          - "Stack Sets para multi-account."
  - week: 4
    title: Networking Avanzado - VPC y Connectivity
    sections:
      - domain: "Networking and Content Delivery"
        weight: "18%"
        points:
          - "VPC Peering y Transit Gateway."
          - "VPC Endpoints (Gateway y Interface)."
          - "VPC Flow Logs para troubleshooting."
          - "NACLs vs Security Groups profundo."
  - week: 5
    title: Auto Scaling, ALB y Health Checks
    sections:
      - domain: "Reliability and Business Continuity"
        weight: "16%"
        points:
          - "Auto Scaling Groups: políticas y métricas."
          - "Application Load Balancer: target groups."
          - "Health Checks: configuración y troubleshooting."
          - "Launch Templates vs Launch Configurations."
  - week: 6
    title: Resiliencia, Backups y Disaster Recovery
    sections:
      - domain: "Reliability and Business Continuity"
        weight: "16%"
        points:
          - "AWS Backup: planes y vaults."
          - "RPO/RTO: estrategias de recuperación."
          - "True Multi-Region architectures."
          - "Route 53: failover routing y health checks."
  - week: 7
    title: IAM Profundo y Seguridad Operacional
    sections:
      - domain: "Security and Compliance"
        weight: "16%"
        points:
          - "IAM Policies: Evaluation Logic."
          - "Service Control Policies (SCPs)."
          - "AWS Config Rules: compliance."
          - "KMS key policies y rotación."
  - week: 8
    title: Costos, Troubleshooting y Simulacro Final
    sections:
      - domain: "Cost and Performance Optimization"
        weight: "12%"
        points:
          - "Savings Plans vs Reserved Instances."
          - "Cost Explorer avanzado."
      - domain: "Troubleshooting y simulación (transversal)"
        points:
          - "Troubleshooting scenarios complejos."
          - "Simulacro tipo examen: 65 preguntas."
`,
  "rh-openshift": `
id: rh-openshift
provider: Red Hat
provider_color: "#ee0000"
title: Red Hat Certified System Administrator in OpenShift
code: EX280
cost: "$400 USD"
default_priority: 3
popularity: 3
summary: Despliegue y administración de clusters OpenShift (OKD/OCP), gestión de RBAC, Operators, red y almacenamiento de contenedores.
meta:
  exam_version: "EX280 · Red Hat OpenShift Container Platform 4.x (4.18–4.22 según versión del examen)"
  guide_date: "2026-05-11"
  guide_source: "https://www.redhat.com/en/services/training/red-hat-certified-openshift-administrator-exam"
  format: "Examen práctico (performance-based) sobre OCP real · 3 horas · Evaluación objetiva de tareas"
  level: "300 · Specialist"
  career_paths:
    - "OpenShift Administrator"
    - "Cloud Operations"
  passing_score: "Importe según criterios objetivos (no publicada como nota)"
  domains:
    - "Gestión de la configuración del cluster"
    - "Autenticación y autorización (RBAC)"
    - "Networking e Ingress"
    - "Almacenamiento persistente"
    - "Builds y despliegues de aplicaciones"
    - "Monitoreo y mantenimiento operacional"
  validity_years: 3
  recert_window: "Antes de la fecha de no-current (3 años de vigencia desde la obtención)"
  recert_options:
    - "Retomar y aprobar EX280 (renueva esa certificación por 3 años)"
    - "Reglas flexibles desde el 11-may-2026: retomar el examen de tu cert de mayor nivel, subir al mismo nivel o avanzar a un nivel superior renueva tus certificaciones vigentes del mismo nivel e inferiores"
    - "EX280 → nivel Administrator/Developer del track OpenShift en el nuevo marco de 5 niveles (Technologist → Admin/Dev → Engineer → Specialist → Architect)"
  recert_discount: "Sin descuento oficial; incluye 1 reintento gratis por cada primer intento pagado"
  verified_sources:
    - url: "https://docs.redhat.com/en/documentation/red_hat_learning_subscription/1-latest/html-single/red_hat_certification_program_guide/index"
      date_last_fetched: "2026-09-08"
      label: "Red Hat Certification Program Guide (vigencia 3 años, renovación flexible)"
    - url: "https://www.redhat.com/en/services/training/red-hat-certified-openshift-administrator-exam"
      date_last_fetched: "2026-09-08"
      label: "EX280 — Red Hat Certified System Administrator in OpenShift exam"
  versions:
    - code: "EX280 (OCP 4.x)"
      note: "Reemplaza EX280 basado en versiones anteriores de OCP"
  badge_image: "https://images.credly.com/images/e7a34dc0-feb1-44a1-b8e7-3f825faf1c8e/blob"
weeks:
  - week: 1
    title: CLI oc y Gestión de Proyectos
    sections:
      - domain: "Gestión de la configuración del cluster"
        points:
          - "Comandos: oc login, oc new-app, oc status."
          - "oc get, describe, logs, exec, rsh."
          - "Proyectos, Namespaces, Quotas, LimitRanges."
          - "Builds y DeploymentConfigs desde CLI."
  - week: 2
    title: Autenticación y RBAC en OpenShift
    sections:
      - domain: "Autenticación y autorización (RBAC)"
        points:
          - "HTPasswd Identity Provider setup."
          - "ClusterRoles y ClusterRoleBindings."
          - "Local Roles y RoleBindings por namespace."
          - "ServiceAccounts y secrets asociados."
  - week: 3
    title: Redes - SDN, Ingress y Routes
    sections:
      - domain: "Networking e Ingress"
        points:
          - "OpenShift SDN / OVN-Kubernetes."
          - "Routes: Edge, Passthrough, Re-encrypt."
          - "NetworkPolicy: restricción de tráfico."
          - "DNS interno del cluster y services."
  - week: 4
    title: Almacenamiento Persistente
    sections:
      - domain: "Almacenamiento persistente"
        points:
          - "PersistentVolumes y PersistentVolumeClaims."
          - "StorageClasses y dynamic provisioning."
          - "NFS, Ceph y cloud storage drivers."
          - "StatefulSets vs Deployments."
  - week: 5
    title: Operators y OperatorHub
    sections:
      - domain: "Gestión de la configuración del cluster"
        points:
          - "Qué es un Operator y su ciclo de vida."
          - "OperatorHub: búsqueda e instalación."
          - "Cluster Operators: health y troubleshooting."
          - "OLM (Operator Lifecycle Manager)."
  - week: 6
    title: Escalado de Aplicaciones y Builds
    sections:
      - domain: "Builds y despliegues de aplicaciones"
        points:
          - "BuildConfigs y ImageStreams."
          - "DeploymentConfigs y estrategias."
          - "Horizontal Pod Autoscaler (HPA)."
          - "Troubleshooting de pods y nodos."
  - week: 7
    title: Monitorización y Logging del Cluster
    sections:
      - domain: "Monitoreo y mantenimiento operacional"
        points:
          - "Prometheus y Grafana en OpenShift."
          - "EFK Stack: Elasticsearch, Fluentd, Kibana."
          - "Alerting rules y cluster monitoring."
          - "Audit logs y security scanning."
  - week: 8
    title: Mantenimiento del Cluster y Simulacro
    sections:
      - domain: "Monitoreo y mantenimiento operacional"
        points:
          - "Upgrade del cluster y versionado."
          - "Backup etcd y disaster recovery."
          - "Troubleshooting scenarios de examen."
          - "Simulacro práctico completo: 4 horas."
`,
  "hashi-tf": `
id: hashi-tf
provider: HashiCorp
provider_color: "#844fba"
title: "HashiCorp Certified: Terraform Associate"
code: TA-004
cost: "$70.50 USD"
default_priority: 4
popularity: 4
summary: Infraestructura como Código (IaC) agnóstica, sintaxis HCL, gestión de estado local/remoto, módulos y HCP Terraform.
meta:
  exam_version: "Terraform Associate 004 (Terraform 1.12 / HCP Terraform)"
  guide_date: "2026-01-08"
  guide_source: "https://developer.hashicorp.com/certifications/infrastructure-automation"
  format: "~57 preguntas · 60 min · Multiple choice, multiple select y true/false (sin fill-in-the-blank) · Online proctored"
  level: "200 · Associate"
  career_paths:
    - "DevOps Engineer"
    - "Platform Engineer"
  passing_score: "No publicada (resultado Pass/Fail)"
  domains:
    - "Fundamentos y sintaxis HCL"
    - "Ciclo de vida: init, plan, apply, destroy"
    - "Gestión de estado y backends remotos"
    - "Módulos y reutilización"
    - "HCP Terraform (Terraform Cloud) y Workspaces"
    - "Best practices y seguridad"
  validity_years: 2
  recert_window: "A partir de los 18 meses desde la obtención · retomar hasta 6 meses antes del vencimiento"
  recert_options:
    - "Retomar la versión vigente del examen Associate (extiende 2 años desde la nueva aprobación)"
    - "Aprobar Terraform Authoring & Operations Professional (extiende la credencial Associate por 2 años)"
    - "Aprobar una versión más nueva del examen (nueva credencial)"
  recert_discount: "Sin descuento oficial de examen publicada"
  verified_sources:
    - url: "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004"
      date_last_fetched: "2026-09-08"
      label: "Terraform Associate 004 Study Guide (official, Terraform 1.12)"
  versions:
    - code: "TA-001"
      note: "Versión original (retirada)"
    - code: "TA-002"
      note: "Versión anterior (retirada)"
    - code: "TA-003"
      note: "Retirada el 7-ene-2026 · probaba Terraform 1.3"
    - code: "TA-004"
      note: "Versión vigente desde el 8-ene-2026 · Terraform 1.12"
  badge_image: "https://images.credly.com/images/6f614b71-3f2e-488e-8b29-71e90d4dbf80/blob"
weeks:
  - week: 1
    title: Fundamentos de IaC y Sintaxis HCL
    sections:
      - domain: "Fundamentos y sintaxis HCL"
        points:
          - "IaC: beneficios, declarativo vs imperativo."
          - "Bloques: provider, resource, data."
          - "Variables, outputs y locals."
          - "Ciclo: init, plan, apply, destroy, fmt, validate."
  - week: 2
    title: State Management Local y Remoto
    sections:
      - domain: "Gestión de estado y backends remotos"
        points:
          - "terraform.tfstate: estructura y formato."
          - "State locking con DynamoDB."
          - "Remote Backends: S3, Consul, Terraform Cloud."
          - "Import y state manipulation."
  - week: 3
    title: Módulos y Reutilización de Código
    sections:
      - domain: "Módulos y reutilización"
        points:
          - "Estructura de módulos reutilizables."
          - "Inputs y outputs de módulos."
          - "Módulos de Terraform Registry."
          - "Testing con terraform plan y validate."
  - week: 4
    title: Expresiones y Funciones Avanzadas
    sections:
      - domain: "Fundamentos y sintaxis HCL"
        points:
          - "count y for_each para recursos."
          - "dynamic blocks para configuraciones."
          - "Funciones: lookup, merge, flatten."
          - "Conditionals y expression language."
  - week: 5
    title: Provisioners, Lifecycle y Dependencies
    sections:
      - domain: "Ciclo de vida: init, plan, apply, destroy"
        points:
          - "Provisioners: local-exec, remote-exec."
          - "Lifecycle: create_before_destroy, ignore_changes."
          - "depends_on y dependencias implícitas."
          - "move y moved blocks."
  - week: 6
    title: Terraform Cloud y Workspaces
    sections:
      - domain: "HCP Terraform (Terraform Cloud) y Workspaces"
        points:
          - "Terraform Cloud: pricing y features."
          - "Workspaces: strategies y separación."
          - "Variables de entorno y sensitive vars."
          - "Run Tasks y VCS integration."
  - week: 7
    title: Multi-Cloud y Estrategias Avanzadas
    sections:
      - domain: "Best practices y seguridad"
        points:
          - "Multi-provider: AWS + GCP + Azure."
          - "Terragrunt para DRY en multi-env."
          - "Workspace strategies: env/stage."
          - "Best practices de estructura de directorios."
  - week: 8
    title: Seguridad, Compliance y Simulacro
    sections:
      - domain: "Best practices y seguridad"
        points:
          - "Vault integration para secrets."
          - "Sentinel policies (enterprise)."
          - "TFsec y Checkov para security scanning."
          - "Simulacro de examen: 57 preguntas."
`,
  "gcp-ai": `
id: gcp-ai
provider: Google Cloud
provider_color: "#4285f4"
title: Google Cloud Professional AI Engineer / Vertex AI
code: GCP-AIENG
cost: "$200 USD"
default_priority: 3
popularity: 3
summary: Modelos de Machine Learning, desarrollo agéntico con Vertex AI, ADK, RAG, Gemini API y MLOps.
meta:
  exam_version: "Professional Machine Learning Engineer (guía vigente al 2026-06-01)"
  guide_date: "2026-06-01"
  guide_source: "https://cloud.google.com/learn/certification/guides/machine-learning-engineer"
  format: "50–60 preguntas · 2 horas (120 min) · Multiple choice / multiple select · Online proctored (OnVUE) o test center"
  level: "300 · Professional"
  career_paths:
    - "Machine Learning Engineer"
  passing_score: "No publicada (resultado Pass/Fail)"
  domains:
    - "Architecting low-code AI solutions: ~13%"
    - "Collaborating within and across teams to manage data and models: ~16%"
    - "Scaling prototypes into ML models: ~21%"
    - "Serving and scaling models: ~20%"
    - "Automating and orchestrating ML pipelines: ~18%"
    - "Monitoring AI solutions: ~13%"
  validity_years: 2
  recert_window: "Ventana de renovación abierta 60 días antes de la fecha de inactividad"
  recert_options:
    - "Retomar el examen vigente (Professional ML Engineer) dentro de la ventana de renovación (+2 años)"
    - "Examen opcional acortado de renovación si está disponible para la certificación"
  recert_discount: "Código de 50% de descuento para renovación emitido al certificarte inicialmente (visible en CM Connect)"
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/professional_machine_learning_engineer_exam_guide_english_new.pdf"
      date_last_fetched: "2026-09-08"
      label: "Professional Machine Learning Engineer Exam Guide (English)"
  versions:
    - code: "Professional ML Engineer (v4.0)"
      note: "Guía vigente desde 2024-10-01 (agrega Gen AI)"
    - code: "Professional ML Engineer (2026-06-01)"
      note: "Guía vigente actualizada con Agent Platform / Model Garden"
  badge_image: "https://images.credly.com/images/00096281-8052-4cf1-b412-37702a94b539/image.png"
weeks:
  - week: 1
    title: Vertex AI Overview y Gemini APIs
    sections:
      - domain: "Architecting low-code AI solutions: ~13%"
        points:
          - "Vertex AI Studio: interfaz de modelos."
          - "Model Garden: selección de modelos."
          - "Gemini 1.5/2.0 Pro y Flash: diferencias."
          - "Python SDK: install y setup rápido."
  - week: 2
    title: Prompt Engineering y Fine-Tuning
    sections:
      - domain: "Scaling prototypes into ML models: ~21%"
        points:
          - "Prompt design: best practices de Google."
          - "Few-shot, chain-of-thought, system instructions."
          - "Fine-tuning: cuándo y cómo usarlo."
          - "Evaluation metrics: BLEU, ROUGE, human eval."
  - week: 3
    title: Agentes de IA - ADK Fundamentals
    sections:
      - domain: "Scaling prototypes into ML models: ~21%"
        points:
          - "Agent Development Kit: arquitectura."
          - "Tools: function calling y tool use."
          - "Reasoning loops y memory management."
          - "State management en agentes."
  - week: 4
    title: Orquestación de Agentes y Workflows
    sections:
      - domain: "Automating and orchestrating ML pipelines: ~18%"
        points:
          - "Multi-agent systems y delegación."
          - "Sequential y parallel agent patterns."
          - "Error handling y retry logic."
          - "Agent evaluation y observabilidad."
  - week: 5
    title: RAG - Retrieval-Augmented Generation
    sections:
      - domain: "Scaling prototypes into ML models: ~21%"
        points:
          - "Vertex AI Vector Search y embeddings."
          - "Embeddings API: textembedding-gecko."
          - "Document AI para procesamiento."
          - "Chunking strategies y hybrid search."
  - week: 6
    title: MLOps, Pipelines y Production
    sections:
      - domain: "Automating and orchestrating ML pipelines: ~18%"
        points:
          - "Vertex AI Pipelines: Kubeflow."
          - "Model Registry y versioning."
          - "Model Monitoring y drift detection."
          - "Feature Store y online serving."
  - week: 7
    title: Evaluation y Responsible AI
    sections:
      - domain: "Monitoring AI solutions: ~13%"
        points:
          - "Safety filtering y toxicity detection."
          - "Groundedness y atribución."
          - "Human evaluation workflows."
          - "Benchmarks: MMLU, HELM, BigBench."
  - week: 8
    title: Arquitectura Final y Simulacro
    sections:
      - domain: "Serving and scaling models: ~20%"
        points:
          - "Design patterns: online serving at scale."
          - "Cost optimization: selección de modelos."
          - "Security: IAM, VPC, data governance."
          - "Simulacro de examen: práctica completa."
`,
  "gcp-ace": `
id: gcp-ace
provider: Google Cloud
provider_color: "#4285f4"
title: "Associate Cloud Engineer"
code: "ACE"
cost: "$125 USD"
default_priority: 4
popularity: 4
summary: "Despliega, asegura y opera soluciones en Google Cloud con Compute, Kubernetes y redes."
meta:
  exam_version: "Standard Exam Guide vigente"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/cloud-engineer"
  format: "50-60 preguntas · 120 minutos · multiple choice and multiple select · online-proctored u onsite (Pearson VUE)"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Setting up a cloud solution environment: ~20%"
    - "Planning and implementing a cloud solution: ~30%"
    - "Ensuring the successful operation of a cloud solution: ~30%"
    - "Configuring access and security: ~20%"
  validity_years: 3
  recert_window: "Desde 180 días antes del vencimiento hasta 30 días después"
  recert_options:
    - "Repetir examen estándar ACE ($125)"
    - "Examen corto de renovación (1 hora, 20 preguntas, $75, solo EN/JA, con certificación activa)"
    - "Renovación vía Google Skills con cursos/skill badges designados (extiende 1 año)"
  recert_discount: "Código de 50% de descuento en renovación (perfil CM Connect tras certificarse)"
  level: "200 · Associate"
  career_paths:
    - "Cloud Engineer"
  versions:
    - code: "Standard"
      note: "Examen completo de 2 horas para primera certificación o recertificación vencida"
    - code: "Renewal"
      note: "Examen corto de 1 hora y 20 preguntas solo con certificación activa en ventana de elegibilidad"
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/associate_cloud_engineer_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Associate Cloud Engineer Standard Exam Guide (English)"
    - url: "https://services.google.com/fh/files/misc/associate_cloud_engineer_renewal_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Associate Cloud Engineer Renewal Exam Guide (English)"
  badge_image: "https://images.credly.com/images/08096465-cbfc-4c3e-93e5-93c5aa61f23e/image.png"
weeks:
  - week: 1
    title: "Fundamentos y jerarquía de recursos con gcloud CLI"
    sections:
      - domain: "Setting up a cloud solution environment"
        weight: "~20%"
        points:
          - "Jerarquía Organization/Folder/Project y cuotas con Cloud Quotas."
          - "Billing accounts, budgets y alertas de facturación."
          - "APIs enablement y Cloud SDK/gcloud básico."
          - "Cloud Identity y organización inicial del entorno."
  - week: 2
    title: "Planificación de cómputo con Compute Engine y GKE"
    sections:
      - domain: "Planning and implementing a cloud solution"
        weight: "~30%"
        points:
          - "Elegir Compute Engine vs GKE vs Cloud Run vs App Engine vs Cloud Functions."
          - "Machine types, Spot/Preemptible VMs y MIGs con autoscaling."
          - "Diseños básicos de alta disponibilidad por zona y región."
          - "IaC inicial con Terraform y plantillas de despliegue."
  - week: 3
    title: "Almacenamiento, datos y redes VPC"
    sections:
      - domain: "Planning and implementing a cloud solution"
        weight: "~30%"
        points:
          - "Cloud Storage classes y lifecycle policies."
          - "Persistent Disk, Filestore y bases (Cloud SQL, Spanner, Firestore, Bigtable)."
          - "VPC, subnets, firewall rules y Cloud DNS."
          - "Load Balancing, CDN y Cloud NAT."
  - week: 4
    title: "Operación de cómputo y almacenamiento"
    sections:
      - domain: "Ensuring the successful operation of a cloud solution"
        weight: "~30%"
        points:
          - "Gestionar VMs, MIGs y estado de instancias."
          - "Operar GKE y Cloud Run en producción."
          - "Administrar buckets y ciclos de vida de objetos."
          - "Backups y snapshots de datos críticos."
  - week: 5
    title: "Monitoreo, logs y troubleshooting"
    sections:
      - domain: "Ensuring the successful operation of a cloud solution"
        weight: "~30%"
        points:
          - "Cloud Monitoring, alertas y SLOs básicos."
          - "Cloud Logging, sinks y análisis de errores."
          - "Network Intelligence y diagnóstico de conectividad."
          - "Asistencia de Gemini Cloud Assist para operaciones."
  - week: 6
    title: "IAM, service accounts y seguridad"
    sections:
      - domain: "Configuring access and security"
        weight: "~20%"
        points:
          - "Roles primitivos vs predefined vs custom y least privilege."
          - "Service accounts, impersonation y Workload Identity."
          - "VPC Service Controls y políticas de organización."
          - "KMS, Secret Manager y gestión de credenciales."
  - week: 7
    title: "Laboratorios integrales de despliegue y operación"
    sections:
      - domain: "Planning and implementing a cloud solution"
        weight: "~30%"
        points:
          - "Desplegar app completa en GKE/Cloud Run end-to-end."
          - "Exponer con load balancer y DNS, probar escalado."
          - "Automatizar con Terraform un entorno repetible."
          - "Practicar preguntas de escenario de diseño."
      - domain: "Ensuring the successful operation of a cloud solution"
        weight: "~30%"
        points:
          - "Simular fallos y recuperar servicios degradados."
          - "Crear dashboards y alertas de latencia y errores."
          - "Rotar claves y auditar con Cloud Audit Logs."
          - "Repasar sample questions oficiales."
  - week: 8
    title: "Repaso final, billing y simulacro de examen"
    sections:
      - domain: "Setting up a cloud solution environment"
        weight: "~20%"
        points:
          - "Repasar billing, presupuestos y límites de cuota."
          - "Checklist de APIs y permisos por servicio."
          - "Simulacro cronometrado de 50 preguntas."
          - "Estrategia de descarte en multiple select."
      - domain: "Configuring access and security"
        weight: "~20%"
        points:
          - "Matriz rápida de roles IAM frecuentes."
          - "Casos típicos de service accounts y acceso cruzado."
          - "Errores comunes de seguridad en el examen."
          - "Plan logístico del día del examen."
`,
  "gcp-genai-leader": `
id: gcp-genai-leader
provider: Google Cloud
provider_color: "#4285f4"
title: "Generative AI Leader"
code: "GenAI-Leader"
cost: "$99 USD"
default_priority: 3
popularity: 3
summary: "Lidera la adopción de IA generativa con Gemini, Vertex AI y estrategia responsable."
meta:
  exam_version: "Exam Guide vigente"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/generative-ai-leader/"
  format: "50-60 preguntas · 90 minutos · multiple choice · online-proctored u onsite"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Fundamentals of gen AI: ~30%"
    - "Google Cloud's gen AI offerings: ~35%"
    - "Techniques to improve gen AI model output: ~20%"
    - "Business strategies for a successful gen AI solution: ~15%"
  validity_years: 3
  recert_window: "Desde 180 días antes del vencimiento hasta 30 días después"
  recert_options:
    - "Repetir examen estándar ($99, extiende 3 años)"
  recert_discount: "Código de 50% de descuento en renovación (perfil CM Connect tras certificarse)"
  level: "100 · Foundational"
  career_paths:
    - "AI Leader"
  versions: []
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/generative_ai_leader_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Generative AI Leader Exam Guide (English)"
    - url: "https://services.google.com/fh/files/misc/generative_ai_leader_study_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Generative AI Leader Study Guide (English)"
  badge_image: "https://images.credly.com/images/ec23e41a-0f32-4a98-9c00-28925621b281/blob"
weeks:
  - week: 1
    title: "Fundamentos de gen AI y foundation models"
    sections:
      - domain: "Fundamentals of gen AI"
        weight: "~30%"
        points:
          - "Foundation models vs LLMs y multimodalidad."
          - "Difusión para imagen/video y casos de uso."
          - "ML clásico vs generativo y ciclo de vida del ML."
          - "Calidad de datos y capas del paisaje de IA."
  - week: 2
    title: "Modelos de Google y conceptos clave de negocio"
    sections:
      - domain: "Fundamentals of gen AI"
        weight: "~30%"
        points:
          - "Familias Gemini, Gemma, Imagen y Veo a nivel conceptual."
          - "Qué es una plataforma de IA y un AI agent."
          - "Vocabulario líder: prompt, grounding, hallucination."
          - "Cuándo gen AI sí aplica y cuándo no."
      - domain: "Google Cloud's gen AI offerings"
        weight: "~35%"
        points:
          - "Enfoque AI-first de Google y fortalezas enterprise."
          - "Mapa Gemini apps vs Gemini Enterprise vs Customer Engagement Suite."
          - "Vertex AI, Model Garden y Vertex AI Studio."
          - "Vertex AI Search y agentes de negocio."
  - week: 3
    title: "Portafolio de offerings y herramientas de desarrollo"
    sections:
      - domain: "Google Cloud's gen AI offerings"
        weight: "~35%"
        points:
          - "Diferenciar Gemini, Gemma, Imagen y Veo por caso de uso."
          - "Vertex AI Agent Builder y tooling para developers."
          - "Opciones no-code/low-code para equipos de negocio."
          - "Elegir producto según escenario empresarial."
  - week: 4
    title: "Casos de uso empresariales con gen AI"
    sections:
      - domain: "Google Cloud's gen AI offerings"
        weight: "~35%"
        points:
          - "Atención al cliente y personalización con gen AI."
          - "Productividad, código y conocimiento interno."
          - "Marketing, medios y generación de contenido."
          - "Mapa de productos y sus límites."
  - week: 5
    title: "Prompt engineering, RAG y grounding"
    sections:
      - domain: "Techniques to improve gen AI model output"
        weight: "~20%"
        points:
          - "Prompt engineering vs prompt tuning a nivel líder."
          - "Grounding y RAG para reducir alucinaciones."
          - "Sampling parameters (temperature, top-k/top-p) conceptual."
          - "Limitaciones del modelo y cómo mitigarlas."
  - week: 6
    title: "Evaluación de salidas y estrategia de adopción"
    sections:
      - domain: "Techniques to improve gen AI model output"
        weight: "~20%"
        points:
          - "Criterios para evaluar calidad de respuestas."
          - "Iterar prompts con ejemplos y contexto."
          - "Cuándo reentrenar vs anclar con datos."
          - "Riesgos de salida no supervisada."
      - domain: "Business strategies for a successful gen AI solution"
        weight: "~15%"
        points:
          - "Pasos recomendados para implementar gen AI transformacional."
          - "Tipos de solución (texto, imagen, código, personalización)."
          - "Factores que definen necesidades de gen AI y ROI."
          - "Gestión del cambio y pilotos empresariales."
  - week: 7
    title: "Secure AI con SAIF e IA responsable"
    sections:
      - domain: "Business strategies for a successful gen AI solution"
        weight: "~15%"
        points:
          - "Framework SAIF para proteger sistemas de IA."
          - "Responsible AI: fairness, privacidad y governance."
          - "Riesgos, compliance y criterios de go/no-go."
          - "Métricas de éxito y escalado de pilotos."
  - week: 8
    title: "Simulacro líder y repaso de los 4 dominios"
    sections:
      - domain: "Google Cloud's gen AI offerings"
        weight: "~35%"
        points:
          - "Mapa rápido producto-caso de uso de memoria."
          - "Simulacro de 50 preguntas tipo escenario."
          - "Repasar sample questions oficiales."
          - "Estrategia de examen sin background técnico."
      - domain: "Fundamentals of gen AI"
        weight: "~30%"
        points:
          - "Glosario final de 40 términos clave."
          - "Diferencias que más preguntan (LLM vs foundation model)."
          - "Checklist de los 4 dominios ponderados."
          - "Plan logístico del día del examen."
`,
  "gcp-data-practitioner": `
id: gcp-data-practitioner
provider: Google Cloud
provider_color: "#4285f4"
title: "Associate Data Practitioner"
code: "ADP"
cost: "$125 USD"
default_priority: 3
popularity: 3
summary: "Ingiere, transforma y visualiza datos en Google Cloud con BigQuery y Dataform."
meta:
  exam_version: "Guía v1.0 vigente"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/data-practitioner/"
  format: "50-60 preguntas · 120 minutos · multiple choice and multiple select · online-proctored u onsite"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Data Preparation and Ingestion: ~30%"
    - "Data Analysis and Presentation: ~27%"
    - "Data Pipeline Orchestration: ~18%"
    - "Data Management: ~25%"
  validity_years: 3
  recert_window: "Desde 180 días antes del vencimiento hasta 30 días después"
  recert_options:
    - "Repetir examen estándar ($125, extiende 3 años)"
  recert_discount: "Código de 50% de descuento en renovación (perfil CM Connect tras certificarse)"
  level: "200 · Associate"
  career_paths:
    - "Data Analyst"
    - "Data Engineer"
  versions:
    - code: "v1.0"
      note: "Guía oficial v1.0 vigente"
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/v1.0_associate_data_practitioner_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Associate Data Practitioner Exam Guide v1.0 (English)"
  badge_image: "https://images.credly.com/images/3e3f6d8b-b37e-4a3d-93d0-6f2bafa5f03c/blob"
weeks:
  - week: 1
    title: "Almacenamiento e ingestión hacia BigQuery"
    sections:
      - domain: "Data Preparation and Ingestion"
        weight: "~30%"
        points:
          - "Elegir Cloud Storage vs BigQuery vs Cloud SQL vs Bigtable vs Spanner vs Firestore."
          - "Cargar CSV/JSON a BigQuery y gestión de esquemas."
          - "Storage Transfer Service y BigQuery Data Transfer Service."
          - "Database Migration Service, Datastream y Dataflow templates."
  - week: 2
    title: "Transformación con Dataform, Dataflow y Pub/Sub"
    sections:
      - domain: "Data Preparation and Ingestion"
        weight: "~30%"
        points:
          - "Transformaciones SQL con Dataform."
          - "Pipelines batch y streaming con Dataflow."
          - "Ingesta de eventos con Pub/Sub."
          - "Calidad de datos y manejo de errores de carga."
  - week: 3
    title: "Análisis SQL en BigQuery"
    sections:
      - domain: "Data Analysis and Presentation"
        weight: "~27%"
        points:
          - "SELECT, JOINs, subqueries y CTEs."
          - "Window functions y agregaciones avanzadas."
          - "Vistas, tablas y análisis exploratorio."
          - "ML básico en BigQuery (BigQuery ML)."
  - week: 4
    title: "Visualización con Looker Studio"
    sections:
      - domain: "Data Analysis and Presentation"
        weight: "~27%"
        points:
          - "Dashboards y reportes en Looker Studio."
          - "Conectar BigQuery como fuente de datos."
          - "Filtros, controles y buenas prácticas visuales."
          - "Interpretar insights para audiencia de negocio."
  - week: 5
    title: "Orquestación con Cloud Composer y Scheduler"
    sections:
      - domain: "Data Pipeline Orchestration"
        weight: "~18%"
        points:
          - "Workflows con Cloud Composer (Apache Airflow)."
          - "Scheduled queries y Cloud Scheduler."
          - "Dataform Pipelines y dependencias."
          - "Monitoreo y reintentos de pipelines."
  - week: 6
    title: "Gestión, costos y seguridad de datos"
    sections:
      - domain: "Data Management"
        weight: "~25%"
        points:
          - "Partitioning y clustering en BigQuery."
          - "Optimización de costos y slots."
          - "IAM least-privilege para datos y datasets."
          - "Claves CMEK/CSEK/GMEK y lifecycle de Cloud Storage."
  - week: 7
    title: "Laboratorio end-to-end de datos"
    sections:
      - domain: "Data Preparation and Ingestion"
        weight: "~30%"
        points:
          - "Pipeline CSV a BigQuery con transformación."
          - "Automatizar ingesta programada."
          - "Validar calidad y documentar linaje."
          - "Practicar SQL bajo tiempo."
      - domain: "Data Analysis and Presentation"
        weight: "~27%"
        points:
          - "Resolver 30 ejercicios SQL variados."
          - "Construir dashboard completo de ejemplo."
          - "Repasar sample questions oficiales."
          - "Errores típicos de análisis en el examen."
  - week: 8
    title: "Simulacro final y gobierno de datos"
    sections:
      - domain: "Data Pipeline Orchestration"
        weight: "~18%"
        points:
          - "Diseñar DAG sencillo y su schedule."
          - "Casos de fallo y reintento de pipelines."
          - "Simulacro cronometrado de 50 preguntas."
          - "Checklist de los 4 dominios ponderados."
      - domain: "Data Management"
        weight: "~25%"
        points:
          - "Data governance y catálogo básico."
          - "Alta disponibilidad y retención de datos."
          - "Matriz rápida IAM para datos."
          - "Plan logístico del día del examen."
`,
  "lf-lfcs": `
id: "lf-lfcs"
provider: "Linux Foundation"
provider_color: "#0099d6"
title: "Linux Foundation Certified System Administrator"
code: "LFCS"
cost: "$445 USD"
default_priority: 3
popularity: 3
summary: "Administración Linux vendor-neutral con examen 100% práctico: usuarios, almacenamiento, redes y troubleshooting."
meta:
  exam_version: "LFCS (distribution-independent)"
  guide_date: "2026-08-31"
  guide_source: "https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/"
  format: "17-20 tareas performance-based en línea de comandos · 2 horas · online proctored (PSI Bridge)"
  passing_score: "67% o superior"
  domains:
    - "Operations Deployment: 25%"
    - "Networking: 25%"
    - "Storage: 20%"
    - "Essential Commands: 20%"
    - "Users and Groups: 10%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración (elegibilidad de compra: 12 meses)"
  recert_options:
    - "Repetir y aprobar el mismo examen LFCS"
  recert_discount: "Sin descuento documentado (bundles: examen + THRIVE-ONE $625 / examen + LFS207 $645)"
  level: "200 · Associate"
  career_paths:
    - "System Administrator"
    - "Cloud Operations"
  versions: []
  verified_sources:
    - url: "https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/"
      date_last_fetched: "2026-09-08"
      label: "LFCS Exam Page — Domains, Competencies, Price, Duration, Validity"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/instructions-lfcs-and-lfce"
      date_last_fetched: "2026-09-08"
      label: "Important Instructions LFCS — Passing Score 67%, Tasks, Duration"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/lf-handbook2/certificates-and-certification"
      date_last_fetched: "2026-09-08"
      label: "Certificates and Certification — 24-Month Validity and Renewal by Retake"
  badge_image: "https://images.credly.com/images/1e6611ca-8afe-4ecc-ad4d-305fba52ee7e/linkedin_thumb_1_LFCS-600x600.png"
weeks:
  - week: 1
    title: "Usuarios, grupos y permisos con ACLs y LDAP"
    sections:
      - domain: "Users and Groups"
        weight: "10%"
        points:
          - "Crear y gestionar cuentas locales de usuario y grupo."
          - "Perfiles de entorno personales y system-wide."
          - "Límites de recursos de usuario (ulimit, cgroups básico)."
          - "ACLs y cuentas LDAP centralizadas."
  - week: 2
    title: "Comandos esenciales, Git y certificados SSL"
    sections:
      - domain: "Essential Commands"
        weight: "20%"
        points:
          - "Operaciones básicas de Git en servidor."
          - "Crear, configurar y troubleshotear servicios (systemd)."
          - "Troubleshooting de rendimiento y espacio en disco."
          - "Trabajar con certificados SSL."
  - week: 3
    title: "Almacenamiento LVM, filesystems y swap"
    sections:
      - domain: "Storage"
        weight: "20%"
        points:
          - "Configurar y gestionar almacenamiento LVM."
          - "Crear, gestionar y reparar filesystems y VFS."
          - "Filesystems remotos, network block devices y automounters."
          - "Swap y monitoreo de rendimiento de almacenamiento."
  - week: 4
    title: "Operaciones: kernel, procesos y paquetería"
    sections:
      - domain: "Operations Deployment"
        weight: "25%"
        points:
          - "Parámetros de kernel persistentes y no persistentes."
          - "Diagnóstico y gestión de procesos y servicios."
          - "Jobs programados y gestión de paquetes/repositorios."
          - "Recuperación ante fallos de hardware, SO o filesystem."
  - week: 5
    title: "Virtualización libvirt, contenedores y SELinux"
    sections:
      - domain: "Operations Deployment"
        weight: "25%"
        points:
          - "Gestionar máquinas virtuales con libvirt."
          - "Configurar container engines y gestionar contenedores."
          - "Crear y aplicar MAC con SELinux."
          - "Práctica mixta de despliegue bajo presión de tiempo."
  - week: 6
    title: "Redes IPv4/IPv6, tiempo y troubleshooting"
    sections:
      - domain: "Networking"
        weight: "25%"
        points:
          - "Configurar IPv4/IPv6 y resolución de hostname."
          - "Sincronizar hora del sistema con time servers."
          - "Monitorear y troubleshotear redes."
          - "Configurar servidor y cliente OpenSSH."
  - week: 7
    title: "Filtrado de paquetes, routing, bonding y balanceo"
    sections:
      - domain: "Networking"
        weight: "25%"
        points:
          - "Packet filtering, port redirection y NAT."
          - "Routing estático y dispositivos bridge/bonding."
          - "Reverse proxies y load balancers."
          - "Laboratorio integral de red + servicios."
  - week: 8
    title: "Simulacros finales y repaso ponderado"
    sections:
      - domain: "Operations Deployment"
        weight: "25%"
        points:
          - "Simulacro 1 estilo Killer.sh (20 tareas, 2h)."
          - "Simulacro 2 con dominios débiles reforzados."
          - "Checklist de Essential Commands y Users and Groups."
          - "Estrategia de examen: orden por peso y gestión del tiempo."
`,
  "cncf-cka": `
id: "cncf-cka"
provider: "CNCF"
provider_color: "#326ce5"
title: "Certified Kubernetes Administrator"
code: "CKA"
cost: "$445 USD"
default_priority: 4
popularity: 5
summary: "Administración de clusters Kubernetes con examen práctico: instalación, networking, storage y troubleshooting."
meta:
  exam_version: "Kubernetes v1.35"
  guide_date: "2026-07-27"
  guide_source: "https://www.cncf.io/training/certification/cka/"
  format: "Performance-based en línea de comandos · 2 horas · online proctored (PSI)"
  passing_score: "66% o superior"
  domains:
    - "Cluster Architecture, Installation & Configuration: 25%"
    - "Workloads & Scheduling: 15%"
    - "Services & Networking: 20%"
    - "Storage: 10%"
    - "Troubleshooting: 30%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración (elegibilidad de compra: 12 meses)"
  recert_options:
    - "Repetir y aprobar el examen CKA"
    - "Programa CARE: obtener/recertificar CKS extiende CKA"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis; bundles examen + curso desde $645)"
  level: "300 · Professional"
  career_paths:
    - "Kubernetes Administrator"
    - "DevOps Engineer"
  versions:
    - code: "Kubernetes v1.35"
      note: "Versión vigente del examen"
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/CKA_Curriculum_v1.35.pdf"
      date_last_fetched: "2026-09-08"
      label: "CKA Curriculum v1.35 (Official CNCF Curriculum)"
    - url: "https://www.cncf.io/training/certification/cka/"
      date_last_fetched: "2026-09-08"
      label: "CKA Exam Page — Domains, Weights, Cost"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks"
      date_last_fetched: "2026-09-08"
      label: "FAQ CKA/CKAD/CKS — Passing Score 66%, Duration 2h, K8s v1.35, 2-Year Validity, Renewal"
  badge_image: "https://images.credly.com/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png"
weeks:
  - week: 1
    title: "Arquitectura del cluster, kubeadm y RBAC"
    sections:
      - domain: "Cluster Architecture, Installation & Configuration"
        weight: "25%"
        points:
          - "Instalar y gestionar clusters con kubeadm y su lifecycle."
          - "RBAC: roles, bindings y service accounts."
          - "Control plane altamente disponible e infra subyacente."
          - "Interfaces de extensión (CNI, CSI, CRI) y CRDs/operators."
  - week: 2
    title: "Helm, Kustomize y Workloads con Deployments"
    sections:
      - domain: "Cluster Architecture, Installation & Configuration"
        weight: "25%"
        points:
          - "Instalar componentes con Helm y Kustomize."
          - "Deployments: rolling updates y rollbacks."
          - "Primitivas de self-healing y Deployments robustos."
          - "ConfigMaps y Secrets para configurar apps."
  - week: 3
    title: "Scheduling, admisión y autoscaling"
    sections:
      - domain: "Workloads & Scheduling"
        weight: "15%"
        points:
          - "Admisión y scheduling de Pods: limits, node affinity."
          - "Taints, tolerations y node selectors."
          - "Autoscaling de workloads (HPA/VPA)."
          - "Práctica cronometrada de scheduling."
  - week: 4
    title: "Servicios, DNS e Ingress con Gateway API"
    sections:
      - domain: "Services & Networking"
        weight: "20%"
        points:
          - "Conectividad entre Pods y tipos ClusterIP/NodePort/LoadBalancer."
          - "Network Policies: definición y enforcement."
          - "Ingress controllers, recursos Ingress y Gateway API."
          - "CoreDNS: resolución y troubleshooting."
  - week: 5
    title: "Storage: PV, PVC y StorageClasses"
    sections:
      - domain: "Storage"
        weight: "10%"
        points:
          - "StorageClasses y provisioning dinámico."
          - "Tipos de volúmenes, access modes y reclaim policies."
          - "Gestión de PV y PVC."
          - "Laboratorio de storage stateful."
  - week: 6
    title: "Troubleshooting de clusters, nodos y componentes"
    sections:
      - domain: "Troubleshooting"
        weight: "30%"
        points:
          - "Troubleshooting de clusters, nodos y componentes."
          - "Monitoreo de uso de recursos de cluster y apps."
          - "Evaluación de container output streams y logs."
          - "Troubleshooting de servicios y networking."
  - week: 7
    title: "Troubleshooting avanzado bajo presión"
    sections:
      - domain: "Troubleshooting"
        weight: "30%"
        points:
          - "Diagnóstico de etcd, kubelet y control plane."
          - "Fallos de scheduling, probes y recursos."
          - "Uso rápido de docs oficiales durante el examen."
          - "Simulacro Killer.sh sesión 1 (17 tareas)."
  - week: 8
    title: "Simulacros finales y repaso ponderado"
    sections:
      - domain: "Cluster Architecture, Installation & Configuration"
        weight: "25%"
        points:
          - "Simulacro Killer.sh sesión 2 con tiempo real."
          - "Repaso de Services & Networking (20%)."
          - "Repaso de Workloads & Scheduling (15%) y Storage (10%)."
          - "Estrategia final: orden, atajos kubectl y vim."
`,
  "cncf-ckad": `
id: "cncf-ckad"
provider: "CNCF"
provider_color: "#326ce5"
title: "Certified Kubernetes Application Developer"
code: "CKAD"
cost: "$445 USD"
default_priority: 4
popularity: 4
summary: "Desarrollo cloud-native en Kubernetes con examen práctico: diseño, despliegue, observabilidad y seguridad de apps."
meta:
  exam_version: "Kubernetes v1.35"
  guide_date: "2026-07-28"
  guide_source: "https://www.cncf.io/training/certification/ckad/"
  format: "Performance-based en línea de comandos · 2 horas · online proctored (PSI)"
  passing_score: "66% o superior"
  domains:
    - "Application Design and Build: 20%"
    - "Application Deployment: 20%"
    - "Application Observability and Maintenance: 15%"
    - "Application Environment, Configuration and Security: 25%"
    - "Services and Networking: 20%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración (elegibilidad de compra: 12 meses)"
  recert_options:
    - "Repetir y aprobar el examen CKAD"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis; bundles examen + curso desde $645)"
  level: "300 · Professional"
  career_paths:
    - "Cloud Developer"
    - "Kubernetes Developer"
  versions:
    - code: "Kubernetes v1.35"
      note: "Versión vigente del examen"
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/CKAD_Curriculum_v1.35.pdf"
      date_last_fetched: "2026-09-08"
      label: "CKAD Curriculum v1.35 (Official CNCF Curriculum)"
    - url: "https://www.cncf.io/training/certification/ckad/"
      date_last_fetched: "2026-09-08"
      label: "CKAD Exam Page — Domains, Weights, Cost"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks"
      date_last_fetched: "2026-09-08"
      label: "FAQ CKA/CKAD/CKS — Passing Score 66%, Duration 2h, K8s v1.35, 2-Year Validity, Renewal"
  badge_image: "https://images.credly.com/images/cc8adc83-1dc6-4d57-8e20-22171247e052/blob"
weeks:
  - week: 1
    title: "Diseño de apps: imágenes y workloads"
    sections:
      - domain: "Application Design and Build"
        weight: "20%"
        points:
          - "Definir, construir y modificar container images."
          - "Elegir workload resources (Deployment, DaemonSet, CronJob)."
          - "Patrones multi-container: sidecar, init y otros."
          - "Volúmenes persistentes y efímeros en Pods."
  - week: 2
    title: "Deployment strategies, Helm y Kustomize"
    sections:
      - domain: "Application Deployment"
        weight: "20%"
        points:
          - "Estrategias blue/green y canary con primitivas K8s."
          - "Deployments y rolling updates."
          - "Desplegar paquetes con Helm."
          - "Overlays y parches con Kustomize."
  - week: 3
    title: "Configuración: ConfigMaps, Secrets y SecurityContexts"
    sections:
      - domain: "Application Environment, Configuration and Security"
        weight: "25%"
        points:
          - "ConfigMaps y Secrets: crear y consumir."
          - "Resource requirements, requests, limits y quotas."
          - "ServiceAccounts y autenticación/autorización/admisión."
          - "Seguridad de apps: SecurityContexts y Capabilities."
  - week: 4
    title: "CRDs, Operators y troubleshooting de red"
    sections:
      - domain: "Application Environment, Configuration and Security"
        weight: "25%"
        points:
          - "Recursos extendidos: CRDs y Operators."
          - "Exponer apps con Services y debug de acceso."
          - "NetworkPolicies básicas."
          - "Reglas Ingress para exponer aplicaciones."
  - week: 5
    title: "Services & Networking para developers"
    sections:
      - domain: "Services and Networking"
        weight: "20%"
        points:
          - "Services ClusterIP/NodePort/LoadBalancer y endpoints."
          - "DNS interno y variables de entorno de servicios."
          - "Ingress paths, hosts y TLS básico."
          - "Práctica cronometrada de exposición de apps."
  - week: 6
    title: "Observabilidad: probes, logs y debugging"
    sections:
      - domain: "Application Observability and Maintenance"
        weight: "15%"
        points:
          - "Probes y health checks (liveness/readiness/startup)."
          - "Logs de contenedores y CLI de monitoreo."
          - "Debugging en Kubernetes (exec, describe, events)."
          - "API deprecations y migración de manifiestos."
  - week: 7
    title: "Simulacro Killer.sh y velocidad con kubectl"
    sections:
      - domain: "Application Design and Build"
        weight: "20%"
        points:
          - "Simulacro Killer.sh sesión 1 (17 tareas, 2h)."
          - "Atajos imperativos kubectl y dry-run YAML."
          - "Templates rápidos de Deployment/Service/Ingress."
          - "Repaso de dominios débiles del simulacro."
  - week: 8
    title: "Simulacro final y repaso ponderado"
    sections:
      - domain: "Application Environment, Configuration and Security"
        weight: "25%"
        points:
          - "Simulacro Killer.sh sesión 2 con tiempo real."
          - "Repaso de Deployment (20%) y Networking (20%)."
          - "Repaso de Observability (15%)."
          - "Estrategia final: orden por peso y copia de docs."
`,
  "cncf-otca": `
id: "cncf-otca"
provider: "CNCF"
provider_color: "#326ce5"
title: "OpenTelemetry Certified Associate (OTCA)"
code: "OTCA"
cost: "$250 USD"
default_priority: 2
popularity: 2
summary: "Certificación foundational de observabilidad con OpenTelemetry: traces, metrics, logs, Collector e instrumentación."
meta:
  exam_version: "current (unversioned)"
  guide_date: "2026-07-28"
  guide_source: "https://www.cncf.io/training/certification/otca/"
  format: "60 preguntas · 90 minutos · multiple choice · online proctored"
  passing_score: "75%"
  domains:
    - "Fundamentals of Observability: 18%"
    - "The OpenTelemetry API and SDK: 46%"
    - "The OpenTelemetry Collector: 26%"
    - "Maintaining and Debugging Observability Pipelines: 10%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir y aprobar el examen (renueva 2 años desde la aprobación)"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis: dos intentos)"
  level: "100 · Foundational"
  career_paths:
    - "Observability Engineer"
    - "SRE"
  versions: []
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/OTCA_Curriculum.pdf"
      date_last_fetched: "2026-09-08"
      label: "OTCA Curriculum PDF (CNCF curriculum repo)"
    - url: "https://training.linuxfoundation.org/certification/opentelemetry-certified-associate-otca/"
      date_last_fetched: "2026-09-08"
      label: "OTCA exam page with domains, $250, 90 minutes, valid 2 years (Linux Foundation)"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-mc"
      date_last_fetched: "2026-09-08"
      label: "Multiple Choice Exams FAQ: 90 min, 75% pass, 2-year validity, retake renewal"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-mc"
      date_last_fetched: "2026-09-08"
      label: "Important Instructions: 60 multiple-choice questions, 90 minutes"
  badge_image: "https://images.credly.com/images/3d3f7131-83a4-4427-8a68-150ca90bcc23/blob"
weeks:
  - week: 1
    title: "Fundamentos de observabilidad y telemetry data"
    sections:
      - domain: "Fundamentals of Observability"
        weight: "18%"
        points:
          - "Diferenciar traces, metrics y logs y sus casos de uso."
          - "Entender semantic conventions y por qué importan."
          - "Conceptos de instrumentación: automática vs manual."
          - "De telemetry a outcomes: análisis y troubleshooting."
  - week: 2
    title: "OpenTelemetry API y SDK: data model y configuración"
    sections:
      - domain: "The OpenTelemetry API and SDK"
        weight: "46%"
        points:
          - "Data model: spans, metrics, log records y resources."
          - "API vs SDK: roles y separación de responsabilidades."
          - "Configurar SDKs: providers, processors y exporters."
          - "Composability y extensión del ecosistema OTel."
  - week: 3
    title: "Signals: tracing, metrics y logs en el SDK"
    sections:
      - domain: "The OpenTelemetry API and SDK"
        weight: "46%"
        points:
          - "Tracing: spans, contexto y sampling."
          - "Metrics: instruments, aggregation y temporality."
          - "Logs: bridge API y correlación con traces."
          - "Agents e instrumentación automática por lenguaje."
  - week: 4
    title: "SDK pipelines y context propagation"
    sections:
      - domain: "The OpenTelemetry API and SDK"
        weight: "46%"
        points:
          - "Armar pipelines: spans processors y metric readers."
          - "Batch vs simple processors y su impacto."
          - "Propagators W3C: TraceContext y Baggage."
          - "Context propagation entre servicios distribuidos."
  - week: 5
    title: "Collector: configuración y despliegue"
    sections:
      - domain: "The OpenTelemetry Collector"
        weight: "26%"
        points:
          - "Arquitectura: receivers, processors, exporters y extensions."
          - "Escribir collector config YAML por pipelines."
          - "Patrones de despliegue: agent vs gateway."
          - "Desplegar el Collector en Kubernetes."
  - week: 6
    title: "Collector pipelines: transformación y escalado"
    sections:
      - domain: "The OpenTelemetry Collector"
        weight: "26%"
        points:
          - "Construir pipelines por señal (traces/metrics/logs)."
          - "Transformar datos: batch, filter y attributes processors."
          - "Escalar el Collector y tunear performance."
          - "Exportar a backends de observabilidad."
  - week: 7
    title: "Mantener y depurar pipelines de observabilidad"
    sections:
      - domain: "Maintaining and Debugging Observability Pipelines"
        weight: "10%"
        points:
          - "Depurar pipelines: zpages, logging exporter y métricas propias."
          - "Manejo de errores: reintentos, colas y dropped data."
          - "Schema management y versionado de telemetría."
          - "Diagnosticar pérdida de contexto end-to-end."
  - week: 8
    title: "Repaso final y simulacro OTCA"
    sections:
      - domain: "The OpenTelemetry API and SDK"
        weight: "46%"
        points:
          - "Simulacro de 60 preguntas en 90 minutos."
          - "Repasar Collector config stanzas típicas del examen."
          - "Cerrar gaps en API/SDK, el dominio de mayor peso."
          - "Checklist de día de examen con PSI Bridge."
`,
  "cncf-cgoa": `
id: "cncf-cgoa"
provider: "CNCF"
provider_color: "#326ce5"
title: "Certified GitOps Associate (CGOA)"
code: "CGOA"
cost: "$250 USD"
default_priority: 2
popularity: 2
summary: "Certificación foundational de GitOps: principios, terminología, patrones, tooling y prácticas relacionadas (IaC, CI/CD)."
meta:
  exam_version: "current (unversioned)"
  guide_date: "2026-07-27"
  guide_source: "https://www.cncf.io/training/certification/cgoa/"
  format: "60 preguntas · 90 minutos · multiple choice · online proctored"
  passing_score: "75%"
  domains:
    - "GitOps Terminology: 20%"
    - "GitOps Principles: 30%"
    - "Related Practices: 16%"
    - "GitOps Patterns: 20%"
    - "Tooling: 14%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir y aprobar el examen (renueva 2 años desde la aprobación)"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis: dos intentos)"
  level: "100 · Foundational"
  career_paths:
    - "DevOps Engineer"
    - "Platform Engineer"
  versions: []
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/CGOA_Curriculum.pdf"
      date_last_fetched: "2026-09-08"
      label: "CGOA Curriculum PDF (CNCF curriculum repo)"
    - url: "https://training.linuxfoundation.org/certification/certified-gitops-associate-cgoa/"
      date_last_fetched: "2026-09-08"
      label: "CGOA exam page with domains, 90-minute exam, $250, valid 2 years (Linux Foundation)"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-mc"
      date_last_fetched: "2026-09-08"
      label: "Multiple Choice Exams FAQ: 90 min, 75% pass, 2-year validity, retake renewal"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-mc"
      date_last_fetched: "2026-09-08"
      label: "Important Instructions: 60 multiple-choice questions, 90 minutes"
  badge_image: "https://images.credly.com/images/7219d055-4e97-439c-b244-8fbe885fa06b/image.png"
weeks:
  - week: 1
    title: "Terminología GitOps esencial"
    sections:
      - domain: "GitOps Terminology"
        weight: "20%"
        points:
          - "Desired state, state drift y state reconciliation."
          - "GitOps managed software system y state store."
          - "Feedback loop y rollback en flujo GitOps."
          - "Vocabulario Continuous: delivery vs deployment."
  - week: 2
    title: "Principios GitOps: declarativo y versionado"
    sections:
      - domain: "GitOps Principles"
        weight: "30%"
        points:
          - "Declarative: describir el estado deseado en código."
          - "Versioned e immutable: Git como source of truth."
          - "Pulled automatically: agentes que reconcilian."
          - "Continuously reconciled y self-healing."
  - week: 3
    title: "Prácticas relacionadas: CaC, IaC y DevOps"
    sections:
      - domain: "Related Practices"
        weight: "16%"
        points:
          - "Configuration as Code (CaC) mapeado a GitOps."
          - "Infrastructure as Code (IaC) con GitOps."
          - "DevOps y DevSecOps en el ciclo GitOps."
          - "CI y CD: dónde termina CI y empieza GitOps."
  - week: 4
    title: "Patrones GitOps de despliegue y release"
    sections:
      - domain: "GitOps Patterns"
        weight: "20%"
        points:
          - "Deployment y release patterns con Git."
          - "Progressive delivery: canary y blue/green."
          - "Pull vs event-driven: trade-offs."
          - "Elegir patrón según riesgo y entorno."
  - week: 5
    title: "Architecture patterns y reconciliación"
    sections:
      - domain: "GitOps Patterns"
        weight: "20%"
        points:
          - "In-cluster vs external reconciler."
          - "State store management y branching."
          - "Multi-cluster y multi-tenant patterns."
          - "Precauciones de diseño en sistemas GitOps."
  - week: 6
    title: "Tooling: manifiestos, state store y reconcilers"
    sections:
      - domain: "Tooling"
        weight: "14%"
        points:
          - "Manifest format y packaging: YAML, Helm, Kustomize."
          - "State stores: Git y alternativas."
          - "Reconciliation engines: Argo CD, Flux y alternativas."
          - "Criterios para elegir tooling GitOps."
  - week: 7
    title: "GitOps con Kubernetes, seguridad e interoperabilidad"
    sections:
      - domain: "Tooling"
        weight: "14%"
        points:
          - "Integrar GitOps con Kubernetes y CI/CD."
          - "Seguridad y governance con GitOps."
          - "Observabilidad y notificaciones del reconciler."
          - "Troubleshoot de workflows GitOps."
  - week: 8
    title: "Repaso final y simulacro CGOA"
    sections:
      - domain: "GitOps Principles"
        weight: "30%"
        points:
          - "Simulacro de 60 preguntas en 90 minutos."
          - "Repasar principios, el dominio de mayor peso."
          - "Flashcards de terminología y patrones."
          - "Checklist de día de examen con PSI Bridge."
`,
  "cncf-kca": `
id: "cncf-kca"
provider: "CNCF"
provider_color: "#326ce5"
title: "Kyverno Certified Associate (KCA)"
code: "KCA"
cost: "$250 USD"
default_priority: 2
popularity: 2
summary: "Certificación foundational de Kyverno: policy as code en Kubernetes (validar, mutar, generar) y gestión de políticas."
meta:
  exam_version: "current (unversioned)"
  guide_date: "2026-07-28"
  guide_source: "https://www.cncf.io/training/certification/kca/"
  format: "60 preguntas · 90 minutos · multiple choice · online proctored"
  passing_score: "75%"
  domains:
    - "Fundamentals of Kyverno: 18%"
    - "Installation, Configuration, and Upgrades: 18%"
    - "Kyverno CLI: 12%"
    - "Applying Policies: 10%"
    - "Writing Policies: 32%"
    - "Policy Management: 10%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir y aprobar el examen (renueva 2 años desde la aprobación)"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis: dos intentos)"
  level: "100 · Foundational"
  career_paths:
    - "Platform Engineer"
  versions: []
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/KCA_Curriculum.pdf"
      date_last_fetched: "2026-09-08"
      label: "KCA Curriculum PDF (CNCF curriculum repo)"
    - url: "https://training.linuxfoundation.org/certification/kyverno-certified-associate-kca/"
      date_last_fetched: "2026-09-08"
      label: "KCA exam page with domains, $250, 90 minutes, valid 2 years (Linux Foundation)"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-mc"
      date_last_fetched: "2026-09-08"
      label: "Multiple Choice Exams FAQ: 90 min, 75% pass, 2-year validity, retake renewal"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-mc"
      date_last_fetched: "2026-09-08"
      label: "Important Instructions: 60 multiple-choice questions, 90 minutes"
  badge_image: "https://images.credly.com/images/2592935a-d8fa-405d-b40a-711a75454fc2/image.png"
weeks:
  - week: 1
    title: "Fundamentos de Kyverno y admission control"
    sections:
      - domain: "Fundamentals of Kyverno"
        weight: "18%"
        points:
          - "Policies y rules: validate, mutate, generate, verifyImages."
          - "Admission controllers y webhook de Kyverno."
          - "Leer YAML manifests para políticas."
          - "OCI images y firmas en el contexto Kyverno."
  - week: 2
    title: "Instalación, configuración y upgrades con Helm"
    sections:
      - domain: "Installation, Configuration, and Upgrades"
        weight: "18%"
        points:
          - "Instalación con Helm y values clave."
          - "CRDs de Kyverno y su ciclo de vida."
          - "Flags del controller y tuning básico."
          - "RBAC, roles y permisos de Kyverno."
  - week: 3
    title: "Alta disponibilidad, upgrades y Kyverno CLI"
    sections:
      - domain: "Kyverno CLI"
        weight: "12%"
        points:
          - "Instalar y usar kyverno apply y test."
          - "kyverno jp para JMESPath y depuración."
          - "Instalaciones HA: réplicas y afinidad."
          - "Upgrades seguros de Kyverno."
  - week: 4
    title: "Aplicar políticas en el cluster"
    sections:
      - domain: "Applying Policies"
        weight: "10%"
        points:
          - "Aplicar policies a nivel cluster vs namespace."
          - "Resource selection con match/exclude."
          - "Common policy settings de rules."
          - "Validar admisión con policies de ejemplo."
  - week: 5
    title: "Escribir políticas: validación y mutación"
    sections:
      - domain: "Writing Policies"
        weight: "32%"
        points:
          - "Validation rules y message/deny."
          - "Mutation rules y JSON patches/strategic merge."
          - "Preconditions y background scans."
          - "Autogen rules para Pod controllers."
  - week: 6
    title: "Escribir políticas: generación, imágenes y CEL"
    sections:
      - domain: "Writing Policies"
        weight: "32%"
        points:
          - "Generation rules: sync y clone resources."
          - "VerifyImage rules para supply chain."
          - "Variables y API calls (context) en policies."
          - "Cleanup policies y Common Expression Language (CEL)."
  - week: 7
    title: "Gestión de políticas: reports y observabilidad"
    sections:
      - domain: "Policy Management"
        weight: "10%"
        points:
          - "PolicyReports y resultados pass/fail/skip."
          - "PolicyExceptions: uso y governance."
          - "Métricas de Kyverno para monitoreo."
          - "Flujo de remediación de violaciones."
  - week: 8
    title: "Repaso final y simulacro KCA"
    sections:
      - domain: "Writing Policies"
        weight: "32%"
        points:
          - "Simulacro de 60 preguntas en 90 minutos."
          - "Repasar writing policies, el dominio de mayor peso."
          - "Labs: CLI apply/test y policies de ejemplo."
          - "Checklist de día de examen con PSI Bridge."
`,
  "lf-capa": `
id: "lf-capa"
provider: "Linux Foundation"
provider_color: "#0099d6"
title: "Certified Argo Project Associate (CAPA)"
code: "CAPA"
cost: "$250 USD"
default_priority: 2
popularity: 2
summary: "Certificación foundational del ecosistema Argo: Workflows, CD, Rollouts y Events con GitOps en Kubernetes."
meta:
  exam_version: "current (unversioned)"
  guide_date: "2026-07-27"
  guide_source: "https://training.linuxfoundation.org/certification/certified-argo-project-associate-capa/"
  format: "60 preguntas · 90 minutos · multiple choice · online proctored"
  passing_score: "75%"
  domains:
    - "Argo Workflows: 36%"
    - "Argo CD: 34%"
    - "Argo Rollouts: 18%"
    - "Argo Events: 12%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir y aprobar el examen (renueva 2 años desde la aprobación)"
  recert_discount: "Sin descuento documentado (incluye 1 retake gratis: dos intentos)"
  level: "100 · Foundational"
  career_paths:
    - "DevOps Engineer"
    - "Platform Engineer"
  versions: []
  verified_sources:
    - url: "https://github.com/cncf/curriculum/blob/master/CAPA_Curriculum.pdf"
      date_last_fetched: "2026-09-08"
      label: "CAPA Curriculum PDF (CNCF curriculum repo)"
    - url: "https://training.linuxfoundation.org/certification/certified-argo-project-associate-capa/"
      date_last_fetched: "2026-09-08"
      label: "CAPA exam page: 36/34/18/12 domains, $250, 90 minutes, valid 2 years (Linux Foundation)"
    - url: "https://www.cncf.io/training/certification/capa/"
      date_last_fetched: "2026-09-08"
      label: "CAPA exam page mirror with same 36/34/18/12 weights, $250 (CNCF)"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/faq-mc"
      date_last_fetched: "2026-09-08"
      label: "Multiple Choice Exams FAQ: 90 min, 75% pass, 2-year validity, retake renewal"
    - url: "https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-mc"
      date_last_fetched: "2026-09-08"
      label: "Important Instructions: 60 multiple-choice questions, 90 minutes"
  badge_image: "https://images.credly.com/images/12624f9e-6b4a-43f0-b7a2-afb2c6cf8059/image.png"
weeks:
  - week: 1
    title: "Fundamentos de Argo Workflows y specs"
    sections:
      - domain: "Argo Workflows"
        weight: "36%"
        points:
          - "Workflow fundamentals: qué y cuándo usar."
          - "Anatomía del Workflow spec en YAML."
          - "Templates: container, steps y script."
          - "Ejecutar y monitorear workflows básicos."
  - week: 2
    title: "Workflows avanzados: DAG, artefactos y data jobs"
    sections:
      - domain: "Argo Workflows"
        weight: "36%"
        points:
          - "DAG (Directed-Acyclic Graphs) y dependencias."
          - "Generar y consumir artifacts."
          - "Data processing jobs con Workflows."
          - "Retries, timeouts y parámetros."
  - week: 3
    title: "Fundamentos de Argo CD y sincronización"
    sections:
      - domain: "Argo CD"
        weight: "34%"
        points:
          - "Argo CD fundamentals y arquitectura GitOps."
          - "Sincronizar aplicaciones: sync policies."
          - "Application CR: source, destination y project."
          - "Live state vs desired state y diff."
  - week: 4
    title: "Argo CD con Helm/Kustomize y reconciliación"
    sections:
      - domain: "Argo CD"
        weight: "34%"
        points:
          - "Configurar Argo CD con Helm y Kustomize."
          - "Reconciliation patterns comunes."
          - "Self-heal, prune y sync waves."
          - "Troubleshoot de apps OutOfSync/Degraded."
  - week: 5
    title: "Argo Rollouts: estrategias progresivas"
    sections:
      - domain: "Argo Rollouts"
        weight: "18%"
        points:
          - "Rollouts fundamentals vs Deployment nativo."
          - "Canary y blue/green paso a paso."
          - "Traffic routing y service mesh básico."
          - "Promote, abort y rollback."
  - week: 6
    title: "AnalysisTemplates y métricas en Rollouts"
    sections:
      - domain: "Argo Rollouts"
        weight: "18%"
        points:
          - "AnalysisTemplate y AnalysisRun."
          - "Metrics providers y thresholds."
          - "Automated promotion con análisis."
          - "Casos de fallo y pausa automática."
  - week: 7
    title: "Argo Events: arquitectura y componentes"
    sections:
      - domain: "Argo Events"
        weight: "12%"
        points:
          - "Events fundamentals y casos de uso."
          - "EventSources: qué eventos escuchar."
          - "Sensors, triggers y dependencias."
          - "Integrar Events con Workflows y CD."
  - week: 8
    title: "Repaso final y simulacro CAPA"
    sections:
      - domain: "Argo Workflows"
        weight: "36%"
        points:
          - "Simulacro de 60 preguntas en 90 minutos."
          - "Repasar cuándo usar cada herramienta Argo."
          - "Cerrar gaps en Workflows y CD (70% combinado)."
          - "Checklist de día de examen con PSI Bridge."
`,
  "nv-genl": `
id: "nv-genl"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Associate: Generative AI LLMs"
code: "NCA-GENL"
cost: "$125 USD"
default_priority: 2
popularity: 4
summary: "Credencial Associate que valida fundamentos de LLMs e IA generativa con soluciones NVIDIA."
meta:
  exam_version: "Guía vigente (Associate)"
  guide_date: "2026-09-08"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/"
  format: "50-60 preguntas · 60 minutos · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Core Machine Learning and AI Knowledge: 30%"
    - "Software Development: 24%"
    - "Experimentation: 22%"
    - "Data Analysis and Visualization: 14%"
    - "Trustworthy AI: 10%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "200 · Associate"
  career_paths:
    - "AI Engineer"
    - "Machine Learning Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/"
      date_last_fetched: "2026-09-08"
      label: "Generative AI LLMs (NCA-GENL) — About, Exam Details, Blueprint"
    - url: "https://dam-cdn.nvd.orangelogic.com/AssetLink/ik3amm6oy7871nv371600i4h7drvex5m.pdf"
      date_last_fetched: "2026-09-08"
      label: "NVIDIA-Certified Associate Generative AI LLM Exam Study Guide"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-08"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
  badge_image: "https://images.credly.com/images/01c81db8-c1f5-41f6-b0f8-ac22442f8fa1/image.png"
weeks:
  - week: 1
    title: "Fundamentos ML y redes neuronales con NVIDIA"
    sections:
      - domain: "Core Machine Learning and AI Knowledge"
        weight: "30%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Repasar ML supervisado/no supervisado, overfitting y validación cruzada."
          - "Estudiar perceptrón, backpropagation, embeddings y arquitecturas encoder/decoder."
          - "Leer curso DLI Getting Started With Deep Learning y tomar apuntes."
          - "Resolver quiz de conceptos ML y registrar errores frecuentes."
  - week: 2
    title: "Transformers, NLP y prompt engineering"
    sections:
      - domain: "Core Machine Learning and AI Knowledge"
        weight: "30%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Estudiar atención, transformers y tokenización con curso DLI de NLP."
          - "Practicar RAG, chatbots y resumidores como casos de uso LLM."
          - "Aplicar principios de prompt engineering en ejercicios guiados."
          - "Comparar modelos y embeddings para selección de casos de uso."
  - week: 3
    title: "Desarrollo de software y librerías Python para LLMs"
    sections:
      - domain: "Software Development"
        weight: "24%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Programar scripts Python con spaCy, NumPy y Keras bajo buenas prácticas."
          - "Identificar componentes de sistema, hardware y software según requisitos."
          - "Monitorear recolección de datos y procesos de experimentación."
          - "Construir un mini-proyecto RAG o chatbot con control de versiones."
  - week: 4
    title: "Integración y despliegue de LLMs con NVIDIA"
    sections:
      - domain: "Software Development"
        weight: "24%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Evaluar escalabilidad, rendimiento y fiabilidad en despliegues modelo."
          - "Revisar NIM, NeMo, TensorRT y Triton a nivel conceptual Associate."
          - "Diseñar flujo de integración de un LLM en una app existente."
          - "Documentar decisiones de despliegue y riesgos técnicos."
  - week: 5
    title: "Experimentación y diseño de experimentos"
    sections:
      - domain: "Experimentation"
        weight: "22%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Diseñar experimentos con hipótesis, métricas y grupos de control."
          - "Comparar modelos con loss, varianza explicada y métricas estándar."
          - "Aplicar validación cruzada y selección de hiperparámetros básica."
          - "Analizar resultados y decidir siguiente iteración del experimento."
  - week: 6
    title: "Preprocesamiento, features y evaluación de modelos"
    sections:
      - domain: "Experimentation"
        weight: "22%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Limpiar y preparar datasets con pandas y técnicas de feature engineering."
          - "Curar y embeber datasets de contenido para RAG."
          - "Evaluar modelos con benchmarks de tareas de lenguaje elementales."
          - "Registrar experimentos de forma reproducible en cuaderno."
  - week: 7
    title: "Análisis de datos y visualización con RAPIDS"
    sections:
      - domain: "Data Analysis and Visualization"
        weight: "14%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Extraer insights con minería de datos y visualización exploratoria."
          - "Crear gráficos claros con software especializado para comunicar hallazgos."
          - "Identificar relaciones, tendencias y factores que afectan resultados."
          - "Practicar EDA con cuDF y visualización GPU en un dataset real."
  - week: 8
    title: "Trustworthy AI y simulacro final NCA-GENL"
    sections:
      - domain: "Trustworthy AI"
        weight: "10%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir principios éticos y balance privacidad vs. consentimiento."
          - "Explicar cómo reducir sesgo con tecnologías NVIDIA y otras."
          - "Repasar alineamiento, seguridad y transparencia de sistemas IA."
          - "Hacer examen cronometrado de 50 preguntas y repasar fallos."
`,
  "nv-ads": `
id: "nv-ads"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Associate: Accelerated Data Science"
code: "NCA-ADS"
cost: "$125 USD"
default_priority: 3
popularity: 3
summary: "Credencial Associate de data science acelerado por GPU con RAPIDS, cuDF y cuML."
meta:
  exam_version: "Guía vigente (Associate)"
  guide_date: "2026-09-08"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/accelerated-data-science-associate/"
  format: "50-60 preguntas · 60 minutos · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Data Manipulation and Preparation: 23%"
    - "Machine Learning With RAPIDS: 16%"
    - "Data Science Pipelines and Workflow Automation: 13%"
    - "Descriptive Analysis and Visualization: 13%"
    - "Foundations of Accelerated Data Science: 12%"
    - "Introductory MLOps Practices: 10%"
    - "Advance Data Structures: 7%"
    - "Software and Environment Management: 6%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "200 · Associate"
  career_paths:
    - "Data Scientist"
    - "Data Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/accelerated-data-science-associate/"
      date_last_fetched: "2026-09-08"
      label: "Accelerated Data Science (NCA-ADS) — About, Exam Details, Blueprint"
    - url: "https://dam-cdn.nvd.orangelogic.com/AssetLink/328u55865k15h7h0r28e70o023andi0r.pdf"
      date_last_fetched: "2026-09-08"
      label: "NVIDIA-Certified Associate Accelerated Data Science Study Guide"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-08"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
  badge_image: "https://images.credly.com/images/b9615320-0021-4759-aabf-07f131ec866a/blob"
weeks:
  - week: 1
    title: "Fundamentos de data science acelerado por GPU"
    sections:
      - domain: "Foundations of Accelerated Data Science"
        weight: "12%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Repasar Python, NumPy, pandas y Jupyter para análisis de datos."
          - "Comparar CPU vs. GPU, memoria y costo de transferencia host-device."
          - "Describir flujo end-to-end: ingesta, ETL, limpieza y transformación."
          - "Distinguir cómputo distribuido frente a acelerado por GPU."
  - week: 2
    title: "Manipulación y preparación de datos con cuDF"
    sections:
      - domain: "Data Manipulation and Preparation"
        weight: "23%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Integrar y unir datos con cuDF y pandas a escala GPU."
          - "Limpiar datos, gestionar calidad y cumplimiento de gobernanza."
          - "Construir ETL acelerado con RAPIDS, Dask o Spark."
          - "Aplicar feature engineering y manejo de desbalance de clases."
  - week: 3
    title: "Parquet, muestreo y reducción de dimensionalidad"
    sections:
      - domain: "Data Manipulation and Preparation"
        weight: "23%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Procesar y almacenar eficientemente con Parquet y frameworks modernos."
          - "Aplicar muestreo y reducción de dimensionalidad en datasets grandes."
          - "Generar datos sintéticos y validar su utilidad."
          - "Resolver un ejercicio ETL completo con cuDF de inicio a fin."
  - week: 4
    title: "Machine learning con RAPIDS y XGBoost"
    sections:
      - domain: "Machine Learning With RAPIDS"
        weight: "16%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Entrenar modelos GPU con cuML y XGBoost para regresión y clasificación."
          - "Evaluar modelos con métricas, matriz de confusión y generalización."
          - "Ajustar hiperparámetros y aplicar validación cruzada."
          - "Comparar clustering y clasificación en un dataset tabular."
  - week: 5
    title: "Pipelines reproducibles y workflow automation"
    sections:
      - domain: "Data Science Pipelines and Workflow Automation"
        weight: "13%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar pipelines end-to-end con RAPIDS y Dask reproducibles."
          - "Mitigar underfitting y overfitting con features y ajustes de modelo."
          - "Automatizar y escalar flujos con aumento e integración de datos."
          - "Documentar un pipeline con pasos, artefactos y dependencias."
  - week: 6
    title: "Análisis descriptivo, visualización e hipótesis"
    sections:
      - domain: "Descriptive Analysis and Visualization"
        weight: "13%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Realizar EDA con estadística descriptiva sobre DataFrames GPU."
          - "Elegir gráficos adecuados según el objetivo de análisis."
          - "Aplicar pruebas de hipótesis y significancia estadística."
          - "Interpretar patrones, tendencias y relaciones en un informe breve."
  - week: 7
    title: "MLOps introductorio y estructuras avanzadas"
    sections:
      - domain: "Introductory MLOps Practices"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Rastrear experimentos con MLflow o Weights and Biases."
          - "Guardar, cargar y versionar modelos con artefactos reproducibles."
          - "Monitorear drift y degradación en modelos en producción."
          - "Comparar benchmarking y selección de hardware óptimo."
      - domain: "Advance Data Structures"
        weight: "7%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Manejar series temporales con interpolación cuDF y forecasting."
          - "Evaluar rendimiento CPU vs. GPU en analítica temporal."
          - "Representar grafos y evaluar importancia de nodos y relaciones."
          - "Resolver un ejercicio de grafos o timestamps con RAPIDS."
  - week: 8
    title: "Entornos reproducibles y simulacro final NCA-ADS"
    sections:
      - domain: "Software and Environment Management"
        weight: "6%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Configurar entornos con Conda, PIP o Docker de forma reproducible."
          - "Verificar GPU con nvidia-smi y compatibilidad driver/CUDA/RAPIDS."
          - "Resolver conflictos de dependencias y usar git básico."
          - "Hacer examen cronometrado de 50 preguntas y repasar fallos."
`,
  "aws-saa": `
id: aws-saa
provider: AWS
provider_color: "#ff9900"
title: "AWS Certified Solutions Architect - Associate (SAA-C03)"
code: "SAA-C03"
cost: "$150 USD"
default_priority: 5
popularity: 5
summary: "Arquitectura segura resiliente y optimizada en costes sobre AWS Well-Architected."
meta:
  exam_version: "SAA-C03"
  guide_date: "2026-09-08"
  guide_source: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
  format: "65 preguntas · 130 minutos · multiple choice / multiple response"
  passing_score: "720 sobre 1000"
  domains:
    - "Design Secure Architectures: 30%"
    - "Design Resilient Architectures: 26%"
    - "Design High-Performing Architectures: 24%"
    - "Design Cost-Optimized Architectures: 20%"
  validity_years: 3
  recert_window: "Con certificación activa; maintain en Skill Builder dentro de los 90 días previos a expirar"
  recert_options:
    - "Pass the latest version of this exam (3 years)"
    - "Pass AWS Certified Solutions Architect - Professional (auto-recertifies, 3 years)"
    - "Maintain on AWS Skill Builder with paid subscription (1 year)"
  recert_discount: "50% voucher on next exam via AWS Certification Account"
  level: "200 · Associate"
  career_paths:
    - "Solutions Architect"
  versions:
    - code: "SAA-C02"
      note: "Versión previa reemplazada por SAA-C03"
    - code: "SAA-C01"
      note: "Versión original retirada"
  verified_sources:
    - url: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Solutions Architect - Associate Exam Guide (SAA-C03)"
    - url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Solutions Architect - Associate certification page"
  badge_image: "https://images.credly.com/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png"
weeks:
  - week: 1
    title: "Fundamentos Well-Architected e IAM"
    sections:
      - domain: "Design Secure Architectures"
        weight: "30%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "Pilares Well-Architected y principios de diseño seguro."
          - "IAM users roles policies y federación con IdP."
          - "Organizations SCPs y diseño multi-account básico."
          - "KMS Secrets Manager y protección de datos en reposo."
  - week: 2
    title: "Arquitecturas seguras con VPC y Edge"
    sections:
      - domain: "Design Secure Architectures"
        weight: "30%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "VPC subnets NACLs security groups y endpoints."
          - "WAF Shield CloudFront y protección DDoS."
          - "Cognito ALB auth y acceso seguro a workloads."
          - "Logging con CloudTrail Config y detección básica."
  - week: 3
    title: "Resiliencia con ELB Auto Scaling y desacoplo"
    sections:
      - domain: "Design Resilient Architectures"
        weight: "26%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "ALB NLB Auto Scaling y plantillas de lanzamiento."
          - "SQS SNS EventBridge y patrones loosely coupled."
          - "Multi-AZ frente a multi-Region y elección de estrategia."
          - "Lab con carga y failover entre zonas."
  - week: 4
    title: "Alta disponibilidad backup y DR"
    sections:
      - domain: "Design Resilient Architectures"
        weight: "26%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "RPO RTO y estrategias pilot light warm standby active-active."
          - "Backup con AWS Backup y snapshots cross-Region."
          - "Route 53 health checks y failover DNS."
          - "S3 CRR y replicación de datos críticos."
  - week: 5
    title: "Alto rendimiento en compute y storage"
    sections:
      - domain: "Design High-Performing Architectures"
        weight: "24%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "EC2 families Graviton Spot y Lambda concurrencia."
          - "EBS EFS S3 tiers y selección por patrón de acceso."
          - "CloudFront ElastiCache y aceleración de lectura."
          - "Lab de dimensionado y pruebas de rendimiento."
  - week: 6
    title: "Bases de datos redes e ingestión"
    sections:
      - domain: "Design High-Performing Architectures"
        weight: "24%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "RDS Aurora DynamoDB y elección SQL vs NoSQL."
          - "Read replicas DAX Global Tables y caching."
          - "VPC peering Transit Gateway y Direct Connect."
          - "Kinesis MSK y pipelines de ingestión y transformación."
  - week: 7
    title: "Costes optimizados S3 EC2 DB y red"
    sections:
      - domain: "Design Cost-Optimized Architectures"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "S3 lifecycle Intelligent-Tiering y Glacier."
          - "Savings Plans Reserved y Spot para compute."
          - "Aurora Serverless y dimensionado correcto de RDS."
          - "Cost Explorer budgets y diseño de red económico."
  - week: 8
    title: "Simulacros y repaso final SAA-C03"
    sections:
      - domain: "Design Secure Architectures"
        weight: "30%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Test completo de 65 preguntas en 130 minutos."
          - "Revisión de fallos en IAM VPC y KMS."
          - "Cheat sheets de Well-Architected por dominio."
          - "Estrategia de descarte y gestión del tiempo."
`,
  "aws-dva": `
id: aws-dva
provider: AWS
provider_color: "#ff9900"
title: "AWS Certified Developer - Associate (DVA-C02)"
code: "DVA-C02"
cost: "$150 USD"
default_priority: 4
popularity: 4
summary: "Desarrollo despliegue y depuración de aplicaciones cloud-native con SDK CLI y CI-CD."
meta:
  exam_version: "DVA-C02"
  guide_date: "2026-09-08"
  guide_source: "https://aws.amazon.com/certification/certified-developer-associate/"
  format: "65 preguntas · 130 minutos · multiple choice / multiple response"
  passing_score: "720 sobre 1000"
  domains:
    - "Development with AWS Services: 32%"
    - "Security: 26%"
    - "Deployment: 24%"
    - "Troubleshooting and Optimization: 18%"
  validity_years: 3
  recert_window: "Con certificación activa; maintain en Skill Builder dentro de los 90 días previos a expirar"
  recert_options:
    - "Pass the latest version of this exam (3 years)"
    - "Pass AWS Certified DevOps Engineer - Professional (auto-recertifies, 3 years)"
    - "Maintain on AWS Skill Builder with paid subscription (1 year)"
  recert_discount: "50% voucher on next exam via AWS Certification Account"
  level: "200 · Associate"
  career_paths:
    - "Cloud Developer"
  versions:
    - code: "DVA-C03"
      note: "Nueva versión, registro abre 2026-10-27, último día DVA-C02 2026-12-01"
    - code: "DVA-C01"
      note: "Versión previa retirada"
  verified_sources:
    - url: "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Developer - Associate Exam Guide (DVA-C02)"
    - url: "https://aws.amazon.com/certification/certified-developer-associate/"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Developer - Associate certification page"
  badge_image: "https://images.credly.com/images/b9feab85-1a43-4f6c-99a5-631b88d5461b/image.png"
weeks:
  - week: 1
    title: "Desarrollo con Lambda API Gateway y DynamoDB"
    sections:
      - domain: "Development with AWS Services"
        weight: "32%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Lambda eventos concurrencia y capas."
          - "API Gateway REST HTTP y autorizadores."
          - "DynamoDB keys indexes y streams básicos."
          - "Lab CRUD serverless con SAM."
  - week: 2
    title: "SDK CLI mensajería y Step Functions"
    sections:
      - domain: "Development with AWS Services"
        weight: "32%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "SDK paginación reintentos y manejo de errores."
          - "SQS SNS EventBridge y patrones event-driven."
          - "Step Functions Express vs Standard."
          - "S3 presigned URLs y multipart uploads."
  - week: 3
    title: "Seguridad IAM KMS Cognito y Secrets"
    sections:
      - domain: "Security"
        weight: "26%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Roles de ejecución y least privilege en apps."
          - "KMS envelope encryption y SSE para S3 y DynamoDB."
          - "Cognito user pools identity pools y JWT."
          - "Secrets Manager Parameter Store y rotación."
  - week: 4
    title: "Despliegue CI-CD con Code y Elastic Beanstalk"
    sections:
      - domain: "Deployment"
        weight: "24%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "CodeCommit CodeBuild CodeDeploy CodePipeline."
          - "Estrategias rolling blue-green y canary."
          - "Elastic Beanstalk y App Runner para despliegue rápido."
          - "Lab pipeline con aprobaciones y rollback."
  - week: 5
    title: "Contenedores ECS ECR y SAM"
    sections:
      - domain: "Deployment"
        weight: "24%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "ECS Fargate task definitions y service discovery."
          - "ECR imágenes y escaneo de vulnerabilidades."
          - "SAM templates y despliegue de serverless."
          - "Canary con CodeDeploy y CloudWatch alarms."
  - week: 6
    title: "Troubleshooting con X-Ray y CloudWatch"
    sections:
      - domain: "Troubleshooting and Optimization"
        weight: "18%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "CloudWatch Logs Insights metrics y alarms."
          - "X-Ray tracing y análisis de latencia."
          - "Optimización de Lambda memoria timeout y caching."
          - "DynamoDB throttling y diseño de particiones."
  - week: 7
    title: "Testing AI-assisted y repaso transversal"
    sections:
      - domain: "Troubleshooting and Optimization"
        weight: "18%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Herramientas AI para generar y revisar código."
          - "Tests automatizados y cobertura en pipelines."
          - "Escaneo de seguridad en dependencias y logs."
          - "Repaso de los cuatro dominios con flashcards."
  - week: 8
    title: "Simulacros y examen oficial de práctica"
    sections:
      - domain: "Development with AWS Services"
        weight: "32%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Official Practice Exam en Skill Builder."
          - "Drills de SDK CLI y SAM bajo tiempo."
          - "Revisión de errores en Security y Deployment."
          - "Checklist final y logística del día del examen."
`,
  "aws-sap": `
id: aws-sap
provider: AWS
provider_color: "#ff9900"
title: "AWS Certified Solutions Architect - Professional (SAP-C02)"
code: "SAP-C02"
cost: "$300 USD"
default_priority: 4
popularity: 4
summary: "Diseño avanzado multi-cuenta migración y mejora continua con Well-Architected."
meta:
  exam_version: "SAP-C02"
  guide_date: "2026-09-08"
  guide_source: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
  format: "75 preguntas · 180 minutos · multiple choice / multiple response"
  passing_score: "750 sobre 1000"
  domains:
    - "Design Solutions for Organizational Complexity: 26%"
    - "Design for New Solutions: 29%"
    - "Continuous Improvement for Existing Solutions: 25%"
    - "Accelerate Workload Migration and Modernization: 20%"
  validity_years: 3
  recert_window: "Con certificación activa; maintain en Skill Builder dentro de los 90 días previos a expirar"
  recert_options:
    - "Pass the latest version of this exam (3 years)"
    - "Maintain on AWS Skill Builder with paid subscription (1 year)"
  recert_discount: "50% voucher on next exam via AWS Certification Account"
  level: "300 · Professional"
  career_paths:
    - "Solutions Architect"
  versions:
    - code: "SAP-C03"
      note: "Nueva versión, registro abre 2026-10-27, último día SAP-C02 2026-11-17"
    - code: "SAP-C01"
      note: "Versión previa retirada"
  verified_sources:
    - url: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-professional-02/solutions-architect-professional-02.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Solutions Architect - Professional Exam Guide (SAP-C02)"
    - url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified Solutions Architect - Professional certification page"
  badge_image: "https://images.credly.com/images/2d84e428-9078-49b6-a804-13c15383d0de/image.png"
weeks:
  - week: 1
    title: "Complejidad organizativa con Organizations y SSO"
    sections:
      - domain: "Design Solutions for Organizational Complexity"
        weight: "26%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Organizations OUs SCPs y políticas preventivas."
          - "IAM Identity Center y federación a escala."
          - "Control Tower Account Factory y guardrails."
          - "Diseño de landing zone multi-cuenta."
  - week: 2
    title: "Redes multi-cuenta y conectividad híbrida"
    sections:
      - domain: "Design Solutions for Organizational Complexity"
        weight: "26%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Transit Gateway RAM y redes compartidas."
          - "Direct Connect VPN y routing híbrido."
          - "PrivateLink endpoints y exposición segura."
          - "DNS híbrido con Route 53 Resolver."
  - week: 3
    title: "Nuevas soluciones compute storage y datos"
    sections:
      - domain: "Design for New Solutions"
        weight: "29%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "EKS ECS Fargate y decisiones de orquestación."
          - "S3 FSx y almacenamiento por rendimiento."
          - "Aurora DynamoDB y replicación global."
          - "Event-driven con EventBridge y Step Functions."
  - week: 4
    title: "Seguridad avanzada y controles AI"
    sections:
      - domain: "Design for New Solutions"
        weight: "29%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Zero trust KMS CloudHSM y mTLS."
          - "Bedrock Guardrails y filtros de contenido."
          - "AgentCore Identity y oversight humano con Step Functions."
          - "Diseño de resiliencia multi-Region activa."
  - week: 5
    title: "Mejora continua coste fiabilidad y performance"
    sections:
      - domain: "Continuous Improvement for Existing Solutions"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Well-Architected reviews y priorización de remediación."
          - "Rightsizing Graviton Savings Plans y caching."
          - "Chaos engineering y pruebas de failover."
          - "Observabilidad avanzada y SLOs."
  - week: 6
    title: "Migración y modernización con CAF y MAP"
    sections:
      - domain: "Accelerate Workload Migration and Modernization"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Estrategias 7Rs y AWS CAF."
          - "MGN DMS SMS y migración de bases de datos."
          - "Refactor a microservicios y strangler pattern."
          - "DataSync Transfer Family y cortes de migración."
  - week: 7
    title: "Labs multi-Region y alta disponibilidad"
    sections:
      - domain: "Continuous Improvement for Existing Solutions"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Lab active-active con Route 53 y Global Accelerator."
          - "Backup cross-Region y restore medido."
          - "IaC con CloudFormation StackSets a escala."
          - "Runbooks y game days documentados."
  - week: 8
    title: "Simulacros largos SAP-C02 de 75 preguntas"
    sections:
      - domain: "Design for New Solutions"
        weight: "29%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Dos simulacros de 180 minutos cronometrados."
          - "Análisis de escenarios largos y descarte fino."
          - "Repaso de migración y organización compleja."
          - "Plan de ritmo para preguntas de respuesta múltiple."
`,
  "aws-dop": `
id: aws-dop
provider: AWS
provider_color: "#ff9900"
title: "AWS Certified DevOps Engineer - Professional (DOP-C02)"
code: "DOP-C02"
cost: "$300 USD"
default_priority: 3
popularity: 3
summary: "Automatización SDLC IaC observabilidad respuesta a incidentes y compliance en AWS."
meta:
  exam_version: "DOP-C02"
  guide_date: "2026-09-08"
  guide_source: "https://aws.amazon.com/certification/certified-devops-engineer-professional/"
  format: "75 preguntas · 180 minutos · multiple choice / multiple response"
  passing_score: "750 sobre 1000"
  domains:
    - "SDLC Automation: 22%"
    - "Configuration Management and IaC: 17%"
    - "Resilient Cloud Solutions: 15%"
    - "Monitoring and Logging: 15%"
    - "Incident and Event Response: 14%"
    - "Security and Compliance: 17%"
  validity_years: 3
  recert_window: "Con certificación activa; maintain en Skill Builder dentro de los 90 días previos a expirar"
  recert_options:
    - "Pass the latest version of this exam (3 years)"
    - "Maintain on AWS Skill Builder with paid subscription (1 year)"
  recert_discount: "50% voucher on next exam via AWS Certification Account"
  level: "300 · Professional"
  career_paths:
    - "DevOps Engineer"
  versions:
    - code: "DOP-C01"
      note: "Versión previa reemplazada por DOP-C02 en marzo 2023"
  verified_sources:
    - url: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.pdf"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified DevOps Engineer - Professional Exam Guide (DOP-C02)"
    - url: "https://aws.amazon.com/certification/certified-devops-engineer-professional/"
      date_last_fetched: "2026-09-08"
      label: "AWS Certified DevOps Engineer - Professional certification page"
  badge_image: "https://images.credly.com/images/bd31ef42-d460-493e-8503-39592aaf0458/image.png"
weeks:
  - week: 1
    title: "SDLC Automation con CodePipeline"
    sections:
      - domain: "SDLC Automation"
        weight: "22%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "CodePipeline stages aprobaciones y gates."
          - "CodeBuild builds cache y artefactos."
          - "CodeDeploy AppSpec y hooks de validación."
          - "Lab pipeline completo con rollback automático."
  - week: 2
    title: "IaC con CloudFormation CDK y SSM"
    sections:
      - domain: "Configuration Management and IaC"
        weight: "17%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Stacks change sets drift y StackSets."
          - "CDK constructs y pipelines de síntesis."
          - "SSM Parameter Store Automation y Patch Manager."
          - "Estrategias de config management inmutable."
  - week: 3
    title: "Soluciones resilientes y auto-healing"
    sections:
      - domain: "Resilient Cloud Solutions"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Auto Scaling policies predictivo y scheduled."
          - "Despliegues blue-green canary con Route 53."
          - "Multi-AZ multi-Region y data replication."
          - "Lab de failover y self-healing con health checks."
  - week: 4
    title: "Monitoring y logging con CloudWatch"
    sections:
      - domain: "Monitoring and Logging"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Metrics Logs Insights y Contributor Insights."
          - "Alarms composite y actions con SNS y Lambda."
          - "CloudTrail Lake y auditoría centralizada."
          - "Dashboards y SLOs operativos."
  - week: 5
    title: "Respuesta a incidentes con EventBridge"
    sections:
      - domain: "Incident and Event Response"
        weight: "14%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "EventBridge rules buses y archiving."
          - "SSM Incident Manager runbooks y postmortems."
          - "Step Functions para remediación automática."
          - "Simulacro de incidente con timeline medido."
  - week: 6
    title: "Seguridad y compliance automatizados"
    sections:
      - domain: "Security and Compliance"
        weight: "17%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "IAM least privilege y permission boundaries."
          - "Config rules Conformance Packs y remediación."
          - "Secrets rotation y escaneo en pipelines."
          - "GuardDuty Security Hub e Inspector integrados."
  - week: 7
    title: "Proyecto end-to-end DevOps en AWS"
    sections:
      - domain: "SDLC Automation"
        weight: "22%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "IaC despliegue y pipeline desde cero."
          - "Observabilidad alertas y dashboards finales."
          - "Runbook de incidentes y rollback probado."
          - "Revisión de costes y hardening final."
  - week: 8
    title: "Simulacros DOP-C02 y repaso de gaps"
    sections:
      - domain: "Monitoring and Logging"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Dos simulacros de 75 preguntas en 180 minutos."
          - "Drills de CodeDeploy CloudFormation y Config."
          - "Matriz de gaps por dominio con pesos oficiales."
          - "Rutina de examen y control de tiempo."
`,
  "ms-az900": `
id: ms-az900
provider: Microsoft Azure
provider_color: "#0078D4"
title: "Microsoft Certified: Azure Fundamentals"
code: "AZ-900"
cost: "$99 USD"
default_priority: 4
popularity: 5
summary: "Fundamentos de nube y Azure: conceptos cloud, arquitectura/servicios y gestión/gobernanza."
meta:
  exam_version: "Skills measured as of July 20, 2026"
  guide_date: "2026-07-20"
  guide_source: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
  format: "40-60 preguntas · 45 min · multiple choice, multi-select, drag-and-drop, hotspot/yes-no"
  passing_score: "700 sobre 1000"
  domains:
    - "Describe cloud concepts: 25-30%"
    - "Describe Azure architecture and services: 35-40%"
    - "Describe Azure management and governance: 30-35%"
  validity_years: 0
  recert_window: "N/A — las certificaciones Fundamentals no expiran"
  recert_options:
    - "No requiere renovación — credencial vitalicia"
    - "Opcional: practice assessment gratuito en Microsoft Learn"
  recert_discount: "N/A — no requiere renovación"
  level: "100 · Foundational"
  career_paths:
    - "Cloud Fundamentals"
  versions: []
  verified_sources:
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
      date_last_fetched: "2026-09-08"
      label: "Study guide for Exam AZ-900: Microsoft Azure Fundamentals"
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"
      date_last_fetched: "2026-09-08"
      label: "Microsoft Certified: Azure Fundamentals"
  badge_image: "https://images.credly.com/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png"
weeks:
  - week: 1
    title: "Conceptos cloud: modelos y CapEx/OpEx"
    sections:
      - domain: "Describe cloud concepts"
        weight: "25-30%"
        bloom: 1
        kirkpatrick: "L2"
        points:
          - "Definir cloud computing y modelo de responsabilidad compartida."
          - "Comparar modelos public/private/hybrid y casos de uso."
          - "Contrastar CapEx vs OpEx y modelo basado en consumo."
          - "Describir serverless y modelos de precios."
  - week: 2
    title: "Tipos de servicio IaaS/PaaS/SaaS y beneficios cloud"
    sections:
      - domain: "Describe cloud concepts"
        weight: "25-30%"
        bloom: 2
        points:
          - "Distinguir IaaS, PaaS y SaaS con ejemplos de Azure."
          - "Identificar caso de uso adecuado para cada tipo de servicio."
          - "Describir beneficios: alta disponibilidad, escalabilidad y elasticidad."
          - "Describir beneficios: fiabilidad, seguridad y manageability."
  - week: 3
    title: "Arquitectura Azure: regiones, recursos y jerarquía"
    sections:
      - domain: "Describe Azure architecture and services"
        weight: "35-40%"
        bloom: 2
        points:
          - "Describir regiones, pares de regiones y regiones soberanas."
          - "Explicar availability zones, datacenters y SLA implícito."
          - "Definir recursos, grupos de recursos y suscripciones."
          - "Explicar jerarquía management groups > subscriptions > resource groups."
  - week: 4
    title: "Compute y networking: VMs, containers y VNet"
    sections:
      - domain: "Describe Azure architecture and services"
        weight: "35-40%"
        bloom: 2
        points:
          - "Comparar VMs, Scale Sets, App Service, Functions y Container Instances."
          - "Describir opciones de hosting: Web Apps, containers y Azure Virtual Desktop."
          - "Explicar VNet, subnets, peering, VPN Gateway y ExpressRoute."
          - "Definir public vs private endpoints y Azure DNS."
  - week: 5
    title: "Storage, migración e identidad/seguridad"
    sections:
      - domain: "Describe Azure architecture and services"
        weight: "35-40%"
        bloom: 2
        points:
          - "Comparar Blob, Files, Queue, Disk y tiers/redundancia."
          - "Identificar AzCopy, Storage Explorer, Azure Migrate y Data Box."
          - "Describir Microsoft Entra ID, SSO, MFA y passwordless."
          - "Explicar RBAC, Conditional Access, Zero Trust y Defender for Cloud."
  - week: 6
    title: "Costos, gobernanza y herramientas de gestión"
    sections:
      - domain: "Describe Azure management and governance"
        weight: "30-35%"
        bloom: 2
        points:
          - "Identificar factores de costo, Pricing Calculator y Cost Management."
          - "Describir TCO Calculator, tags y presupuestos."
          - "Explicar Azure Policy, resource locks y Microsoft Purview."
          - "Describir portal, Cloud Shell, CLI, PowerShell, Azure Arc e IaC/ARM."
  - week: 7
    title: "Monitoreo: Advisor, Service Health y Monitor"
    sections:
      - domain: "Describe Azure management and governance"
        weight: "30-35%"
        bloom: 2
        points:
          - "Describir propósito de Azure Advisor y recomendaciones."
          - "Explicar Azure Service Health: estado, incidencias y mantenimiento."
          - "Describir Azure Monitor, Log Analytics y alertas."
          - "Identificar Application Insights para apps."
  - week: 8
    title: "Repaso final y simulacros cronometrados"
    sections:
      - domain: "Describe cloud concepts"
        weight: "25-30%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Repasar flashcards de definiciones clave de cloud."
          - "Resolver practice assessment oficial hasta 85%+."
          - "Revisar errores por dominio y releer study guide."
          - "Simular 40 preguntas en 45 minutos sin pausas."
`,
  "ms-ai901": `
id: ms-ai901
provider: Microsoft Azure
provider_color: "#0078D4"
title: "Microsoft Certified: Azure AI Fundamentals"
code: "AI-901"
cost: "$99 USD"
default_priority: 3
popularity: 3
summary: "Fundamentos de IA en Azure: conceptos de IA/ML y soluciones con Microsoft Foundry."
meta:
  exam_version: "Skills measured as of April 15, 2026 (AI-901)"
  guide_date: "2026-04-15"
  guide_source: "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/"
  format: "40-60 preguntas · 45 min · multiple choice, multi-select (sin labs)"
  passing_score: "700 sobre 1000"
  domains:
    - "Identify AI concepts and capabilities: 40-45%"
    - "Implement AI solutions by using Microsoft Foundry: 55-60%"
  validity_years: 0
  recert_window: "N/A — las certificaciones Fundamentals no expiran"
  recert_options:
    - "No requiere renovación — credencial vitalicia"
    - "Opcional: practice assessment gratuito vía AI Skills Navigator"
  recert_discount: "N/A — no requiere renovación"
  level: "100 · Foundational"
  career_paths:
    - "AI Engineer"
  versions:
    - code: "AI-900"
      note: "Retirado el 2026-06-30; el examen vigente es AI-901 (2 dominios, foco en generative-AI/Foundry)"
  verified_sources:
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/"
      date_last_fetched: "2026-09-08"
      label: "Exam AI-901: Microsoft Azure AI Fundamentals"
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/"
      date_last_fetched: "2026-09-08"
      label: "Microsoft Certified: Azure AI Fundamentals"
  badge_image: "https://images.credly.com/images/4136ced8-75d5-4afb-8677-40b6236e2672/linkedin_thumb_azure-ai-fundamentals-600x600.png"
weeks:
  - week: 1
    title: "Workloads de IA e IA responsable"
    sections:
      - domain: "Identify AI concepts and capabilities"
        weight: "40-45%"
        bloom: 1
        points:
          - "Distinguir workloads: ML, visión, NLP y IA generativa."
          - "Aplicar principios de IA responsable de Microsoft."
          - "Identificar consideraciones: fairness, privacy, transparency."
          - "Reconocer cuándo usar cada familia de servicios Azure AI."
  - week: 2
    title: "Machine Learning en Azure"
    sections:
      - domain: "Identify AI concepts and capabilities"
        weight: "40-45%"
        bloom: 2
        points:
          - "Distinguir ML supervisado, no supervisado y refuerzo."
          - "Explicar regresión, clasificación y clustering."
          - "Describir features, labels, training y evaluation."
          - "Identificar Azure Machine Learning y AutoML."
  - week: 3
    title: "Visión por computadora y NLP"
    sections:
      - domain: "Identify AI concepts and capabilities"
        weight: "40-45%"
        bloom: 2
        points:
          - "Describir image classification y object detection."
          - "Explicar OCR y Azure AI Vision / Face."
          - "Describir key phrase extraction, sentiment y traducción."
          - "Identificar Azure AI Language y Speech."
  - week: 4
    title: "IA generativa: tokens, embeddings y prompts"
    sections:
      - domain: "Identify AI concepts and capabilities"
        weight: "40-45%"
        bloom: 2
        points:
          - "Explicar LLMs, tokens y ventanas de contexto."
          - "Describir embeddings y búsqueda vectorial."
          - "Aplicar patrones de prompt engineering básicos."
          - "Distinguir completions vs chat vs RAG."
  - week: 5
    title: "Microsoft Foundry y Azure OpenAI"
    sections:
      - domain: "Implement AI solutions by using Microsoft Foundry"
        weight: "55-60%"
        bloom: 3
        points:
          - "Navegar Microsoft Foundry: hubs, proyectos y modelos."
          - "Desplegar un modelo Azure OpenAI en un endpoint."
          - "Consumir REST API/SDK con Python: auth y llamadas."
          - "Configurar content filters y cuotas del deployment."
  - week: 6
    title: "Apps y agentes con búsqueda y documentos"
    sections:
      - domain: "Implement AI solutions by using Microsoft Foundry"
        weight: "55-60%"
        bloom: 3
        points:
          - "Conectar Azure AI Search como grounding para RAG."
          - "Usar Content Understanding con documentos."
          - "Crear un agente básico con herramientas."
          - "Evaluar respuestas: groundedness y relevance."
  - week: 7
    title: "Laboratorio end-to-end en Foundry"
    sections:
      - domain: "Implement AI solutions by using Microsoft Foundry"
        weight: "55-60%"
        bloom: 4
        points:
          - "Construir app de Q&A sobre datos propios."
          - "Instrumentar prompts, parámetros y templates."
          - "Probar con CLI/SDK y revisar trazas."
          - "Documentar costos, límites y monitoreo."
  - week: 8
    title: "Repaso final y simulacros cronometrados"
    sections:
      - domain: "Identify AI concepts and capabilities"
        weight: "40-45%"
        kirkpatrick: "L2"
        points:
          - "Repasar glosario ML/GenAI y servicios Azure AI."
          - "Resolver practice assessment hasta 85%+."
          - "Simular 40-60 preguntas en 45 minutos."
          - "Revisar errores y releer study guide AI-901."
`,
  "ms-az104": `
id: ms-az104
provider: Microsoft Azure
provider_color: "#0078D4"
title: "Microsoft Certified: Azure Administrator Associate"
code: "AZ-104"
cost: "$165 USD"
default_priority: 5
popularity: 5
summary: "Administración de Azure: identidad/gobernanza, storage, compute, networking y monitoreo."
meta:
  exam_version: "Skills measured as of April 17, 2026"
  guide_date: "2026-04-17"
  guide_source: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104"
  format: "40-60 preguntas · 100 min · multiple choice, case studies, posible componente interactivo/lab"
  passing_score: "700 sobre 1000"
  domains:
    - "Manage Azure identities and governance: 20-25%"
    - "Implement and manage storage: 15-20%"
    - "Deploy and manage Azure compute resources: 20-25%"
    - "Implement and manage virtual networking: 15-20%"
    - "Monitor and maintain Azure resources: 10-15%"
  validity_years: 1
  recert_window: "Ventana de renovación desde 6 meses antes del vencimiento"
  recert_options:
    - "Free online renewal assessment on Microsoft Learn (unproctored, open-book, reintentos permitidos)"
  recert_discount: "Renovación gratuita — sin descuento aplicable porque no hay costo"
  level: "200 · Associate"
  career_paths:
    - "Cloud Administrator"
  versions: []
  verified_sources:
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104"
      date_last_fetched: "2026-09-08"
      label: "Study guide for Exam AZ-104: Microsoft Azure Administrator"
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/"
      date_last_fetched: "2026-09-08"
      label: "Microsoft Certified: Azure Administrator Associate"
  badge_image: "https://images.credly.com/images/336eebfc-0ac3-4553-9a67-b402f491f185/linkedin_thumb_azure-administrator-associate-600x600.png"
weeks:
  - week: 1
    title: "Entra ID: usuarios, grupos y SSPR"
    sections:
      - domain: "Manage Azure identities and governance"
        weight: "20-25%"
        bloom: 3
        points:
          - "Crear/gestionar usuarios, grupos y licencias en Entra ID."
          - "Gestionar external users B2B y SSPR."
          - "Practicar con portal, CLI y PowerShell."
          - "Resolver escenarios de ciclo de vida de identidades."
  - week: 2
    title: "RBAC, Policy, locks y costos"
    sections:
      - domain: "Manage Azure identities and governance"
        weight: "20-25%"
        bloom: 3
        points:
          - "Asignar roles built-in en distintos scopes e interpretar accesos."
          - "Implementar Azure Policy y resource locks."
          - "Aplicar tags, resource groups y management groups."
          - "Configurar budgets, alertas de costo y Advisor."
  - week: 3
    title: "Storage: cuentas, SAS y Blob/Files"
    sections:
      - domain: "Implement and manage storage"
        weight: "15-20%"
        bloom: 3
        points:
          - "Configurar firewalls de Storage, SAS y access keys."
          - "Crear cuentas: redundancia, replicación y cifrado."
          - "Gestionar Azure Files y Blob: tiers, soft delete, lifecycle."
          - "Mover datos con Storage Explorer y AzCopy."
  - week: 4
    title: "Compute I: ARM/Bicep y VMs"
    sections:
      - domain: "Deploy and manage Azure compute resources"
        weight: "20-25%"
        bloom: 3
        points:
          - "Interpretar y modificar templates ARM y ficheros Bicep."
          - "Desplegar VMs: tamaños, discos, encryption at host."
          - "Configurar availability zones/sets y VM Scale Sets."
          - "Mover VMs entre resource groups y regiones."
  - week: 5
    title: "Compute II: containers y App Service"
    sections:
      - domain: "Deploy and manage Azure compute resources"
        weight: "20-25%"
        bloom: 3
        points:
          - "Gestionar Azure Container Registry e instancias."
          - "Desplegar con Container Instances y Container Apps."
          - "Crear App Service plans, scaling, TLS y slots."
          - "Configurar backup y networking de App Service."
  - week: 6
    title: "Networking: VNet, NSG y balanceo"
    sections:
      - domain: "Implement and manage virtual networking"
        weight: "15-20%"
        bloom: 4
        points:
          - "Crear VNets, subnets, peering y rutas definidas."
          - "Configurar NSG/ASG y evaluar reglas efectivas."
          - "Implementar Bastion, service y private endpoints."
          - "Configurar Azure DNS y load balancer + troubleshooting."
  - week: 7
    title: "Monitoreo, backup y recuperación"
    sections:
      - domain: "Monitor and maintain Azure resources"
        weight: "10-15%"
        bloom: 3
        points:
          - "Interpretar métricas y logs en Azure Monitor (KQL básico)."
          - "Crear alert rules, action groups y processing rules."
          - "Usar Network Watcher y Connection monitor."
          - "Configurar Backup vaults, Site Recovery y failover."
  - week: 8
    title: "Repaso final y simulacros cronometrados"
    sections:
      - domain: "Deploy and manage Azure compute resources"
        weight: "20-25%"
        kirkpatrick: "L2"
        points:
          - "Resolver practice assessment oficial hasta 85%+."
          - "Simular examen de 100 minutos con labs/casos."
          - "Repasar comandos CLI/PowerShell por dominio."
          - "Releer change log del study guide abril 2026."
`,
  "ms-az204": `
id: ms-az204
provider: Microsoft Azure
provider_color: "#0078D4"
title: "Microsoft Certified: Azure Developer Associate"
code: "AZ-204"
cost: "$165 USD"
default_priority: 4
popularity: 4
summary: "Desarrollo en Azure: compute, storage, seguridad, monitoreo e integración de servicios."
meta:
  exam_version: "Skills measured as of January 14, 2026"
  guide_date: "2026-01-14"
  guide_source: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204"
  format: "40-60 preguntas · ~100 min · multiple choice, case studies, drag-and-drop"
  passing_score: "700 sobre 1000"
  domains:
    - "Develop Azure compute solutions: 25-30%"
    - "Develop for Azure storage: 15-20%"
    - "Implement Azure security: 15-20%"
    - "Monitor, troubleshoot, and optimize Azure solutions: 5-10%"
    - "Connect to and consume Azure services and third-party services: 20-25%"
  validity_years: 1
  recert_window: "Ventana de renovación desde 6 meses antes del vencimiento (ver nota de retiro)"
  recert_options:
    - "Free online renewal assessment on Microsoft Learn mientras la certificación esté vigente"
  recert_discount: "Renovación gratuita — sin descuento aplicable porque no hay costo"
  level: "200 · Associate"
  career_paths:
    - "Cloud Developer"
  versions:
    - code: "Aviso 2026-09-08"
      note: "La página oficial muestra aviso de retiro de la certificación y su renewal assessment; verificar vigencia en Learn antes de inscribirse"
  verified_sources:
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204"
      date_last_fetched: "2026-09-08"
      label: "Study guide for Exam AZ-204: Developing Solutions for Microsoft Azure"
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/"
      date_last_fetched: "2026-09-08"
      label: "Microsoft Certified: Azure Developer Associate"
  badge_image: "https://images.credly.com/images/63316b60-f62d-4e51-aacc-c23cb850089c/linkedin_thumb_azure-developer-associate-600x600.png"
weeks:
  - week: 1
    title: "Compute I: App Service y Functions"
    sections:
      - domain: "Develop Azure compute solutions"
        weight: "25-30%"
        bloom: 3
        points:
          - "Implementar App Service Web Apps: deploy, slots y TLS."
          - "Desarrollar Azure Functions: triggers y bindings."
          - "Configurar settings, scaling y custom domains."
          - "Laboratorio: desplegar app + function con Azure SDK/CLI."
  - week: 2
    title: "Compute II: containers y ACR"
    sections:
      - domain: "Develop Azure compute solutions"
        weight: "25-30%"
        bloom: 3
        points:
          - "Containerizar apps y push a Azure Container Registry."
          - "Desplegar en Container Instances y Container Apps."
          - "Gestionar sizing, scaling y auth de ACR."
          - "Laboratorio: pipeline build-push-deploy de container."
  - week: 3
    title: "Storage: Blob y Cosmos DB desde código"
    sections:
      - domain: "Develop for Azure storage"
        weight: "15-20%"
        bloom: 3
        points:
          - "Operar Blob Storage con SDK: upload, SAS y metadata."
          - "Implementar CRUD en Cosmos DB: particionado y consistencia."
          - "Usar change feed y TTL donde aplique."
          - "Laboratorio: API CRUD con backend Cosmos DB."
  - week: 4
    title: "Seguridad: Entra ID, Key Vault e identidades"
    sections:
      - domain: "Implement Azure security"
        weight: "15-20%"
        bloom: 4
        points:
          - "Autenticar usuarios con Microsoft Identity Platform."
          - "Implementar Managed Identities (system vs user-assigned)."
          - "Gestionar secretos/claves con Key Vault y App Config."
          - "Laboratorio: app sin secretos con Managed Identity."
  - week: 5
    title: "Monitoreo y optimización"
    sections:
      - domain: "Monitor, troubleshoot, and optimize Azure solutions"
        weight: "5-10%"
        bloom: 3
        points:
          - "Instrumentar con Application Insights y availability tests."
          - "Consultar logs/métricas en Azure Monitor (KQL)."
          - "Implementar caching con Azure Cache for Redis."
          - "Configurar CDN: endpoints, reglas y purge."
  - week: 6
    title: "Integración I: APIM y Microsoft Graph"
    sections:
      - domain: "Connect to and consume Azure services and third-party services"
        weight: "20-25%"
        bloom: 3
        points:
          - "Exponer APIs con API Management: policies y products."
          - "Consumir Microsoft Graph API autenticada."
          - "Gestionar suscripciones y versionado de APIs."
          - "Laboratorio: fachada APIM sobre Function App."
  - week: 7
    title: "Integración II: mensajería y eventos"
    sections:
      - domain: "Connect to and consume Azure services and third-party services"
        weight: "20-25%"
        bloom: 4
        points:
          - "Implementar colas/topics con Service Bus y dead-letter."
          - "Desarrollar soluciones event-based con Event Grid."
          - "Usar Event Hubs: particiones y consumer groups."
          - "Laboratorio: flujo queue + function + Cosmos DB."
  - week: 8
    title: "Repaso final y simulacros cronometrados"
    sections:
      - domain: "Develop Azure compute solutions"
        weight: "25-30%"
        kirkpatrick: "L3"
        points:
          - "Resolver 4+ practice exams completos hasta 85%+."
          - "Repasar SDK snippets por servicio."
          - "Proyecto end-to-end multi-servicio."
          - "Verificar estado de vigencia AZ-204 en Learn."
`,
  "ms-az305": `
id: ms-az305
provider: Microsoft Azure
provider_color: "#0078D4"
title: "Microsoft Certified: Azure Solutions Architect Expert"
code: "AZ-305"
cost: "$165 USD"
default_priority: 4
popularity: 4
summary: "Arquitectura en Azure: identidad/gobernanza, datos, continuidad e infraestructura con WAF."
meta:
  exam_version: "Skills measured updated April 17, 2026"
  guide_date: "2026-04-17"
  guide_source: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-305/"
  format: "40-60 preguntas · ~120 min · multiple choice, drag-and-drop, case studies (sin labs)"
  passing_score: "700 sobre 1000"
  domains:
    - "Design identity, governance, and monitoring solutions: 25-30%"
    - "Design data storage solutions: 20-25%"
    - "Design business continuity solutions: 15-20%"
    - "Design infrastructure solutions: 30-35%"
  validity_years: 1
  recert_window: "Ventana de renovación desde 6 meses antes del vencimiento"
  recert_options:
    - "Free online renewal assessment on Microsoft Learn (unproctored, open-book, reintentos permitidos)"
    - "Prerrequisito: mantener vigente Microsoft Certified: Azure Administrator Associate (AZ-104)"
  recert_discount: "Renovación gratuita — sin descuento aplicable porque no hay costo"
  level: "300 · Professional"
  career_paths:
    - "Solutions Architect"
  versions:
    - code: "Prerrequisito"
      note: "Expert credential requires AZ-104 (Azure Administrator Associate) as prerequisite alongside AZ-305"
  verified_sources:
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/az-305/"
      date_last_fetched: "2026-09-08"
      label: "Exam AZ-305: Designing Microsoft Azure Infrastructure Solutions"
    - url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/"
      date_last_fetched: "2026-09-08"
      label: "Microsoft Certified: Azure Solutions Architect Expert"
  badge_image: "https://images.credly.com/images/987adb7e-49be-4e24-b67e-55986bd3fe66/linkedin_thumb_azure-solutions-architect-expert-600x600.png"
weeks:
  - week: 1
    title: "Identidad y gobernanza: Entra ID y landing zones"
    sections:
      - domain: "Design identity, governance, and monitoring solutions"
        weight: "25-30%"
        bloom: 5
        points:
          - "Diseñar tenants, jerarquía de management groups y RBAC."
          - "Proponer Conditional Access, PIM y Zero Trust."
          - "Seleccionar Azure Policy, Blueprints e IaC/Bicep."
          - "Justificar trade-offs con Well-Architected Framework."
  - week: 2
    title: "Monitoreo y gobierno continuo"
    sections:
      - domain: "Design identity, governance, and monitoring solutions"
        weight: "25-30%"
        bloom: 5
        points:
          - "Diseñar estrategia Azure Monitor, Log Analytics y alertas."
          - "Incluir Network Watcher, Service Health y Advisor."
          - "Definir tagging, costos y FinOps por workload."
          - "Documentar decisiones tipo ADR por caso."
  - week: 3
    title: "Datos I: storage y SQL"
    sections:
      - domain: "Design data storage solutions"
        weight: "20-25%"
        bloom: 5
        points:
          - "Elegir Blob/Files/Data Lake por patrón de acceso."
          - "Diseñar Azure SQL vs Cosmos DB según consistencia."
          - "Definir particionado, indexación y replicación."
          - "Incorporar cifrado, keys y private endpoints."
  - week: 4
    title: "Datos II: integración y análisis"
    sections:
      - domain: "Design data storage solutions"
        weight: "20-25%"
        bloom: 5
        points:
          - "Proponer Data Factory / Event Hubs para ingesta."
          - "Diseñar capas medallion y retención por compliance."
          - "Evaluar costos de transacciones y throughput."
          - "Alinear con CAF y data governance (Purview)."
  - week: 5
    title: "Continuidad: backup, HA y DR"
    sections:
      - domain: "Design business continuity solutions"
        weight: "15-20%"
        bloom: 5
        points:
          - "Definir RTO/RPO por tier de aplicación."
          - "Diseñar Azure Backup y Site Recovery multi-región."
          - "Proponer active-passive vs active-active."
          - "Incluir runbooks de failover y pruebas chaos."
  - week: 6
    title: "Infraestructura I: compute y redes"
    sections:
      - domain: "Design infrastructure solutions"
        weight: "30-35%"
        bloom: 5
        points:
          - "Elegir VMs, AKS, Container Apps o Functions por workload."
          - "Diseñar hub-spoke, peering, Firewall y Bastion."
          - "Proponer App Gateway/Front Door y diseño de tráfico."
          - "Dimensionar zonas de disponibilidad y scale sets."
  - week: 7
    title: "Infraestructura II: apps, migración y seguridad"
    sections:
      - domain: "Design infrastructure solutions"
        weight: "30-35%"
        bloom: 6
        kirkpatrick: "L3"
        points:
          - "Diseñar App Service Environment y messaging (Service Bus/Event Grid)."
          - "Planificar migración con Azure Migrate y Data Box."
          - "Integrar Key Vault, Defender for Cloud y WAF."
          - "Estimar TCO con Pricing Calculator."
  - week: 8
    title: "Casos de estudio cronometrados"
    sections:
      - domain: "Design infrastructure solutions"
        weight: "30-35%"
        kirkpatrick: "L2"
        points:
          - "Resolver 2-3 case studies sin volver atrás (formato real)."
          - "Practicar lectura rápida de escenarios largos."
          - "Repasar videos AZ-305 Exam Readiness Zone."
          - "Confirmar AZ-104 vigente como prerrequisito Expert."
`,
  "gcp-pca": `
id: gcp-pca
provider: Google Cloud
provider_color: "#4285f4"
title: "Professional Cloud Architect"
code: "PCA"
cost: "$200 USD"
default_priority: 5
popularity: 5
summary: "Diseña, asegura y optimiza arquitecturas empresariales escalables en Google Cloud."
meta:
  exam_version: "Standard exam guide (English, current)"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/cloud-architect"
  format: "50-60 preguntas · 120 min · multiple choice y multiple select · online-proctored o centro Pearson VUE"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Designing and planning a cloud solution architecture: ~25%"
    - "Managing and provisioning a cloud solution infrastructure: ~17.5%"
    - "Designing for security and compliance: ~17.5%"
    - "Analyzing and optimizing technical and business processes: ~15%"
    - "Managing implementation: ~12.5%"
    - "Ensuring solution and operations excellence: ~12.5%"
  validity_years: 2
  recert_window: "Professional: desde 60 días antes del vencimiento; hasta 30 días después aún renovable conservando Series ID, luego examen estándar"
  recert_options:
    - "Standard exam"
    - "Renewal exam (1h, 25 preguntas, $100)"
    - "Ruta Google Skills (cursos/skill badges, extiende 1 año)"
  recert_discount: "Código 50% en sección Benefits de CM Connect"
  level: "300 · Professional"
  career_paths:
    - "Solutions Architect"
    - "Cloud Architect"
  versions: []
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Professional Cloud Architect Exam Guide (English)"
    - url: "https://cloud.google.com/learn/certification/cloud-architect"
      date_last_fetched: "2026-09-08"
      label: "Professional Cloud Architect certification page"
  badge_image: "https://images.credly.com/images/71c579e0-51fd-4247-b493-d2fa8167157a/image.png"
weeks:
  - week: 1
    title: "Marco del examen, Well-Architected y case studies"
    sections:
      - domain: "Designing and planning a cloud solution architecture"
        weight: "~25%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "Formato 50-60 preguntas, 2h, 2 case studies (20-30% del examen)."
          - "Pilares Well-Architected Framework como criterio transversal de diseño."
          - "Lectura inicial de los 4 case studies: EHR Healthcare, Cymbal Retail, Altostrat Media, KnightMotives."
          - "Método requisito negocio vs requisito técnico para responder escenarios."
  - week: 2
    title: "Diseño de arquitectura de solución y redes híbridas"
    sections:
      - domain: "Designing and planning a cloud solution architecture"
        weight: "~25%"
        bloom: 5
        kirkpatrick: "L2"
        points:
          - "Diseño multirregión, HA/DR, RPO/RTO y patrones de continuidad."
          - "VPC, Shared VPC, VPC peering, Cloud Interconnect y VPN híbrida."
          - "Migración: rehost, replatform, refactor y Migration Center."
          - "Estimación de capacidad y costes con Pricing Calculator."
  - week: 3
    title: "Cómputo, contenedores y serverless"
    sections:
      - domain: "Managing and provisioning a cloud solution infrastructure"
        weight: "~17.5%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Compute Engine, MIG con autoscaling y plantillas de instancia."
          - "GKE Standard vs Autopilot, Cloud Run y Cloud Functions con Eventarc."
          - "IaC con Terraform y Config Connector; estrategias de despliegue."
          - "Balanceo global, Cloud CDN y Cloud DNS para latencia."
  - week: 4
    title: "Datos, almacenamiento y bases de datos"
    sections:
      - domain: "Managing and provisioning a cloud solution infrastructure"
        weight: "~17.5%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Cloud Storage, Persistent Disk y Filestore según patrón de acceso."
          - "Cloud SQL, AlloyDB, Spanner, Firestore y Bigtable: criterios de selección."
          - "BigQuery, Pub/Sub, Dataflow y Dataproc en arquitecturas de datos."
          - "Vertex AI y Model Garden integrados en la solución."
  - week: 5
    title: "Seguridad, identidad y cumplimiento"
    sections:
      - domain: "Designing for security and compliance"
        weight: "~17.5%"
        bloom: 5
        kirkpatrick: "L2"
        points:
          - "Jerarquía IAM, roles, service accounts y Workload Identity Federation."
          - "VPC Service Controls, Private Google Access y perímetros de datos."
          - "Cifrado con Cloud KMS, DLP, Binary Authorization y SCC."
          - "Cumplimiento HIPAA/PCI, soberanía del dato y logs de auditoría."
  - week: 6
    title: "Análisis y optimización técnica y de negocio"
    sections:
      - domain: "Analyzing and optimizing technical and business processes"
        weight: "~15%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "SDLC, pruebas, validación y definición de procesos técnicos."
          - "Optimización de costes, FinOps y recomendaciones de Active Assist."
          - "Rendimiento: profiling, caching y escalado de cuellos de botella."
          - "Gobernanza datos e IA responsable en decisiones de arquitectura."
  - week: 7
    title: "Implementación y excelencia operativa"
    sections:
      - domain: "Managing implementation"
        weight: "~12.5%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Asesorar a equipos dev/ops y gestionar despliegues multientorno."
          - "CI/CD con Cloud Build, Artifact Registry y despliegues progresivos."
          - "Pilar excelencia operativa del Well-Architected Framework."
          - "Observabilidad: Cloud Monitoring, Logging, Trace y SLO/SLI."
      - domain: "Ensuring solution and operations excellence"
        weight: "~12.5%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "SRE: SLO, SLA, burn rate y gestión de incidentes."
          - "Automatización de operaciones y políticas de organización."
          - "Resiliencia, backup y recuperación ante desastres."
          - "Revisión post-incidente y mejora continua."
  - week: 8
    title: "Simulacros con case studies y repaso final"
    sections:
      - domain: "Designing and planning a cloud solution architecture"
        weight: "~25%"
        bloom: 6
        kirkpatrick: "L2"
        points:
          - "Resolver 2 case studies completos con pantalla dividida simulada."
          - "Mapear cada pregunta a dominio y pilar Well-Architected."
          - "Repaso de errores típicos en redes, IAM y selección de BD."
          - "Estrategia de tiempo: 2 min por pregunta y revisión final."
      - domain: "Ensuring solution and operations excellence"
        weight: "~12.5%"
        bloom: 3
        kirkpatrick: "L1"
        points:
          - "Checklist operativo previo al examen y logística Kryterion/VUE."
          - "Simulacro cronometrado de 50 preguntas con revisión de fallos."
          - "Fichas rápidas de servicios y límites clave."
          - "Plan de descanso y gestión del estrés el día del examen."
`,
  "gcp-pde": `
id: gcp-pde
provider: Google Cloud
provider_color: "#4285f4"
title: "Professional Data Engineer"
code: "PDE"
cost: "$200 USD"
default_priority: 4
popularity: 4
summary: "Construye pipelines, lagos y almacenes de datos seguros y escalables en Google Cloud."
meta:
  exam_version: "Standard exam guide (English, current)"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/data-engineer"
  format: "40-50 preguntas · 120 min · multiple choice y multiple select · online-proctored o centro Pearson VUE"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Designing data processing systems: ~22%"
    - "Ingesting and processing the data: ~25%"
    - "Storing the data: ~20%"
    - "Preparing and using data for analysis: ~15%"
    - "Maintaining and automating data workloads: ~18%"
  validity_years: 2
  recert_window: "Professional: desde 60 días antes del vencimiento; hasta 30 días después aún renovable conservando Series ID, luego examen estándar"
  recert_options:
    - "Standard exam"
    - "Renewal exam (1h, 20 preguntas, $100)"
    - "Ruta Google Skills (cursos/skill badges, extiende 1 año)"
  recert_discount: "Código 50% en sección Benefits de CM Connect"
  level: "300 · Professional"
  career_paths:
    - "Data Engineer"
  versions: []
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Professional Data Engineer Exam Guide (English)"
    - url: "https://cloud.google.com/learn/certification/data-engineer"
      date_last_fetched: "2026-09-08"
      label: "Professional Data Engineer certification page"
  badge_image: "https://images.credly.com/images/2d613ff8-8879-430b-b2d8-925fa29785e8/image.png"
weeks:
  - week: 1
    title: "Fundamentos del rol y diseño de sistemas de datos"
    sections:
      - domain: "Designing data processing systems"
        weight: "~22%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Ciclo de vida del dato: ingesta, transformación, almacenamiento y entrega."
          - "Batch vs streaming y estructurado vs no estructurado por caso."
          - "Fiabilidad, fidelidad, flexibilidad y portabilidad del diseño."
          - "Planificación de migraciones Hadoop hacia Dataproc/Dataflow/BigQuery."
  - week: 2
    title: "Seguridad, cumplimiento y gobernanza del dato"
    sections:
      - domain: "Designing data processing systems"
        weight: "~22%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "IAM granular BigQuery, service accounts y controles regionales."
          - "CMEK con Cloud KMS, DLP y enmascaramiento dinámico."
          - "VPC Service Controls y linaje de datos con Dataplex."
          - "Residencia del dato y auditoría de accesos."
  - week: 3
    title: "Ingesta y procesamiento batch y streaming"
    sections:
      - domain: "Ingesting and processing the data"
        weight: "~25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Pub/Sub: topics, ordering keys, dead-letter y entrega exactly-once."
          - "Dataflow/Beam: ventanas, watermarks, triggers y side inputs."
          - "Dataproc serverless, clusters efímeros y Dataproc Metastore."
          - "Orquestación con Cloud Composer: DAGs, sensores y scheduling."
  - week: 4
    title: "Almacenamiento y modelado en BigQuery y lagos"
    sections:
      - domain: "Storing the data"
        weight: "~20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "BigQuery: particionado, clustering, vistas materializadas y ediciones."
          - "Cloud Storage: clases, lifecycle y Autoclass para lagos."
          - "Cloud SQL, AlloyDB, Spanner, Firestore y Bigtable según acceso."
          - "Patrones lake/lakehouse con BigLake y tablas externas."
  - week: 5
    title: "Preparación y análisis con ML y BI"
    sections:
      - domain: "Preparing and using data for analysis"
        weight: "~15%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Transformación in-warehouse con Dataform y dbt."
          - "BigQuery ML: CREATE MODEL y tipos soportados en SQL."
          - "Vertex AI AutoML y despliegue de modelos tabulares."
          - "Looker y Looker Studio para analítica gobernada."
  - week: 6
    title: "Mantenimiento, costes y automatización"
    sections:
      - domain: "Maintaining and automating data workloads"
        weight: "~18%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Precios BigQuery on-demand vs ediciones y estimación de slots."
          - "Reintentos, idempotencia y dead-letter para fiabilidad."
          - "CI/CD de datos con Cloud Build y despliegue de DAGs."
          - "DR con time travel, snapshots y replicación multirregión."
  - week: 7
    title: "Laboratorio end-to-end y tuning"
    sections:
      - domain: "Ingesting and processing the data"
        weight: "~25%"
        bloom: 5
        kirkpatrick: "L3"
        points:
          - "Pipeline Pub/Sub a Dataflow hacia BigQuery con ventana sesión."
          - "Optimización de consultas: pruning, clustering y BI Engine."
          - "Monitorización con Cloud Monitoring y alertas de backlog."
          - "Seguridad columna/fila y row-level security en BigQuery."
  - week: 8
    title: "Simulacros y repaso de los 5 dominios"
    sections:
      - domain: "Maintaining and automating data workloads"
        weight: "~18%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 40 preguntas con revisión por dominio."
          - "Matriz decisión BigQuery vs Bigtable vs Spanner vs GCS."
          - "Matriz Dataflow vs Dataproc vs Composer vs Dataform."
          - "Checklist de examen y estrategia de descarte."
`,
  "gcp-cdl": `
id: gcp-cdl
provider: Google Cloud
provider_color: "#4285f4"
title: "Cloud Digital Leader"
code: "CDL"
cost: "$99 USD"
default_priority: 3
popularity: 3
summary: "Fundamentos de nube, datos, IA, infraestructura y seguridad en Google Cloud."
meta:
  exam_version: "Standard exam guide (English, current)"
  guide_date: "2026-09-08"
  guide_source: "https://cloud.google.com/learn/certification/cloud-digital-leader/"
  format: "50-60 preguntas · 90 min · multiple choice y multiple select · online-proctored o centro Pearson VUE"
  passing_score: "No publicada (Pass/Fail)"
  domains:
    - "Digital Transformation with Google Cloud: ~17%"
    - "Exploring Data Transformation with Google Cloud: ~16%"
    - "Innovating with Google Cloud Artificial Intelligence: ~16%"
    - "Modernize Infrastructure and Applications with Google Cloud: ~17%"
    - "Trust and Security with Google Cloud: ~17%"
    - "Scaling with Google Cloud Operations: ~17%"
  validity_years: 3
  recert_window: "Foundational: desde 180 días antes del vencimiento; hasta 30 días después aún renovable conservando Series ID, luego examen estándar"
  recert_options:
    - "Standard exam"
    - "Renewal exam (45 min, 20 preguntas, $60)"
    - "Ruta Google Skills (cursos/skill badges, extiende 1 año)"
  recert_discount: "Código 50% en sección Benefits de CM Connect"
  level: "100 · Foundational"
  career_paths:
    - "Cloud Fundamentals"
  versions: []
  verified_sources:
    - url: "https://services.google.com/fh/files/misc/cloud_digital_leader_exam_guide_english.pdf"
      date_last_fetched: "2026-09-08"
      label: "Cloud Digital Leader Exam Guide (English)"
    - url: "https://cloud.google.com/learn/certification/cloud-digital-leader/"
      date_last_fetched: "2026-09-08"
      label: "Cloud Digital Leader certification page"
  badge_image: "https://images.credly.com/images/44994cda-b5b0-44cb-9a6d-d29b57163073/image.png"
weeks:
  - week: 1
    title: "Transformación digital y por qué la nube"
    sections:
      - domain: "Digital Transformation with Google Cloud"
        weight: "~17%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "Nube, transformación digital, cloud-native y open standards."
          - "On-premises vs pública, privada, híbrida y multicloud."
          - "Beneficios Google Cloud: inteligencia, libertad y sostenibilidad."
          - "Riesgos de no adoptar y motores del cambio digital."
  - week: 2
    title: "Conceptos cloud y responsabilidad compartida"
    sections:
      - domain: "Digital Transformation with Google Cloud"
        weight: "~17%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "IaaS, PaaS y SaaS con TCO, flexibilidad y staffing."
          - "Modelo compartido en on-premises, IaaS, PaaS y SaaS."
          - "CapEx a OpEx, elasticidad, agilidad y escalabilidad."
          - "Infraestructura global Google: regiones, zonas y red privada."
  - week: 3
    title: "Datos: valor, almacenamiento y análisis"
    sections:
      - domain: "Exploring Data Transformation with Google Cloud"
        weight: "~16%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Dato como activo: insights, decisiones y cadena de valor."
          - "Cloud Storage, BigQuery, Spanner, Cloud SQL y Bigtable por caso."
          - "Clases Standard, Nearline, Coldline y Archive."
          - "Looker, Pub/Sub y Dataflow para pipelines y BI en tiempo real."
  - week: 4
    title: "IA y ML con Google Cloud"
    sections:
      - domain: "Innovating with Google Cloud Artificial Intelligence"
        weight: "~16%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "IA vs ML vs analítica y tipos de problemas ML."
          - "APIs preentrenadas: Vision, Language, Translation y Speech."
          - "AutoML, BigQuery ML en SQL y Vertex AI custom."
          - "IA explicable y responsable con datos de calidad."
  - week: 5
    title: "Modernización: migración y cómputo"
    sections:
      - domain: "Modernize Infrastructure and Applications with Google Cloud"
        weight: "~17%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Rutas retire, retain, rehost, replatform y refactor."
          - "VMs, contenedores, microservicios y serverless."
          - "Compute Engine, GKE, Cloud Run, App Engine y Functions."
          - "Autoscaling, balanceo y Kubernetes en contexto negocio."
  - week: 6
    title: "APIs e híbrido con Anthos"
    sections:
      - domain: "Modernize Infrastructure and Applications with Google Cloud"
        weight: "~17%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "APIs como oportunidad y monetización con Apigee."
          - "Casos híbrido y multicloud y panel único Anthos."
          - "Cuándo elegir cada opción de cómputo por escenario."
          - "Mapa producto-necesidad para preguntas situacionales."
  - week: 7
    title: "Confianza, seguridad y operaciones a escala"
    sections:
      - domain: "Trust and Security with Google Cloud"
        weight: "~17%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "Ciberamenazas, CIA y seguridad cloud vs tradicional."
          - "Defensa en profundidad, cifrado, IAM y 2SV."
          - "Cloud Armor anti-DDoS, SecOps y centro de cumplimiento."
          - "Soberanía y residencia del dato con auditorías externas."
      - domain: "Scaling with Google Cloud Operations"
        weight: "~17%"
        bloom: 2
        kirkpatrick: "L1"
        points:
          - "Gobernanza financiera, cuotas, presupuestos y Billing Reports."
          - "SRE, DevOps, resiliencia, HA y disaster recovery."
          - "Customer Care y ciclo de vida de un caso de soporte."
          - "Sostenibilidad Google Cloud y productos verdes."
  - week: 8
    title: "Repaso integral y simulacros"
    sections:
      - domain: "Digital Transformation with Google Cloud"
        weight: "~17%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Fichas por dominio con 8-10 preguntas esperadas cada uno."
          - "Simulacro de 50 preguntas en 90 min sin pausa."
          - "Repaso de vocabulario: TCO, defensa en profundidad y SRE."
          - "Estrategia de descarte y gestión del tiempo."
      - domain: "Trust and Security with Google Cloud"
        weight: "~17%"
        bloom: 3
        kirkpatrick: "L1"
        points:
          - "Segundo simulacro enfocado en seguridad y operaciones."
          - "Errores típicos en clases de storage y opciones de cómputo."
          - "Checklist logístico del examen online o en centro."
          - "Plan final de repaso de 48h antes del examen."
`,
  "nv-genm": `
id: "nv-genm"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Associate: Generative AI Multimodal"
code: "NCA-GENM"
cost: "$125 USD"
default_priority: 3
popularity: 3
summary: "Credencial Associate que valida diseño y gestión de IA generativa multimodal (texto, imagen y audio)."
meta:
  exam_version: "Guía vigente (Associate)"
  guide_date: "2026-09-08"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/"
  format: "50-60 preguntas · 60 minutos · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Experimentation: 25%"
    - "Core Machine Learning and AI Knowledge: 20%"
    - "Multimodal Data: 15%"
    - "Software Development: 15%"
    - "Data Analysis and Visualization: 10%"
    - "Performance Optimization: 10%"
    - "Trustworthy AI: 5%"
  validity_years: 2
  recert_window: "Validez de 2 años desde la emisión; reintento tras suspenso con espera de 14 días y máximo 5 intentos por año"
  recert_options:
    - "Repetir el examen NCA-GENM (única vía de recertificación publicada)"
  recert_discount: "No publicado"
  level: "200 · Associate"
  career_paths:
    - "AI Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/"
      date_last_fetched: "2026-09-08"
      label: "Página oficial del examen NCA-GENM (duración, precio, preguntas, temas, blueprint y validez)"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-08"
      label: "Hub oficial de certificaciones NVIDIA (política de renovación cada 2 años y reintentos)"
    - url: "https://dam-cdn.nvd.orangelogic.com/AssetLink/detpmyehv83e550p46e2s6b2786368yd.pdf"
      date_last_fetched: "2026-09-08"
      label: "Guía de estudio oficial NCA-GENM (PDF enlazado desde la página del examen)"
  badge_image: "https://images.credly.com/images/3a48bfb1-6b85-42f3-8c82-10178b948419/image.png"
weeks:
  - week: 1
    title: "Fundamentos de ML/DL y redes neuronales con PyTorch"
    sections:
      - domain: "Core Machine Learning and AI Knowledge"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Repasar perceptrón, CNN, RNN y dinámica de entrenamiento (gradientes, overfitting)."
          - "Practicar tensores y autograd en PyTorch con notebooks reproducibles."
          - "Comparar GAN, VAE y difusión como familias generativas base."
          - "Resolver cuestionarios de conceptos ML con justificación de cada respuesta."
  - week: 2
    title: "Transformers, CLIP y modelos de difusión multimodales"
    sections:
      - domain: "Core Machine Learning and AI Knowledge"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Estudiar atención, ViT con patch embeddings y codificadores duales tipo CLIP."
          - "Entender proceso directo/inverso de difusión y difusión latente con VAE."
          - "Analizar cross-attention como condicionamiento texto-imagen."
          - "Comparar arquitecturas encoder-decoder frente a decoder-only multimodales."
  - week: 3
    title: "Datos multimodales: curación y preprocesado con Hugging Face"
    sections:
      - domain: "Multimodal Data"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Preprocesar imágenes (resize, normalización) y audio (mel-espectrogramas)."
          - "Curar pares texto-imagen: calidad de captions, deduplicación y licencias."
          - "Aplicar aumento de datos multimodal y filtrado de seguridad del corpus."
          - "Inspeccionar datasets con Hugging Face Datasets y documentar linaje."
  - week: 4
    title: "Desarrollo de pipelines con NeMo, NIM y Diffusers"
    sections:
      - domain: "Software Development"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Construir pipeline texto-imagen con Hugging Face Diffusers paso a paso."
          - "Mapear componentes NVIDIA: NeMo entrena, NIM sirve, Riva voz, Triton despliega."
          - "Integrar APIs y contenedores NGC con buenas prácticas de ingeniería."
          - "Versionar código, datos y modelos con flujos MLOps reproducibles."
  - week: 5
    title: "Experimentación y prompt engineering multimodal"
    sections:
      - domain: "Experimentation"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar prompts texto-imagen con prompts negativos y ponderación."
          - "Ajustar guidance scale, pasos de inferencia, scheduler y semilla."
          - "Planificar barridos de hiperparámetros y estudios de ablación."
          - "Registrar experimentos con hipótesis, métrica y criterio de decisión."
  - week: 6
    title: "Evaluación multimodal: FID, CLIP Score y tests A/B"
    sections:
      - domain: "Experimentation"
        weight: "25%"
        bloom: 5
        kirkpatrick: "L3"
        points:
          - "Calcular e interpretar FID (menor es mejor) y CLIP Score (mayor es mejor)."
          - "Contrastar Inception Score, BLEU y CIDEr según modalidad evaluada."
          - "Diseñar test A/B de despliegue con criterios de parada definidos."
          - "Decidir el siguiente experimento a partir de señales de evaluación."
  - week: 7
    title: "Análisis visual y optimización de inferencia con TensorRT"
    sections:
      - domain: "Data Analysis and Visualization"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Explorar datasets multimodales y detectar desbalance entre modalidades."
          - "Visualizar embeddings y mapas de atención para diagnosticar fallos."
          - "Interpretar curvas de entrenamiento y paneles de monitorización."
          - "Relacionar mala alineación caption-imagen con métricas degradadas."
      - domain: "Performance Optimization"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Aplicar cuantización y reducción de pasos de difusión en inferencia."
          - "Acelerar servicio con TensorRT y batching eficiente en GPU."
          - "Comparar latencia frente a calidad al optimizar modelos de visión."
          - "Perfilar cuellos de botella de un pipeline multimodal servido."
  - week: 8
    title: "IA confiable, repaso final y simulacro cronometrado"
    sections:
      - domain: "Trustworthy AI"
        weight: "5%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Identificar sesgos y estereotipos visuales en generación de imágenes."
          - "Aplicar filtros NSFW, marcas de agua y detección de deepfakes."
          - "Evaluar privacidad, consentimiento y propiedad intelectual en medios generados."
          - "Añadir guardarraíles a un pipeline de generación multimodal."
      - domain: "Experimentation"
        weight: "25%"
        bloom: 5
        kirkpatrick: "L4"
        points:
          - "Repasar los 7 dominios priorizando puntos débiles detectados."
          - "Completar simulacro de 60 preguntas en 55 minutos cronometrados."
          - "Revisar errores con referencia a la documentación oficial."
          - "Confirmar ritmo de 60-72 segundos por pregunta antes del examen."
`,
  "nv-aiio": `
id: "nv-aiio"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Associate: AI Infrastructure and Operations"
code: "NCA-AIIO"
cost: "$125 USD"
default_priority: 3
popularity: 3
summary: "Credencial Associate que valida fundamentos de infraestructura y operaciones de computación IA."
meta:
  exam_version: "Guía vigente (Associate)"
  guide_date: "2026-09-08"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/"
  format: "50 preguntas · 60 minutos · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Essential AI Knowledge: 38%"
    - "AI Infrastructure: 40%"
    - "AI Operations: 22%"
  validity_years: 2
  recert_window: "Validez de 2 años desde la emisión; reintento tras suspenso con espera de 14 días y máximo 5 intentos por año"
  recert_options:
    - "Repetir el examen NCA-AIIO (única vía de recertificación publicada)"
  recert_discount: "No publicado"
  level: "200 · Associate"
  career_paths:
    - "AI Infrastructure Engineer"
    - "Cloud Operations"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/"
      date_last_fetched: "2026-09-08"
      label: "Página oficial del examen NCA-AIIO (duración, precio, preguntas, temas, blueprint y validez)"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-08"
      label: "Hub oficial de certificaciones NVIDIA (política de renovación cada 2 años y reintentos)"
    - url: "https://dam-cdn.nvd.orangelogic.com/AssetLink/x874j05hy3m3r2sor84kpvp70750m468.pdf"
      date_last_fetched: "2026-09-08"
      label: "Guía de estudio oficial NCA-AIIO (PDF enlazado desde la página del examen)"
  badge_image: "https://images.credly.com/images/3d924691-436a-4fb6-b19b-1005ccbb6135/blob"
weeks:
  - week: 1
    title: "Fundamentos de IA/ML/DL y casos de uso por industria"
    sections:
      - domain: "Essential AI Knowledge"
        weight: "38%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Diferenciar IA, machine learning y deep learning con ejemplos."
          - "Explicar factores del auge reciente de la IA (datos, GPU, algoritmos)."
          - "Mapear casos de uso clave de IA a industrias y soluciones NVIDIA."
          - "Describir requisitos de arquitectura de training frente a inference."
  - week: 2
    title: "Stack de software NVIDIA y ciclo de vida de la IA"
    sections:
      - domain: "Essential AI Knowledge"
        weight: "38%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir el stack NVIDIA en un entorno IA (CUDA, NCCL, AI Enterprise)."
          - "Identificar componentes del ciclo de vida: desarrollo, despliegue y servicio."
          - "Comparar arquitecturas GPU y CPU para cargas de trabajo IA."
          - "Asociar cada solución NVIDIA a su propósito y caso de uso."
  - week: 3
    title: "Dimensionado de infraestructura GPU para training e inferencia"
    sections:
      - domain: "AI Infrastructure"
        weight: "40%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Identificar requisitos hardware para casos de training concretos."
          - "Escalar infraestructura GPU (DGX, HGX, MGX) según el caso de uso."
          - "Describir componentes clave de un clúster acelerado."
          - "Comparar training distribuido frente a inferencia de baja latencia."
  - week: 4
    title: "Energía, refrigeración e instalaciones del data center"
    sections:
      - domain: "AI Infrastructure"
        weight: "40%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Identificar conceptos y especificaciones de potencia y refrigeración."
          - "Determinar requisitos de instalación para racks acelerados."
          - "Estimar impacto energético de clústeres GPU densos."
          - "Relacionar refrigeración con disponibilidad y rendimiento sostenido."
  - week: 5
    title: "Redes de data center: InfiniBand, Ethernet y DPU"
    sections:
      - domain: "AI Infrastructure"
        weight: "40%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Determinar requisitos de red para cargas de trabajo IA distribuidas."
          - "Identificar protocolos y conceptos clave de red en el DC."
          - "Comparar opciones de red de alta velocidad y sus casos de uso."
          - "Explicar propósito y beneficios de la DPU en el data center."
  - week: 6
    title: "On-prem frente a cloud y virtualización acelerada"
    sections:
      - domain: "AI Infrastructure"
        weight: "40%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Contrastar ventajas y retos de on-prem frente a cloud para IA."
          - "Identificar consideraciones clave de adopción de soluciones NVIDIA."
          - "Describir opciones de nube GPU (p. ej. DGX Cloud) y colocación."
          - "Evaluar escenarios para recomendar on-prem, cloud o híbrido."
      - domain: "AI Operations"
        weight: "22%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Identificar consideraciones para virtualizar infraestructura acelerada (vGPU)."
          - "Comparar aislamiento y compartición de GPU en entornos virtuales."
          - "Documentar criterios de decisión para virtualizar cargas IA."
          - "Relacionar virtualización con utilización y costes operativos."
  - week: 7
    title: "Operaciones: monitorización GPU y orquestación de clústeres"
    sections:
      - domain: "AI Operations"
        weight: "22%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Describir gestión y monitorización esencial del DC de IA (DCGM)."
          - "Identificar métricas y criterios clave de monitorización de GPU."
          - "Describir orquestación de clúster y scheduling de trabajos (Run:ai, Slurm)."
          - "Diagnosticar un incidente simulado con logs y métricas GPU."
  - week: 8
    title: "Repaso integral, curso Academy y simulacro cronometrado"
    sections:
      - domain: "Essential AI Knowledge"
        weight: "38%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Repasar el stack, training frente a inference y GPU frente a CPU."
          - "Completar el curso AI Infrastructure and Operations Fundamentals (7 h)."
          - "Resolver tarjetas de conceptos clave de los tres dominios."
          - "Validar definiciones contra la guía de estudio oficial."
      - domain: "AI Operations"
        weight: "22%"
        bloom: 5
        kirkpatrick: "L4"
        points:
          - "Completar simulacro de 50 preguntas en 60 minutos cronometrados."
          - "Revisar fallos de infraestructura, red y operaciones por tema."
          - "Reforzar puntos débiles con documentación oficial NVIDIA."
          - "Confirmar estrategia de ritmo (72 segundos por pregunta)."
`,
  "istqb-ctfl": `
id: "istqb-ctfl"
provider: "ISTQB"
provider_color: "#1a73e8"
title: "Certified Tester Foundation Level (CTFL) v4.0"
code: "CTFL"
cost: "$229 USD"
default_priority: 4
popularity: 4
summary: "Fundamentos de testing de software: base de todo el esquema ISTQB, sin prerrequisitos."
meta:
  exam_version: "v4.0 (syllabus v4.0.1, actualización menor sin cambios de contenido)"
  guide_date: "2023-04-21"
  guide_source: "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/"
  format: "40 preguntas de opción múltiple, 60 min (+25% si el examen no es en tu lengua nativa: 75 min)"
  passing_score: "26/40 (65%)"
  domains:
    - "Fundamentos del testing (Cap. 1, ~16% tiempo formación, K1-K2)"
    - "Testing en el ciclo de vida del software (Cap. 2, ~11% tiempo formación, K1-K2)"
    - "Testing estático (Cap. 3, ~7% tiempo formación, K1-K2)"
    - "Análisis y diseño de pruebas (Cap. 4, ~34% tiempo formación, K2-K3)"
    - "Gestión de las actividades de prueba (Cap. 5, ~30% tiempo formación, K1-K3)"
    - "Herramientas de prueba (Cap. 6, ~2% tiempo formación, K1-K2)"
  validity_years: 0
  recert_window: "N/A — credencial vitalicia"
  recert_options:
    - "Credencial vitalicia — no requiere renovación"
  recert_discount: "N/A — vitalicia, sin renovación"
  level: "100 · Foundational"
  career_paths:
    - "Software Tester"
    - "QA Engineer"
  versions:
    - code: "v4.0"
      note: "Vigente (lanzado 2023-04-21); v4.0.1 es actualización menor de 2024"
    - code: "v3.1"
      note: "Versión anterior, aún listada en tablas de examen v1.6 (40Q/26 pass/60 min)"
  verified_sources:
    - url: "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/"
      date_last_fetched: "2026-09-08"
      label: "Página oficial CTFL v4.0 (40 preguntas, aprobado 26, 60 min +25%)"
    - url: "https://istqb.org/certifications/"
      date_last_fetched: "2026-09-08"
      label: "Portafolio oficial ISTQB (CTFL v4.0 vigente en Core Foundation)"
    - url: "https://astqb.org/istqb-faqs/what-is-the-price-of-an-istqb-exam/"
      date_last_fetched: "2026-09-08"
      label: "Precio US verificado $229 CTFL (varía por Member Board)"
  badge_image: "https://images.credly.com/images/12c64ffc-c5af-4be8-8fdc-8de91879be44/Brightest_CTFL.png"
weeks:
  - week: 1
    title: "Fundamentos del testing"
    sections:
      - domain: "Fundamentos del testing"
        weight: "~16%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Diferenciar testing de debugging y QA de QC."
          - "Explicar los 7 principios del testing."
          - "Resumir actividades, testware y trazabilidad."
          - "Comparar roles y el enfoque whole-team e independencia."
  - week: 2
    title: "Testing en el ciclo de vida del software"
    sections:
      - domain: "Testing en el ciclo de vida del software"
        weight: "~11%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Adaptar el testing al SDLC elegido y shift-left."
          - "Distinguir niveles y tipos de prueba."
          - "Diferenciar confirmación de regresión."
          - "Resumir DevOps, TDD/ATDD/BDD y retrospectivas."
  - week: 3
    title: "Testing estático y revisiones"
    sections:
      - domain: "Testing estático"
        weight: "~7%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Contrastar testing estático frente a dinámico."
          - "Aplicar el proceso de revisión ISO/IEC 20246."
          - "Asignar roles de revisión (autor, moderador, escriba)."
          - "Distinguir walkthrough, revisión técnica e inspección."
  - week: 4
    title: "Técnicas de caja negra"
    sections:
      - domain: "Análisis y diseño de pruebas"
        weight: "~17%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Derivar casos con partición de equivalencia."
          - "Derivar casos con análisis de valores límite (2 y 3 valores)."
          - "Derivar casos con tablas de decisión."
          - "Derivar casos con transición de estados y coberturas."
  - week: 5
    title: "Caja blanca, experiencia y colaboración"
    sections:
      - domain: "Análisis y diseño de pruebas"
        weight: "~17%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Explicar cobertura de sentencias y de ramas."
          - "Explicar error guessing, exploratory y checklist-based."
          - "Escribir user stories colaborativas (INVEST, 3 C)."
          - "Derivar casos con ATDD y criterios de aceptación."
  - week: 6
    title: "Planificación y estimación de pruebas"
    sections:
      - domain: "Gestión de las actividades de prueba"
        weight: "~15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Redactar el contenido y propósito del plan de pruebas."
          - "Comparar criterios de entrada y salida (DoR/DoD)."
          - "Calcular esfuerzo con ratios, Delphi, 3 puntos y Planning Poker."
          - "Priorizar casos y usar pirámide y cuadrantes de testing."
  - week: 7
    title: "Riesgos, seguimiento y defectos"
    sections:
      - domain: "Gestión de las actividades de prueba"
        weight: "~15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Distinguir riesgos de proyecto y de producto."
          - "Analizar riesgos para enfocar el testing basado en riesgo."
          - "Interpretar métricas e informes de avance y cierre."
          - "Redactar un informe de defecto completo y reproducible."
  - week: 8
    title: "Herramientas y simulacros finales"
    sections:
      - domain: "Herramientas de prueba"
        weight: "~2%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Clasificar tipos de herramientas y su apoyo al testing."
          - "Recordar beneficios y riesgos de la automatización."
          - "Resolver exámenes de muestra A-D bajo tiempo real."
          - "Repasar los 8 objetivos K3 más preguntados."
`,
  "istqb-ctai": `
id: "istqb-ctai"
provider: "ISTQB"
provider_color: "#1a73e8"
title: "Certified Tester AI Testing (CT-AI) v2.0"
code: "CT-AI"
cost: "$199 USD"
default_priority: 4
popularity: 3
summary: "Testing de sistemas basados en IA/ML y GenAI: prerrequisito CTFL, nivel Specialist."
meta:
  exam_version: "v2.0 (reemplaza a CT-AI v1.0; v1.0 EN se retira el 2027-04-21)"
  guide_date: "2026-09-08"
  guide_source: "https://istqb.org/certifications/certified-tester-ai-testing-ct-ai/"
  format: "40 preguntas, 44 puntos, 60 min (+25% si el examen no es en tu lengua nativa: 75 min); prerrequisito: CTFL"
  passing_score: "29/44 (66%)"
  domains:
    - "Introducción a la IA (K2)"
    - "Características de calidad para sistemas IA e ISO/IEC 25059 (K2)"
    - "Machine learning: datos, métricas de rendimiento y redes neuronales (K2-K3)"
    - "Testing de sistemas IA incl. GenAI/LLM y niveles de prueba ML (K2)"
    - "Testing de datos de entrada para ML (K2-K3)"
    - "Testing de modelos ML (K2-K3)"
    - "Testing del desarrollo ML y estrategia de pruebas (K2-K3)"
  validity_years: 0
  recert_window: "N/A — credencial vitalicia"
  recert_options:
    - "Credencial vitalicia — no requiere renovación"
  recert_discount: "N/A — vitalicia, sin renovación"
  level: "200 · Intermediate"
  career_paths:
    - "AI Test Engineer"
    - "Software Tester"
  versions:
    - code: "v2.0"
      note: "Vigente; v1.0 en retirada (EN hasta 2027-04-21, no inglesas hasta 2027-10-21)"
  verified_sources:
    - url: "https://istqb.org/certifications/certified-tester-ai-testing-ct-ai/"
      date_last_fetched: "2026-09-08"
      label: "Página oficial CT-AI v2.0 (40 preguntas, 44 puntos, aprobado 29, 60 min +25%, prerrequisito CTFL)"
    - url: "https://istqb.org/certifications/"
      date_last_fetched: "2026-09-08"
      label: "Portafolio oficial ISTQB (CT-AI v2.0 en Specialist)"
    - url: "https://atsqa.org/pricing-faq"
      date_last_fetched: "2026-09-08"
      label: "Precio US verificado $199 AI Testing (varía por Member Board)"
weeks:
  - week: 1
    title: "Introducción a la IA"
    sections:
      - domain: "Introducción a la IA"
        weight: "12%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir el estado actual de la IA incl. IA generativa."
          - "Distinguir tipos de sistemas basados en IA."
          - "Identificar el comportamiento probabilístico y no determinista."
          - "Relacionar la dependencia de los datos con el testing."
  - week: 2
    title: "Calidad y aceptación en sistemas IA"
    sections:
      - domain: "Características de calidad para sistemas IA"
        weight: "14%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Explicar las características de calidad específicas de IA (ISO/IEC 25059)."
          - "Definir criterios de aceptación para sistemas IA."
          - "Distinguir calidad funcional clásica frente a calidad ML."
          - "Ejemplificar riesgos de calidad propios de la IA."
  - week: 3
    title: "Fundamentos de machine learning"
    sections:
      - domain: "Machine learning: introducción y datos"
        weight: "14%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Resumir cómo se entrenan y evalúan modelos ML."
          - "Clasificar tipos de datos para ML y su preparación."
          - "Explicar el funcionamiento básico de redes neuronales simples."
          - "Implementar y probar un modelo ML sencillo de ejemplo."
  - week: 4
    title: "Métricas de rendimiento ML"
    sections:
      - domain: "Métricas funcionales para clasificación"
        weight: "14%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Calcular precisión, recall, F1 y exactitud en clasificación."
          - "Interpretar matrices de confusión en casos dados."
          - "Seleccionar la métrica adecuada según el contexto de negocio."
          - "Explicar overfitting/underfitting y su detección con métricas."
  - week: 5
    title: "Testing de sistemas IA y GenAI"
    sections:
      - domain: "Testing de sistemas IA incl. GenAI/LLM"
        weight: "14%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Resumir retos de probar sistemas probabilísticos."
          - "Describir enfoques de prueba para LLMs e IA generativa."
          - "Reconocer los dos niveles de prueba específicos de ML."
          - "Distinguir CT-AI de CT-GenAI (usar GenAI para probar)."
  - week: 6
    title: "Testing de datos de entrada"
    sections:
      - domain: "Testing de datos de entrada para ML"
        weight: "12%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Diseñar pruebas de calidad, sesgo y representatividad de datos."
          - "Detectar data leakage y problemas de etiquetado."
          - "Verificar pipelines de preprocesamiento de datos."
          - "Ejecutar casos de prueba sobre conjuntos de datos dados."
  - week: 7
    title: "Testing de modelos y desarrollo ML"
    sections:
      - domain: "Testing de modelos y desarrollo ML"
        weight: "12%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Diseñar y ejecutar casos de prueba para modelos ML."
          - "Probar robustez, metamórficas y pruebas adversariales básicas."
          - "Contribuir a una estrategia de pruebas para un sistema ML."
          - "Probar el proceso de desarrollo/entrenamiento del modelo."
  - week: 8
    title: "Estrategia y simulacro final"
    sections:
      - domain: "Repaso integral"
        weight: "8%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Resolver el sample exam oficial bajo tiempo real."
          - "Repasar cálculo e interpretación de métricas ML."
          - "Consolidar estrategia de pruebas para sistemas ML."
          - "Cerrar gaps en calidad IA y testing de datos/modelos."
`,
  "anthropic-ccar": `
id: anthropic-ccar
provider: "Anthropic"
provider_color: "#D97757"
title: "Claude Certified Architect – Foundations"
code: "CCAR-F"
cost: "$125 USD"
default_priority: 4
popularity: 4
summary: "Certificación de arquitectura de agentes con Claude: Agent SDK, MCP, Claude Code y salida estructurada."
meta:
  exam_version: "v1.0 effective July 2026"
  guide_date: "2026-07-01"
  guide_source: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification"
  format: "60 preguntas de opción múltiple y respuesta múltiple basadas en escenarios; 4 escenarios aleatorios de un banco de 6; 120 minutos; proctored online o en centro Pearson VUE"
  passing_score: "720 sobre 1000"
  domains:
    - "Agentic Architecture & Orchestration: 27%"
    - "Tool Design & MCP Integration: 18%"
    - "Claude Code Configuration & Workflows: 20%"
    - "Prompt Engineering & Structured Output: 20%"
    - "Context Management & Reliability: 15%"
  validity_years: 1
  recert_window: "Renovación a tiempo con assessment gratuito; tras caducar, retake completo"
  recert_options:
    - "Evaluación gratuita de renovación sin supervisión en Anthropic Partner Academy (credencial vigente)"
    - "Repetir el examen completo a tarifa completa (si la credencial caducó)"
    - "Repetir el examen completo si Anthropic lo exige por cambios significativos de contenido"
  recert_discount: "Renovación a tiempo gratuita; retake tras caducidad a tarifa completa"
  level: "200 · Associate"
  career_paths:
    - "AI Architect"
    - "AI Engineer"
  versions: []
  verified_sources:
    - url: "https://www.pearsonvue.com/us/en/anthropic.html"
      date_last_fetched: "2026-09-08"
      label: "Claude Certification Program by Anthropic — Pearson VUE (lista oficial de 4 certificaciones y política de retakes)"
    - url: "https://claude.com/blog/four-role-based-claude-certifications"
      date_last_fetched: "2026-09-08"
      label: "Four role-based certifications for the people who put Claude to work (Claude Blog 2026-07-23)"
    - url: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification"
      date_last_fetched: "2026-09-08"
      label: "Claude Certified Architect – Foundations — Partner Academy (precio $125 verificado)"
  badge_image: "https://images.credly.com/images/f2040db3-3904-4240-8966-e87b1510bea0/blob"
weeks:
  - week: 1
    title: "Agentic loops y Claude Agent SDK"
    sections:
      - domain: "Agentic Architecture & Orchestration"
        weight: "27%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Implementar el bucle agéntico con stop_reason: continuar con tool_use y terminar con end_turn."
          - "Añadir tool results al historial para razonar la siguiente acción."
          - "Evitar antipatrones: parsear texto libre, topes arbitrarios o contenido como señal de fin."
          - "Practicar hooks PostToolUse para normalizar datos heterogéneos antes del razonamiento."
  - week: 2
    title: "Orquestación multi-agente: coordinator y subagents"
    sections:
      - domain: "Agentic Architecture & Orchestration"
        weight: "27%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Diseñar hub-and-spoke: el coordinator rutea, agrega y gestiona errores."
          - "Pasar contexto explícito en el prompt: los subagents no heredan historial."
          - "Invocar subagents vía Task tool con allowedTools y llamadas paralelas en una respuesta."
          - "Implementar enforcement programático (hooks, gates) frente a guía solo por prompt."
  - week: 3
    title: "Tool design y MCP integration"
    sections:
      - domain: "Tool Design & MCP Integration"
        weight: "18%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Escribir tool descriptions con formatos, ejemplos, edge cases y límites entre tools similares."
          - "Devolver errores MCP estructurados con isError, errorCategory e isRetryable."
          - "Distinguir errores transient, validation, business y permission para decidir retry."
          - "Limitar el toolset por agente y usar tool_choice auto, any o forzado según el caso."
  - week: 4
    title: "Built-in tools, MCP servers y resources"
    sections:
      - domain: "Tool Design & MCP Integration"
        weight: "18%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Elegir Grep para contenido, Glob para rutas, Read/Write/Edit para archivos."
          - "Configurar MCP servers en .mcp.json con variables sin commitear secretos."
          - "Separar scope proyecto (.mcp.json) de personal (~/.claude.json)."
          - "Exponer catálogos como MCP resources para evitar exploración costosa."
  - week: 5
    title: "Claude Code: CLAUDE.md, commands y skills"
    sections:
      - domain: "Claude Code Configuration & Workflows"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Aplicar jerarquía CLAUDE.md: usuario, proyecto y directorio con @import modular."
          - "Crear slash commands en .claude/commands/ versionados para el equipo."
          - "Configurar skills con context: fork, allowed-tools y argument-hint."
          - "Usar rules con paths y glob para convenciones por tipo de archivo."
  - week: 6
    title: "Claude Code: plan mode, refinamiento y CI/CD"
    sections:
      - domain: "Claude Code Configuration & Workflows"
        weight: "20%"
        bloom: 5
        kirkpatrick: "L3"
        points:
          - "Elegir plan mode para cambios multi-archivo y ejecución directa para fixes acotados."
          - "Iterar con ejemplos input/output, tests primero e interview pattern."
          - "Ejecutar en CI con flag -p y salida JSON con output-format y json-schema."
          - "Aislar sesiones de review del código generado por la misma sesión."
  - week: 7
    title: "Prompt engineering y structured output"
    sections:
      - domain: "Prompt Engineering & Structured Output"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Definir criterios explícitos con ejemplos para reducir falsos positivos."
          - "Usar few-shot con 2-4 ejemplos de casos ambiguos y formato deseado."
          - "Forzar esquemas con tool_use y tool_choice any o herramienta específica."
          - "Implementar validation-retry con errores concretos y Batch API solo si tolera latencia."
  - week: 8
    title: "Context management, reliability y simulacros finales"
    sections:
      - domain: "Context Management & Reliability"
        weight: "15%"
        bloom: 5
        kirkpatrick: "L3"
        points:
          - "Persistir case facts fuera del resumen y recortar tool outputs verbosos."
          - "Escalar con criterios explícitos y honrar peticiones directas de humano."
          - "Propagar errores estructurados con contexto y preservar claim-source mapping."
          - "Completar simulacros de 60 preguntas en 120 minutos y repasar dominios débiles."
`,
  "anthropic-ccdv": `
id: anthropic-ccdv
provider: "Anthropic"
provider_color: "#D97757"
title: "Claude Certified Developer - Foundations"
code: "CCDV-F"
cost: "$125 USD"
default_priority: 3
popularity: 3
summary: "Credencial para developers que construyen apps y agentes en producción con Claude: API, tools y MCP."
meta:
  exam_version: "Guía vigente (Foundations)"
  guide_date: "2026-09-08"
  guide_source: "https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification"
  format: "Examen proctored de opción múltiple (detalles de duración en Partner Academy)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Prompt Engineering"
    - "Claude API integration"
    - "MCP Server Development"
    - "Agent development"
    - "Context engineering"
    - "Eval & debugging"
    - "Application Security"
    - "Model Optimization"
  validity_years: 1
  recert_window: "Política del programa: verificar en Partner Academy"
  recert_options:
    - "Repetir el examen"
  recert_discount: "No publicado"
  level: "200 · Associate"
  career_paths:
    - "AI Engineer"
    - "Cloud Developer"
  versions: []
  verified_sources:
    - url: "https://www.credly.com/org/anthropic/badge/claude-certified-developer-foundations"
      date_last_fetched: "2026-09-08"
      label: "Claude Certified Developer - Foundations — Credly (skills oficiales y criterio)"
    - url: "https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification"
      date_last_fetched: "2026-09-08"
      label: "Claude Certified Developer – Foundations — Partner Academy (precio $125 verificado)"
    - url: "https://claude.com/blog/four-role-based-claude-certifications"
      date_last_fetched: "2026-09-08"
      label: "Four role-based certifications — Claude Blog 2026-07-23"
  badge_image: "https://images.credly.com/size/340x340/images/f101c6ac-8a2d-4220-b381-70e3e6c364e3/blob"
weeks:
  - week: 1
    title: "Prompt Engineering con Claude"
    sections:
      - domain: "Prompt Engineering"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Escribir prompts claros con contexto, ejemplos e instrucciones."
          - "Usar system prompts y prefilling para controlar formato."
          - "Aplicar chain-of-thought y few-shot en casos de uso reales."
          - "Iterar prompts midiendo calidad de salida."
  - week: 2
    title: "Claude API integration"
    sections:
      - domain: "Claude API integration"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Llamar a la API de mensajes con SDK y streaming."
          - "Gestionar API keys, límites y reintentos."
          - "Pasar imágenes y documentos como bloques de contenido."
          - "Construir un cliente mínimo con manejo de errores."
  - week: 3
    title: "MCP Server Development"
    sections:
      - domain: "MCP Server Development"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Exponer tools, resources y prompts vía un MCP server."
          - "Configurar clientes MCP y depurar handshakes."
          - "Diseñar esquemas de input con validación."
          - "Probar el server con Inspector antes de integrar."
  - week: 4
    title: "Agent development"
    sections:
      - domain: "Agent development"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar el loop agéntico: razonar, actuar, observar."
          - "Orquestar subagents con contexto explícito."
          - "Añadir guardarraíles y aprobación humana en acciones sensibles."
          - "Construir un agente de soporte de principio a fin."
  - week: 5
    title: "Context engineering"
    sections:
      - domain: "Context engineering"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Gestionar ventanas de contexto y presupuestos de tokens."
          - "Compactar historiales sin perder hechos del caso."
          - "Usar caché de prompts para latencia y costo."
          - "Recuperar contexto con RAG sobre datos propios."
  - week: 6
    title: "Eval & debugging"
    sections:
      - domain: "Eval & debugging"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Definir evals con criterios y datasets dorados."
          - "Trazar tool calls y latencias para diagnosticar fallos."
          - "Comparar modelos y parámetros con tests A/B."
          - "Automatizar regresión de prompts en CI."
  - week: 7
    title: "Application Security y Model Optimization"
    sections:
      - domain: "Application Security"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Sanitizar inputs y salidas contra prompt injection."
          - "Aislar secretos y scopes mínimos en tools."
          - "Auditar logs de uso para detectar abuso."
          - "Aplicar revisiones de seguridad antes de shippear."
      - domain: "Model Optimization"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Elegir modelo por costo/latencia/calidad (Haiku/Sonnet/Opus)."
          - "Reducir tokens con batching y respuestas acotadas."
          - "Medir costo por tarea y fijar presupuestos."
          - "Perfilar cuellos de botella en un pipeline servido."
  - week: 8
    title: "Simulacro final CCDV-F"
    sections:
      - domain: "Agent development"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 60 preguntas."
          - "Repasar API, MCP y agentes con sample questions."
          - "Cerrar gaps en eval, seguridad y contexto."
          - "Checklist logístico del examen proctored."
`,
  "nv-pgenl": `
id: "nv-pgenl"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: Generative AI LLMs"
code: "NCP-GENL"
cost: "$200 USD"
default_priority: 3
popularity: 5
summary: "Credencial Professional que valida diseñar, entrenar y optimizar LLMs con entrenamiento distribuido y fine-tuning sobre plataforma NVIDIA."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "LLM Architecture and Training: 25%"
    - "Distributed Training: 20%"
    - "Fine-tuning and Customization: 20%"
    - "RAG and Inference Optimization: 20%"
    - "Evaluation and Trustworthy AI: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "LLM Engineer"
    - "AI Solutions Architect"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/"
      date_last_fetched: "2026-09-09"
      label: "Generative AI LLMs (NCP-GENL) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Arquitecturas LLM y ciclo de entrenamiento"
    sections:
      - domain: "LLM Architecture and Training"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Repasar transformers, tokenización y objetivos de preentrenamiento."
          - "Comparar arquitecturas densas y mixture-of-experts para casos de uso."
          - "Estudiar curvas de loss, overfitting y criterios de parada."
          - "Montar un entrenamiento pequeño con NeMo Framework y registrar métricas."
  - week: 2
    title: "Entrenamiento distribuido a escala"
    sections:
      - domain: "Distributed Training"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Distinguir data, tensor y pipeline parallelism y cuándo combinarlos."
          - "Configurar multi-GPU y multi-nodo con NCCL y chequeo de ancho de banda."
          - "Aplicar mixed precision y gradient accumulation sin perder convergencia."
          - "Diagnosticar cuellos de botella con Nsight Systems en un job distribuido."
  - week: 3
    title: "Fine-tuning y personalización de modelos"
    sections:
      - domain: "Fine-tuning and Customization"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Comparar full fine-tuning, LoRA/QLoRA y prompt tuning por costo y calidad."
          - "Curar datasets de instrucción y alinear formato con la tarea objetivo."
          - "Aplicar domain-adaptive pretraining para un dominio especializado."
          - "Evaluar regresiones contra el modelo base antes de promover cambios."
  - week: 4
    title: "RAG y arquitecturas de recuperación"
    sections:
      - domain: "RAG and Inference Optimization"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar pipelines RAG: chunking, embeddings y vector stores en GPU."
          - "Medir recall y faithfulness con evals de recuperación y generación."
          - "Implementar reranking y filtros para reducir alucinaciones."
          - "Prototipar un asistente RAG con NIM y documentar decisiones."
  - week: 5
    title: "Optimización de inferencia para producción"
    sections:
      - domain: "RAG and Inference Optimization"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Acelerar inferencia con TensorRT-LLM: cuantización y batching."
          - "Dimensionar throughput y latencia p50/p99 para un SLO dado."
          - "Servir modelos con Triton Inference Server y versionado."
          - "Perfilar memoria KV-cache y fijar límites por réplica."
  - week: 6
    title: "Evaluación sistemática de LLMs"
    sections:
      - domain: "Evaluation and Trustworthy AI"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Diseñar evals con golden sets, jueces LLM y revisión humana."
          - "Medir toxicidad, sesgo y fugas de datos en salidas del modelo."
          - "Comparar checkpoints con tests de regresión antes del release."
          - "Documentar limitaciones conocidas del modelo evaluado."
  - week: 7
    title: "IA confiable y gobierno de modelos"
    sections:
      - domain: "Evaluation and Trustworthy AI"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Aplicar principios de transparencia y consentimiento en datos."
          - "Implementar guardrails de contenido y moderación en producción."
          - "Trazar linaje de datos y versiones para auditoría."
          - "Redactar model card con riesgos y usos previstos."
  - week: 8
    title: "Simulacro final NCP-GENL"
    sections:
      - domain: "LLM Architecture and Training"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en entrenamiento distribuido y fine-tuning."
          - "Repasar comandos y flujos NIM, NeMo y Triton."
          - "Checklist logístico del examen proctored."
`,
  "nv-pagentic": `
id: "nv-pagentic"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: Agentic AI"
code: "NCP-AAI"
cost: "$200 USD"
default_priority: 3
popularity: 5
summary: "Credencial Professional que valida construir agentes RAG y aplicaciones agénticas con LLMs, evaluación y despliegue a escala."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Agent Design and Tool Use: 25%"
    - "RAG Pipelines for Agents: 25%"
    - "Evaluation and Observability: 20%"
    - "Multi-agent Orchestration: 15%"
    - "Production Deployment: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "AI Agent Developer"
    - "Applied AI Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/"
      date_last_fetched: "2026-09-09"
      label: "Agentic AI (NCP-AAI) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Fundamentos de agentes y uso de herramientas"
    sections:
      - domain: "Agent Design and Tool Use"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Distinguir agentes reactivos, planificadores y loops ReAct."
          - "Definir herramientas con esquemas y validación de argumentos."
          - "Implementar un agente que consulte APIs y maneje errores."
          - "Limitar iteraciones y costo por tarea con presupuestos."
  - week: 2
    title: "RAG como memoria del agente"
    sections:
      - domain: "RAG Pipelines for Agents"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Conectar recuperación a decisiones del agente en cada paso."
          - "Sincronizar índices con fuentes cambiantes y versionar snapshots."
          - "Dar al agente búsqueda semántica y SQL según el caso."
          - "Medir grounding de respuestas con evals dedicados."
  - week: 3
    title: "Evaluación de RAG y búsqueda semántica"
    sections:
      - domain: "Evaluation and Observability"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Evaluar retrievers con recall@k y nDCG sobre queries etiquetadas."
          - "Detectar deriva de calidad entre reindexados."
          - "Trazar cada llamada a herramienta con inputs y latencias."
          - "Crear dashboards de éxito de tarea y costo por ejecución."
  - week: 4
    title: "Orquestación multi-agente observable"
    sections:
      - domain: "Multi-agent Orchestration"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Dividir tareas entre planificador, ejecutor y verificador."
          - "Pasar contexto entre agentes sin perder estado."
          - "Resolver conflictos y deadlocks en flujos colaborativos."
          - "Registrar trazas extremo a extremo para debugging."
  - week: 5
    title: "Nuevo conocimiento y adaptación continua"
    sections:
      - domain: "RAG Pipelines for Agents"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Incorporar documentos nuevos sin reentrenar el modelo base."
          - "Combinar fine-tuning ligero con recuperación para jerga de dominio."
          - "Evaluar olvido catastrófico tras cada actualización."
          - "Automatizar reindexado con tests de humo."
  - week: 6
    title: "Despliegue de agentes en producción"
    sections:
      - domain: "Production Deployment"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Empaquetar agentes con NIM y exponer endpoints estables."
          - "Escalar workers por cola de tareas con límites de concurrencia."
          - "Aislar secretos y permisos por herramienta del agente."
          - "Definir rollbacks cuando cae la tasa de éxito."
  - week: 7
    title: "Seguridad y casos borde de agentes"
    sections:
      - domain: "Production Deployment"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Prevenir prompt injection en entradas y documentos recuperados."
          - "Poner aprobación humana en acciones irreversibles."
          - "Auditar llamadas externas del agente para compliance."
          - "Probar jailbreaks comunes y documentar mitigaciones."
  - week: 8
    title: "Simulacro final NCP-AAI"
    sections:
      - domain: "Agent Design and Tool Use"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en evaluación y orquestación multi-agente."
          - "Repasar flujos RAG, NIM y observabilidad."
          - "Checklist logístico del examen proctored."
`,
  "nv-pds": `
id: "nv-pds"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: Accelerated Data Science"
code: "NCP-ADS"
cost: "$200 USD"
default_priority: 3
popularity: 4
summary: "Credencial Professional que valida flujos de data science acelerados por GPU: RAPIDS, feature engineering y despliegue de modelos."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/accelerated-data-science-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "GPU Data Processing: 25%"
    - "Feature Engineering: 20%"
    - "Model Training at Scale: 25%"
    - "Deployment and MLOps: 15%"
    - "Visualization and Communication: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "Data Scientist"
    - "ML Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/accelerated-data-science-professional/"
      date_last_fetched: "2026-09-09"
      label: "Accelerated Data Science (NCP-ADS) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Procesamiento GPU con RAPIDS y cuDF"
    sections:
      - domain: "GPU Data Processing"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Migrar pipelines pandas a cuDF midiendo speedup y memoria."
          - "Unir y agregar datasets grandes sin salir de la GPU."
          - "Acelerar ETL con cuIO y particionado eficiente."
          - "Perfilar transferencias host-device y eliminar copias."
  - week: 2
    title: "Feature engineering acelerado"
    sections:
      - domain: "Feature Engineering"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Crear features tabulares con NVTabular en pipelines reproducibles."
          - "Codificar categóricas y temporales para modelos GPU."
          - "Seleccionar features por importancia y estabilidad."
          - "Versionar datasets y features para experimentos comparables."
  - week: 3
    title: "Entrenamiento distribuido de modelos"
    sections:
      - domain: "Model Training at Scale"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Entrenar XGBoost y LightGBM en GPU con validación cruzada."
          - "Escalar a multi-GPU con Dask-cuDF y Dask-ML."
          - "Ajustar hiperparámetros con búsqueda distribuida."
          - "Comparar precisión vs. tiempo para elegir el modelo final."
  - week: 4
    title: "Series temporales y grafos en GPU"
    sections:
      - domain: "Model Training at Scale"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Pronosticar series temporales con modelos acelerados."
          - "Acelerar clustering y grafos con cuML y cuGraph."
          - "Validar con splits temporales sin fuga de información."
          - "Documentar supuestos del modelo para el negocio."
  - week: 5
    title: "Despliegue y MLOps de modelos"
    sections:
      - domain: "Deployment and MLOps"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Servir modelos con Triton y monitorear latencia."
          - "Detectar deriva de datos y programar reentrenos."
          - "Empaquetar entornos reproducibles con contenedores."
          - "Definir rollback ante caída de métricas en producción."
  - week: 6
    title: "Workflows de punta a punta"
    sections:
      - domain: "Deployment and MLOps"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Orquestar ingesta, entrenamiento y despliegue en un pipeline."
          - "Acelerar Spark con RAPIDS Accelerator sin reescribir jobs."
          - "Optimizar portafolios y casos financieros como ejercicio aplicado."
          - "Medir costo por experimento y priorizar backlog."
  - week: 7
    title: "Visualización y comunicación de resultados"
    sections:
      - domain: "Visualization and Communication"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Explorar datos masivos con visualización interactiva acelerada."
          - "Contar la historia del modelo para audiencia no técnica."
          - "Elegir gráficos que no distorsionen las conclusiones."
          - "Armar un reporte reproducible del caso de estudio."
  - week: 8
    title: "Simulacro final NCP-ADS"
    sections:
      - domain: "GPU Data Processing"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en RAPIDS y entrenamiento distribuido."
          - "Repasar cuDF, cuML y Triton a nivel conceptual."
          - "Checklist logístico del examen proctored."
`,
  "nv-popenusd": `
id: "nv-popenusd"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: OpenUSD Development"
code: "NCP-OUSD"
cost: "$200 USD"
default_priority: 2
popularity: 3
summary: "Credencial Professional que valida construir y optimizar pipelines de contenido 3D con OpenUSD para gemelos digitales y simulación."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/openusd-development-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "USD Composition and Layers: 25%"
    - "Assets and Materials: 20%"
    - "Data Exchange Pipelines: 20%"
    - "Omniverse Kit Development: 20%"
    - "Simulation and Digital Twins: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "OpenUSD Developer"
    - "Digital Twin Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/openusd-development-professional/"
      date_last_fetched: "2026-09-09"
      label: "OpenUSD Development (NCP-OUSD) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Fundamentos USD y composición"
    sections:
      - domain: "USD Composition and Layers"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Explicar prims, propiedades y el modelo de composición por capas."
          - "Crear arcos de composición básicos con usdview para verificar."
          - "Ordenar opiniones con layer stacking y sublayers."
          - "Resolver referencias y payloads en escenas de ejemplo."
  - week: 2
    title: "Estructura de assets y agregación"
    sections:
      - domain: "Assets and Materials"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Organizar assets con principios de modularidad e instanciado."
          - "Agregar contenido de múltiples fuentes en un asset coherente."
          - "Preparar assets 3D para simulación y physical AI."
          - "Documentar convenciones de nombres y versiones de assets."
  - week: 3
    title: "Materiales, luces y escenarios"
    sections:
      - domain: "Assets and Materials"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Asignar materiales y variantes a prims con MaterialX."
          - "Montar un stage con blueprints de descripción de escena."
          - "Ajustar iluminación para previsualización consistente."
          - "Validar escenas contra checklists de calidad de assets."
  - week: 4
    title: "Pipelines de intercambio de datos"
    sections:
      - domain: "Data Exchange Pipelines"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar pipelines USD entre DCCs con conversores."
          - "Automatizar validación y reparación de stages."
          - "Sincronizar cambios con control de versiones."
          - "Medir tiempos de carga y optimizar payloads."
  - week: 5
    title: "Extensiones Omniverse con Python"
    sections:
      - domain: "Omniverse Kit Development"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Crear una extensión Omniverse básica en Python."
          - "Extender apps Kit para dashboards de gemelos digitales."
          - "Personalizar UI y paneles front-end de la extensión."
          - "Empaquetar y distribuir la extensión al equipo."
  - week: 6
    title: "Streaming y despliegue de apps Kit"
    sections:
      - domain: "Omniverse Kit Development"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Desplegar apps de gemelos digitales con Kit App Streaming."
          - "Configurar autenticación y sesiones concurrentes."
          - "Optimizar escenas pesadas para streaming fluido."
          - "Monitorear uso y errores de la app desplegada."
  - week: 7
    title: "Simulación y gemelos digitales"
    sections:
      - domain: "Simulation and Digital Twins"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Ensamblar un gemelo digital mínimo con Omniverse y USD."
          - "Conectar datos sintéticos y sensores simulados."
          - "Validar física básica con Isaac Sim a nivel conceptual."
          - "Presentar el gemelo con métricas de negocio."
  - week: 8
    title: "Simulacro final NCP-OUSD"
    sections:
      - domain: "USD Composition and Layers"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en composición y pipelines de datos."
          - "Repasar Kit, layers y agregación de assets."
          - "Checklist logístico del examen proctored."
`,
  "nv-pinfra": `
id: "nv-pinfra"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: AI Infrastructure"
code: "NCP-AII"
cost: "$400 USD"
default_priority: 3
popularity: 4
summary: "Credencial Professional que valida desplegar, configurar y validar infraestructura NVIDIA avanzada: DGX, Kubernetes y fabric."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "GPU Systems and DGX: 25%"
    - "Kubernetes and Scheduling: 25%"
    - "Storage and Networking Fabric: 20%"
    - "Deployment Validation: 15%"
    - "NVIDIA AI Enterprise: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "AI Infrastructure Engineer"
    - "MLOps Platform Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-professional/"
      date_last_fetched: "2026-09-09"
      label: "AI Infrastructure (NCP-AII) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Sistemas DGX y arquitectura GPU"
    sections:
      - domain: "GPU Systems and DGX"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Describir DGX, HGX y NVLink/NVSwitch a nivel de despliegue."
          - "Verificar GPUs con nvidia-smi y compatibilidad driver/CUDA."
          - "Planear capacidad por workload de entrenamiento e inferencia."
          - "Documentar inventario y topología del clúster."
  - week: 2
    title: "Kubernetes para cargas IA"
    sections:
      - domain: "Kubernetes and Scheduling"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Desplegar NVIDIA AI Enterprise sobre Kubernetes bare-metal."
          - "Configurar GPU Operator y device plugins."
          - "Planificar colas y prioridades con Run:ai o Kueue."
          - "Aislar tenants con cuotas y políticas de red."
  - week: 3
    title: "Almacenamiento y fabric de red"
    sections:
      - domain: "Storage and Networking Fabric"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Dimensionar almacenamiento para checkpoints y datasets."
          - "Validar InfiniBand y Ethernet con herramientas de cableado."
          - "Configurar UFM para gestión del fabric."
          - "Medir ancho de banda efectivo con NCCL tests."
  - week: 4
    title: "Aprovisionamiento con BCM y Mission Control"
    sections:
      - domain: "Deployment Validation"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Aprovisionar nodos con Base Command Manager."
          - "Registrar clústeres en Mission Control y asignar políticas."
          - "Automatizar golden images y configuración inicial."
          - "Probar recuperación ante fallo de nodo."
  - week: 5
    title: "Validación de despliegues end-to-end"
    sections:
      - domain: "Deployment Validation"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Correr jobs de validación sintéticos post-instalación."
          - "Verificar NCCL, almacenamiento y scheduling juntos."
          - "Firmar checklist de aceptación del clúster."
          - "Documentar desvíos y remediaciones aplicadas."
  - week: 6
    title: "NVIDIA AI Enterprise en producción"
    sections:
      - domain: "NVIDIA AI Enterprise"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Licenciar y actualizar la suite AI Enterprise."
          - "Exponer NIM y modelos como servicios internos."
          - "Integrar observabilidad base del stack."
          - "Planear ventanas de mantenimiento sin downtime."
  - week: 7
    title: "Seguridad y casos borde de plataforma"
    sections:
      - domain: "NVIDIA AI Enterprise"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Endurecer accesos SSH y API del plano de control."
          - "Rotar credenciales y certificados del clúster."
          - "Auditar imágenes y SBOM de workloads."
          - "Probar restore de backups de configuración."
  - week: 8
    title: "Simulacro final NCP-AII"
    sections:
      - domain: "GPU Systems and DGX"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en fabric y validación de despliegues."
          - "Repasar DGX, Kubernetes y AI Enterprise."
          - "Checklist logístico del examen proctored."
`,
  "nv-pops": `
id: "nv-pops"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: AI Operations"
code: "NCP-AIO"
cost: "$500 USD"
default_priority: 3
popularity: 3
summary: "Credencial Professional que valida monitorear, diagnosticar y optimizar infraestructura IA NVIDIA en operación continua."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/ai-operations-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Monitoring and Telemetry: 25%"
    - "Troubleshooting: 25%"
    - "Performance Optimization: 20%"
    - "Lifecycle and Upgrades: 15%"
    - "Capacity and Cost Management: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "AI Operations Engineer"
    - "SRE GPU Platforms"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/ai-operations-professional/"
      date_last_fetched: "2026-09-09"
      label: "AI Operations (NCP-AIO) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Telemetría GPU con DCGM"
    sections:
      - domain: "Monitoring and Telemetry"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Exponer métricas GPU con DCGM Exporter hacia Prometheus."
          - "Alertar sobre temperatura, throttling y errores Xid."
          - "Crear dashboards de utilización por job y tenant."
          - "Retener series para análisis post-incidente."
  - week: 2
    title: "Observabilidad del fabric y red"
    sections:
      - domain: "Monitoring and Telemetry"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Monitorear InfiniBand con UFM Telemetry."
          - "Detectar congestión y errores de enlace a tiempo."
          - "Correlacionar red lenta con jobs afectados."
          - "Definir SLIs de fabric para el equipo de plataforma."
  - week: 3
    title: "Diagnóstico de fallos GPU y jobs"
    sections:
      - domain: "Troubleshooting"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Clasificar fallos: hardware, driver, red o aplicación."
          - "Aislar nodos malos con health checks automatizados."
          - "Reproducir NCCL timeouts en entorno controlado."
          - "Escribir postmortems con acciones concretas."
  - week: 4
    title: "Incidentes de scheduling y colas"
    sections:
      - domain: "Troubleshooting"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diagnosticar starvation y preemption en colas."
          - "Rastrear por qué un job no obtiene GPUs."
          - "Ajustar prioridades sin romper fairness."
          - "Simular un game-day de caída de scheduler."
  - week: 5
    title: "Optimización de rendimiento sostenido"
    sections:
      - domain: "Performance Optimization"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Subir utilización sostenida sin afectar latencias."
          - "Afinar afinidad NUMA y locality de datos."
          - "Reducir fragmentación de reservas GPU."
          - "Comparar antes/después con benchmarks estándar."
  - week: 6
    title: "Ciclo de vida y upgrades sin downtime"
    sections:
      - domain: "Lifecycle and Upgrades"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Planear upgrades de driver/CUDA por oleadas con canary."
          - "Drenar nodos y reprogramar jobs automáticamente."
          - "Validar compatibilidad de versiones antes del rollout."
          - "Revertir una oleada fallida con runbooks."
  - week: 7
    title: "Capacidad y costos de la flota GPU"
    sections:
      - domain: "Capacity and Cost Management"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Pronosticar demanda por equipo y temporada."
          - "Medir costo por GPU-hora y por experimento."
          - "Apagar capacidad ociosa con políticas automáticas."
          - "Presentar el business case de expansión."
  - week: 8
    title: "Simulacro final NCP-AIO"
    sections:
      - domain: "Monitoring and Telemetry"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en troubleshooting y upgrades."
          - "Repasar DCGM, UFM y runbooks de incidentes."
          - "Checklist logístico del examen proctored."
`,
  "nv-pnet": `
id: "nv-pnet"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: AI Networking"
code: "NCP-AIN"
cost: "$400 USD"
default_priority: 3
popularity: 3
summary: "Credencial Professional que valida desplegar redes InfiniBand y Ethernet Spectrum-X para fábricas de IA."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/ai-networking-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "InfiniBand Fabric: 25%"
    - "Ethernet and Spectrum-X: 20%"
    - "RDMA and Transports: 20%"
    - "Monitoring with UFM: 20%"
    - "DPU and DOCA: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "AI Network Engineer"
    - "HPC Network Administrator"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/ai-networking-professional/"
      date_last_fetched: "2026-09-09"
      label: "AI Networking (NCP-AIN) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Fundamentos de redes para IA"
    sections:
      - domain: "InfiniBand Fabric"
        weight: "25%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Comparar InfiniBand y Ethernet para entrenamientos distribuidos."
          - "Describir topologías fat-tree y Dragonfly a alto nivel."
          - "Identificar componentes: HCAs, switches y cables."
          - "Leer un diagrama de fabric y detectar single points of failure."
  - week: 2
    title: "Administración InfiniBand"
    sections:
      - domain: "InfiniBand Fabric"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Levantar y verificar enlaces con ibstat e ibdiagnet."
          - "Configurar particiones y claves de red."
          - "Actualizar firmware de switches y adaptadores."
          - "Documentar el mapa físico-lógico del fabric."
  - week: 3
    title: "Ethernet Spectrum-X y Cumulus"
    sections:
      - domain: "Ethernet and Spectrum-X"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Desplegar Cumulus Linux en switches Spectrum."
          - "Configurar RoCE para tráfico RDMA sobre Ethernet."
          - "Ajustar buffers y control de congestión."
          - "Validar throughput con benchmarks de red."
  - week: 4
    title: "RDMA de punta a punta"
    sections:
      - domain: "RDMA and Transports"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Explicar queue pairs, memoria registrada y zero-copy."
          - "Programar RDMA básico y medir latencia."
          - "Depurar conexiones con herramientas MLXlink."
          - "Elegir transporte según workload y escala."
  - week: 5
    title: "Monitoreo con UFM y NetQ"
    sections:
      - domain: "Monitoring with UFM"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Desplegar UFM y descubrir la topología automáticamente."
          - "Alertar sobre errores de símbolo y caídas de enlace."
          - "Validar cables con la herramienta CVT."
          - "Generar reportes de salud para operaciones."
  - week: 6
    title: "DPU BlueField y DOCA"
    sections:
      - domain: "DPU and DOCA"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Describir offloads de red, seguridad y storage en DPU."
          - "Aprovisionar BlueField con DOCA a nivel conceptual."
          - "Aislar tráfico de control, datos y gestión."
          - "Evaluar cuándo justifica DPU frente a SmartNIC básica."
  - week: 7
    title: "Diseño de fabric para AI factory"
    sections:
      - domain: "Monitoring with UFM"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Dimensionar front-end y back-end networks por escala."
          - "Planear crecimiento por pods sin rediseñar el core."
          - "Estimar presupuesto de red por nodo GPU."
          - "Presentar el diseño con riesgos y mitigaciones."
  - week: 8
    title: "Simulacro final NCP-AIN"
    sections:
      - domain: "InfiniBand Fabric"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en Spectrum-X y monitoreo UFM."
          - "Repasar RDMA, DPU y topologías."
          - "Checklist logístico del examen proctored."
`,
  "nv-prack": `
id: "nv-prack"
provider: "NVIDIA"
provider_color: "#76B900"
title: "NVIDIA-Certified Professional: AI Rack and Interconnect"
code: "NCP-ARI"
cost: "$400 USD"
default_priority: 2
popularity: 3
summary: "Credencial Professional nueva que valida desplegar racks DGX/HGX: energía, refrigeración, cableado e interconexión."
meta:
  exam_version: "Guía vigente (Professional)"
  guide_date: "2026-09-09"
  guide_source: "https://www.nvidia.com/en-us/learn/certification/ai-rack-and-interconnect-professional/"
  format: "2 horas · multiple-choice · online con supervisión remota (Certiverse)"
  passing_score: "No publicado (Pass/Fail)"
  domains:
    - "Rack Architecture: 25%"
    - "Power and Cooling: 20%"
    - "Cabling and Validation: 25%"
    - "Interconnect Bring-up: 15%"
    - "Operations Handoff: 15%"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "Data Center Deployment Engineer"
    - "AI Infrastructure Engineer"
  versions: []
  verified_sources:
    - url: "https://www.nvidia.com/en-us/learn/certification/ai-rack-and-interconnect-professional/"
      date_last_fetched: "2026-09-09"
      label: "AI Rack and Interconnect (NCP-ARI) — About, Exam Details"
    - url: "https://www.nvidia.com/en-us/learn/certification/"
      date_last_fetched: "2026-09-09"
      label: "Get Certified by NVIDIA — catálogo, precios, FAQ y renovación"
weeks:
  - week: 1
    title: "Arquitecturas de rack HGX y DGX"
    sections:
      - domain: "Rack Architecture"
        weight: "25%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir racks HGX de 8 GPUs y su interconnect interno."
          - "Leer planos de rack: PDUs, switches y bandejas."
          - "Distinguir aire vs. líquido según densidad."
          - "Verificar lista de materiales contra el diseño."
  - week: 2
    title: "Energía y refrigeración"
    sections:
      - domain: "Power and Cooling"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Calcular carga eléctrica por rack y redundancia N+1."
          - "Planear circuitos y PDUs con margen de crecimiento."
          - "Coordinar refrigeración con el equipo de facilities."
          - "Medir PUE antes y después del despliegue."
  - week: 3
    title: "Cableado estructurado y CVT"
    sections:
      - domain: "Cabling and Validation"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Tender fibra y cobre con radios de curvatura correctos."
          - "Etiquetar cada enlace según el plano aprobado."
          - "Validar cables con la herramienta CVT."
          - "Reemplazar enlaces marginales antes del bring-up."
  - week: 4
    title: "Bring-up de interconexión"
    sections:
      - domain: "Interconnect Bring-up"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Levantar enlaces NVLink y red en secuencia definida."
          - "Verificar todos los enlaces con diagnósticos del vendor."
          - "Resolver enlaces caídos con metodología de descarte."
          - "Firmar la matriz de conectividad del rack."
  - week: 5
    title: "Integración con el fabric del site"
    sections:
      - domain: "Interconnect Bring-up"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Conectar uplinks del rack al core del data center."
          - "Configurar VLANs y direccionamiento acordados."
          - "Probar redundancia cortando un uplink."
          - "Documentar la integración para operaciones."
  - week: 6
    title: "Pruebas de aceptación del rack"
    sections:
      - domain: "Cabling and Validation"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Correr burn-in de GPUs y detectar outliers."
          - "Validar NCCL a través del rack completo."
          - "Medir ruido térmico bajo carga sostenida."
          - "Firmar criterios de aceptación con el cliente."
  - week: 7
    title: "Handoff a operaciones"
    sections:
      - domain: "Operations Handoff"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Entregar as-builts, credenciales y runbooks."
          - "Capacitar al turno en procedimientos del rack."
          - "Definir SLAs y rutas de escalamiento."
          - "Agendar primera revisión post-despliegue."
  - week: 8
    title: "Simulacro final NCP-ARI"
    sections:
      - domain: "Rack Architecture"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 65 preguntas y repaso de fallos."
          - "Cerrar gaps en energía y validación de cableado."
          - "Repasar bring-up y handoff operativo."
          - "Checklist logístico del examen proctored."
`,
  "ali-aca-ce": `
id: "ali-aca-ce"
provider: "Alibaba Cloud"
provider_color: "#FF6A00"
title: "Alibaba Cloud Certified Associate: Cloud Engineer"
code: "CEA-C01"
cost: "$200 USD"
default_priority: 2
popularity: 3
summary: "Credencial Associate que valida crear, configurar y gestionar recursos cloud: cómputo, red, almacenamiento y seguridad."
meta:
  exam_version: "Guía vigente (Associate, reemplaza a ACA Cloud Computing)"
  guide_date: "2026-09-09"
  guide_source: "https://edu.alibabacloud.com/certification/cloud_engineer_associate"
  format: "50 preguntas · 90 minutos · 70/100 para aprobar · online o presencial"
  passing_score: "70/100"
  domains:
    - "Compute"
    - "Networking"
    - "Storage"
    - "Security and IAM"
    - "Monitoring and Billing"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "200 · Associate"
  career_paths:
    - "Cloud Engineer"
    - "Junior Solution Architect"
  versions: []
  verified_sources:
    - url: "https://edu.alibabacloud.com/certification/cloud_engineer_associate"
      date_last_fetched: "2026-09-09"
      label: "ACA Cloud Engineer (CEA-C01) — Exam Overview"
    - url: "https://edu.alibabacloud.com/certification/"
      date_last_fetched: "2026-09-09"
      label: "Alibaba Cloud Certification — catálogo y precios"
weeks:
  - week: 1
    title: "Fundamentos cloud y consola Alibaba"
    sections:
      - domain: "Compute"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir regiones, zonas y modelos de pago de Alibaba Cloud."
          - "Navegar la consola, CLI y gestionar cuotas y límites."
          - "Crear una instancia ECS y conectarse por SSH."
          - "Estimar costos básicos con la calculadora de precios."
  - week: 2
    title: "ECS y cómputo elástico"
    sections:
      - domain: "Compute"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Elegir familias de instancias según workload."
          - "Configurar discos, snapshots e imágenes personalizadas."
          - "Montar auto scaling con reglas simples."
          - "Practicar stop/start y cambio de tipo de instancia."
  - week: 3
    title: "VPC y redes"
    sections:
      - domain: "Networking"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Diseñar VPC con vSwitches públicos y privados."
          - "Configurar security groups y listas de acceso."
          - "Exponer servicios con SLB y EIP."
          - "Conectar VPCs con peering y CEN a nivel conceptual."
  - week: 4
    title: "Almacenamiento OSS y NAS"
    sections:
      - domain: "Storage"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear buckets OSS y gestionar permisos y versionado."
          - "Montar NAS para cargas compartidas."
          - "Aplicar lifecycle policies para abaratar storage."
          - "Migrar un backup local a OSS como ejercicio."
  - week: 5
    title: "Seguridad e IAM (RAM)"
    sections:
      - domain: "Security and IAM"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear usuarios RAM, grupos y políticas de mínimo privilegio."
          - "Activar MFA y rotación de credenciales."
          - "Auditar acciones con ActionTrail."
          - "Proteger secretos sin hardcodearlos en código."
  - week: 6
    title: "Bases de datos gestionadas"
    sections:
      - domain: "Storage"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Levantar PolarDB/RDS y configurar backups."
          - "Conectar apps con endpoints privados."
          - "Elegir entre relacional y NoSQL según el caso."
          - "Probar failover y medir RTO básico."
  - week: 7
    title: "Monitoreo y facturación"
    sections:
      - domain: "Monitoring and Billing"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear alarmas en CloudMonitor para CPU y disco."
          - "Leer la factura y detectar consumos anómalos."
          - "Etiquetar recursos para cost allocation."
          - "Definir presupuestos y alertas de gasto."
  - week: 8
    title: "Simulacro final CEA-C01"
    sections:
      - domain: "Compute"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 50 preguntas y repaso de fallos."
          - "Cerrar gaps en red y seguridad RAM."
          - "Repasar ECS, VPC y OSS a nivel conceptual."
          - "Checklist logístico del examen."
`,
  "ali-acp-ca": `
id: "ali-acp-ca"
provider: "Alibaba Cloud"
provider_color: "#FF6A00"
title: "Alibaba Cloud Certified Professional: Cloud Architect"
code: "CAP-C01"
cost: "$200 USD"
default_priority: 3
popularity: 3
summary: "Credencial Professional que valida diseñar soluciones escalables y resilientes: arquitectura, red, seguridad y migración."
meta:
  exam_version: "Guía vigente (Professional, reemplaza a ACP Cloud Computing)"
  guide_date: "2026-09-09"
  guide_source: "https://edu.alibabacloud.com/certification/cloud_architect_professional"
  format: "50 preguntas · 90 minutos · 70/100 para aprobar · online o presencial"
  passing_score: "70/100"
  domains:
    - "Architecture Design"
    - "Network Architecture"
    - "Security Architecture"
    - "High Availability and Disaster Recovery"
    - "Migration and Cost Optimization"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "Solution Architect"
    - "Cloud Consultant"
  versions: []
  verified_sources:
    - url: "https://edu.alibabacloud.com/certification/cloud_architect_professional"
      date_last_fetched: "2026-09-09"
      label: "ACP Cloud Architect (CAP-C01) — Exam Overview"
    - url: "https://edu.alibabacloud.com/certification/"
      date_last_fetched: "2026-09-09"
      label: "Alibaba Cloud Certification — catálogo y precios"
weeks:
  - week: 1
    title: "Diseño de arquitecturas de referencia"
    sections:
      - domain: "Architecture Design"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Mapear requisitos a servicios: cómputo, datos y red."
          - "Separar ambientes dev/stage/prod con cuentas y RAM."
          - "Documentar decisiones con ADRs simples."
          - "Estimar costo total de una arquitectura propuesta."
  - week: 2
    title: "Red empresarial y conectividad híbrida"
    sections:
      - domain: "Network Architecture"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar hub-and-spoke con CEN y Transit Router."
          - "Conectar on-premises con VPN y Express Connect."
          - "Segmentar con security groups y NACLs por capa."
          - "Planear DNS privado y resolución híbrida."
  - week: 3
    title: "Seguridad en profundidad"
    sections:
      - domain: "Security Architecture"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Diseñar identidad federada y SSO para la organización."
          - "Proteger APIs y apps con WAF y Anti-DDoS."
          - "Cifrar datos en tránsito y reposo con KMS."
          - "Auditar con ActionTrail y Config de forma continua."
  - week: 4
    title: "Alta disponibilidad y DR"
    sections:
      - domain: "High Availability and Disaster Recovery"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar multi-zona con SLB y health checks."
          - "Definir RTO/RPO y elegir estrategia backup/pilot/light."
          - "Replicar bases de datos entre regiones."
          - "Probar failover con game-day documentado."
  - week: 5
    title: "Datos y analytics a escala"
    sections:
      - domain: "Architecture Design"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Elegir OLTP vs OLAP vs lakehouse según el caso."
          - "Diseñar ingesta con DataHub/Kafka y procesamiento."
          - "Gobernar datos con catalogación y linaje básico."
          - "Dimensionar throughput y retención."
  - week: 6
    title: "Migración a la nube"
    sections:
      - domain: "Migration and Cost Optimization"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Evaluar 6R y elegir estrategia por workload."
          - "Planear oleadas con dependencias y rollback."
          - "Migrar una app de ejemplo con SMC."
          - "Validar paridad funcional post-migración."
  - week: 7
    title: "Optimización de costos y gobierno"
    sections:
      - domain: "Migration and Cost Optimization"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Detectar recursos ociosos y rightsizing."
          - "Combinar pay-as-you-go con reservadas donde aplique."
          - "Etiquetar todo para chargeback por equipo."
          - "Armar reporte mensual de savings."
  - week: 8
    title: "Simulacro final CAP-C01"
    sections:
      - domain: "Architecture Design"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 50 preguntas y repaso de fallos."
          - "Cerrar gaps en red híbrida y seguridad."
          - "Repasar casos de arquitectura de la guía oficial."
          - "Checklist logístico del examen."
`,
  "oci-found": `
id: "oci-found"
provider: "Oracle"
provider_color: "#C74634"
title: "Oracle Cloud Infrastructure Foundations Associate"
code: "1Z0-1085"
cost: "Gratis · online sin supervisión"
default_priority: 1
popularity: 3
summary: "Credencial Foundations gratuita que valida conceptos cloud e intro a IAM, red, cómputo y storage en OCI."
meta:
  exam_version: "Guía vigente (Foundations)"
  guide_date: "2026-09-09"
  guide_source: "https://www.oracle.com/education/certification/"
  format: "Online sin supervisión · gratuito"
  passing_score: "No publicado (verificar en registro)"
  domains:
    - "Cloud Concepts"
    - "IAM Basics"
    - "Networking Basics"
    - "Compute and Storage Basics"
    - "Observability Basics"
  validity_years: 3
  recert_window: "Según política de recertificación Oracle"
  recert_options:
    - "Repetir el examen o subir de nivel"
  recert_discount: "Examen gratuito"
  level: "100 · Foundations"
  career_paths:
    - "Cloud Beginner"
    - "Presales Associate"
  versions: []
  verified_sources:
    - url: "https://www.oracle.com/education/certification/"
      date_last_fetched: "2026-09-09"
      label: "Oracle Certification — catálogo y políticas"
weeks:
  - week: 1
    title: "Conceptos cloud y modelo OCI"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Distinguir IaaS, PaaS, SaaS y nube pública/privada."
          - "Describir regiones, dominios de disponibilidad y realms OCI."
          - "Explicar el modelo de responsabilidad compartida."
          - "Navegar la consola OCI y cloud shell."
  - week: 2
    title: "IAM y compartimentos"
    sections:
      - domain: "IAM Basics"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear usuarios, grupos y políticas básicas."
          - "Organizar recursos en compartimentos."
          - "Aplicar principio de mínimo privilegio."
          - "Activar MFA en cuentas administrativas."
  - week: 3
    title: "Redes VCN a nivel introductorio"
    sections:
      - domain: "Networking Basics"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear una VCN con subredes públicas y privadas."
          - "Configurar route tables e internet gateway."
          - "Explicar security lists vs network security groups."
          - "Conectar una instancia a internet de forma segura."
  - week: 4
    title: "Cómputo y shapes"
    sections:
      - domain: "Compute and Storage Basics"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Lanzar una VM con shape flexible Always Free."
          - "Distinguir VM, bare metal y contenedores."
          - "Adjuntar block volumes y hacer backup."
          - "Usar Object Storage para archivos y backups."
  - week: 5
    title: "Bases de datos y Autonomous"
    sections:
      - domain: "Compute and Storage Basics"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir Autonomous Database y sus workloads."
          - "Crear una ADB Always Free y conectarse."
          - "Explicar backups automáticos y scaling."
          - "Comparar MySQL HeatWave con ADB a alto nivel."
  - week: 6
    title: "Observabilidad y costos"
    sections:
      - domain: "Observability Basics"
        weight: "10%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Ver métricas y crear una alarma básica."
          - "Consultar Audit logs de la tenancy."
          - "Revisar el costo con Cost Analysis."
          - "Configurar budgets y alertas de gasto."
  - week: 7
    title: "Seguridad base y compliance"
    sections:
      - domain: "IAM Basics"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Explicar Cloud Guard y Security Zones."
          - "Gestionar vaults y secretos a nivel conceptual."
          - "Describir cifrado por defecto de OCI."
          - "Repasar principios de Zero Trust aplicados."
  - week: 8
    title: "Simulacro final 1Z0-1085"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Simulacro de 40 preguntas y repaso de fallos."
          - "Cerrar gaps en IAM y networking básico."
          - "Repasar el free tier como laboratorio."
          - "Checklist logístico del examen online."
`,
  "oci-arch-a": `
id: "oci-arch-a"
provider: "Oracle"
provider_color: "#C74634"
title: "Oracle Cloud Infrastructure Architect Associate"
code: "1Z0-1072-26"
cost: "$245 USD"
default_priority: 3
popularity: 4
summary: "Credencial Associate que valida diseñar IAM, VCN, cómputo, storage y bases de datos en OCI (Pearson VUE)."
meta:
  exam_version: "Guía vigente 2026 (1Z0-1072-26)"
  guide_date: "2026-09-09"
  guide_source: "https://www.oracle.com/education/certification/"
  format: "55 preguntas · 90 minutos · Pearson VUE online o centro"
  passing_score: "68% (verificar en registro)"
  domains:
    - "Identity and Access Management"
    - "Networking"
    - "Compute"
    - "Storage"
    - "Database"
    - "Observability and Management"
  validity_years: 3
  recert_window: "Según política de recertificación Oracle (3 años)"
  recert_options:
    - "Repetir el examen o subir a Professional"
  recert_discount: "Sin descuento documentado"
  level: "200 · Associate"
  career_paths:
    - "OCI Architect"
    - "Cloud Engineer"
  versions: []
  verified_sources:
    - url: "https://www.oracle.com/education/certification/"
      date_last_fetched: "2026-09-09"
      label: "Oracle Certification — catálogo y políticas"
weeks:
  - week: 1
    title: "IAM avanzado con identity domains"
    sections:
      - domain: "Identity and Access Management"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Escribir políticas IAM con condicionales y tags."
          - "Configurar dynamic groups y resource principals."
          - "Federar IdP externo con identity domains."
          - "Diseñar compartimentos y quotas por equipo."
  - week: 2
    title: "VCN, subredes y conectividad"
    sections:
      - domain: "Networking"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar VCN multi-subred con gateways."
          - "Asegurar con security lists y NSGs."
          - "Conectar con peering local/remoto y DRG."
          - "Exponer con load balancer y DNS."
  - week: 3
    title: "VPN, FastConnect y tránsito"
    sections:
      - domain: "Networking"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Montar Site-to-Site VPN con redundancia."
          - "Planear FastConnect para tráfico dedicado."
          - "Enrutar tránsito hub-and-spoke con DRG."
          - "Diagnosticar conectividad con Network Command Center."
  - week: 4
    title: "Cómputo: shapes y autoscaling"
    sections:
      - domain: "Compute"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Elegir shapes VM, bare metal y flexibles."
          - "Crear imágenes custom y instance pools."
          - "Configurar autoscaling con métricas."
          - "Usar instancias preemptibles para batch."
  - week: 5
    title: "Object, Block y File Storage"
    sections:
      - domain: "Storage"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Gestionar tiers, lifecycle y versionado en Object Storage."
          - "Dimensionar Block Volumes con performance tiers."
          - "Montar File Storage con exports y snapshots."
          - "Firmar PARs para accesos temporales."
  - week: 6
    title: "Bases de datos y Autonomous"
    sections:
      - domain: "Database"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Desplegar Base DB, Exadata y Autonomous."
          - "Configurar Data Guard para HA/DR."
          - "Activar TDE y gestionar backups."
          - "Elegir MySQL HeatWave vs ADB según workload."
  - week: 7
    title: "Observabilidad y costos"
    sections:
      - domain: "Observability and Management"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear alarmas, notificaciones y logging."
          - "Automatizar con Events y Connector Hub."
          - "Desplegar con Resource Manager (Terraform)."
          - "Etiquetar y controlar costos por compartimento."
  - week: 8
    title: "Simulacro final 1Z0-1072-26"
    sections:
      - domain: "Networking"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 55 preguntas y repaso de fallos."
          - "Cerrar gaps en red y storage (44% combinado)."
          - "Repasar IAM con casos de escenario."
          - "Checklist logístico Pearson VUE."
`,
  "oci-arch-p": `
id: "oci-arch-p"
provider: "Oracle"
provider_color: "#C74634"
title: "Oracle Cloud Infrastructure Architect Professional"
code: "1Z0-997"
cost: "$245 USD"
default_priority: 4
popularity: 3
summary: "Credencial Professional que valida arquitecturas empresariales OCI: HA/DR, migración, seguridad y costos a escala."
meta:
  exam_version: "Guía vigente (1Z0-997)"
  guide_date: "2026-09-09"
  guide_source: "https://www.oracle.com/education/certification/"
  format: "120 minutos · Pearson VUE online o centro (verificar detalle en registro)"
  passing_score: "Consultar registro oficial"
  domains:
    - "Enterprise Architecture"
    - "High Availability and DR"
    - "Security and Compliance"
    - "Migration"
    - "Cost Governance"
  validity_years: 3
  recert_window: "Según política de recertificación Oracle (3 años)"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "Enterprise Architect"
    - "OCI Architect"
  versions: []
  verified_sources:
    - url: "https://www.oracle.com/education/certification/"
      date_last_fetched: "2026-09-09"
      label: "Oracle Certification — catálogo y políticas"
weeks:
  - week: 1
    title: "Arquitecturas de referencia OCI"
    sections:
      - domain: "Enterprise Architecture"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Diseñar landing zones con múltiples compartimentos."
          - "Separar workloads por criticidad y blast radius."
          - "Documentar decisiones con ADRs."
          - "Estimar TCO a 3 años de la propuesta."
  - week: 2
    title: "HA multi-AD y recuperación"
    sections:
      - domain: "High Availability and DR"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Distribuir fault domains y availability domains."
          - "Diseñar active-passive entre regiones."
          - "Probar DR con game-day semestral."
          - "Definir RTO/RPO por tier de aplicación."
  - week: 3
    title: "Seguridad y compliance empresarial"
    sections:
      - domain: "Security and Compliance"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Endurecer con Cloud Guard y Security Zones."
          - "Centralizar vaults y rotación de secretos."
          - "Auditar con Audit logs y SIEM externo."
          - "Mapear controles a marcos regulatorios."
  - week: 4
    title: "Migración lift-and-shift y replatform"
    sections:
      - domain: "Migration"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Evaluar readiness con Cloud Advisor."
          - "Planear oleadas con dependencias."
          - "Migrar bases de datos con Zero Downtime."
          - "Validar performance post-migración."
  - week: 5
    title: "Datos y Autonomous a escala"
    sections:
      - domain: "Enterprise Architecture"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Estandarizar ADB para analytics y transacciones."
          - "Replicar datos críticos entre regiones."
          - "Gobernar accesos a datos sensibles."
          - "Optimizar licencias y BYOL donde aplique."
  - week: 6
    title: "Redes hub-and-spoke y FastConnect"
    sections:
      - domain: "Enterprise Architecture"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Centralizar egress e inspección de tráfico."
          - "Conectar múltiples VCNs con DRG."
          - "Asegurar DNS privado a escala."
          - "Planear crecimiento sin rediseño."
  - week: 7
    title: "FinOps en OCI"
    sections:
      - domain: "Cost Governance"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Etiquetar todo para chargeback."
          - "Detectar underutilization con Advisor."
          - "Comprometer reservas donde haya base estable."
          - "Reportar savings trimestrales."
  - week: 8
    title: "Simulacro final 1Z0-997"
    sections:
      - domain: "Enterprise Architecture"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 50 preguntas y repaso de fallos."
          - "Cerrar gaps en HA/DR y migración."
          - "Repasar casos de escenario empresarial."
          - "Checklist logístico Pearson VUE."
`,
  "ibm-advocate": `
id: "ibm-advocate"
provider: "IBM Cloud"
provider_color: "#0F62FE"
title: "IBM Certified Technical Advocate - Cloud"
code: "C1000-158"
cost: "$200 USD (verificar en registro)"
default_priority: 2
popularity: 3
summary: "Credencial Advocate que valida fundamentos de IBM Cloud: catálogo, IAM, cómputo, red y observabilidad."
meta:
  exam_version: "Guía vigente (C1000-158)"
  guide_date: "2026-09-09"
  guide_source: "https://www.ibm.com/training/"
  format: "Multiple-choice · Pearson VUE (verificar duración en registro)"
  passing_score: "No publicado (verificar en registro)"
  domains:
    - "Cloud Concepts"
    - "IBM Cloud Catalog"
    - "Identity and Access"
    - "Compute and Storage"
    - "Monitoring Basics"
  validity_years: 2
  recert_window: "Se renueva con la versión vigente del examen"
  recert_options:
    - "Repetir el examen vigente"
  recert_discount: "Sin descuento documentado"
  level: "100 · Advocate"
  career_paths:
    - "Cloud Advocate"
    - "Presales Engineer"
  versions: []
  verified_sources:
    - url: "https://www.ibm.com/training/"
      date_last_fetched: "2026-09-09"
      label: "IBM Training — catálogo y registro de exámenes"
weeks:
  - week: 1
    title: "Conceptos cloud y cuenta IBM"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Distinguir IaaS, PaaS, SaaS y despliegues IBM."
          - "Crear cuenta, grupos de recursos y etiquetas."
          - "Navegar el catálogo y estimar costos."
          - "Explicar regiones y zonas de IBM Cloud."
  - week: 2
    title: "IAM y access groups"
    sections:
      - domain: "Identity and Access"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Invitar usuarios y asignar roles de plataforma."
          - "Crear access groups por equipo."
          - "Aplicar políticas de servicio mínimas."
          - "Activar MFA en la cuenta."
  - week: 3
    title: "VPC y redes"
    sections:
      - domain: "IBM Cloud Catalog"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear una VPC con subredes y ACLs."
          - "Exponer con floating IP y load balancer."
          - "Conectar con VPN a nivel conceptual."
          - "Aislar ambientes dev y prod."
  - week: 4
    title: "Cómputo y contenedores"
    sections:
      - domain: "Compute and Storage"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Levantar una VSI y conectarse por SSH."
          - "Crear un cluster IKS/ROKS de prueba."
          - "Desplegar una app de ejemplo."
          - "Adjuntar block storage y hacer snapshot."
  - week: 5
    title: "Storage y bases de datos"
    sections:
      - domain: "Compute and Storage"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Crear buckets COS y políticas de acceso."
          - "Levantar Databases for PostgreSQL."
          - "Configurar backups automáticos."
          - "Elegir storage según durabilidad y costo."
  - week: 6
    title: "Observabilidad básica"
    sections:
      - domain: "Monitoring Basics"
        weight: "10%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Ver métricas en Monitoring."
          - "Buscar eventos en Activity Tracker."
          - "Crear una alerta de gasto."
          - "Centralizar logs de una app de prueba."
  - week: 7
    title: "Seguridad base"
    sections:
      - domain: "Identity and Access"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Gestionar claves con Secrets Manager."
          - "Rotar credenciales de servicio."
          - "Revisar findings de Security Advisor."
          - "Documentar baseline de hardening."
  - week: 8
    title: "Simulacro final C1000-158"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Simulacro de 50 preguntas y repaso de fallos."
          - "Cerrar gaps en IAM y catálogo."
          - "Repasar VPC y storage a nivel conceptual."
          - "Checklist logístico Pearson VUE."
`,
  "ibm-arch": `
id: "ibm-arch"
provider: "IBM Cloud"
provider_color: "#0F62FE"
title: "IBM Certified Professional Architect - Cloud v6"
code: "C1000-172"
cost: "$200 USD (verificar en registro)"
default_priority: 3
popularity: 3
summary: "Credencial Professional que valida diseñar soluciones end-to-end en IBM Cloud: infraestructura, red, seguridad y datos."
meta:
  exam_version: "Guía vigente v6 (C1000-172)"
  guide_date: "2026-09-09"
  guide_source: "https://www.ibm.com/training/"
  format: "64 preguntas · 39 para aprobar · 90 minutos · Pearson VUE"
  passing_score: "39/64"
  domains:
    - "Solution Design"
    - "Networking"
    - "Security"
    - "Data and Integration"
    - "Operations"
  validity_years: 2
  recert_window: "Se renueva con la versión vigente del examen"
  recert_options:
    - "Repetir el examen vigente"
  recert_discount: "Sin descuento documentado"
  level: "300 · Professional"
  career_paths:
    - "Cloud Architect"
    - "Solutions Architect"
  versions: []
  verified_sources:
    - url: "https://www.ibm.com/training/"
      date_last_fetched: "2026-09-09"
      label: "IBM Training — catálogo y registro de exámenes"
weeks:
  - week: 1
    title: "Diseño de soluciones y landing zone"
    sections:
      - domain: "Solution Design"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Mapear requisitos a servicios IBM Cloud."
          - "Diseñar enterprise con múltiples cuentas."
          - "Documentar decisiones y supuestos."
          - "Estimar TCO de la propuesta."
  - week: 2
    title: "Red: VPC, Direct Link y DNS"
    sections:
      - domain: "Networking"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diseñar VPC hub-and-spoke con transit gateway."
          - "Conectar on-premises con Direct Link."
          - "Asegurar con ACLs y security groups."
          - "Planear DNS privado y resolución híbrida."
  - week: 3
    title: "Seguridad y compliance"
    sections:
      - domain: "Security"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L2"
        points:
          - "Federar identidad y aplicar least privilege."
          - "Centralizar secretos y rotación."
          - "Proteger datos con Key Protect."
          - "Auditar con Activity Tracker y SIEM."
  - week: 4
    title: "Datos e integración"
    sections:
      - domain: "Data and Integration"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Elegir Databases for XXX según workload."
          - "Integrar apps con MQ y Event Streams."
          - "Replicar datos críticos entre regiones."
          - "Gobernar accesos a datos sensibles."
  - week: 5
    title: "Contenedores y serverless"
    sections:
      - domain: "Solution Design"
        weight: "25%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Estandarizar IKS/ROKS y Code Engine."
          - "Diseñar CI/CD con Toolchain."
          - "Definir estrategias de rollout."
          - "Observar con Log Analysis y Monitoring."
  - week: 6
    title: "HA/DR entre regiones"
    sections:
      - domain: "Operations"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Distribuir zonas y regiones por criticidad."
          - "Definir RTO/RPO y runbooks."
          - "Probar failover semestralmente."
          - "Automatizar backups y restores."
  - week: 7
    title: "FinOps y gobierno"
    sections:
      - domain: "Operations"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Etiquetar y asignar costos por equipo."
          - "Detectar recursos ociosos."
          - "Reservar capacidad estable."
          - "Reportar savings y forecast."
  - week: 8
    title: "Simulacro final C1000-172"
    sections:
      - domain: "Solution Design"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 64 preguntas y repaso de fallos."
          - "Cerrar gaps en red y seguridad."
          - "Repasar casos de escenario empresarial."
          - "Checklist logístico Pearson VUE."
`,
  "tencent-pract": `
id: "tencent-pract"
provider: "Tencent Cloud"
provider_color: "#006EFF"
title: "Tencent Cloud Practitioner"
code: "TCP"
cost: "$100 USD aprox. (verificar en portal)"
default_priority: 1
popularity: 2
summary: "Credencial entry-level que valida fundamentos cloud y productos core Tencent: CVM, VPC, COS, TencentDB y facturación."
meta:
  exam_version: "Guía vigente (versión 2026)"
  guide_date: "2026-09-09"
  guide_source: "https://www.tencentcloud.com/edu/training"
  format: "60 preguntas · 90 minutos · 70/100 para aprobar"
  passing_score: "70/100"
  domains:
    - "Cloud Concepts"
    - "Compute (CVM)"
    - "Network (VPC, CLB, CDN)"
    - "Storage (COS, CBS)"
    - "Database and Security"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración (2 años)"
  recert_options:
    - "Repetir el examen"
  recert_discount: "Sin descuento documentado"
  level: "100 · Practitioner"
  career_paths:
    - "Cloud Beginner"
    - "Presales Engineer"
  versions: []
  verified_sources:
    - url: "https://www.tencentcloud.com/edu/training"
      date_last_fetched: "2026-09-09"
      label: "Tencent Cloud Training and Certification — portal"
weeks:
  - week: 1
    title: "Conceptos y consola Tencent"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Distinguir IaaS, PaaS, SaaS en el portfolio Tencent."
          - "Crear cuenta, proyectos y control de gastos."
          - "Navegar la consola y Cloud Shell."
          - "Explicar regiones y zonas disponibles."
  - week: 2
    title: "CVM y cómputo"
    sections:
      - domain: "Compute (CVM)"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Lanzar una CVM y conectarse."
          - "Elegir tipos de instancia por workload."
          - "Crear imágenes y snapshots."
          - "Configurar auto scaling básico."
  - week: 3
    title: "VPC, CLB y CDN"
    sections:
      - domain: "Network (VPC, CLB, CDN)"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear VPC con subredes y tablas de ruta."
          - "Exponer con CLB y EIP."
          - "Acelerar contenido con CDN."
          - "Asegurar con security groups."
  - week: 4
    title: "COS y CBS"
    sections:
      - domain: "Storage (COS, CBS)"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Crear buckets COS y gestionar permisos."
          - "Adjuntar CBS y expandir volúmenes."
          - "Versionar y archivar objetos."
          - "Migrar un backup como ejercicio."
  - week: 5
    title: "TencentDB y CAM"
    sections:
      - domain: "Database and Security"
        weight: "15%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Levantar MySQL/Redis gestionados."
          - "Crear subcuentas CAM con políticas mínimas."
          - "Activar MFA y auditar accesos."
          - "Elegir base según el caso de uso."
  - week: 6
    title: "Monitoreo y SCF/TKE intro"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Ver métricas en Cloud Monitor."
          - "Crear una alarma de CPU."
          - "Probar una función SCF hola-mundo."
          - "Describir TKE a alto nivel."
  - week: 7
    title: "Facturación y casos"
    sections:
      - domain: "Cloud Concepts"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Leer la factura y detectar anomalías."
          - "Comparar pay-as-you-go vs paquetes."
          - "Estimar un despliegue típico."
          - "Resolver casos de ejemplo del temario."
  - week: 8
    title: "Simulacro final TCP"
    sections:
      - domain: "Compute (CVM)"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Simulacro de 60 preguntas en 90 minutos."
          - "Cerrar gaps en red y billing."
          - "Repasar CVM, COS y CAM."
          - "Checklist logístico del examen."
`,
  "tencent-tcca": `
id: "tencent-tcca"
provider: "Tencent Cloud"
provider_color: "#006EFF"
title: "Tencent Cloud Computing Associate Engineer"
code: "TCCA"
cost: "$100 USD aprox. (verificar en portal)"
default_priority: 2
popularity: 2
summary: "Credencial Associate (TCCA) que valida operar workloads productivos: despliegue, monitoreo y troubleshooting en Tencent Cloud."
meta:
  exam_version: "Guía vigente (versión 2026)"
  guide_date: "2026-09-09"
  guide_source: "https://www.tencentcloud.com/edu/training"
  format: "Multiple-choice (verificar duración en portal)"
  passing_score: "No publicado (verificar en portal)"
  domains:
    - "Deployment"
    - "Monitoring"
    - "Troubleshooting"
    - "Security Operations"
    - "Cost Operations"
  validity_years: 2
  recert_window: "Antes de la fecha de expiración (2 años)"
  recert_options:
    - "Repetir el examen o subir a TCCP"
  recert_discount: "Sin descuento documentado"
  level: "200 · Associate"
  career_paths:
    - "Cloud SysOps"
    - "Cloud Support Engineer"
  versions: []
  verified_sources:
    - url: "https://www.tencentcloud.com/edu/training"
      date_last_fetched: "2026-09-09"
      label: "Tencent Cloud Training and Certification — portal"
weeks:
  - week: 1
    title: "Despliegue de workloads"
    sections:
      - domain: "Deployment"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Desplegar una app 3-tier con CVM, CLB y TencentDB."
          - "Automatizar con plantillas y scripts."
          - "Versionar releases con rollback."
          - "Validar salud post-despliegue."
  - week: 2
    title: "Monitoreo productivo"
    sections:
      - domain: "Monitoring"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Centralizar métricas y logs."
          - "Crear alarmas accionables."
          - "Definir SLIs básicos del servicio."
          - "Armar dashboard operativo."
  - week: 3
    title: "Troubleshooting sistemático"
    sections:
      - domain: "Troubleshooting"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Diagnosticar latencia por capas."
          - "Rastrear errores 5xx hasta el origen."
          - "Resolver agotamiento de disco/memoria."
          - "Escribir postmortems accionables."
  - week: 4
    title: "Seguridad operativa"
    sections:
      - domain: "Security Operations"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Endurecer security groups en producción."
          - "Rotar claves y certificados."
          - "Mitigar DDoS básico con Anti-DDoS."
          - "Auditar permisos trimestralmente."
  - week: 5
    title: "Backups y DR"
    sections:
      - domain: "Deployment"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Automatizar snapshots y backups DB."
          - "Probar restores periódicamente."
          - "Replicar datos críticos."
          - "Documentar runbook de recuperación."
  - week: 6
    title: "Escalado y performance"
    sections:
      - domain: "Monitoring"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Configurar auto scaling por métricas."
          - "Perfilar cuellos de botella."
          - "Cachear con Redis donde aplique."
          - "Medir mejora antes/después."
  - week: 7
    title: "Costos en operación"
    sections:
      - domain: "Cost Operations"
        weight: "10%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Detectar recursos ociosos."
          - "Rightsizing de CVMs."
          - "Alertas de presupuesto por proyecto."
          - "Reporte mensual de gasto."
  - week: 8
    title: "Simulacro final TCCA"
    sections:
      - domain: "Deployment"
        weight: "25%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado y repaso de fallos."
          - "Cerrar gaps en monitoreo y DR."
          - "Repasar CAM y networking operativo."
          - "Checklist logístico del examen."
`,
  "sf-admin": `
id: "sf-admin"
provider: "Salesforce"
provider_color: "#00A1E0"
title: "Salesforce Certified Administrator"
code: "ADM-201"
cost: "$200 USD"
default_priority: 2
popularity: 5
summary: "Credencial base que valida configurar, asegurar y operar una org Salesforce (Sales, Service, Collaboration)."
meta:
  exam_version: "Guía vigente (incluye dominio Agentforce AI 8%)"
  guide_date: "2026-09-09"
  guide_source: "https://trailheadacademy.salesforce.com/certificate/exam-platform-admin---Plat-Admn-201"
  format: "60 + 5 preguntas · 105 minutos · Kryterion online o centro"
  passing_score: "68% (verificar en registro)"
  domains:
    - "Organization Setup"
    - "User Setup and Security"
    - "Standard and Custom Objects"
    - "Sales and Service Applications"
    - "Data and Analytics"
    - "Workflow and Automation"
  validity_years: 0
  recert_window: "Mantenimiento Trailhead 3 veces por año (sin expiración fija)"
  recert_options:
    - "Completar el módulo Trailhead de cada release"
  recert_discount: "Mantenimiento gratuito"
  level: "200 · Administrator"
  career_paths:
    - "Salesforce Administrator"
    - "CRM Specialist"
  versions: []
  verified_sources:
    - url: "https://trailheadacademy.salesforce.com/certificate/exam-platform-admin---Plat-Admn-201"
      date_last_fetched: "2026-09-09"
      label: "Salesforce Certified Platform Administrator — Exam Details"
weeks:
  - week: 1
    title: "Setup de org y modelo de datos"
    sections:
      - domain: "Organization Setup"
        weight: "20%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Configurar company information, fiscal year y UI."
          - "Distinguir sandboxes por propósito."
          - "Crear objetos custom y relaciones."
          - "Practicar en un Trailhead Playground."
  - week: 2
    title: "Usuarios, roles y seguridad"
    sections:
      - domain: "User Setup and Security"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Crear usuarios, roles y jerarquía."
          - "Asignar perfiles vs permission sets."
          - "Configurar OWD y sharing rules."
          - "Auditar accesos con reportes."
  - week: 3
    title: "Objetos standard y custom"
    sections:
      - domain: "Standard and Custom Objects"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Modelar cuentas, contactos y oportunidades."
          - "Crear campos, validaciones y page layouts."
          - "Gestionar record types y processes."
          - "Importar datos con Data Loader."
  - week: 4
    title: "Sales y Service Cloud"
    sections:
      - domain: "Sales and Service Applications"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L3"
        points:
          - "Configurar pipeline, stages y forecasts."
          - "Montar casos, queues y reglas de asignación."
          - "Activar knowledge base para agentes."
          - "Medir CSAT con reportes."
  - week: 5
    title: "Datos, reportes y dashboards"
    sections:
      - domain: "Data and Analytics"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Construir reportes tabulares, summary y matrix."
          - "Armar dashboards con componentes."
          - "Deduplicar y auditar calidad de datos."
          - "Programar exports periódicos."
  - week: 6
    title: "Automatización con Flow"
    sections:
      - domain: "Workflow and Automation"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Crear screen flows y record-triggered flows."
          - "Elegir Flow vs approval process."
          - "Manejar errores y fault paths."
          - "Probar en sandbox antes de activar."
  - week: 7
    title: "Agentforce y AppExchange"
    sections:
      - domain: "Workflow and Automation"
        weight: "10%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Describir capacidades de Agentforce AI."
          - "Evaluar apps de AppExchange con criterio."
          - "Revisar permisos de paquetes instalados."
          - "Repasar el dominio AI del examen 2026."
  - week: 8
    title: "Simulacro final ADM-201"
    sections:
      - domain: "Organization Setup"
        weight: "20%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 60 preguntas y repaso de fallos."
          - "Cerrar gaps en seguridad y sharing."
          - "Repasar Trailhead Admin trailmix."
          - "Checklist logístico Kryterion."
`,
  "sf-pd1": `
id: "sf-pd1"
provider: "Salesforce"
provider_color: "#00A1E0"
title: "Salesforce Certified Platform Developer I"
code: "PD1"
cost: "$200 USD"
default_priority: 3
popularity: 4
summary: "Credencial developer que valida Apex, SOQL/SOSL, triggers, async y Lightning Web Components sobre la plataforma."
meta:
  exam_version: "Guía vigente"
  guide_date: "2026-09-09"
  guide_source: "https://trailhead.salesforce.com/"
  format: "60 preguntas · 105 minutos · Kryterion online o centro"
  passing_score: "65% (verificar en registro)"
  domains:
    - "Developer Fundamentals"
    - "Apex and Database"
    - "SOQL and SOSL"
    - "Triggers and Async"
    - "Lightning Web Components"
    - "Testing and Debugging"
  validity_years: 0
  recert_window: "Mantenimiento Trailhead 3 veces por año (sin expiración fija)"
  recert_options:
    - "Completar el módulo Trailhead de cada release"
  recert_discount: "Mantenimiento gratuito"
  level: "300 · Developer"
  career_paths:
    - "Salesforce Developer"
    - "Platform Developer"
  versions: []
  verified_sources:
    - url: "https://trailhead.salesforce.com/"
      date_last_fetched: "2026-09-09"
      label: "Trailhead — plataforma oficial de aprendizaje y registro"
weeks:
  - week: 1
    title: "Fundamentos y org de desarrollo"
    sections:
      - domain: "Developer Fundamentals"
        weight: "15%"
        bloom: 2
        kirkpatrick: "L2"
        points:
          - "Montar Dev Hub y scratch orgs."
          - "Trabajar con SFDX y control de versiones."
          - "Explicar límites governor a alto nivel."
          - "Navegar Setup con mentalidad developer."
  - week: 2
    title: "Apex esencial"
    sections:
      - domain: "Apex and Database"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Escribir clases, métodos y colecciones."
          - "Operar DML con bulkification."
          - "Encapsular lógica en services y selectors."
          - "Ejecutar anonymous Apex para probar."
  - week: 3
    title: "SOQL y SOSL"
    sections:
      - domain: "SOQL and SOSL"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Consultar con filtros, orden y límites."
          - "Navegar relaciones parent-child."
          - "Buscar multi-objeto con SOSL."
          - "Evitar queries en loops."
  - week: 4
    title: "Triggers y procesamiento async"
    sections:
      - domain: "Triggers and Async"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Implementar trigger handler pattern."
          - "Delegar a future, queueable y batch."
          - "Controlar recursión de triggers."
          - "Planificar jobs con schedulable."
  - week: 5
    title: "Lightning Web Components"
    sections:
      - domain: "Lightning Web Components"
        weight: "15%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Crear un LWC con @wire y Apex imperativo."
          - "Comunicar componentes con eventos."
          - "Manejar formularios con record-edit-form."
          - "Depurar con Lightning DevTools."
  - week: 6
    title: "Seguridad y datos en código"
    sections:
      - domain: "Apex and Database"
        weight: "20%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Respetar sharing y CRUD/FLS en Apex."
          - "Usar WITH SECURITY_ENFORCED."
          - "Prevenir SOQL injection."
          - "Gestionar secretos sin hardcode."
  - week: 7
    title: "Testing y debugging"
    sections:
      - domain: "Testing and Debugging"
        weight: "10%"
        bloom: 4
        kirkpatrick: "L3"
        points:
          - "Escribir tests con @isTest y asserts."
          - "Cubrir triggers al 75%+ con datos de prueba."
          - "Leer debug logs para fallos."
          - "Medir coverage antes del deploy."
  - week: 8
    title: "Simulacro final PD1"
    sections:
      - domain: "Developer Fundamentals"
        weight: "15%"
        bloom: 3
        kirkpatrick: "L2"
        points:
          - "Simulacro cronometrado de 60 preguntas y repaso de fallos."
          - "Cerrar gaps en async y LWC."
          - "Repasar límites governor clave."
          - "Checklist logístico Kryterion."
`,
};

function fromYaml<T>(raw: string): T | null {
  try {
    return parse(raw) as T;
  } catch (e) {
    console.error("Error parseando YAML:", e);
    return null;
  }
}

function normalize(raw: RawCert): Certification {
  const weeks = (raw.weeks ?? []).map((w) => {
    const sections = (w.sections ?? []).map((s) => {
      const bloomNum = typeof s.bloom === "number" ? Math.round(s.bloom) : NaN;
      const bloom: BloomLevel | undefined =
        bloomNum >= 1 && bloomNum <= 6 ? (bloomNum as BloomLevel) : undefined;
      const k = typeof s.kirkpatrick === "string" ? s.kirkpatrick.trim().toUpperCase() : "";
      const kirkpatrick: KirkpatrickLevel | undefined =
        k === "L1" || k === "L2" || k === "L3" || k === "L4" ? k : undefined;
      return {
        domain: s.domain ?? "",
        weight: s.weight ?? "",
        points: s.points ?? [],
        ...(bloom ? { bloom } : {}),
        ...(kirkpatrick ? { kirkpatrick } : {}),
      };
    });
    return {
      week: w.week ?? 0,
      title: w.title ?? `Semana ${w.week}`,
      points: w.points ?? [],
      ...(sections.length > 0 ? { sections } : {}),
    };
  });

  const m = raw.meta;
  const meta: CertificationMeta | undefined = m
    ? {
        examVersion: m.exam_version ?? "",
        guideDate: m.guide_date ?? "",
        guideSource: m.guide_source ?? "",
        format: m.format ?? "",
        passingScore: m.passing_score ?? "",
        domains: m.domains ?? [],
        level: m.level ?? "",
        validityYears: m.validity_years ?? 0,
        recertWindow: m.recert_window ?? "",
        recertOptions: m.recert_options ?? [],
        recertDiscount: m.recert_discount ?? "",
        versions: (m.versions ?? []).map((v) => ({
          code: v.code ?? "",
          note: v.note ?? "",
        })),
        verifiedSources: (m.verified_sources ?? []).map((v) => ({
          url: v.url ?? "",
          dateLastFetched: v.date_last_fetched ?? "",
          label: v.label ?? "Guía oficial del examen",
        })),
        careerPaths: (m.career_paths ?? []).map((c) => `${c}`),
        badgeImage: typeof m.badge_image === "string" ? m.badge_image : undefined,
      }
    : undefined;

  return {
    id: raw.id ?? "unknown",
    provider: raw.provider ?? "Cloud",
    providerColor: raw.provider_color ?? "#38bdf8",
    title: raw.title ?? "Certificación",
    code: raw.code ?? "",
    cost: raw.cost ?? "",
    defaultPriority: parsePriority(raw.default_priority),
    popularity: parsePopularity(raw.popularity),
    summary: raw.summary ?? "",
    weeks,
    meta,
  };
}

export const certifications: Certification[] = Object.values(certificationsYaml)
  .map((y) => normalize(fromYaml<RawCert>(y) ?? {}))
  .filter((c) => c.id !== "unknown");

/** Devuelve el YAML crudo editable de una certificación. */
export function getCertificationYaml(id: string): string {
  return certificationsYaml[id] ?? "";
}

/** Issues estructurados de la última corrida de validación (errores + warnings). */
let lastValidationIssues: ValidationIssue[] = [];

/** Devuelve los issues de la última validación de saveYaml (copia). */
export function getLastValidationIssues(): ValidationIssue[] {
  return [...lastValidationIssues];
}

/** Actualiza (en memoria) el YAML crudo de una certificación y re-parsea. */
export function setCertificationYaml(yamlText: string): boolean {
  const parsed = fromYaml<RawCert>(yamlText);
  if (!parsed) {
    lastValidationIssues = [
      { path: "(root)", message: "El YAML no pudo parsearse (sintaxis inválida).", severity: "error" },
    ];
    return false;
  }
  lastValidationIssues = validateGuide(parsed);
  if (lastValidationIssues.some((i) => i.severity === "error")) {
    return false;
  }
  const idx = certifications.findIndex((c) => c.id === parsed.id);
  if (idx === -1) {
    lastValidationIssues = [
      ...lastValidationIssues,
      { path: "id", message: `No existe una certificación con id "${parsed.id ?? "?"}" en el catálogo.`, severity: "error" },
    ];
    return false;
  }
  certifications.splice(idx, 1, normalize(parsed));
  return true;
}

/** Adaptador del puerto ICertificationRepository sobre el YAML embebido. */
export const certificationRepository: ICertificationRepository = {
  list: () => certifications,
  getYaml: (id: string) => getCertificationYaml(id),
  saveYaml: (yamlText: string) => setCertificationYaml(yamlText),
  getLastValidationIssues: () => getLastValidationIssues(),
};
