// Tests del directorio de proyectos de portafolio (lee el YAML real).
import { describe, expect, test } from "vitest";
import { loadPortfolioDirectory, portfolioFor } from "./projectsRepository";

describe("loadPortfolioDirectory", () => {
  test("YAML válido sin issues y con los 7 certs de seguridad", () => {
    const { certs, issues } = loadPortfolioDirectory();
    expect(issues).toEqual([]);
    for (const id of ["sec-plus", "cysa-plus", "pentest-plus", "securityx", "cissp", "ccsp", "ceh"]) {
      expect(Object.keys(certs)).toContain(id);
    }
  });

  test("todas las URLs son https con labels no vacíos", () => {
    const { certs } = loadPortfolioDirectory();
    for (const entry of Object.values(certs)) {
      for (const p of entry.projects) {
        expect(p.url).toMatch(/^https:\/\//);
        expect(p.name.trim().length).toBeGreaterThan(0);
        expect(p.tier.trim().length).toBeGreaterThan(0);
      }
      for (const r of entry.roadmaps) {
        expect(r.url).toMatch(/^https:\/\//);
        expect(r.label.trim().length).toBeGreaterThan(0);
      }
      expect(entry.projects.length + entry.roadmaps.length).toBeGreaterThan(0);
    }
  });

  test("cert sin curaduría retorna vacío", () => {
    expect(portfolioFor("aws-clf")).toEqual({ projects: [], roadmaps: [] });
  });
});
