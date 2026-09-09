import { useState, type ReactNode } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  GridView,
  ListAlt,
  Code,
  SelectAll,
  ClearAll,
  ContentCopy,
  Save,
  Palette,
  ExpandLess,
  ExpandMore,
  Domain,
  School,
  SignalCellularAlt,
  TrendingUp,
  WorkspacePremium,
  Science,
  OpenInNew,
  Quiz,
  Work,
} from "@mui/icons-material";
import type { View } from "../../domain";
import type { SidebarGroupBy } from "./Sidebar";
import RibbonGroup, { type RibbonGroupSpec } from "../molecules/RibbonGroup";
import { SKILLS_BOOST_URL } from "./CodelabsView";
import { MOCK_EXAM_URL } from "./MocksView";
import { PORTFOLIO_URL } from "./PortfolioView";
import { ribbon } from "../quarks";

// ── Ribbon — tab bar + tool area, siguiendo la anatomía de
// OpenCADStudio/src/ui/ribbon (mod.rs + widgets.rs + collapse.rs):
//   · Tab bar con tabs de texto (activo subrayado con el color de acento).
//   · Tool area de ~96px: paneles horizontales con fila de herramientas
//     arriba y título de grupo abajo; botones grandes = icono + etiqueta.
//   · Colapso total a simple menu bar (solo tabs) con el botón del extremo
//     derecho, como el colapso del ribbon de AutoCAD.

interface RibbonProps {
  view: View;
  onViewChange: (v: View) => void;
  groupBy: SidebarGroupBy;
  onGroupByChange: (g: SidebarGroupBy) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onOpenTheme: () => void;
  onCopyResponse: () => void;
  onSaveYaml: () => void;
  onSavePlan: () => void;
  canCopy: boolean;
}

const TABS: { value: View; label: string; icon: ReactNode }[] = [
  { value: "home", label: "Home", icon: <GridView sx={{ fontSize: 16 }} /> },
  { value: "progress", label: "Progreso", icon: <TrendingUp sx={{ fontSize: 16 }} /> },
  { value: "guides", label: "Guías", icon: <ListAlt sx={{ fontSize: 16 }} /> },
  { value: "editor", label: "Editor YAML", icon: <Code sx={{ fontSize: 16 }} /> },
  { value: "badges", label: "Badges", icon: <WorkspacePremium sx={{ fontSize: 16 }} /> },
  { value: "codelabs", label: "Codelabs", icon: <Science sx={{ fontSize: 16 }} /> },
  { value: "mocks", label: "Mocks", icon: <Quiz sx={{ fontSize: 16 }} /> },
  { value: "portfolio", label: "Portafolio", icon: <Work sx={{ fontSize: 16 }} /> },
];

