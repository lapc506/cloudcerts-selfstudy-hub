import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
} from "@mui/material";
import { Save, History, Code } from "@mui/icons-material";
import type {
  ICertificationRepository,
  IMockExamRepository,
  ValidationIssue,
} from "../../domain";

export interface YAMLGuideEditorHandle {
  save: () => boolean;
}

type DocType = "guide" | "bank" | "mock";

const DOC_LABEL: Record<DocType, string> = {
  guide: "Guía",
  bank: "Banco",
  mock: "Mock",
};

const YAMLGuideEditor = forwardRef<
  YAMLGuideEditorHandle,
  { repository: ICertificationRepository; mockRepository: IMockExamRepository }
>(function YAMLGuideEditor({ repository, mockRepository }, ref) {
  const [docType, setDocType] = useState<DocType>("guide");
  const idOptions =
    docType === "guide"
      ? repository.list().map((c) => ({ id: c.id, label: `${c.title} (${c.code})` }))
      : docType === "bank"
      ? mockRepository.listBanks().map((b) => ({ id: b.id, label: `${b.title} (${b.id})` }))
      : mockRepository.listMocks().map((m) => ({ id: m.id, label: `${m.title} (${m.id})` }));
  const [selectedId, setSelectedId] = useState(() => idOptions[0]?.id ?? "");
  const [yamlText, setYamlText] = useState("");
  const [saved, setSaved] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const loadDoc = (kind: DocType, id: string): string =>
    kind === "guide"
      ? repository.getYaml(id)
      : mockRepository.getYaml(kind, id);

  useEffect(() => {
    const first = idOptions[0]?.id ?? "";
    setSelectedId(first);
    setYamlText(first ? loadDoc(docType, first) : "");
    setSaved(false);
    setIssues([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType]);

  useEffect(() => {
    setYamlText(loadDoc(docType, selectedId));
    setSaved(false);
    setIssues([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSave = () => {
    const ok =
      docType === "guide"
        ? repository.saveYaml(yamlText)
        : mockRepository.saveYaml(docType, yamlText);
    if (ok) {
      setSaved(true);
      setIssues([]);
    } else {
      setSaved(false);
      setIssues(
        docType === "guide"
          ? repository.getLastValidationIssues()
          : mockRepository.getLastValidationIssues()
      );
    }
    return ok;
  };

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  useImperativeHandle(ref, () => ({ save: handleSave }), [yamlText, docType]);

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Typography variant="h4">Editor YAML</Typography>
        <Code />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Editá guías, bancos de preguntas y mocks en formato YAML: cada guía debe
        tener exactamente 8 semanas; los mocks referencian preguntas por{" "}
        <code>{`{bank, id}`}</code> y varios mocks pueden compartir la misma
        pregunta del banco.
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaved(false)}>
          {DOC_LABEL[docType]} guardado correctamente.
        </Alert>
      )}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setIssues([])}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            La guía tiene {errors.length} error{errors.length === 1 ? "" : "es"}:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {errors.map((issue, idx) => (
              <li key={idx}>
                <Typography variant="body2" component="span">
                  <strong>{issue.path}</strong>: {issue.message}
                </Typography>
              </li>
            ))}
          </Box>
        </Alert>
      )}
      {warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {warnings.length} advertencia{warnings.length === 1 ? "" : "s"} pedagógica{warnings.length === 1 ? "" : "s"}:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {warnings.map((issue, idx) => (
              <li key={idx}>
                <Typography variant="body2" component="span">
                  <strong>{issue.path}</strong>: {issue.message}
                </Typography>
              </li>
            ))}
          </Box>
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={docType}
            label="Tipo"
            onChange={(e) => setDocType(e.target.value as DocType)}
          >
            <MenuItem value="guide">Guía</MenuItem>
            <MenuItem value="bank">Banco</MenuItem>
            <MenuItem value="mock">Mock</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 260 }}>
          <InputLabel>Documento</InputLabel>
          <Select
            value={selectedId}
            label="Documento"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {idOptions.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          sx={{ alignSelf: "flex-start" }}
        >
          Guardar
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={22}
          maxRows={40}
          value={yamlText}
          onChange={(e) => setYamlText(e.target.value)}
          sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem" }}
          slotProps={{ input: { sx: { fontFamily: "JetBrains Mono, monospace" } } }}
        />
      </Paper>

      <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "center" }}>
        <History sx={{ fontSize: 20 }} />
        <Typography variant="caption" color="text.secondary">
          Los cambios se guardan en memoria para la sesión actual. Para persistencia
          total, editá el archivo src/infrastructure/yamlCertificationRepository.ts.
        </Typography>
      </Stack>
    </Box>
  );
});

export default YAMLGuideEditor;
