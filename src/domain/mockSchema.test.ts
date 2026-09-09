// Unit tests del validador de banks/mocks (lógica pura, sin Tauri).
import { describe, expect, test } from "vitest";
import { validateBank, validateMock } from "./mockSchema";

function choice(text: string, justification = "Justificación de ejemplo.") {
  return {
    text,
    justification,
    sources: [
      {
        url: "https://docs.aws.amazon.com/soa/latest/guide/welcome.html",
        date_last_fetched: "2026-09-08",
      },
    ],
  };
}

function validBank() {
  return {
    id: "bank-01",
    cert_id: "soa-c02",
    title: "Banco de ejemplo",
    fair_use: {
      work: "Preguntas originales del repo",
      purpose: "Autoestudio personal",
      verdict: "likely-fair",
      assessed_at: "2026-09-08",
      factors: [1, 2, 3, 4].map((n) => ({
        factor: `Factor ${n}`,
        favoring: ["uso transformativo"],
        opposing: [],
      })),
    },
    questions: [
      {
        id: "q1",
        text: "¿Pregunta de ejemplo?",
        choices: [choice("A"), choice("B")],
        answer: [0],
        explanation: "Explicación de dos oraciones. Segunda oración.",
      },
    ],
  };
}

describe("validateBank", () => {
  test("banco válido no reporta issues", () => {
    expect(validateBank(validBank())).toEqual([]);
  });

  test("exige justificación por respuesta", () => {
    const bank = validBank();
    bank.questions[0].choices[0] = { text: "A" } as never;
    const issues = validateBank(bank);
    expect(
      issues.some(
        (i) =>
          i.severity === "error" &&
          i.path === "questions[0].choices[0].justification"
      )
    ).toBe(true);
  });

  test("avisa (warning) si falta sources en una opción", () => {
    const bank = validBank();
    delete (bank.questions[0].choices[0] as { sources?: unknown }).sources;
    const issues = validateBank(bank);
    expect(
      issues.some(
        (i) =>
          i.severity === "warning" &&
          i.path === "questions[0].choices[0].sources"
      )
    ).toBe(true);
  });

  test("rechaza URL no-https y fecha no-ISO en sources", () => {
    const bank = validBank();
    bank.questions[0].choices[0] = {
      ...choice("A"),
      sources: [{ url: "http://inseguro.test/doc", date_last_fetched: "ayer" }],
    };
    const paths = validateBank(bank).map((i) => i.path);
    expect(paths).toContain("questions[0].choices[0].sources[0].url");
    expect(paths).toContain(
      "questions[0].choices[0].sources[0].date_last_fetched"
    );
  });

  test("detecta ids de pregunta duplicados y verdict inválido", () => {
    const bank = validBank();
    bank.questions.push({ ...bank.questions[0] });
    bank.fair_use.verdict = "maybe";
    const issues = validateBank(bank);
    expect(issues.some((i) => i.path === "questions[1].id")).toBe(true);
    expect(issues.some((i) => i.path === "fair_use.verdict")).toBe(true);
  });
});

describe("validateMock", () => {
  const ctx = { certIds: ["soa-c02"], questionKeys: new Set(["bank-01:q1"]) };
  const validMock = () => ({
    id: "mock-01",
    title: "Mock de ejemplo",
    cert_id: "soa-c02",
    time_minutes: 60,
    passing_percent: 72,
    questions: [{ bank: "bank-01", id: "q1" }],
  });

  test("mock válido no reporta issues", () => {
    expect(validateMock(validMock(), ctx)).toEqual([]);
  });

  test("rechaza cert_id desconocido, refs inexistentes y passing fuera de rango", () => {
    const bad = {
      ...validMock(),
      cert_id: "xxx",
      passing_percent: 101,
      questions: [
        { bank: "bank-01", id: "q1" },
        { bank: "bank-01", id: "q1" },
        { bank: "nope", id: "q9" },
      ],
    };
    const paths = validateMock(bad, ctx).map((i) => i.path);
    expect(paths).toContain("cert_id");
    expect(paths).toContain("passing_percent");
    expect(paths).toContain("questions[1]");
    expect(paths).toContain("questions[2]");
  });
});
