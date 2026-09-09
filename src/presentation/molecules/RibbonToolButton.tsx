import { Box, Button, Tooltip, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";
import { ribbon } from "../quarks";

// Molécula: botón grande del ribbon (icono + etiqueta). Sigue la anatomía
// OpenCADStudio LargeTool: altura completa del panel, icono 30px + label.

export interface RibbonToolCommand {
  label: string;
  icon: ReactNode;
  tip: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  sx?: SxProps<Theme>;
}

export default function RibbonToolButton({ cmd }: { cmd: RibbonToolCommand }) {
  return (
    <Tooltip title={cmd.tip} placement="bottom" enterDelay={400}>
      <span>
        <Button
          onClick={cmd.onClick}
          disabled={cmd.disabled}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 0.5,
            minWidth: ribbon.largeMinWidth,
            maxWidth: ribbon.largeMaxWidth,
            px: 1,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
            "&.Mui-disabled": { color: "text.disabled" },
            ...(cmd.active
              ? { bgcolor: "action.selected", color: "primary.main" }
              : {}),
            ...cmd.sx,
          }}
        >
          <Box sx={{ fontSize: ribbon.largeIcon, lineHeight: 1, display: "flex" }}>
            {cmd.icon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: ribbon.buttonLabelSize,
              lineHeight: 1.2,
              textAlign: "center",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cmd.label}
          </Typography>
        </Button>
      </span>
    </Tooltip>
  );
}
