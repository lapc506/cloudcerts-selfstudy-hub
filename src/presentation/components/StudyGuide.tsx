import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  List,
  Button,
  Alert,
  Paper,
  Divider,
  Link,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  ContentCopy,
  Book,
  Schedule,
  AttachMoney,
  HistoryEdu,
  EventAvailable,
  CardGiftcard,
  OpenInNew,
  Verified,
  AlarmOn,
  Category,
  Percent,
  MenuBook,
  Science,
  Forum,
} from "@mui/icons-material";
import type { Certification, UserState, Week, WeekSection } from "../../domain";
import {
  collectDomainFocus,
  compileCheatsheet,
  firstIncompleteWeek,
} from "../../domain/studyFocus";
import { resourcesFor } from "../../infrastructure/resourcesRepository";
import {
  buildFormResponse,
  BLOOM_LABELS,
  KIRKPATRICK_LABELS,
  collectCertItemIds,
  collectWeekItemIds,
  countDone,
  formatValidity,
  parsePriority,
  popularityFlames,
  priorityCaps,
  studyItemId,
} from "../../domain";

interface StudyGuideProps {
  state: UserState;
  catalog: Certification[];
  focus?: { certId: string; week: number; n: number } | null;
  done: Record<string, boolean>;
  onTogglePoint: (id: string) => void;
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

import StudyPointRow from "../molecules/StudyPointRow";
import { progressBar } from "../quarks";

function WeekSectionAccordions({
  certId,
  week,
  sections,
  done,
  onTogglePoint,
}: {
  certId: string;
  week: number;
  sections: WeekSection[];
  done: Record<string, boolean>;
  onTogglePoint: (itemId: string) => void;
}) {
  return (
    <Stack spacing={0.5}>
      {sections.map((s, i) => (
        <Accordion
          key={i}
          disableGutters
          defaultExpanded={i === 0}
          variant="outlined"
          slotProps={{ transition: { unmountOnExit: true } }}
          sx={{
            borderColor: "divider",
            "&.MuiAccordion-root:before": { display: "none" },
            bgcolor: "background.paper",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              minHeight: 0,
              "& .MuiAccordionSummary-content": { m: "6px 0" },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Category sx={{ width: 16, height: 16, color: "text.secondary" }} />
              <Typography variant="subtitle2">{s.domain}</Typography>
              {s.weight && (
                <Chip
                  size="small"
                  icon={<Percent sx={{ fontSize: 13 }} />}
                  label={s.weight}
                  variant="outlined"
                  color="primary"
                />
              )}
              {s.bloom && (
                <Tooltip title={BLOOM_LABELS[s.bloom]}>
                  <Chip size="small" variant="outlined" label={`B${s.bloom}`} />
                </Tooltip>
              )}
              {s.kirkpatrick && (
                <Tooltip title={KIRKPATRICK_LABELS[s.kirkpatrick]}>
                  <Chip size="small" variant="outlined" color="secondary" label={s.kirkpatrick} />
                </Tooltip>
              )}
              {s.points.length > 0 && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${s.points.filter((_, pi) => done[studyItemId(certId, week, i, pi)]).length}/${s.points.length}`}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ py: 0.5 }}>
            <List dense disablePadding>
              {s.points.map((p, j) => (
                <StudyPointRow
                  key={j}
                  id={studyItemId(certId, week, i, j)}
                  text={p}
                  done={done}
                  onTogglePoint={onTogglePoint}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}

function WeekAccordion({
  w,
  certId,
  anchorId,
  forceOpenSignal = 0,
  done,
  onTogglePoint,
}: {
  w: Week;
  certId: string;
  anchorId?: string;
  forceOpenSignal?: number;
  done: Record<string, boolean>;
  onTogglePoint: (itemId: string) => void;
}) {
  const hasSections = (w.sections?.length ?? 0) > 0;
  const [expanded, setExpanded] = useState(w.week === 1);
  const seenSignal = useRef(forceOpenSignal);
  useEffect(() => {
    if (forceOpenSignal && forceOpenSignal !== seenSignal.current) {
      seenSignal.current = forceOpenSignal;
      setExpanded(true);
    }
  }, [forceOpenSignal]);
  const weekIds = collectWeekItemIds(certId, w);
  const weekDone = countDone(weekIds, done);
  return (
    <Box id={anchorId} sx={{ mb: 1, scrollMarginTop: 150 }}>
    <Accordion
      key={w.week}
      expanded={expanded}
      onChange={(_, v) => setExpanded(v)}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{ mb: 0 }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontWeight: 700 }}>
            Semana {w.week}: {w.title}
          </Typography>
          {hasSections && (
            <Chip size="small" label={`${w.sections!.length} dominio${w.sections!.length > 1 ? "s" : ""}`} />
          )}
          {weekIds.length > 0 && (
            <Chip size="small" variant="outlined" color={weekDone === weekIds.length ? "success" : "default"} label={`${weekDone}/${weekIds.length}`} />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {hasSections ? (
          <WeekSectionAccordions
            certId={certId}
            week={w.week}
            sections={w.sections!}
            done={done}
            onTogglePoint={onTogglePoint}
          />
        ) : (
          <List dense disablePadding>
            {w.points.map((p, i) => (
              <StudyPointRow
                key={i}
                id={studyItemId(certId, w.week, -1, i)}
                text={p}
                done={done}
                onTogglePoint={onTogglePoint}
              />
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
    </Box>
  );
}

function CertificationMetaPanel({ cert }: { cert: Certification }) {
  const meta = cert.meta;
  if (!meta) return null;
  const res = resourcesFor(cert.provider);
  const resourceGroups = [
    { title: "Hojas de referencia", icon: <MenuBook sx={{ fontSize: 16 }} />, links: res.cheatsheets },
    { title: "Laboratorios", icon: <Science sx={{ fontSize: 16 }} />, links: res.labs },
    { title: "Guías de la comunidad", icon: <Forum sx={{ fontSize: 16 }} />, links: res.guides },
  ].filter((g) => g.links.length > 0);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderColor: "divider" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Chip
            size="small"
            color="info"
            icon={<HistoryEdu />}
            label={meta.examVersion}
          />
          <Chip
            size="small"
            variant="outlined"
            icon={<EventAvailable />}
            label={`Emisión guía: ${fmtDate(meta.guideDate)}`}
          />
          <Chip
            size="small"
            variant="outlined"
            color="warning"
            icon={<AlarmOn />}
            label={`Validez: ${formatValidity(meta.validityYears)}`}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {meta.format}
          {meta.passingScore ? ` · Aprobación: ${meta.passingScore}` : ""}
        </Typography>

        {meta.domains.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Dominios del examen
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {meta.domains.map((d) => (
                <Chip key={d} size="small" variant="outlined" label={d} />
              ))}
            </Stack>
          </Box>
        )}

        {meta.careerPaths.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Career path
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {meta.careerPaths.map((c) => (
                <Chip key={c} size="small" color="primary" variant="outlined" label={c} />
              ))}
            </Stack>
          </Box>
        )}

        {meta.versions.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Control de versiones del examen
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {meta.versions.map((v) => (
                  <Chip
                    key={v.code + v.note}
                    size="small"
                    variant={v.note?.toLowerCase().includes("vigente") ? "filled" : "outlined"}
                    color={v.note?.toLowerCase().includes("vigente") ? "success" : "default"}
                    label={`${v.code} — ${v.note}`}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}

        <Divider />
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Recertificación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {meta.recertWindow}
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {meta.recertOptions.map((o) => (
              <li key={o}>
                <Typography variant="body2" color="text.secondary">
                  {o}
                </Typography>
              </li>
            ))}
          </ul>
          {meta.recertDiscount && (
            <Alert
              severity="success"
              icon={<CardGiftcard />}
              sx={{ mt: 1.5, py: 0.5 }}
            >
              <Typography variant="body2">{meta.recertDiscount}</Typography>
            </Alert>
          )}
          {meta.guideSource && (
            <Link
              href={meta.guideSource}
              target="_blank"
              rel="noreferrer"
              underline="hover"
              sx={{ mt: 1.5, display: "inline-flex", alignItems: "center", gap: 0.5 }}
            >
              Ver guía oficial del examen <OpenInNew sx={{ fontSize: 14 }} />
            </Link>
          )}
          {meta.verifiedSources.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" gutterBottom>
                Fuentes verificadas (PDF oficial)
              </Typography>
              <Stack spacing={0.5}>
                {meta.verifiedSources.map((v) => (
                  <Stack key={v.url} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Verified sx={{ fontSize: 14 }} color="success" />
                    <Link
                      href={v.url}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                    >
                      {v.label} <OpenInNew sx={{ fontSize: 14 }} />
                    </Link>
                    {v.dateLastFetched && (
                      <Typography variant="caption" color="text.secondary">
                        · verificada el {fmtDate(v.dateLastFetched)}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
          {resourceGroups.length > 0 && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="subtitle2" gutterBottom>
                Recursos
              </Typography>
              {resourceGroups.map((g) => (
                <Box key={g.title} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: "center" }}>
                    {g.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {g.title}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    {g.links.map((l) => (
                      <Link
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                        variant="body2"
                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                      >
                        {l.label} <OpenInNew sx={{ fontSize: 14 }} />
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

function FocusPanel({
  certId,
  cert,
  done,
}: {
  certId: string;
  cert: Certification;
  done: Record<string, boolean>;
}) {
  const focus = collectDomainFocus(certId, cert, done);
  const nextWeek = firstIncompleteWeek(certId, cert, done);
  if (focus.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        Guía completada: todos los puntos marcados. 🎉
      </Alert>
    );
  }
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Foco sugerido
        </Typography>
        {nextWeek !== null && (
          <Chip size="small" color="primary" label={`Continúa en Semana ${nextWeek}`} />
        )}
      </Stack>
      <Stack spacing={1}>
        {focus.slice(0, 3).map((f) => (
          <Box key={f.domain}>
            <Typography variant="body2">
              {f.domain}{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                · {f.weight}% · {f.total - f.remaining}/{f.total}
              </Typography>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={f.total ? ((f.total - f.remaining) / f.total) * 100 : 0}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function CheatsheetPrint({ cert }: { cert: Certification }) {
  const [open, setOpen] = useState(false);
  const groups = compileCheatsheet(cert);
  return (
    <Box sx={{ mb: 2 }} className="cheatsheet-print">
      <Button size="small" variant="outlined" onClick={() => setOpen((v) => !v)} className="print-hide">
        {open ? "Ocultar chuleta" : "Ver chuleta imprimible"}
      </Button>
      {open && (
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 1, alignItems: "center", justifyContent: "space-between" }}
            className="print-hide"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Chuleta · {cert.code}
            </Typography>
            <Button size="small" onClick={() => window.print()}>
              Imprimir / PDF
            </Button>
          </Stack>
          {groups.map((g) => (
            <Box key={g.domain} sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2">
                {g.domain}
                {g.weight > 0 ? ` · ${g.weight}%` : ""}
              </Typography>
              <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                {g.points.map((p, i) => (
                  <li key={i}>
                    <Typography variant="body2">{p}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}

export interface StudyGuideHandle {
  copyResponse: () => Promise<void>;
}

const StudyGuide = forwardRef<StudyGuideHandle, StudyGuideProps>(function StudyGuide(
  { state, catalog, focus, done, onTogglePoint },
  ref
) {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));

  useImperativeHandle(ref, () => ({ copyResponse }), [state]);

  // Navegación desde el sidebar: scroll al ancla de la semana.
  useEffect(() => {
    if (!focus) return;
    document
      .getElementById(`week-${focus.certId}-${focus.week}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus]);

  if (selected.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 6 }}>
        Seleccioná certificaciones en el sidebar para ver sus guías de estudio de 8
        semanas.
      </Alert>
    );
  }

  const copyResponse = async () => {
    const text = buildFormResponse(state, catalog);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 3, alignItems: { md: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h4">Guías de Estudio</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selected.length} guías · 8 semanas cada una
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<ContentCopy />}
          onClick={copyResponse}
        >
          Copiar respuesta para formulario
        </Button>
      </Stack>

      <Alert severity="success" sx={{ mb: 3 }}>
        La respuesta formateada para formularios de empleo técnico se copia al
        portapapeles con un clic.
      </Alert>

      {selected.map((cert) => {
        const priority = parsePriority(state.priority[cert.id]);
        const certIds = collectCertItemIds(cert.id, cert);
        const certDone = countDone(certIds, done);
        const certPct = certIds.length ? (certDone / certIds.length) * 100 : 0;
        return (
          <Card key={cert.id} sx={{ mb: 4, overflow: "visible" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
                <Avatar sx={{ bgcolor: cert.providerColor, width: 48, height: 48 }}>
                  {cert.title.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography variant="h5">{cert.title}</Typography>
                    <Chip size="small" label={cert.code} variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {cert.provider} · Prioridad {priorityCaps(priority)} ({priority}/5) ·
                    Popularidad {popularityFlames(cert.popularity)}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {cert.summary}
              </Typography>

              <CertificationMetaPanel cert={cert} />

              <FocusPanel certId={cert.id} cert={cert} done={done} />

              <CheatsheetPrint cert={cert} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Chip icon={<Schedule />} label="8 semanas" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Chip icon={<AttachMoney />} label={cert.cost} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Chip icon={<Book />} label="Plan estructurado" />
                </Grid>
              </Grid>

              {certIds.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" sx={{ mb: 0.5, justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Progreso de estudio
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {certDone}/{certIds.length}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={certPct}
                    sx={{ height: progressBar.height, borderRadius: progressBar.radius }}
                  />
                </Box>
              )}

              {cert.weeks.map((w) => (
                <WeekAccordion
                  key={w.week}
                  w={w}
                  certId={cert.id}
                  anchorId={`week-${cert.id}-${w.week}`}
                  forceOpenSignal={
                    focus && focus.certId === cert.id && focus.week === w.week
                      ? focus.n
                      : 0
                  }
                  done={done}
                  onTogglePoint={onTogglePoint}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
});

export default StudyGuide;
