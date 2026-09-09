import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CssBaseline, ThemeProvider, Box, CircularProgress } from "@mui/material";
import {
  buildTheme,
  DEFAULT_THEME_SETTINGS,
  FONT_OPTIONS,
  type FontKey,
  type ThemeSettings,
} from "./theme";
import type { ISettingsStore } from "../domain";

// Capa presentation: host del tema. Recibe el store por props (inyección desde
// la composition root); solo conoce el puerto ISettingsStore del dominio.

interface ThemeSettingsContextValue {
  settings: ThemeSettings;
  update: (patch: Partial<ThemeSettings>) => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue>({
  settings: DEFAULT_THEME_SETTINGS,
  update: () => {},
});

export function useThemeSettings(): ThemeSettingsContextValue {
  return useContext(ThemeSettingsContext);
}

function coerceFont(font: string): FontKey {
  return FONT_OPTIONS.some((f) => f.key === font) ? (font as FontKey) : "ibm-plex-mono";
}

export default function AppThemeHost({
  children,
  store,
}: {
  children: ReactNode;
  store: ISettingsStore;
}) {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    let active = true;
    store.load().then((s) => {
      if (!active) return;
      setSettings({ mode: s.mode, seed: s.seed, font: coerceFont(s.font) });
    });
    return () => {
      active = false;
    };
  }, [store]);

  const update = useCallback(
    (patch: Partial<ThemeSettings>) => {
      setSettings((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        void store.save(next);
        return next;
      });
    },
    [store]
  );

  const theme = useMemo(
    () => (settings ? buildTheme(settings) : null),
    [settings]
  );

  if (!theme) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0f172a",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeSettingsContext.Provider value={{ settings: settings!, update }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
