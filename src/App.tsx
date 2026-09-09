import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Alert, Box, CircularProgress, Fab, Snackbar } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Timer } from "lucide-react";
import Ribbon from "./presentation/components/Ribbon";
import Sidebar, { type SidebarGroupBy } from "./presentation/components/Sidebar";
import SidebarResizer, {
  SIDEBAR_MAX,
  SIDEBAR_MIN,
} from "./presentation/molecules/SidebarResizer";
import { APP_ZOOM } from "./presentation/quarks";
import PlanView from "./presentation/components/PlanView";
import CertificationFormDialog from "./presentation/components/CertificationFormDialog";
import PomodoroDialog from "./presentation/components/PomodoroDialog";
import type { StudyGuideHandle } from "./presentation/components/StudyGuide";
import type { YAMLGuideEditorHandle } from "./presentation/components/YAMLGuideEditor";
import ThemePicker from "./presentation/components/ThemePicker";
import { certificationRepository } from "./infrastructure/yamlCertificationRepository";
import { mockExamRepository, resolveMockQuestions } from "./infrastructure/mockExamRepository";
import { EXAMTOPICS_PRACTICE } from "./infrastructure/examTopics";
import { localStoragePlanStore } from "./infrastructure/localStoragePlanStore";
import { sqliteProgressStore } from "./infrastructure/sqliteProgressStore";
import { useCertificationState } from "./application/useCertificationState";
import { useStudyProgress } from "./application/useStudyProgress";
import type { View } from "./domain";

// Code-splitting por vista (todo lazy menos Home): reduce el parse inicial.
// Composition root: cablea adaptadores (infrastructure) con casos de uso
// (application) y UI (presentation). Es el único lugar que importa todas
// las capas.

const Dashboard = lazy(() => import("./presentation/components/Dashboard"));
const StudyGuide = lazy(() => import("./presentation/components/StudyGuide"));
const YAMLGuideEditor = lazy(() => import("./presentation/components/YAMLGuideEditor"));
const BadgesView = lazy(() => import("./presentation/components/BadgesView"));
const CodelabsView = lazy(() => import("./presentation/components/CodelabsView"));
const MocksView = lazy(() => import("./presentation/components/MocksView"));

