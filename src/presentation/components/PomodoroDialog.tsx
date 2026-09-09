import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Pause, PlayArrow, RestartAlt, SkipNext } from "@mui/icons-material";
// lucide-react no trae glifo de tomate: se usa Timer, la representación
// canónica de la técnica Pomodoro (25/5/15). Ver App.tsx (FAB).
import { Timer } from "lucide-react";

// Organismo: modal Pomodoro (técnica 25/5/15 con ciclo largo cada 4 focos).
// Estado local de UI (no persiste en stores).

type Mode = "focus" | "short" | "long";

interface PomodoroDialogProps {
  open: boolean;
  onClose: () => void;
}

function beep() {
  try {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    setTimeout(() => void ctx.close(), 400);
  } catch {
    // Sin audio disponible: silencioso.
  }
}

export default function PomodoroDialog({ open, onClose }: PomodoroDialogProps) {
  const [focusLen, setFocusLen] = useState(25);
  const [shortLen, setShortLen] = useState(5);
  const [longLen, setLongLen] = useState(15);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  const totalFor = (m: Mode) =>
    (m === "focus" ? focusLen : m === "short" ? shortLen : longLen) * 60;

  useEffect(() => {
    if (!open || !running) return;
    if (secondsLeft <= 0) {
      beep();
      if (mode === "focus") {
        const c = completed + 1;
        setCompleted(c);
        const next: Mode = c % 4 === 0 ? "long" : "short";
        setMode(next);
        setSecondsLeft(totalFor(next));
      } else {
        setMode("focus");
        setSecondsLeft(totalFor("focus"));
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, running, secondsLeft, mode, focusLen, shortLen, longLen, completed]);

  const reset = () => {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(focusLen * 60);
  };

  const skip = () => {
    setRunning(false);
    if (mode === "focus") {
      const c = completed + 1;
      setCompleted(c);
      const next: Mode = c % 4 === 0 ? "long" : "short";
      setMode(next);
      setSecondsLeft(totalFor(next));
    } else {
      setMode("focus");
      setSecondsLeft(totalFor("focus"));
    }
  };

  const mm = Math.floor(Math.max(0, secondsLeft) / 60);
  const ss = Math.max(0, secondsLeft) % 60;
  const total = totalFor(mode);
  const pct = total > 0 ? ((total - secondsLeft) / total) * 100 : 0;

  const modeLabel =
    mode === "focus" ? "Enfoque" : mode === "short" ? "Descanso corto" : "Descanso largo";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <Timer size={22} />
          <span>Pomodoro</span>
          <Typography variant="caption" color="text.secondary">
            {modeLabel} · ciclo {completed + 1}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h2"
          align="center"
          sx={{ fontVariantNumeric: "tabular-nums", my: 1 }}
        >
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </Typography>
        <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, pct))} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant={running ? "outlined" : "contained"}
            startIcon={running ? <Pause /> : <PlayArrow />}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pausar" : "Iniciar"}
          </Button>
          <Button variant="outlined" startIcon={<SkipNext />} onClick={skip}>
            Saltar
          </Button>
          <Button variant="outlined" startIcon={<RestartAlt />} onClick={reset}>
            Reset
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
          Pomodoros completados: {completed}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Foco (min)"
            type="number"
            size="small"
            value={focusLen}
            onChange={(e) => {
              const v = Math.max(1, parseInt(e.target.value, 10) || 25);
              setFocusLen(v);
              if (mode === "focus") setSecondsLeft(v * 60);
            }}
          />
          <TextField
            label="Corto (min)"
            type="number"
            size="small"
            value={shortLen}
            onChange={(e) => {
              const v = Math.max(1, parseInt(e.target.value, 10) || 5);
              setShortLen(v);
              if (mode === "short") setSecondsLeft(v * 60);
            }}
          />
          <TextField
            label="Largo (min)"
            type="number"
            size="small"
            value={longLen}
            onChange={(e) => {
              const v = Math.max(1, parseInt(e.target.value, 10) || 15);
              setLongLen(v);
              if (mode === "long") setSecondsLeft(v * 60);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
