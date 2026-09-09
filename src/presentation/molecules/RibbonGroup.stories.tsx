import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import type { Meta, StoryObj } from "@storybook/react";
import RibbonGroup from "./RibbonGroup";

const meta: Meta<typeof RibbonGroup> = {
  title: "Shell/Molecules/RibbonGroup",
  component: RibbonGroup,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SeleccionGroup: Story = {
  args: {
    last: true,
    spec: {
      title: "Selección",
      commands: [
        {
          label: "Seleccionar todo",
          icon: <SelectAllIcon />,
          tip: "Marca todos los puntos de estudio como completados",
          onClick: () => {},
        },
        {
          label: "Limpiar selección",
          icon: <ClearAllIcon />,
          tip: "Desmarca todos los puntos de estudio",
          onClick: () => {},
        },
      ],
    },
  },
};

export const WithDisabledCommand: Story = {
  args: {
    last: false,
    spec: {
      title: "Edición",
      commands: [
        {
          label: "Seleccionar todo",
          icon: <SelectAllIcon />,
          tip: "Marca todos los puntos de estudio como completados",
          onClick: () => {},
        },
        {
          label: "Limpiar selección",
          icon: <ClearAllIcon />,
          tip: "Desmarca todos los puntos de estudio",
          onClick: () => {},
          disabled: true,
        },
      ],
    },
  },
};
