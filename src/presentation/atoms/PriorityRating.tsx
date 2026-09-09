import { Rating, Tooltip } from "@mui/material";
import type { Priority } from "../../domain";
import { parsePriority } from "../../domain";

// Átomo: rating 1–5 con glifo (🎓 prioridad / 🔥 popularidad).
// Presentacional (datos por props, eventos por callbacks).

interface PriorityRatingProps {
  value: unknown;
  onChange: (v: Priority) => void;
  glyph?: string;
  label?: string;
}

export default function PriorityRating({
  value,
  onChange,
  glyph = "🎓",
  label = "Prioridad",
}: PriorityRatingProps) {
  return (
    <Tooltip title={`${label} ${parsePriority(value)}/5`}>
      <Rating
        size="small"
        max={5}
        value={parsePriority(value)}
        icon={<span style={{ fontSize: "0.85rem" }}>{glyph}</span>}
        emptyIcon={<span style={{ fontSize: "0.85rem", opacity: 0.3 }}>{glyph}</span>}
        onChange={(_, v) => {
          if (v != null) onChange(v as Priority);
        }}
      />
    </Tooltip>
  );
}
