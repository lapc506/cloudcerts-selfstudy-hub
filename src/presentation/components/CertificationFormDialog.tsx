import { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Delete } from "@mui/icons-material";
import type { Certification, Priority } from "../../domain";
import PriorityRating from "../atoms/PriorityRating";

// Organismo: modal para dar de alta una certificación nueva cubriendo TODOS
// los campos del YAML schema (general + meta + verified_sources + 8 semanas
// con taxonomía Bloom/Kirkpatrick). Construye el YAML y lo persiste vía la
// prop onSaveYamlText (el repositorio valida el esquema).

interface WeekForm {
  title: string;
  domain: string;
  weight: string;
  bloom: string;
  kirkpatrick: string;
  points: string;
}

interface SourceForm {
  url: string;
  label: string;
  date: string;
}

interface CertificationFormDialogProps {
  open: boolean;
  catalog: Certification[];
  onClose: () => void;
  onSaveYamlText: (yaml: string) => boolean;
  onSaved: (id: string) => void;
}

const BLOOM_OPTIONS = [
  "1 · Remember",
  "2 · Understand",
  "3 · Apply",
  "4 · Analyze",
  "5 · Evaluate",
  "6 · Create",
];

const KIRKPATRICK_OPTIONS = ["L1", "L2", "L3", "L4"];

const LEVEL_OPTIONS = [
  "100 · Foundational",
  "200 · Associate",
  "300 · Professional",
  "400 · Specialty",
];

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyWeek = (): WeekForm => ({
  title: "",
  domain: "",
  weight: "",
  bloom: "",
  kirkpatrick: "",
  points: "",
});