export default function App() {
  const [view, setView] = useState<View>("home");
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pomoOpen, setPomoOpen] = useState(false);
  const [catalogTick, setCatalogTick] = useState(0);
  const [groupBy, setGroupBy] = useState<SidebarGroupBy>("entity");
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const v = parseInt(window.localStorage.getItem("cloudcerts_sidebar_width") ?? "", 10);
      if (Number.isFinite(v)) return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, v));
    } catch {
      // Sin almacenamiento disponible: ancho por defecto.
    }
    return 340;
  });

  const handleSidebarResize = (nextWidth: number) => {
    const clamped = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(nextWidth)));
    setSidebarWidth(clamped);
    try {
      window.localStorage.setItem("cloudcerts_sidebar_width", String(clamped));
    } catch {
      // Sin almacenamiento disponible: solo memoria.
    }
  };
  const [focus, setFocus] = useState<{ certId: string; week: number; n: number } | null>(
    null
  );
  const guideRef = useRef<StudyGuideHandle>(null);
  const editorRef = useRef<YAMLGuideEditorHandle>(null);

  // Releer el catálogo cuando el editor guarda (el repo muta en memoria).
  const catalog = useMemo(() => certificationRepository.list(), [catalogTick]);

  const {
    state,
    toggleInterest,
    changePriority,
    toggleGuideSelection,
    setSelectedGuides,
    flush: flushPlan,
  } = useCertificationState(localStoragePlanStore, catalog);

  const progress = useStudyProgress(sqliteProgressStore);

  const handleSavePlan = () => {
    flushPlan();
    progress.flush();
    setToastOpen(true);
  };

  const selectAll = () => {
    setSelectedGuides(catalog.map((c) => c.id));
    catalog.forEach((c) => toggleInterest(c.id, true));
  };
  const clearAll = () => {
    setSelectedGuides([]);
    catalog.forEach((c) => toggleInterest(c.id, false));
  };

  // Card y checkbox sincronizados: una sola noción de "en el plan".
  const handleToggleGuide = (id: string) => {
    const adding = !state.selectedGuides.includes(id);
    toggleGuideSelection(id);
    toggleInterest(id, adding);
  };
  const handleToggleInterest = (id: string, checked: boolean) => {
    toggleInterest(id, checked);
    setSelectedGuides(
      checked
        ? [...state.selectedGuides, id]
        : state.selectedGuides.filter((g) => g !== id)
    );
  };

  const openGuide = (id: string) => {
    if (!state.selectedGuides.includes(id)) {
      toggleGuideSelection(id);
    }
    setView("guides");
  };

  // Navegación desde el árbol del sidebar: abre la guía, expande la semana
  // destino (forceOpenSignal) y hace scroll a su ancla.
  const navigateToWeek = (certId: string, week: number) => {
    if (!state.selectedGuides.includes(certId)) {
      toggleGuideSelection(certId);
      toggleInterest(certId, true);
    }
    setView("guides");
    setFocus({ certId, week, n: Date.now() });
  };

  const handleSaveYaml = () => {
    if (editorRef.current?.save()) setCatalogTick((t) => t + 1);
  };

  // Alta desde el FAB (+): persiste el YAML y suma la guía al catálogo
  // como interesada pero NO seleccionada.
  const handleSavedCert = (id: string) => {
    setCatalogTick((t) => t + 1);
    toggleInterest(id, true);
    setToastOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
        // Escala global 80% (quarks APP_ZOOM): fuentes y layout proporcionales.
        zoom: APP_ZOOM,
      }}
    >
      <Box className="print-hide" sx={{ display: "contents" }}>
      <Ribbon
        view={view}
        onViewChange={setView}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onSelectAll={selectAll}
        onClearAll={clearAll}
        onOpenTheme={() => setThemePickerOpen(true)}
        onCopyResponse={() => void guideRef.current?.copyResponse()}
        onSaveYaml={handleSaveYaml}
        onSavePlan={handleSavePlan}
        canCopy={state.selectedGuides.length > 0}
      />
      </Box>

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Box className="print-hide" sx={{ display: "contents" }}>
        <Sidebar
          state={state}
          catalog={catalog}
          groupBy={groupBy}
          width={sidebarWidth}
          onToggleInterest={handleToggleInterest}
          onToggleGuide={handleToggleGuide}
          onNavigateWeek={navigateToWeek}
        />
        </Box>
        <Box className="print-hide" sx={{ display: "contents" }}>
        <SidebarResizer width={sidebarWidth} onResize={handleSidebarResize} />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "background.default",
            p: { xs: 2, md: 4 },
          }}
        >
          {view === "home" && (
            <PlanView
              state={state}
              catalog={catalog}
              done={progress.done}
              onOpenGuide={openGuide}
              onChangePriority={changePriority}
            />
          )}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            }
          >
          {view === "progress" && (
            <Dashboard state={state} catalog={catalog} done={progress.done} />
          )}
          {view === "guides" && (
            <StudyGuide
              ref={guideRef}
              state={state}
              catalog={catalog}
              focus={focus}
              done={progress.done}
              onTogglePoint={progress.toggle}
            />
          )}
          {view === "editor" && (
            <YAMLGuideEditor
              ref={editorRef}
              repository={certificationRepository}
              mockRepository={mockExamRepository}
            />
          )}
          {view === "badges" && <BadgesView state={state} catalog={catalog} />}
          {view === "codelabs" && <CodelabsView />}
          {view === "mocks" && (
            <MocksView
              mocks={mockExamRepository.listMocks()}
              banks={mockExamRepository.listBanks()}
              resolveQuestions={resolveMockQuestions}
              practice={catalog
                .map((c) => EXAMTOPICS_PRACTICE.find((p) => p.code === c.code))
                .filter((p): p is (typeof EXAMTOPICS_PRACTICE)[number] => !!p)}
            />
          )}
          </Suspense>
        </Box>
      </Box>

      <ThemePicker open={themePickerOpen} onClose={() => setThemePickerOpen(false)} />

      <Box
        className="print-hide"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          zIndex: 1200,
        }}
      >
        <Fab
          color="default"
          title="Pomodoro"
          onClick={() => setPomoOpen(true)}
          sx={{ bgcolor: "background.paper" }}
        >
          <Timer size={26} />
        </Fab>
        <Fab color="primary" title="Agregar certificación" onClick={() => setAddDialogOpen(true)}>
          <Add />
        </Fab>
      </Box>

      <CertificationFormDialog
        open={addDialogOpen}
        catalog={catalog}
        onClose={() => setAddDialogOpen(false)}
        onSaveYamlText={(yaml) => certificationRepository.saveYaml(yaml)}
        onSaved={handleSavedCert}
      />

      <PomodoroDialog open={pomoOpen} onClose={() => setPomoOpen(false)} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          Successfully saved changes!
        </Alert>
      </Snackbar>
    </Box>
  );
}
