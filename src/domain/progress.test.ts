// Unit tests de identidad y conteo de progreso (lógica pura).
import { describe, expect, test } from "vitest";
import {
  collectWeekItemIds,
  countDone,
  studyItemId,
} from "./progress";
import type { Week } from "./entities";

describe("studyItemId", () => {
  test("formato estable cert/semana/sección/punto", () => {
    expect(studyItemId("soa-c02", 1, 0, 2)).toBe("soa-c02/w1/s0/p2");
  });
});

describe("collectWeekItemIds", () => {
  test("semana plana usa sección -1", () => {
    const week = { week: 1, points: ["a", "b"] } as unknown as Week;
    expect(collectWeekItemIds("c", week)).toEqual(["c/w1/s-1/p0", "c/w1/s-1/p1"]);
  });

  test("semana con secciones recorre cada punto", () => {
    const week = {
      week: 2,
      sections: [{ points: ["a"] }, { points: ["b", "c"] }],
    } as unknown as Week;
    expect(collectWeekItemIds("c", week)).toEqual([
      "c/w2/s0/p0",
      "c/w2/s1/p0",
      "c/w2/s1/p1",
    ]);
  });
});

describe("countDone", () => {
  test("cuenta solo los marcados true", () => {
    expect(countDone(["a", "b", "c"], { a: true, b: false })).toBe(1);
  });
});
