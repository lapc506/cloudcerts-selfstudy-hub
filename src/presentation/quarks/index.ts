// Quarks: tokens de diseño (skill atomic-design-quarks). Valores primitivos
// sin lógica, consumidos por átomos y moléculas. Nada de hex/raw en componentes.

export const sidebarNavy = {
  paper: "#101F33",
  rowText: "rgba(255, 255, 255, 0.7)",
  rowHover: "rgba(255, 255, 255, 0.08)",
  rowSelected: "rgba(255, 255, 255, 0.08)",
  rowSelectedHover: "rgba(255, 255, 255, 0.12)",
  faintText: "rgba(255,255,255,0.5)",
  mutedIcon: "rgba(255,255,255,0.6)",
  chipText: "rgba(255,255,255,0.85)",
  chipBorder: "rgba(255,255,255,0.25)",
  divider: "rgba(255,255,255,0.12)",
} as const;

export const ribbon = {
  toolAreaMinHeight: 104,
  largeIcon: 30,
  largeMinWidth: 68,
  largeMaxWidth: 96,
  buttonLabelSize: 11,
  groupTitleSize: 10,
} as const;

export const progressBar = {
  height: 8,
  radius: 5,
} as const;

/** Escala global de la app (80%): se aplica con `zoom` en la raíz. */
export const APP_ZOOM = 0.8;
