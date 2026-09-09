import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { OpenInNew, Science, UploadFile } from "@mui/icons-material";

// Organismo: vista Codelabs — carga .ipynb locales y renderiza celdas
// markdown/código/salidas de texto. Sin backend: todo en memoria.

export const SKILLS_BOOST_URL = "https://www.skills.google/course_templates/878";

interface NbCell {
  cell_type: string;
  source?: string[] | string;
  outputs?: { output_type?: string; text?: string[] | string; data?: Record<string, unknown>; ename?: string; evalue?: string }[];
}

function srcText(source: NbCell["source"]): string {
  return Array.isArray(source) ? source.join("") : (source ?? "");
}

function inlineMd(text: string, keyPrefix: string): React.ReactNode[] {
  // Mini-markdown inline: `code`, **bold**, *italic*, [text](url).
  const parts: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      parts.push(
        <code key={`${keyPrefix}-${k++}`} style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-${k++}`}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      parts.push(<em key={`${keyPrefix}-${k++}`}>{tok.slice(1, -1)}</em>);
    } else {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      if (lm) {
        parts.push(
          <Link key={`${keyPrefix}-${k++}`} href={lm[2]} target="_blank" rel="noreferrer">
            {lm[1]}
          </Link>
        );
      } else {
        parts.push(tok);
      }
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const variant = (["h1", "h2", "h3", "h4"] as const)[h[1].length - 1];
      out.push(
        <Typography key={k++} variant={variant} sx={{ mt: i === 0 ? 0 : 1.5, mb: 0.5 }}>
          {inlineMd(h[2], `h${k}`)}
        </Typography>
      );
      i++;
      continue;
    }
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(
        <Box
          key={k++}
          component="pre"
          sx={{
            bgcolor: "action.hover",
            p: 1.5,
            borderRadius: 1,
            overflowX: "auto",
            fontSize: "0.85rem",
          }}
        >
          {buf.join("\n")}
        </Box>
      );
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        i++;
      }
      out.push(
        <Box key={k++} component="ul" sx={{ pl: 3, my: 0.5 }}>
          {items.map((it, j) => (
            <li key={j}>
              <Typography variant="body2">{inlineMd(it, `li${k}-${j}`)}</Typography>
            </li>
          ))}
        </Box>
      );
      continue;
    }
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    out.push(
      <Typography key={k++} variant="body2" sx={{ my: 0.5 }}>
        {inlineMd(line, `p${k}`)}
      </Typography>
    );
    i++;
  }
  return <>{out}</>;
}

function OutputBlock({ output }: { output: NonNullable<NbCell["outputs"]>[number] }) {
  if (output.output_type === "stream") {
    const text = Array.isArray(output.text) ? output.text.join("") : (output.text ?? "");
    return (
      <Box component="pre" sx={{ bgcolor: "action.hover", p: 1, borderRadius: 1, fontSize: "0.8rem", overflowX: "auto" }}>
        {text}
      </Box>
    );
  }
  if (output.output_type === "error") {
    return (
      <Typography variant="body2" color="error">
        {output.ename}: {output.evalue}
      </Typography>
    );
  }
  const data = output.data ?? {};
  const plain = data["text/plain"];
  if (typeof plain === "string" || Array.isArray(plain)) {
    return (
      <Box component="pre" sx={{ bgcolor: "action.hover", p: 1, borderRadius: 1, fontSize: "0.8rem", overflowX: "auto" }}>
        {Array.isArray(plain) ? plain.join("") : plain}
      </Box>
    );
  }
  return (
    <Typography variant="caption" color="text.secondary">
      (salida rica no soportada en esta vista)
    </Typography>
  );
}

export default function CodelabsView() {
  const [name, setName] = useState("");
  const [cells, setCells] = useState<NbCell[] | null>(null);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    setError("");
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { cells?: NbCell[] };
      if (!Array.isArray(parsed.cells)) {
        setError("El archivo no parece un notebook (.ipynb sin arreglo cells).");
        return;
      }
      setName(file.name);
      setCells(parsed.cells);
    } catch {
      setError("No se pudo leer el archivo como JSON de notebook.");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Codelabs</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Cargá notebooks Jupyter (.ipynb) para estudiar junto a las guías
          </Typography>
        </Box>
        <Chip icon={<Science />} label="Jupyter" color="primary" variant="outlined" />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }} alignItems={{ sm: "center" }}>
        <Button variant="contained" component="label" startIcon={<UploadFile />}>
          Cargar notebook
          <input
            type="file"
            accept=".ipynb,application/json"
            hidden
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </Button>
        <Link href={SKILLS_BOOST_URL} target="_blank" rel="noreferrer" underline="hover">
          Abrir Skills Boost (course template 878) <OpenInNew sx={{ fontSize: 14 }} />
        </Link>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!cells && !error && (
        <Alert severity="info">
          Todavía no hay notebook cargado. El render incluye celdas markdown, código y
          salidas de texto; las salidas ricas (imágenes/HTML) se indican sin renderizar.
        </Alert>
      )}

      {cells && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {name} · {cells.length} celdas
            </Typography>
            <Stack spacing={2}>
              {cells.map((cell, i) => (
                <Box key={i}>
                  {cell.cell_type === "markdown" ? (
                    <MarkdownBlock text={srcText(cell.source)} />
                  ) : (
                    <Box
                      component="pre"
                      sx={{
                        bgcolor: "action.hover",
                        p: 1.5,
                        borderRadius: 1,
                        overflowX: "auto",
                        fontSize: "0.85rem",
                        my: 0.5,
                      }}
                    >
                      {srcText(cell.source)}
                    </Box>
                  )}
                  {(cell.outputs ?? []).map((o, j) => (
                    <OutputBlock key={j} output={o} />
                  ))}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
