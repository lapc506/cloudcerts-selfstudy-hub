// Unit tests de foco de estudio y chuleta (lógica pura).
import { describe, expect, test } from "vitest";
import type { Certification } from "./entities";
import {
  collectDomainFocus,
  compileCheatsheet,
  firstIncompleteWeek,
  parseWeightPercent,
} from "./studyFocus";
import { studyItemId } from "./progress";

function cert(): Certification {
  return {
    id: "c",
    provider: "P",
    providerColor: "#000",
    title: "T",
    code: "C",
    cost: "$0",
    defaultPriority: 3,
    popularity: 3,
    summary: "S",
    weeks: [
      {
        week: 1,
        title: "W1",
        points: [],
        sections: [
          { domain: "A", weight: "30%", points: ["a1", "a2"] },
          { domain: "B", weight: "10%", points: ["b1"] },
        ],
      },
      { week: 2, title: "W2", points: ["p1"], sections: [] },
    ],
  } as unknown as Certification;
}

describe("parseWeightPercent", () => {
  test("extrae número o 0", () => {
    expect(parseWeightPercent("24%")).toBe(24);
    expect(parseWeightPercent(undefined)).toBe(0);
    expect(parseWeightPercent("n/a")).toBe(0);
  });
});

describe("collectDomainFocus", () => {
  test("ordena por peso × pendiente y excluye completos", () => {
    const c = cert();
    const done = { [studyItemId("c", 1, 0, 0)]: true };
    const focus = collectDomainFocus("c", c, done);
    expect(focus.map((f) => f.domain)).toEqual(["A", "B", "Semana 2"]);
    expect(focus[0]).toMatchObject({ weight: 30, total: 2, remaining: 1 });
  });
});

describe("firstIncompleteWeek", () => {
  test("primera semana con pendientes o null", () => {
    const c = cert();
    expect(firstIncompleteWeek("c", c, {})).toBe(1);
    const all = {
      [studyItemId("c", 1, 0, 0)]: true,
      [studyItemId("c", 1, 0, 1)]: true,
      [studyItemId("c", 1, 1, 0)]: true,
      [studyItemId("c", 2, -1, 0)]: true,
    };
    expect(firstIncompleteWeek("c", c, all)).toBeNull();
  });
});

describe("compileCheatsheet", () => {
  test("agrupa puntos por dominio con peso máximo", () => {
    const groups = compileCheatsheet(cert());
    expect(groups.map((g) => g.domain)).toEqual(["A", "B", "Semana 2"]);
    expect(groups[0]).toMatchObject({ weight: 30, points: ["a1", "a2"] });
  });
});
