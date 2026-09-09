import { List } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import StudyPointRow from "./StudyPointRow";

const meta: Meta<typeof StudyPointRow> = {
  title: "Guides/Molecules/StudyPointRow",
  component: StudyPointRow,
  decorators: [
    (Story) => (
      <List sx={{ width: 420 }}>
        <Story />
      </List>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    id: "sp-1",
    text: "Explicar el modelo de responsabilidad compartida de AWS",
    done: {},
    onTogglePoint: () => {},
  },
};

export const Checked: Story = {
  args: {
    id: "sp-1",
    text: "Explicar el modelo de responsabilidad compartida de AWS",
    done: { "sp-1": true },
    onTogglePoint: () => {},
  },
};

export const LongText: Story = {
  args: {
    id: "sp-2",
    text: "Diseñar una arquitectura multi-AZ con balanceo de carga, autoescalado y replicación de datos que cumpla con los requisitos de alta disponibilidad y recuperación ante desastres del Well-Architected Framework",
    done: {},
    onTogglePoint: () => {},
  },
};
