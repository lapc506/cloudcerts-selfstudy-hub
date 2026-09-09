import { Box, Typography } from "@mui/material";
import RibbonToolButton, { type RibbonToolCommand } from "./RibbonToolButton";
import { ribbon } from "../quarks";

// Molécula: grupo del ribbon (fila de RibbonToolButton + título abajo).
// Equivale al panel de OpenCADStudio render_group (tools + group label).

export interface RibbonGroupSpec {
  title: string;
  commands: RibbonToolCommand[];
}

export default function RibbonGroup({ spec, last }: { spec: RibbonGroupSpec; last: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 1,
        borderRight: last ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: 0.25, flex: 1 }}>
        {spec.commands.map((c) => (
          <RibbonToolButton key={c.label} cmd={c} />
        ))}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: ribbon.groupTitleSize, lineHeight: 1.2, mt: 0.25, whiteSpace: "nowrap" }}
      >
        {spec.title}
      </Typography>
    </Box>
  );
}
