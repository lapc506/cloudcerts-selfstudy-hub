// Capa de dominio: validador de question banks y mock exams.
// Patrón kubetauritrader: guards tipados + issues estructurados con path.

export interface MockValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isHttpsUrl(v: unknown): v is string {
  return typeof v === "string" && /^https:\/\//.test(v);
}

function isIsoDateString(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);
}

const TIERS = ["foundation", "application", "integration"];

export function validateBank(input: unknown): MockValidationIssue[] {
  const issues: MockValidationIssue[] = [];
  const err = (path: string, message: string): void => {
    issues.push({ path, message, severity: "error" });
  };
  const warn = (path: string, message: string): void => {
    issues.push({ path, message, severity: "warning" });
  };
  if (!isRecord(input)) {
    err("(root)", "El banco debe ser un objeto con id, cert_id, title y questions.");
    return issues;
  }
  for (const f of ["id", "cert_id", "title"] as const) {
    if (!isNonEmptyString(input[f])) err(f, `"${f}" debe ser un string no vacío.`);
  }
  const fu = input["fair_use"];
  if (fu !== undefined) {
    if (!isRecord(fu)) {
      err("fair_use", `"fair_use" debe ser un objeto con work, purpose, verdict, assessed_at y factors.`);
    } else {
      if (!isNonEmptyString(fu["work"])) err("fair_use.work", `"fair_use.work" debe describir la obra evaluada.`);
      if (!isNonEmptyString(fu["purpose"])) err("fair_use.purpose", `"fair_use.purpose" debe describir el uso propuesto.`);
      const v = fu["verdict"];
      if (v !== "likely-fair" && v !== "needs-review" && v !== "avoid") {
        err("fair_use.verdict", `"fair_use.verdict" debe ser likely-fair|needs-review|avoid.`);
      }
      const ad = fu["assessed_at"];
      if (typeof ad !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(ad)) {
        err("fair_use.assessed_at", `"fair_use.assessed_at" debe ser una fecha ISO válida (YYYY-MM-DD).`);
      }
      const factors = fu["factors"];
      if (!Array.isArray(factors) || factors.length === 0) {
        err("fair_use.factors", `"fair_use.factors" debe ser un array no vacío con los 4 factores.`);
      } else {
        factors.forEach((f, i) => {
          const base = `fair_use.factors[${i}]`;
          if (!isRecord(f) || !isNonEmptyString(f["factor"])) {
            err(base, `"${base}" debe tener factor (string) más favoring/opposing (arrays).`);
            return;
          }
          for (const k of ["favoring", "opposing"] as const) {
            const arr = (f as Record<string, unknown>)[k];
            if (!Array.isArray(arr) || !arr.every((x) => typeof x === "string")) {
              err(`${base}.${k}`, `"${base}.${k}" debe ser un array de strings.`);
            }
          }
        });
      }
    }
  }
  const qs = input["questions"];
  if (!Array.isArray(qs) || qs.length === 0) {
    err("questions", `"questions" debe ser un array no vacío.`);
    return issues;
  }
  const seen = new Set<string>();
  qs.forEach((q, i) => {
    const base = `questions[${i}]`;
    if (!isRecord(q)) {
      err(base, `"${base}" debe ser un objeto.`);
      return;
    }
    if (!isNonEmptyString(q["id"])) {
      err(`${base}.id`, `"${base}.id" debe ser un string no vacío.`);
    } else if (seen.has(q["id"] as string)) {
      err(`${base}.id`, `ID de pregunta duplicado: "${q["id"]}".`);
    } else {
      seen.add(q["id"] as string);
    }
    if (!isNonEmptyString(q["text"])) err(`${base}.text`, `"${base}.text" debe ser un string no vacío.`);
    const choices = q["choices"];
    if (!Array.isArray(choices) || choices.length < 2) {
      err(`${base}.choices`, `"${base}.choices" debe tener al menos 2 opciones.`);
    } else {
      choices.forEach((c, ci) => {
        const cpath = `${base}.choices[${ci}]`;
        if (!isRecord(c)) {
          err(cpath, `"${cpath}" debe ser un objeto {text, justification}.`);
          return;
        }
        if (!isNonEmptyString(c["text"])) {
          err(`${cpath}.text`, `"${cpath}.text" debe ser un string no vacío.`);
        }
        if (!isNonEmptyString(c["justification"])) {
          err(`${cpath}.justification`, `"${cpath}.justification" debe justificar por qué es correcta o no.`);
        }
        const csrcs = c["sources"];
        if (csrcs === undefined) {
          warn(
            `${cpath}.sources`,
            `"${cpath}.sources" debería citar la documentación oficial (URL + fechas) para fair use.`
          );
        } else if (!Array.isArray(csrcs)) {
          err(`${cpath}.sources`, `"${cpath}.sources" debe ser un array de {url, date_last_fetched} si está presente.`);
        } else {
          csrcs.forEach((s, si) => {
            const spath = `${cpath}.sources[${si}]`;
            if (!isRecord(s)) {
              err(spath, `"${spath}" debe ser un objeto con url y date_last_fetched.`);
              return;
            }
            if (!isHttpsUrl(s["url"])) {
              err(`${spath}.url`, `"${spath}.url" debe ser una URL https válida.`);
            }
            if (!isIsoDateString(s["date_last_fetched"])) {
              err(`${spath}.date_last_fetched`, `"${spath}.date_last_fetched" debe ser una fecha ISO válida (YYYY-MM-DD).`);
            }
          });
        }
      });
    }
    const answer = q["answer"];
    const nChoices = Array.isArray(choices) ? choices.length : 0;
    if (
      !Array.isArray(answer) ||
      answer.length === 0 ||
      !answer.every((a) => Number.isInteger(a) && (a as number) >= 0 && (a as number) < nChoices)
    ) {
      err(`${base}.answer`, `"${base}.answer" debe ser un array de índices válidos en choices.`);
    }
    if (!isNonEmptyString(q["explanation"])) {
      err(`${base}.explanation`, `"${base}.explanation" debe explicar la respuesta (2-3 oraciones).`);
    }
    if (q["bloom"] !== undefined) {
      const b = q["bloom"];
      if (typeof b !== "number" || !Number.isInteger(b) || b < 1 || b > 6) {
        err(`${base}.bloom`, `"${base}.bloom" debe ser un entero entre 1 y 6 si está presente.`);
      }
    }
    if (q["tier"] !== undefined && (typeof q["tier"] !== "string" || !TIERS.includes(q["tier"] as string))) {
      err(`${base}.tier`, `"${base}.tier" debe ser foundation|application|integration si está presente.`);
    }
    if (q["points"] !== undefined) {
      const pts = q["points"];
      if (typeof pts !== "number" || !Number.isInteger(pts) || pts <= 0) {
        err(`${base}.points`, `"${base}.points" debe ser un entero positivo si está presente.`);
      }
    }
    if (q["sources"] !== undefined) {
      const srcs = q["sources"];
      if (!Array.isArray(srcs)) {
        err(`${base}.sources`, `"${base}.sources" debe ser un array de {url, date_last_fetched} si está presente.`);
      } else {
        srcs.forEach((s, si) => {
          const spath = `${base}.sources[${si}]`;
          if (typeof s !== "object" || s === null || Array.isArray(s)) {
            err(spath, `"${spath}" debe ser un objeto con url y date_last_fetched.`);
            return;
          }
          const rec = s as Record<string, unknown>;
          if (typeof rec["url"] !== "string" || !/^https:\/\//.test(rec["url"] as string)) {
            err(`${spath}.url`, `"${spath}.url" debe ser una URL https válida.`);
          }
          if (typeof rec["date_last_fetched"] !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(rec["date_last_fetched"] as string)) {
            err(`${spath}.date_last_fetched`, `"${spath}.date_last_fetched" debe ser una fecha ISO válida (YYYY-MM-DD).`);
          }
        });
      }
    }
  });
  return issues;
}

