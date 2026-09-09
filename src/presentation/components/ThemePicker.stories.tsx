import type { Meta, StoryObj } from "@storybook/react";
import { expect, screen } from "storybook/test";
import ThemePicker from "./ThemePicker";
import AppThemeHost from "../AppThemeHost";
import type { ISettingsStore } from "../../domain";

const memoryStore: ISettingsStore = {
  load: async () => ({ mode: "dark", seed: "#38bdf8", font: "ibm-plex-mono" }),
  save: async () => {},
};

const meta = {
  title: "Shell/Organisms/ThemePicker",
  component: ThemePicker,
  decorators: [
    (Story) => (
      <AppThemeHost store={memoryStore}>
        <Story />
      </AppThemeHost>
    ),
  ],
  args: {
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const ToggleLightMode: Story = {
  play: async ({ step, userEvent }) => {
    // El Dialog renderiza en un portal: se consulta con `screen`, no con `canvas`.
    await step("Activar modo claro", async () => {
      await userEvent.click(screen.getByRole("switch"));
      await expect(screen.getByText("Modo claro")).toBeInTheDocument();
    });
  },
};
