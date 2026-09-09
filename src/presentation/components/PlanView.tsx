import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { AutoAwesome, OpenInNew } from "@mui/icons-material";
import type { Certification, UserState } from "../../domain";
import {
  collectCertItemIds,
  countDone,
  formatValidity,
  parsePriority,
  popularityFlames,
  priorityCaps,
} from "../../domain";
import { progressBar } from "../quarks";

// Organismo: vista Home — el plan de estudios (roadmap). Lista solo las
// certificaciones del plan con su progreso y navegación a cada guía.

interface PlanViewProps {
  state: UserState;
  catalog: Certification[];
  done: Record<string, boolean>;
  onOpenGuide: (id: string) => void;
}

export default function PlanView({ state, catalog, done, onOpenGuide }: PlanViewProps) {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));
  const totalIds = selected.flatMap((c) => collectCertItemIds(c.id, c));
  const totalDone = countDone(totalIds, done);

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Plan de estudios</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selected.length} certificación(es) en el plan · {selected.length * 8} semanas
            programadas · {totalDone}/{totalIds.length} puntos completados
          </Typography>
        </Box>
        <Chip
          icon={<AutoAwesome />}
          label="Plan 8 semanas"
          color="primary"
          variant="outlined"
        />
      </Box>

      {selected.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Todavía no hay certificaciones en tu plan. Agregalas desde el catálogo
          del sidebar.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {selected.map((cert) => {
            const ids = collectCertItemIds(cert.id, cert);
            const d = countDone(ids, done);
            const pct = ids.length ? (d / ids.length) * 100 : 0;
            const priority = parsePriority(state.priority[cert.id]);
            return (
              <Card key={cert.id}>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { sm: "center" } }}
                  >
                    <Avatar sx={{ bgcolor: cert.providerColor, width: 44, height: 44 }}>
                      {cert.title.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Typography variant="h6">{cert.title}</Typography>
                        <Chip size="small" label={cert.code} variant="outlined" />
                      </Stack>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Chip size="small" label={cert.provider} />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`Prioridad ${priorityCaps(priority)} (${priority}/5)`}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color="warning"
                          label={`Popularidad ${popularityFlames(cert.popularity)}`}
                        />
                        {cert.meta && (
                          <Chip
                            size="small"
                            variant="outlined"
                            color="info"
                            label={`Validez ${formatValidity(cert.meta.validityYears)}`}
                          />
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1.5} sx={{ mt: 1, alignItems: "center" }}>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            flex: 1,
                            height: progressBar.height,
                            borderRadius: progressBar.radius,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {d}/{ids.length}
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNew />}
                      onClick={() => onOpenGuide(cert.id)}
                      sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                    >
                      Abrir guía
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