export interface MockValidationContext {
  certIds: string[];
  /** Claves "bankId:questionId" existentes (varios mocks pueden compartir una). */
  questionKeys: Set<string>;
}

export function validateMock(input: unknown, ctx: MockValidationContext): MockValidationIssue[] {
  const issues: MockValidationIssue[] = [];
  const err = (path: string, message: string): void => {
    issues.push({ path, message, severity: "error" });
  };
  if (!isRecord(input)) {
    err("(root)", "El mock debe ser un objeto con id, title, cert_id y questions.");
    return issues;
  }
  for (const f of ["id", "title"] as const) {
    if (!isNonEmptyString(input[f])) err(f, `"${f}" debe ser un string no vacío.`);
  }
  if (!isNonEmptyString(input["cert_id"])) {
    err("cert_id", `"cert_id" debe ser un string no vacío.`);
  } else if (!ctx.certIds.includes(input["cert_id"] as string)) {
    err("cert_id", `"cert_id" "${input["cert_id"]}" no existe en el catálogo.`);
  }
  const tm = input["time_minutes"];
  if (typeof tm !== "number" || !Number.isInteger(tm) || tm <= 0) {
    err("time_minutes", `"time_minutes" debe ser un entero positivo.`);
  }
  const pp = input["passing_percent"];
  if (pp !== undefined && (typeof pp !== "number" || pp <= 0 || pp > 100)) {
    err("passing_percent", `"passing_percent" debe estar entre 1 y 100 si está presente.`);
  }
  const qs = input["questions"];
  if (!Array.isArray(qs) || qs.length === 0) {
    err("questions", `"questions" debe ser un array no vacío de referencias {bank, id}.`);
    return issues;
  }
  const seen = new Set<string>();
  qs.forEach((r, i) => {
    const base = `questions[${i}]`;
    if (!isRecord(r) || !isNonEmptyString(r["bank"]) || !isNonEmptyString(r["id"])) {
      err(base, `"${base}" debe ser {bank, id} con strings no vacíos.`);
      return;
    }
    const key = `${r["bank"]}:${r["id"]}`;
    if (!ctx.questionKeys.has(key)) {
      err(base, `Referencia inexistente en question banks: "${key}".`);
    } else if (seen.has(key)) {
      err(base, `Referencia duplicada dentro del mock: "${key}".`);
    } else {
      seen.add(key);
    }
  });
  return issues;
}