export default function Ribbon({
  view,
  onViewChange,
  groupBy,
  onGroupByChange,
  onSelectAll,
  onClearAll,
  onOpenTheme,
  onCopyResponse,
  onSaveYaml,
  onSavePlan,
  canCopy,
}: RibbonProps) {
  const [collapsed, setCollapsed] = useState(false);

  const selectionGroup: RibbonGroupSpec = {
    title: "Selección",
    commands: [
      {
        label: "Seleccionar todas",
        icon: <SelectAll sx={{ fontSize: ribbon.largeIcon }} />,
        tip: "Seleccionar todas las certificaciones",
        onClick: onSelectAll,
      },
      {
        label: "Limpiar",
        icon: <ClearAll sx={{ fontSize: ribbon.largeIcon }} />,
        tip: "Limpiar la selección de guías",
        onClick: onClearAll,
      },
    ],
  };

  const clipboardGroup: RibbonGroupSpec = {
    title: "Portapapeles",
    commands: [
      {
        label: "Copiar respuesta",
        icon: <ContentCopy sx={{ fontSize: ribbon.largeIcon }} />,
        tip: "Copiar respuesta para formulario",
        onClick: onCopyResponse,
        disabled: !canCopy,
      },
    ],
  };

  const planGroup: RibbonGroupSpec = {
    title: "Plan",
    commands: [
      {
        label: "Guardar cambios",
        icon: <Save sx={{ fontSize: ribbon.largeIcon }} />,
        tip: "Guardar cambios en el plan de estudios",
        onClick: onSavePlan,
      },
    ],
  };

  const groups: RibbonGroupSpec[] =
    view === "home"
      ? [
          selectionGroup,
          {
            title: "Agrupar",
            commands: [
              {
                label: "Entidad",
                icon: <Domain sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Agrupar el sidebar por entidad acreditadora",
                onClick: () => onGroupByChange("entity"),
                active: groupBy === "entity",
              },
              {
                label: "Prioridad",
                icon: <School sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Agrupar el sidebar por 🎓 de prioridad",
                onClick: () => onGroupByChange("priority"),
                active: groupBy === "priority",
              },
              {
                label: "Dificultad",
                icon: <SignalCellularAlt sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Agrupar el sidebar por nivel (100 / 200 / 300)",
                onClick: () => onGroupByChange("difficulty"),
                active: groupBy === "difficulty",
              },
            ],
          },
          planGroup,
        ]
      : view === "progress" || view === "guides" || view === "badges"
      ? [clipboardGroup, selectionGroup]
      : view === "codelabs"
      ? [
          {
            title: "Recursos",
            commands: [
              {
                label: "Abrir Skills Boost",
                icon: <OpenInNew sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Abrir el course template 878 en Google Cloud Skills Boost",
                onClick: () => window.open(SKILLS_BOOST_URL, "_blank", "noopener"),
              },
            ],
          },
        ]
      : view === "mocks"
      ? [
          {
            title: "Simulacros",
            commands: [
              {
                label: "Mock Exam CCDV-F",
                icon: <Quiz sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Abrir el simulacro CCDV-F",
                onClick: () => window.open(MOCK_EXAM_URL, "_blank", "noopener"),
              },
            ],
          },
        ]
      : view === "portfolio"
      ? [
          {
            title: "Portafolio",
            commands: [
              {
                label: "Abrir Cybersecurity-Projects",
                icon: <OpenInNew sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Abrir el repo de 70 proyectos y 10 roadmaps",
                onClick: () => window.open(PORTFOLIO_URL, "_blank", "noopener"),
              },
            ],
          },
        ]
      : [
          {
            title: "Archivo",
            commands: [
              {
                label: "Guardar",
                icon: <Save sx={{ fontSize: ribbon.largeIcon }} />,
                tip: "Guardar la guía YAML en memoria",
                onClick: onSaveYaml,
              },
            ],
          },
        ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* ── Tab bar ── */}
      <Box sx={{ display: "flex", alignItems: "stretch", pl: 0.5, pr: 0.5 }}>
        {TABS.map((t) => {
          const active = t.value === view;
          return (
            <Box
              key={t.value}
              onClick={() => onViewChange(t.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                cursor: "pointer",
                textTransform: "uppercase",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                letterSpacing: "0.04em",
                color: active ? "primary.main" : "text.secondary",
                boxShadow: active ? "inset 0 -2px 0 currentColor" : "none",
                "&:hover": { bgcolor: "action.hover", color: "text.primary" },
              }}
            >
              {t.icon}
              {t.label}
            </Box>
          );
        })}
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Personalizar tema">
          <IconButton size="small" onClick={onOpenTheme} sx={{ alignSelf: "center" }}>
            <Palette sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={collapsed ? "Expandir la cinta" : "Contraer la cinta"}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((c) => !c)}
            sx={{ alignSelf: "center" }}
          >
            {collapsed ? (
              <ExpandMore sx={{ fontSize: 18 }} />
            ) : (
              <ExpandLess sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Tool area (paneles por tab activa) ── */}
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            px: 1,
            py: 0.5,
            minHeight: ribbon.toolAreaMinHeight,
            borderTop: "1px solid",
            borderColor: "divider",
            overflowX: "auto",
          }}
        >
          {groups.map((g, i) => (
            <RibbonGroup key={g.title} spec={g} last={i === groups.length - 1} />
          ))}
        </Box>
      )}
    </Box>
  );
}
