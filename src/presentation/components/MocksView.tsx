import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { OpenInNew, PlayArrow, Quiz, Timer } from "@mui/icons-material";
import type { BankQuestion, MockExam, QuestionBank } from "../../domain";
import QuizRunner from "./QuizRunner";

// Organismo: vista Mock Exams — recursos de simulacros y preparación.
// Enlaces curados (oficiales + terceros claramente etiquetados).

export const MOCK_EXAM_URL = "https://claudecertificationguide.com/mock-exam";

interface MockResource {
  title: string;
  url: string;
  description: string;
  official: boolean;
}

const RESOURCES: MockResource[] = [
  {
    title: "Mock Exam CCDV-F",
    url: "https://claudecertificationguide.com/mock-exam",
    description: "Simulacro estilo examen para Claude Certified Developer - Foundations.",
    official: false,
  },
  {
    title: "Guía CCDV-F",
    url: "https://claudecertificationguide.com/ccdv-f",
    description: "Guía de estudio de terceros para CCDV-F.",
    official: false,
  },
  {
    title: "Badge CCDV-F en Credly",
    url: "https://www.credly.com/org/anthropic/badge/claude-certified-developer-foundations",
    description: "Insignia oficial y criterios de la credencial.",
    official: true,
  },
  {
    title: "Anthropic Academy",
    url: "https://academy.claude.com/courses",
    description: "Cursos oficiales de Anthropic.",
    official: true,
  },
  {
    title: "Pearson VUE — Anthropic",
    url: "https://www.pearsonvue.com/us/en/anthropic.html",
    description: "Agendar el examen y ver la lista oficial de certificaciones.",
    official: true,
  },
];

export default function MocksView({
  mocks,
  banks,
  resolveQuestions,
  practice,
}: {
  mocks: MockExam[];
  banks: QuestionBank[];
  resolveQuestions: (m: MockExam) => BankQuestion[];
  practice: { code: string; title: string; url: string; questions: number | null }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = mocks.find((m) => m.id === activeId) ?? null;
  const bankById = new Map(banks.map((b) => [b.id, b]));
  const fairUseOf = (m: MockExam): boolean =>
    m.questions.every((r) => bankById.get(r.bank)?.fairUse?.verdict === "likely-fair");
  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Mock Exams</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Simulacros y recursos de preparación
          </Typography>
        </Box>
        <Chip icon={<Quiz />} label="Práctica" color="primary" variant="outlined" />
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Los recursos marcados como “terceros” no son oficiales: usalos para
        practicar y contrastá siempre con la guía oficial del examen.
      </Alert>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Simulacros locales
      </Typography>
      {active ? (
        <QuizRunner
          mock={active}
          questions={resolveQuestions(active)}
          onExit={() => setActiveId(null)}
        />
      ) : mocks.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Todavía no hay simulacros cargados. Crealos en el Editor YAML (tipo
          Mock) referenciando preguntas de un banco.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mocks.map((m) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ lineHeight: 1.3, mb: 1 }}>
                    {m.title}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: "wrap" }}>
                    <Chip size="small" label={m.certId} variant="outlined" />
                    <Chip
                      size="small"
                      icon={<Quiz sx={{ fontSize: 14 }} />}
                      label={`${m.questions.length} preguntas`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      icon={<Timer sx={{ fontSize: 14 }} />}
                      label={`${m.timeMinutes} min`}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`Aprueba ${m.passingPercent}%`}
                      variant="outlined"
                      color="success"
                    />
                    <Chip
                      size="small"
                      label={fairUseOf(m) ? "Fair use ✓" : "Revisar fair use"}
                      variant="outlined"
                      color={fairUseOf(m) ? "success" : "warning"}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => setActiveId(m.id)}
                  >
                    Iniciar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h5" sx={{ mb: 2, mt: active ? 4 : 0 }}>
        Recursos externos
      </Typography>

      {practice.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            Bancos externos (ExamTopics)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Preguntas de la comunidad por certificación (el tier gratuito muestra
            las primeras ~10 por examen).
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {practice.map((p) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.code}>
                <Card variant="outlined">
                  <CardContent sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip size="small" label={p.code} variant="outlined" />
                      <Typography variant="body2" sx={{ flex: 1 }} noWrap title={p.title}>
                        {p.title}
                      </Typography>
                      {p.questions != null && (
                        <Chip size="small" label={`${p.questions} preg.`} />
                      )}
                      <Button
                        size="small"
                        startIcon={<OpenInNew />}
                        onClick={() => window.open(p.url, "_blank", "noopener")}
                      >
                        Abrir
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Grid container spacing={3}>
        {RESOURCES.map((r) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.url}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                  <Typography variant="h6" sx={{ flex: 1, lineHeight: 1.3 }}>
                    {r.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={r.official ? "Oficial" : "Terceros"}
                    color={r.official ? "success" : "warning"}
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {r.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                  {new URL(r.url).hostname}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNew />}
                  onClick={() => window.open(r.url, "_blank", "noopener")}
                >
                  Abrir
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
