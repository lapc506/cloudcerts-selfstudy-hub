import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  LinearProgress,
  Link,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward, Refresh, Timer } from "@mui/icons-material";
import type { BankQuestion, MockExam } from "../../domain";

// Organismo: corre un mock exam (preguntas resueltas por referencia).
// Temporizador con auto-cierre, puntaje vs passing_percent y revisión
// con explicaciones que enseñan. Estado local de UI.

interface QuizRunnerProps {
  mock: MockExam;
  questions: BankQuestion[];
  onExit: () => void;
}

function fmtTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^docs\./, "");
  } catch {
    return url;
  }
}

export default function QuizRunner({ mock, questions, onExit }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(mock.timeMinutes * 60);

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setSecondsLeft(mock.timeMinutes * 60);
  }, [mock]);

  useEffect(() => {
    if (finished || mock.timeMinutes <= 0) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [finished, secondsLeft, mock]);

  const total = questions.length;
  const current = questions[index];

  const toggleChoice = (choiceIdx: number) => {
    if (finished) return;
    setAnswers((prev) => {
      const multi = current.answer.length > 1;
      const prevSel = prev[index] ?? [];
      if (multi) {
        return {
          ...prev,
          [index]: prevSel.includes(choiceIdx)
            ? prevSel.filter((c) => c !== choiceIdx)
            : [...prevSel, choiceIdx],
        };
      }
      return { ...prev, [index]: [choiceIdx] };
    });
  };

  const score = useMemo(() => {
    let earned = 0;
    let total = 0;
    questions.forEach((q, i) => {
      const pts = q.points ?? 1;
      total += pts;
      const sel = [...(answers[i] ?? [])].sort((a, b) => a - b);
      const exp = [...q.answer].sort((a, b) => a - b);
      if (sel.length === exp.length && sel.every((v, j) => v === exp[j])) earned += pts;
    });
    return { earned, total };
  }, [answers, questions]);

  const pct = score.total > 0 ? (score.earned / score.total) * 100 : 0;
  const passed = pct >= mock.passingPercent;

  const reset = () => {
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setSecondsLeft(mock.timeMinutes * 60);
  };

  if (total === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Este mock no tiene preguntas resolvibles (revisá las referencias del YAML).
      </Alert>
    );
  }

  if (finished) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Resultado: {score.earned}/{score.total} puntos ({pct.toFixed(0)}%)
          </Typography>
          <Alert severity={passed ? "success" : "warning"} sx={{ mb: 2 }}>
            {passed
              ? `Aprobado (umbral ${mock.passingPercent}%).`
              : `No aprobado (umbral ${mock.passingPercent}%). Revisá las explicaciones e intentá de nuevo.`}
          </Alert>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {questions.map((q, i) => {
              const sel = [...(answers[i] ?? [])].sort((a, b) => a - b);
              const exp = [...q.answer].sort((a, b) => a - b);
              const ok = sel.length === exp.length && sel.every((v, j) => v === exp[j]);
              return (
                <Box key={q.id} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                    <Chip
                      size="small"
                      label={ok ? "Correcta" : "Revisar"}
                      color={ok ? "success" : "error"}
                    />
                    <Typography variant="subtitle2">
                      Pregunta {i + 1} · {q.domain || q.id}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {q.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tu respuesta: {sel.length ? sel.map((c) => q.choices[c]?.text ?? c).join(" | ") : "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correcta: {exp.map((c) => q.choices[c]?.text ?? c).join(" | ")}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {q.explanation}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5 }}>
                    {q.choices.map((ch, ci) => (
                      <li key={ci}>
                        <Typography variant="body2" component="span">
                          <strong>{q.answer.includes(ci) ? "✓" : "✗"} {ch.text}:</strong>{" "}
                          {ch.justification || "Sin justificación registrada."}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                  {(q.sources ?? []).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Validar en documentación oficial:
                      </Typography>
                      <Stack spacing={0.25} sx={{ mt: 0.25 }}>
                        {(q.sources ?? []).map((s) => (
                          <Typography key={s.url} variant="body2">
                            <Link
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              underline="hover"
                            >
                              {s.note || hostOf(s.url)}
                            </Link>
                            <Typography variant="caption" color="text.secondary" component="span">
                              {" "}
                              · rev. {s.lastRevised || "?"} · verificado {s.lastFetched || "?"}
                            </Typography>
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={onExit}>
              Volver
            </Button>
            {mock.allowRetry && (
              <Button variant="contained" startIcon={<Refresh />} onClick={reset}>
                Reintentar
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: "center" }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {mock.title}
          </Typography>
          {mock.timeMinutes > 0 && (
            <Chip icon={<Timer />} label={fmtTime(secondsLeft)} variant="outlined" />
          )}
          <Chip size="small" label={`Pregunta ${index + 1}/${total}`} />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={total > 0 ? ((index + 1) / total) * 100 : 0}
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          {current.text}
        </Typography>
        {current.answer.length > 1 && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Selección múltiple: marcá todas las correctas.
          </Typography>
        )}
        <Stack sx={{ mb: 2 }}>
          {current.choices.map((c, ci) => {
            const checked = (answers[index] ?? []).includes(ci);
            const control =
              current.answer.length > 1 ? (
                <Checkbox checked={checked} onChange={() => toggleChoice(ci)} />
              ) : (
                <Radio checked={checked} onChange={() => toggleChoice(ci)} />
              );
            return (
              <FormControlLabel
                key={ci}
                control={control}
                label={<Typography variant="body2">{c.text}</Typography>}
                sx={{ alignItems: "flex-start", "& .MuiFormControlLabel-label": { pt: 1 } }}
              />
            );
          })}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={onExit}>
            Salir
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            Anterior
          </Button>
          {index < total - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            >
              Siguiente
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={() => setFinished(true)}>
              Finalizar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