/** Entrecomilla YAML escapando backslash y comillas. */
function q(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function linesOf(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export default function CertificationFormDialog({
  open,
  catalog,
  onClose,
  onSaveYamlText,
  onSaved,
}: CertificationFormDialogProps) {
  const [id, setId] = useState("");
  const [provider, setProvider] = useState("");
  const [providerColor, setProviderColor] = useState("#888888");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [cost, setCost] = useState("");
  const [priority, setPriority] = useState<Priority>(3);
  const [popularity, setPopularity] = useState<Priority>(3);
  const [summary, setSummary] = useState("");
  const [examVersion, setExamVersion] = useState("");
  const [guideDate, setGuideDate] = useState(todayIso());
  const [guideSource, setGuideSource] = useState("");
  const [format, setFormat] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [domains, setDomains] = useState("");
  const [validityYears, setValidityYears] = useState("2");
  const [recertWindow, setRecertWindow] = useState("");
  const [recertOptions, setRecertOptions] = useState("");
  const [recertDiscount, setRecertDiscount] = useState("");
  const [level, setLevel] = useState("200 · Associate");
  const [versions, setVersions] = useState("");
  const [sources, setSources] = useState<SourceForm[]>([
    { url: "", label: "Guía oficial del examen", date: todayIso() },
  ]);
  const [weeks, setWeeks] = useState<WeekForm[]>(() =>
    Array.from({ length: 8 }, emptyWeek)
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setId("");
    setProvider("");
    setProviderColor("#888888");
    setTitle("");
    setCode("");
    setCost("");
    setPriority(3);
    setPopularity(3);
    setSummary("");
    setExamVersion("");
    setGuideDate(todayIso());
    setGuideSource("");
    setFormat("");
    setPassingScore("");
    setDomains("");
    setValidityYears("2");
    setRecertWindow("");
    setRecertOptions("");
    setRecertDiscount("");
    setLevel("200 · Associate");
    setVersions("");
    setSources([{ url: "", label: "Guía oficial del examen", date: todayIso() }]);
    setWeeks(Array.from({ length: 8 }, emptyWeek));
    setErrors([]);
  }, [open ]);

  const providers = [...new Set(catalog.map((c) => c.provider))];

  const setWeek = (i: number, patch: Partial<WeekForm>) =>
    setWeeks((ws) => ws.map((w, j) => (j === i ? { ...w, ...patch } : w)));

  const setSource = (i: number, patch: Partial<SourceForm>) =>
    setSources((ss) => ss.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const handleSave = () => {
    const errs: string[] = [];
    const cleanId = id.trim().toLowerCase();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cleanId))
      errs.push("ID inválido: usá minúsculas, números y guiones (ej. cncf-kt).");
    if (catalog.some((c) => c.id === cleanId)) errs.push(`El ID "${cleanId}" ya existe.`);
    if (!provider.trim()) errs.push("Provider es obligatorio.");
    if (!title.trim()) errs.push("Title es obligatorio.");
    if (!code.trim()) errs.push("Code es obligatorio.");
    weeks.forEach((w, i) => {
      if (!w.title.trim()) errs.push(`Semana ${i + 1}: falta el título.`);
      if (!w.domain.trim()) errs.push(`Semana ${i + 1}: falta el dominio.`);
      if (linesOf(w.points).length === 0) errs.push(`Semana ${i + 1}: sin puntos de estudio.`);
    });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const domainLines = linesOf(domains).map((d) => `    - ${q(d)}`).join("\n") || `    - ${q("General")}`;
    const recertLines =
      linesOf(recertOptions).map((o) => `    - ${q(o)}`).join("\n") || `    - ${q("Repetir y aprobar el examen")}`;
    const versionLines = linesOf(versions)
      .map((v) => {
        const [c, ...rest] = v.split("|");
        return `    - code: ${q(c.trim())}\n      note: ${q(rest.join("|").trim())}`;
      })
      .join("\n");
    const sourceLines = sources
      .filter((s) => s.url.trim())
      .map(
        (s) =>
          `    - url: ${q(s.url.trim())}\n      date_last_fetched: ${q(s.date || todayIso())}\n      label: ${q(s.label.trim() || "Guía oficial del examen")}`
      )
      .join("\n");
    const weekLines = weeks
      .map((w, i) => {
        const pts = linesOf(w.points).map((p) => `          - ${q(p)}`).join("\n");
        const bloomNum = parseInt(w.bloom.charAt(0), 10);
        const bloomLine = bloomNum >= 1 && bloomNum <= 6 ? `\n        bloom: ${bloomNum}` : "";
        const k = w.kirkpatrick.trim().toUpperCase();
        const kLine = /^L[1-4]$/.test(k) ? `\n        kirkpatrick: ${q(k)}` : "";
        const weightLine = w.weight.trim() ? `\n        weight: ${q(w.weight.trim())}` : "";
        return `  - week: ${i + 1}
    title: ${q(w.title.trim())}
    sections:
      - domain: ${q(w.domain.trim())}${weightLine}${bloomLine}${kLine}
        points:
${pts}`;
      })
      .join("\n");

    const yaml =
      `id: ${cleanId}\n` +
      `provider: ${q(provider.trim())}\n` +
      `provider_color: ${q(providerColor.trim() || "#888888")}\n` +
      `title: ${q(title.trim())}\n` +
      `code: ${q(code.trim())}\n` +
      `cost: ${q(cost.trim() || "USD")}\n` +
      `default_priority: ${priority}\n` +
      `popularity: ${popularity}\n` +
      `summary: ${q(summary.trim())}\n` +
      `meta:\n` +
      `  exam_version: ${q(examVersion.trim())}\n` +
      `  guide_date: ${q(guideDate || todayIso())}\n` +
      `  guide_source: ${q(guideSource.trim())}\n` +
      `  format: ${q(format.trim())}\n` +
      `  passing_score: ${q(passingScore.trim())}\n` +
      `  domains:\n${domainLines}\n` +
      `  validity_years: ${parseInt(validityYears, 10) || 2}\n` +
      `  recert_window: ${q(recertWindow.trim())}\n` +
      `  recert_options:\n${recertLines}\n` +
      `  recert_discount: ${q(recertDiscount.trim())}\n` +
      `  level: ${q(level.trim())}\n` +
      `  versions:\n${versionLines || "    []"}\n` +
      `  verified_sources:\n${sourceLines || "    []"}\n` +
      `weeks:\n${weekLines}\n`;

    if (onSaveYamlText(yaml)) {
      onSaved(cleanId);
      onClose();
    } else {
      setErrors(["El YAML no pasó la validación del esquema (revisá los campos)."]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Agregar certificación</DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {errors.length > 0 && (
          <Alert severity="error" onClose={() => setErrors([])}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>General</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="ID (slug único)" value={id} onChange={(e) => setId(e.target.value)} placeholder="cncf-kt" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              freeSolo
              options={providers}
              value={provider}
              onInputChange={(_, v) => setProvider(v)}
              renderInput={(p) => <TextField {...p} fullWidth label="Provider" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Costo" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="$250 USD" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TextField
                label="Color"
                value={providerColor}
                onChange={(e) => setProviderColor(e.target.value)}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(providerColor) ? providerColor : "#888888"}
                onChange={(e) => setProviderColor(e.target.value)}
                style={{ width: 44, height: 44, border: "none", background: "none", cursor: "pointer" }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1} sx={{ height: "100%", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Prioridad</Typography>
              <PriorityRating value={priority} onChange={setPriority} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1} sx={{ height: "100%", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Popularidad</Typography>
              <PriorityRating value={popularity} onChange={setPopularity} glyph="🔥" label="Popularidad" />
            </Stack>
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline minRows={2} label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </Grid>
        </Grid>

        <Divider />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Meta (guía oficial)</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Exam version" value={examVersion} onChange={(e) => setExamVersion(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth type="date" label="Guide date" value={guideDate} onChange={(e) => setGuideDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Guide source (URL)" value={guideSource} onChange={(e) => setGuideSource(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Format" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="60 preguntas · 90 min · multiple choice" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Passing score" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} placeholder="75%" />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline minRows={2} label="Domains (uno por línea, con peso %)" value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="Fundamentals: 20%" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth type="number" label="Validez (años)" value={validityYears} onChange={(e) => setValidityYears(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField fullWidth label="Recert window" value={recertWindow} onChange={(e) => setRecertWindow(e.target.value)} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline minRows={2} label="Recert options (una por línea)" value={recertOptions} onChange={(e) => setRecertOptions(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Recert discount" value={recertDiscount} onChange={(e) => setRecertDiscount(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Nivel</InputLabel>
              <Select value={level} label="Nivel" onChange={(e) => setLevel(e.target.value)}>
                {LEVEL_OPTIONS.map((l) => (
                  <MenuItem key={l} value={l}>{l}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField fullWidth multiline minRows={2} label="Versions (una por línea: CODE | nota)" value={versions} onChange={(e) => setVersions(e.target.value)} placeholder="v1.0 | Guía vigente" />
          </Grid>
        </Grid>

        <Divider />
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Verified sources (PDF oficial)</Typography>
          <IconButton
            size="small"
            title="Agregar fuente"
            onClick={() => setSources((ss) => [...ss, { url: "", label: "", date: todayIso() }])}
          >
            <Add />
          </IconButton>
        </Stack>
        {sources.map((s, i) => (
          <Grid container spacing={2} key={i} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label={`URL PDF ${i + 1}`} value={s.url} onChange={(e) => setSource(i, { url: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label="Label" value={s.label} onChange={(e) => setSource(i, { label: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 10, sm: 2 }}>
              <TextField fullWidth type="date" label="Fetched" value={s.date} onChange={(e) => setSource(i, { date: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 2, sm: 1 }}>
              <IconButton size="small" title="Quitar" onClick={() => setSources((ss) => ss.filter((_, j) => j !== i))}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Divider />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Semanas (8) con Bloom / Kirkpatrick</Typography>
        {weeks.map((w, i) => (
          <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Semana {i + 1}</Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField fullWidth label="Título" value={w.title} onChange={(e) => setWeek(i, { title: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Dominio" value={w.domain} onChange={(e) => setWeek(i, { domain: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 6, sm: 2 }}>
                <TextField fullWidth label="Peso" value={w.weight} onChange={(e) => setWeek(i, { weight: e.target.value })} placeholder="20%" />
              </Grid>
              <Grid size={{ xs: 6, sm: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Bloom</InputLabel>
                  <Select value={w.bloom} label="Bloom" onChange={(e) => setWeek(i, { bloom: e.target.value })}>
                    <MenuItem value="">—</MenuItem>
                    {BLOOM_OPTIONS.map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Kirk.</InputLabel>
                  <Select value={w.kirkpatrick} label="Kirk." onChange={(e) => setWeek(i, { kirkpatrick: e.target.value })}>
                    <MenuItem value="">—</MenuItem>
                    {KIRKPATRICK_OPTIONS.map((k) => (
                      <MenuItem key={k} value={k}>{k}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField fullWidth multiline minRows={3} label="Puntos (uno por línea)" value={w.points} onChange={(e) => setWeek(i, { points: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Close />}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar certificación</Button>
      </DialogActions>
    </Dialog>
  );
}
