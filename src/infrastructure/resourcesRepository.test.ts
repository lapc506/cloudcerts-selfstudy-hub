// Tests del directorio curado de recursos (lee el YAML real).
import { describe, expect, test } from "vitest";
import { loadResourceDirectory, resourcesFor } from "./resourcesRepository";

describe("loadResourceDirectory", () => {
  test("YAML válido sin issues", () => {
    const { directory, issues } = loadResourceDirectory();
    expect(issues).toEqual([]);
    expect(directory.version).toBe(1);
    expect(Object.keys(directory.providers).length).toBeGreaterThanOrEqual(4);
  });

  test("todas las URLs son https con labels no vacíos", () => {
    const { directory } = loadResourceDirectory();
    for (const [provider, groups] of Object.entries(directory.providers)) {
      for (const links of [groups.cheatsheets, groups.labs, groups.guides]) {
        for (const l of links) {
          expect(l.url).toMatch(/^https:\/\//);
          expect(l.label.trim().length).toBeGreaterThan(0);
        }
      }
      expect(provider.trim().length).toBeGreaterThan(0);
    }
  });

  test("AWS trae cheat sheets, labs y guías comunidad", () => {
    const aws = resourcesFor("AWS");
    expect(aws.cheatsheets.length).toBeGreaterThanOrEqual(5);
    expect(aws.labs.length).toBeGreaterThanOrEqual(1);
    expect(aws.guides.length).toBe(5);
  });

  test("proveedor sin curaduría retorna grupos vacíos", () => {
    expect(resourcesFor("Inexistente")).toEqual({ cheatsheets: [], labs: [], guides: [] });
  });
});
