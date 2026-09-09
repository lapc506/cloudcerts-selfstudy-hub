import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Scheme,
} from "@material/material-color-utilities";
import { createTheme, type Theme } from "@mui/material/styles";
import {
  DEFAULT_THEME_SETTINGS as DOMAIN_DEFAULTS,
  type ThemeSettings as DomainThemeSettings,
} from "../domain";

export type ThemeMode = "dark" | "light";
export type FontKey =
  | "ibm-plex-mono"
  | "ubuntu-mono"
  | "fira-code"
  | "jetbrains-mono"
  | "plus-jakarta-sans";

export interface ThemeSettings {
  mode: ThemeMode;
  seed: string;
  font: FontKey;
}

export interface FontOption {
  key: FontKey;
  label: string;
  stack: string;
}

/** Fuentes disponibles (se cargan offline vía @fontsource). */
export const FONT_OPTIONS: FontOption[] = [
  { key: "ibm-plex-mono", label: "IBM Plex Mono", stack: "'IBM Plex Mono', monospace" },
  { key: "ubuntu-mono", label: "Ubuntu Mono", stack: "'Ubuntu Mono', monospace" },
  { key: "fira-code", label: "Fira Code", stack: "'Fira Code', monospace" },
  { key: "jetbrains-mono", label: "JetBrains Mono", stack: "'JetBrains Mono', monospace" },
  { key: "plus-jakarta-sans", label: "Plus Jakarta Sans", stack: "'Plus Jakarta Sans', sans-serif" },
];

export function fontStack(key: FontKey): string {
  return FONT_OPTIONS.find((f) => f.key === key)?.stack ?? FONT_OPTIONS[0].stack;
}

/** Semillas de color (estilo Material Theme Builder). */
export const SEED_COLORS = [
  "#38bdf8",
  "#6750a4",
  "#006b5f",
  "#005ac1",
  "#7c4dff",
  "#ffb300",
  "#f4511e",
  "#c2185b",
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: DOMAIN_DEFAULTS.mode,
  seed: DOMAIN_DEFAULTS.seed,
  font: DOMAIN_DEFAULTS.font as FontKey,
};
export type { DomainThemeSettings };

// ── Lazy loading de familias de fuentes ──────────────────────────────
// main.tsx importa estáticamente solo la familia por defecto
// (ibm-plex-mono). Las demás se cargan bajo demanda al elegirlas.
const loadedFonts = new Set<FontKey>(["ibm-plex-mono"]);

const FONT_LOADERS: Record<FontKey, () => Promise<unknown>> = {
  "ibm-plex-mono": () => Promise.resolve(),
  "ubuntu-mono": () =>
    Promise.all([
      import("@fontsource/ubuntu-mono/400.css"),
      import("@fontsource/ubuntu-mono/700.css"),
    ]),
  "fira-code": () =>
    Promise.all([
      import("@fontsource/fira-code/400.css"),
      import("@fontsource/fira-code/500.css"),
      import("@fontsource/fira-code/600.css"),
      import("@fontsource/fira-code/700.css"),
    ]),
  "jetbrains-mono": () =>
    Promise.all([
      import("@fontsource/jetbrains-mono/400.css"),
      import("@fontsource/jetbrains-mono/500.css"),
      import("@fontsource/jetbrains-mono/600.css"),
      import("@fontsource/jetbrains-mono/700.css"),
    ]),
  "plus-jakarta-sans": () =>
    Promise.all([
      import("@fontsource/plus-jakarta-sans/300.css"),
      import("@fontsource/plus-jakarta-sans/400.css"),
      import("@fontsource/plus-jakarta-sans/500.css"),
      import("@fontsource/plus-jakarta-sans/600.css"),
      import("@fontsource/plus-jakarta-sans/700.css"),
      import("@fontsource/plus-jakarta-sans/800.css"),
    ]),
};

export function ensureFontFamily(key: FontKey): Promise<void> {
  if (loadedFonts.has(key)) return Promise.resolve();
  return FONT_LOADERS[key]().then(() => {
    loadedFonts.add(key);
  });
}

const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];

/** Paleta tonal M3 generada a partir de un color semilla. */
export function tonalPalette(seed: string, count = 12): string[] {
  try {
    const t = themeFromSourceColor(argbFromHex(seed));
    return TONES.slice(0, count).map((n) => hexFromArgb(t.palettes.primary.tone(n)));
  } catch {
    return Array.from({ length: count }, () => seed);
  }
}

function m3Scheme(mode: ThemeMode, seed: string): Scheme | null {
  try {
    const t = themeFromSourceColor(argbFromHex(seed));
    return mode === "dark" ? t.schemes.dark : t.schemes.light;
  } catch {
    return null;
  }
}

function m3PrimaryTone(seed: string, tone: number): string {
  try {
    const t = themeFromSourceColor(argbFromHex(seed));
    return hexFromArgb(t.palettes.primary.tone(tone));
  } catch {
    return seed;
  }
}

export function buildTheme(settings: ThemeSettings): Theme {
  const scheme = m3Scheme(settings.mode, settings.seed);

  return createTheme({
    palette: {
      mode: settings.mode,
      primary: {
        main: scheme ? hexFromArgb(scheme.primary) : "#38bdf8",
        light: m3PrimaryTone(settings.seed, 75),
        dark: m3PrimaryTone(settings.seed, 30),
        contrastText: scheme ? hexFromArgb(scheme.onPrimary) : "#0f172a",
      },
      secondary: {
        main: scheme ? hexFromArgb(scheme.secondary) : "#818cf8",
        light: m3PrimaryTone(settings.seed, 75),
        dark: m3PrimaryTone(settings.seed, 30),
        contrastText: scheme ? hexFromArgb(scheme.onSecondary) : "#0f172a",
      },
      error: {
        main: scheme ? hexFromArgb(scheme.error) : "#ef4444",
        contrastText: scheme ? hexFromArgb(scheme.onError) : "#ffffff",
      },
      background: {
        default: scheme ? hexFromArgb(scheme.background) : "#0b0f19",
        paper: scheme ? hexFromArgb(scheme.surface) : "#1e293b",
      },
      text: {
        primary: scheme ? hexFromArgb(scheme.onSurface) : "#f8fafc",
        secondary: scheme ? hexFromArgb(scheme.onSurfaceVariant) : "#94a3b8",
      },
      divider: scheme ? hexFromArgb(scheme.outlineVariant) : "#334155",
    },
    typography: {
      fontFamily: fontStack(settings.font),
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 700 },
        },
      },
    },
  });
}