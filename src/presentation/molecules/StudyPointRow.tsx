import { Checkbox, ListItem, ListItemIcon, Typography } from "@mui/material";

// Molécula: fila de punto de estudio (checkbox + texto). Un patrón de
// interacción: click en la fila o en el checkbox emite onTogglePoint.

interface StudyPointRowProps {
  id: string;
  text: string;
  done: Record<string, boolean>;
  onTogglePoint: (itemId: string) => void;
}

export default function StudyPointRow({ id, text, done, onTogglePoint }: StudyPointRowProps) {
  const checked = !!done[id];
  return (
    <ListItem
      onClick={() => onTogglePoint(id)}
      sx={{
        py: 0.25,
        cursor: "pointer",
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <ListItemIcon sx={{ minWidth: 28 }}>
        <Checkbox
          size="small"
          edge="start"
          checked={checked}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onTogglePoint(id)}
          sx={{ p: 0.25 }}
        />
      </ListItemIcon>
      <Typography
        variant="body2"
        color={checked ? "text.disabled" : "text.secondary"}
        sx={checked ? { textDecoration: "line-through" } : undefined}
      >
        {text}
      </Typography>
    </ListItem>
  );
}
