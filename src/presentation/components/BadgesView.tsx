import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { AutoAwesome, OpenInNew, WorkspacePremium } from "@mui/icons-material";
import type { Certification, UserState } from "../../domain";
import { formatValidity } from "../../domain";

// Organismo: vista Badges — insignias estilo Open Badges 3.0
// (https://www.imsglobal.org/spec/ob/v3p0#json-schema) generadas desde el
// catálogo: name, issuer, criteria (guide_source real), validez y skills.
// Muestra las guías del plan (selectedGuides).

interface BadgesViewProps {
  state: UserState;
  catalog: Certification[];
}

export default function BadgesView({ state, catalog }: BadgesViewProps) {
  const selected = catalog.filter((c) => state.selectedGuides.includes(c.id));

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Insignias</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Vista previa Open Badges 3.0 de tu plan · {selected.length} insignia(s)
          </Typography>
        </Box>
        <Chip
          icon={<WorkspacePremium />}
          label="OpenBadges v3.0"
          color="primary"
          variant="outlined"
        />
      </Box>

      {selected.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Todavía no hay certificaciones en tu plan. Agregalas desde el catálogo
          del sidebar para ver sus insignias.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {selected.map((cert) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cert.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  {cert.meta?.badgeImage ? (
                    <Box
                      component="img"
                      src={cert.meta.badgeImage}
                      alt={`Insignia ${cert.title}`}
                      loading="lazy"
                      sx={{
                        width: 96,
                        height: 96,
                        mx: "auto",
                        mb: 1.5,
                        display: "block",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: cert.providerColor,
                        width: 72,
                        height: 72,
                        mx: "auto",
                        mb: 1.5,
                        fontSize: "1.5rem",
                        fontWeight: 700,
                      }}
                    >
                      {cert.code.slice(0, 2)}
                    </Avatar>
                  )}
                  <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
                    {cert.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Emisor: {cert.provider}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ mt: 1.5, justifyContent: "center", flexWrap: "wrap" }}
                  >
                    <Chip size="small" label="Achievement" color="primary" />
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<AutoAwesome sx={{ fontSize: 14 }} />}
                      label={`Válida ${formatValidity(cert.meta?.validityYears ?? 0)}`}
                    />
                  </Stack>
                  {(cert.meta?.domains.slice(0, 3) ?? []).length > 0 && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      useFlexGap
                      sx={{ mt: 1, justifyContent: "center", flexWrap: "wrap" }}
                    >
                      {(cert.meta?.domains.slice(0, 3) ?? []).map((d) => (
                        <Chip key={d} size="small" variant="outlined" label={d.split(":")[0]} />
                      ))}
                    </Stack>
                  )}
                  {cert.meta?.guideSource && (
                    <Link
                      href={cert.meta.guideSource}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ mt: 1.5, display: "inline-flex", alignItems: "center", gap: 0.5 }}
                    >
                      Ver criterio <OpenInNew sx={{ fontSize: 14 }} />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
