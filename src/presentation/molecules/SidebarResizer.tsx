import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { APP_ZOOM } from "../quarks";

// Molécula: divisor vertical arrastrable para redimensionar el sidebar.
// Mouse (drag) + teclado (flechas/Home/End): cumple 2.1.1 Keyboard y 2.5.7
// Dragging Movements (toda acción drag tiene alternativa de un puntero/tecla).

interface SidebarResizerProps {
  width: number;
  min?: number;
  maxWidth?: number;
  onResize: (nextWidth: number) => void;
}

export const SIDEBAR_MIN = 240;
export const SIDEBAR_MAX = 560;
export const SIDEBAR_STEP = 16;

export default function SidebarResizer({
  width,
  min = SIDEBAR_MIN,
  maxWidth = SIDEBAR_MAX,
  onResize,
}: SidebarResizerProps) {
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, w: 0 });

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      // clientX está en píxeles CSS sin zoom; el layout usa APP_ZOOM.
      onResize(start.current.w + (e.clientX - start.current.x) / APP_ZOOM);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, onResize]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onResize(width - SIDEBAR_STEP);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onResize(width + SIDEBAR_STEP);
    } else if (e.key === "Home") {
      e.preventDefault();
      onResize(min);
    } else if (e.key === "End") {
      e.preventDefault();
      onResize(maxWidth);
    }
  };

  return (
    <Box
      role="separator"
      aria-orientation="vertical"
      aria-label="Redimensionar sidebar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={maxWidth}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        e.preventDefault();
        start.current = { x: e.clientX, w: width };
        setDragging(true);
      }}
      title="Arrastrar para redimensionar (o usar ← →)"
      sx={{
        width: 14,
        flexShrink: 0,
        cursor: "ew-resize",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        py: 1,
        "&:hover > div, &:focus-visible > div": { bgcolor: "primary.main" },
        "&:focus-visible": { outline: "none" },
        "& > div": {
          width: 3,
          borderRadius: 2,
          bgcolor: "divider",
          transition: "background-color 120ms ease-out",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& > div": { transition: "none" },
        },
      }}
    >
      <div />
    </Box>
  );
}
