import { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Stack,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useThemeSettings } from "../AppThemeHost";
import { ensureFontFamily } from "../theme";
import {
  FONT_OPTIONS,
  SEED_COLORS,
  tonalPalette,
  type FontKey,
} from "../theme";

interface ThemePickerProps {
  open: boolean;
  onClose: () => void;
}

export default function ThemePicker({ open, onClose }: ThemePickerProps) {
  const { settings, update } = useThemeSettings();

  const tones = useMemo(() => tonalPalette(settings.seed), [settings.seed]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">Personalizar tema</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Modo */}
          <section>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Modalidad
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.mode === "dark"}
                  onChange={(e) => update({ mode: e.target.checked ? "dark" : "light" })}
                />
              }
              label={settings.mode === "dark" ? "Modo oscuro (default)" : "Modo claro"}
            />
          </section>

          <Divider />

          {/* Color semilla */}
          <section>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Color semilla (Material Theme Builder)
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {SEED_COLORS.map((color) => (
                <Tooltip key={color} title={color.toUpperCase()}>
                  <Box
                    component="button"
                    onClick={() => update({ seed: color })}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      bgcolor: color,
                      border:
                        settings.seed.toLowerCase() === color
                          ? "3px solid #f8fafc"
                          : "1px solid rgba(255,255,255,0.25)",
                      cursor: "pointer",
                      outline:
                        settings.seed.toLowerCase() === color
                          ? "2px solid currentColor"
                          : "none",
                      transition: "transform 0.15s",
                      "&:hover": { transform: "scale(1.12)" },
                    }}
                  />
                </Tooltip>
              ))}
              <label style={{ alignSelf: "center", cursor: "pointer" }}>
                <input
                  type="color"
                  value={settings.seed}
                  onChange={(e) => update({ seed: e.target.value })}
                  style={{ width: 44, height: 34, background: "none", border: "none", cursor: "pointer" }}
                />
              </label>
            </Stack>
          </section>

          {/* Paleta generada */}
          <section>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Paleta tonal generada
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "stretch" }}>
              {tones.map((t, i) => (
                <Box
                  key={i}
                  title={`Tono ${i * 10}: ${t}`}
                  sx={{
                    flex: 1,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: t,
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                />
              ))}
            </Stack>
          </section>

          <Divider />

          {/* Tipografía */}
          <section>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tipografía (monospaced)
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Fuente del tema</InputLabel>
              <Select
                value={settings.font}
                label="Fuente del tema"
                onChange={(e) => {
                  const key = e.target.value as FontKey;
                  void ensureFontFamily(key).then(() => update({ font: key }));
                }}
              >
                {FONT_OPTIONS.map((f) => (
                  <MenuItem key={f.key} value={f.key} sx={{ fontFamily: f.stack }}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="body1" sx={{ fontFamily: "inherit", fontWeight: 700 }}>
                {FONT_OPTIONS.find((f) => f.key === settings.font)?.label} — Muestra
              </Typography>
              <Typography variant="body2" color="text.secondary">
                cloudcerts-hub &gt; aws-clf --plan8 --semana 5
              </Typography>
            </Box>
          </section>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}