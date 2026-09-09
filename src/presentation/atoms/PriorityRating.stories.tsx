import { Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { useState } from "react";
import type { Priority } from "../../domain";
import PriorityRating from "./PriorityRating";

const meta: Meta<typeof PriorityRating> = {
  title: "Plan/Atoms/PriorityRating",
  component: PriorityRating,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Fila estática con los 5 niveles de prioridad (1..5). */
export const StaticLevels: Story = {
  render: () => {
    const levels: Priority[] = [1, 2, 3, 4, 5];
    return (
      <Stack direction="row" spacing={3}>
        {levels.map((level) => (
          <Stack key={level} spacing={0.5} sx={{ alignItems: "center" }}>
            <PriorityRating value={level} onChange={() => {}} />
            <Typography variant="caption" color="text.secondary">
              {level}/5
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  },
};

/** Demo interactiva: el rating responde al clic vía useState. */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<Priority>(3);
    return (
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <PriorityRating value={value} onChange={setValue} />
        <Typography variant="caption" color="text.secondary">
          Prioridad seleccionada: {value}/5
        </Typography>
      </Stack>
    );
  },
  play: async ({ canvas, userEvent }) => {
    // Rating con teclado (vía a11y nativa): foco en el valor actual y 2× →.
    canvas.getByRole("radio", { name: /3 Stars$/ }).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    // El aria-label del Tooltip es atómico (sin nodos partidos).
    await expect(canvas.getByLabelText("Prioridad 5/5")).toBeInTheDocument();
  },
};
