// Organismo: vista Portafolio — proyectos recomendados por certificación.
// Curaduría en src/content/projects.yaml (solo URLs verificadas).

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
import { OpenInNew, Work } from "@mui/icons-material";
import type { Certification, UserState } from "../../domain";
import { portfolioFor } from "../../infrastructure/projectsRepository";

export const PORTFOLIO_URL =
  "https://github.com/CarterPerez-dev/Cybersecurity-Projects";

const ROADMAPS_URL =
  "https://github.com/CarterPerez-dev/Cybersecurity-Projects/blob/main/ROADMAPS/README.md";

interface PortfolioViewProps {
  state: UserState;
  catalog: Certification[];
}

export default function PortfolioView({ state, catalog }: PortfolioViewProps) {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));
  const withData = selected.filter((c) => {
    const p = portfolioFor(c.id);
    return p.projects.length > 0 || p.roadmaps.length > 0;
  });

  return (
    <Box>
      <Typography variant="h4">Portafolio</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Proyectos hands-on por certificación para demostrar skills en entrevistas.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Work color="primary" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Cybersecurity-Projects</Typography>
              <Typography variant="body2" color="text.secondary">
                70 proyectos con código + 10 roadmaps por rol (SOC, pentester, arquitectura…).
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<OpenInNew />}
              onClick={() => window.open(PORTFOLIO_URL, "_blank", "noopener")}
            >
              Abrir repo
            </Button>
            <Button
              variant="text"
              endIcon={<OpenInNew />}
              onClick={() => window.open(ROADMAPS_URL, "_blank", "noopener")}
            >
              Roadmaps
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {selected.length === 0 && (
        <Alert severity="info">
          Seleccioná certificaciones en el sidebar para ver sus proyectos recomendados.
        </Alert>
      )}

      <Stack spacing={2}>
        {withData.map((cert) => {
          const folio = portfolioFor(cert.id);
          return (
            <Card key={cert.id}>
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
                  <Typography variant="h6">{cert.title}</Typography>
                  <Chip size="small" label={cert.code} variant="outlined" />
                </Stack>
                {folio.projects.length > 0 && (
                  <Stack spacing={1} sx={{ mb: folio.roadmaps.length > 0 ? 1.5 : 0 }}>
                    {folio.projects.map((p) => (
                      <Stack
                        key={p.url}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2">{p.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.tier} · {p.hours}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          endIcon={<OpenInNew />}
                          onClick={() => window.open(p.url, "_blank", "noopener")}
                        >
                          Código
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                )}
                {folio.roadmaps.length > 0 && (
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <Typography variant="body2" color="text.secondary">
                      Roadmaps:
                    </Typography>
                    {folio.roadmaps.map((r) => (
                      <Link
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                        variant="body2"
                        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                      >
                        {r.label} <OpenInNew sx={{ fontSize: 14 }} />
                      </Link>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
