// Unit tests de Prioridad 1–5 y Popularidad (lógica pura).
import { describe, expect, test } from "vitest";
import {
  parsePopularity,
  parsePriority,
  popularityFlames,
  priorityCaps,
} from "./priority";

describe("parsePriority", () => {
  test("migra el formato legado High|Medium|Low", () => {
    expect(parsePriority("High")).toBe(5);
    expect(parsePriority("Medium")).toBe(3);
    expect(parsePriority("Low")).toBe(1);
  });

  test("clampa números fuera de rango y redondea", () => {
    expect(parsePriority(99)).toBe(5);
    expect(parsePriority(-2)).toBe(1);
    expect(parsePriority(2.6)).toBe(3);
  });

  test("valor por defecto ante entrada desconocida", () => {
    expect(parsePriority(undefined)).toBe(3);
    expect(parsePriority("urgent")).toBe(3);
  });
});

describe("priorityCaps / popularityFlames", () => {
  test("repite el glifo n veces", () => {
    expect(priorityCaps(4)).toBe("🎓🎓🎓🎓");
    expect(popularityFlames(5)).toBe("🔥🔥🔥🔥🔥");
    expect(parsePopularity("x")).toBe(3);
  });
});
