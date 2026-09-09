// Capa de dominio: construcción de la respuesta para formularios.
// Lógica pura (sin clipboard ni UI).

import type { Certification, UserState } from "./entities";
import { parsePriority, priorityCaps } from "./priority";

export function buildFormResponse(state: UserState, catalog: Certification[]): string {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));
  const activeCerts = selected
    .map((c) => {
      const p = parsePriority(state.priority[c.id]);
      return `• ${c.title} (${c.code}) – Prioridad: ${priorityCaps(p)} (${p}/5)`;
    })
    .join("\n");

  return `En relación con certificaciones técnicas:

Actualmente me encuentro preparando activamente las siguientes certificaciones técnicas alineadas con mi plan de desarrollo profesional:

${activeCerts}

Todas las guías de preparación siguen un plan estructurado de 8 semanas con objetivos claros por semana. Las certificaciones de mayor prioridad se encuentran en fase avanzada de preparación.`;
}
