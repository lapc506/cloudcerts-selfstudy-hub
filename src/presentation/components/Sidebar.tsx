import { useMemo, useState, useEffect, Fragment } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AutoAwesome,
  CloudDone,
  CloudQueue,
  Cloud,
  FactCheck,
  Memory,
  Terminal,
  Psychology,
  Bolt,
  ChevronRight,
  ExpandMore,
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from "@mui/icons-material";
import type { Certification, Priority, UserState } from "../../domain";
import { parsePriority, priorityCaps } from "../../domain";
import PriorityRating from "../atoms/PriorityRating";
import { sidebarNavy } from "../quarks";

// ── Estilo Paperbase (mui/material-ui
// docs/src/pages/premium-themes/paperbase/Navigator.tsx):
// drawer navy, categorías con header, filas full-bleed con highlight.
// Adaptación: categorías = providers; cada fila lleva checkbox + rating.

const item = {
  py: 0,
  px: 3,
  color: sidebarNavy.rowText,
  "&:hover, &:focus": {
    bgcolor: sidebarNavy.rowHover,
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: "1px",
  px: 3,
};

const providerIcons: Record<string, typeof CloudDone> = {
  AWS: CloudDone,
  "Red Hat": Terminal,
  HashiCorp: CloudQueue,
  "Google Cloud": Psychology,
  "Microsoft Azure": Cloud,
  NVIDIA: Memory,
  ISTQB: FactCheck,
  Anthropic: AutoAwesome,
};

const DRAWER_WIDTH = 340;

export type SidebarGroupBy = "entity" | "priority" | "difficulty";

interface SidebarProps {
  state: UserState;
  catalog: Certification[];
  groupBy: SidebarGroupBy;
  width?: number;
  onToggleInterest: (id: string, checked: boolean) => void;
  onChangePriority: (id: string, val: Priority) => void;
  onToggleGuide: (id: string) => void;
  onNavigateWeek: (certId: string, week: number) => void;
}

function difficultyRank(level: string): number {
  const m = /^\s*(\d+)/.exec(level ?? "");
  return m ? parseInt(m[1], 10) : 9999;
}

export default function Sidebar({
  state,
  catalog,
  groupBy,
  width = DRAWER_WIDTH,
  onToggleInterest,
  onChangePriority,
  onToggleGuide,
  onNavigateWeek,
}: SidebarProps) {
  const theme = useTheme();
  // Orden de hyperscalers por market share (Synergy Research Group Q3 2025
  // vía Statista: AWS 29%, Azure 20%, Google Cloud 13%). El resto conserva
  // el orden del catálogo (sort estable).
  const PROVIDER_RANK: Record<string, number> = {
    AWS: 0,
    "Microsoft Azure": 1,
    "Google Cloud": 2,
  };
  const providers = [...new Set(catalog.map((c) => c.provider))].sort((a, b) => {
    const ra = PROVIDER_RANK[a] ?? Number.MAX_SAFE_INTEGER;
    const rb = PROVIDER_RANK[b] ?? Number.MAX_SAFE_INTEGER;
    return ra - rb;
  });

  // Árbol de navegación: guías expandidas y semanas (groups) expandidas.
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(
    () => new Set(state.selectedGuides)
  );
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(() => new Set());

  // Al entrar una guía al plan, expandir su árbol automáticamente.
  const selectedKey = state.selectedGuides.join(",");
  useEffect(() => {
    setExpandedGuides((prev) => {
      const next = new Set(prev);
      state.selectedGuides.forEach((id) => next.add(id));
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const toggleGuideTree = (id: string) =>
    setExpandedGuides((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleWeekTree = (key: string) =>
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // Secciones colapsables (chevrons en entidades / prioridades / dificultades).
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set());
  const toggleSection = (key: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // Agrupación del árbol según el control del ribbon (Home → Agrupar).
  const sections = useMemo(() => {
    if (groupBy === "priority") {
      return ([5, 4, 3, 2, 1] as const)
        .map((p) => ({
          key: `priority:${p}`,
          title: `${priorityCaps(p)} · Prioridad ${p}`,
          certs: catalog.filter((c) => parsePriority(state.priority[c.id]) === p),
        }))
        .filter((s) => s.certs.length > 0);
    }
    if (groupBy === "difficulty") {
      const byLevel = new Map<string, Certification[]>();
      catalog.forEach((c) => {
        const lv = c.meta?.level?.trim() ? c.meta.level : "Sin clasificar";
        if (!byLevel.has(lv)) byLevel.set(lv, []);
        byLevel.get(lv)!.push(c);
      });
      return [...byLevel.entries()]
        .sort((a, b) => difficultyRank(a[0]) - difficultyRank(b[0]))
        .map(([lv, certs]) => ({ key: `difficulty:${lv}`, title: `${lv} · ${certs.length}`, certs }));
    }
    return providers.map((provider) => {
      const certs = catalog.filter((c) => c.provider === provider);
      return { key: `entity:${provider}`, title: `${provider} · ${certs.length}`, certs };
    });
  }, [groupBy, catalog, state]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // El ribbon ocupa todo el ancho arriba: el papel del drawer debe
          // fluir en la fila inferior en vez de fixed (que taparía el ribbon).
          position: "static",
          height: "100%",
          width,
          boxSizing: "border-box",
          bgcolor: sidebarNavy.paper,
          borderRight: "none",
          borderColor: sidebarNavy.divider,
        },
      }}
    >
      <List disablePadding sx={{ flex: 1, overflow: "auto" }}>
        <ListItem sx={{ ...item, ...itemCategory, color: "#fff" }}>
          <Bolt sx={{ mr: 1, color: theme.palette.primary.light }} />
          <Typography variant="body2" sx={{ lineHeight: 1.35, fontWeight: 600 }}>
            Catálogo de certificaciones
          </Typography>
        </ListItem>

        {sections.map((s) => {
          const collapsed = collapsedSections.has(s.key);
          return (
            <Box key={s.key}>
              <ListItem
                onClick={() => toggleSection(s.key)}
                sx={{
                  py: "1px",
                  px: 3,
                  cursor: "pointer",
                  "&:hover": { bgcolor: sidebarNavy.rowHover },
                }}
              >
                <Box sx={{ display: "flex", mr: 0.5, color: sidebarNavy.mutedIcon }}>
                  {collapsed ? (
                    <ChevronRight fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </Box>
                <ListItemText
                  primary={s.title}
                  slotProps={{ primary: { sx: { color: "#fff", fontWeight: 600 } } }}
                />
              </ListItem>
              {!collapsed &&
                s.certs.map((cert) => {
                const Icon = providerIcons[cert.provider] ?? CloudQueue;
                const isSelected = state.selectedGuides.includes(cert.id);
                const guideOpen = expandedGuides.has(cert.id);
                return (
                  <Fragment key={cert.id}>
                  <ListItem disablePadding>
                    <Tooltip title={`${cert.title} (${cert.code})`} placement="right">
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => onToggleGuide(cert.id)}
                        sx={{
                          ...item,
                          "&.Mui-selected": {
                            bgcolor: sidebarNavy.rowSelected,
                            color: theme.palette.primary.light,
                            "&:hover": { bgcolor: sidebarNavy.rowSelectedHover },
                          },
                        }}
                      >
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGuideTree(cert.id);
                          }}
                          title={guideOpen ? "Contraer semanas" : "Expandir semanas"}
                          sx={{ display: "flex", mr: 0.25, color: "inherit" }}
                        >
                          {guideOpen ? (
                            <ExpandMore fontSize="small" />
                          ) : (
                            <ChevronRight fontSize="small" />
                          )}
                        </Box>
                        <Checkbox
                          size="small"
                          sx={{
                            p: 0.5,
                            color: sidebarNavy.mutedIcon,
                            "&.Mui-checked": { color: theme.palette.primary.light },
                          }}
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onToggleInterest(cert.id, e.target.checked)}
                        />
                        <ListItemIcon
                          sx={{ minWidth: 34, color: cert.providerColor }}
                        >
                          <Icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={cert.code}
                          secondary={cert.title}
                          slotProps={{
                            primary: {
                              variant: "body2",
                              sx: {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontWeight: 700,
                              },
                            },
                            secondary: {
                              variant: "caption",
                              sx: {
                                color: sidebarNavy.faintText,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            },
                          }}
                        />
                        <Box
                          onClick={(e) => e.stopPropagation()}
                          sx={{ display: "flex", alignItems: "center", ml: 0.5 }}
                        >
                          <PriorityRating
                            value={state.priority[cert.id]}
                            onChange={(v) => onChangePriority(cert.id, v)}
                          />
                        </Box>
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  {guideOpen && (
                    <List disablePadding>
                      {cert.weeks.map((w) => {
                        const weekKey = `${cert.id}:${w.week}`;
                        const weekOpen = expandedWeeks.has(weekKey);
                        const domains = w.sections ?? [];
                        return (
                          <Fragment key={weekKey}>
                            <ListItem disablePadding>
                              <Box
                                onClick={() => onNavigateWeek(cert.id, w.week)}
                                title={`Ir a la guía · Semana ${w.week}`}
                                sx={{
                                  ...item,
                                  pl: 5,
                                  pr: 2,
                                  py: "2px",
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.75,
                                  cursor: "pointer",
                                }}
                              >
                                {domains.length > 0 ? (
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWeekTree(weekKey);
                                    }}
                                    title={weekOpen ? "Contraer dominios" : "Expandir dominios"}
                                    sx={{
                                      display: "flex",
                                      color: sidebarNavy.mutedIcon,
                                    }}
                                  >
                                    {weekOpen ? (
                                      <IndeterminateCheckBoxOutlined fontSize="small" />
                                    ) : (
                                      <AddBoxOutlined fontSize="small" />
                                    )}
                                  </Box>
                                ) : (
                                  <Box sx={{ width: 20 }} />
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  S{w.week} · {w.title}
                                </Typography>
                              </Box>
                            </ListItem>
                            {weekOpen &&
                              domains.map((s, i) => (
                                <ListItem disablePadding key={`${weekKey}:${i}`}>
                                  <Box
                                    onClick={() => onNavigateWeek(cert.id, w.week)}
                                    title={`${s.domain}${s.weight ? ` · ${s.weight}` : ""}`}
                                    sx={{
                                      ...item,
                                      pl: 8,
                                      pr: 2,
                                      py: "2px",
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: sidebarNavy.faintText,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {s.domain}
                                      {s.weight ? ` · ${s.weight}` : ""}
                                    </Typography>
                                  </Box>
                                </ListItem>
                              ))}
                          </Fragment>
                        );
                      })}
                    </List>
                  )}
                  </Fragment>
                );
              })}
              <Divider sx={{ borderColor: sidebarNavy.divider }} />
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
}
