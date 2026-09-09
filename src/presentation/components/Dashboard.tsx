import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  WorkspacePremium,
  Schedule,
  AttachMoney,
  AutoAwesome,
  TrendingUp,
} from "@mui/icons-material";
import type { Certification, UserState } from "../../domain";
import {
  collectCertItemIds,
  countDone,
  parsePriority,
  priorityCaps,
} from "../../domain";
import KpiCard from "../molecules/KpiCard";
import { progressBar } from "../quarks";

interface DashboardProps {
  state: UserState;
  catalog: Certification[];
  done: Record<string, boolean>;
}

export default function Dashboard({ state, catalog, done }: DashboardProps) {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));
  const totalCost = selected.reduce(
    (acc, c) => acc + parseInt((c.cost.match(/\d+/) ?? ["0"])[0], 10),
    0
  );

  const priorityOf = (id: string) => parsePriority(state.priority[id]);

  const priorityCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  selected.forEach((c) => {
    priorityCounts[priorityOf(c.id)] += 1;
  });
  const topPriority = priorityCounts[5];

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Progreso</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Seguimiento de tu avance: métricas y puntos de estudio completados
          </Typography>
        </Box>
        <Chip
          icon={<AutoAwesome />}
          label="Plan 8 semanas"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* KPI Cards - Molécula KpiCard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon={<WorkspacePremium />}
            color="primary.main"
            label="Certificaciones activas"
            value={selected.length}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon={<Schedule />}
            color="secondary.main"
            label="Semanas totales"
            value={selected.length * 8}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon={<AttachMoney />}
            color="success.main"
            label="Inversión total"
            value={`$${totalCost}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon={<TrendingUp />}
            color="warning.main"
            label="Prioridad máxima 🎓🎓🎓🎓🎓"
            value={topPriority}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Priority distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Distribución de prioridades
              </Typography>
              <Stack spacing={2}>
                {([5, 4, 3, 2, 1] as const).map((p) => {
                  const count = priorityCounts[p];
                  const pct = selected.length ? (count / selected.length) * 100 : 0;
                  const color =
                    p === 5
                      ? "error"
                      : p === 4
                      ? "warning"
                      : p === 3
                      ? "info"
                      : "success";
                  return (
                    <Box key={p}>
                      <Stack
                        direction="row"
                        sx={{ mb: 0.5, justifyContent: "space-between" }}
                      >
                        <Typography variant="body2">
                          {priorityCaps(p)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        color={color}
                        sx={{ height: progressBar.height, borderRadius: progressBar.radius }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Progreso de estudio por certificación */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Progreso de estudio
              </Typography>
              {selected.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sin certificaciones en el plan. Agregalas desde el catálogo del
                  sidebar.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {selected.map((cert) => {
                    const ids = collectCertItemIds(cert.id, cert);
                    const d = countDone(ids, done);
                    const pct = ids.length ? (d / ids.length) * 100 : 0;
                    return (
                      <Box key={cert.id}>
                        <Stack
                          direction="row"
                          sx={{ mb: 0.5, justifyContent: "space-between" }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {cert.code} · {cert.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {d}/{ids.length}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          color={d === ids.length && ids.length > 0 ? "success" : "primary"}
                          sx={{ height: progressBar.height, borderRadius: progressBar.radius }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
