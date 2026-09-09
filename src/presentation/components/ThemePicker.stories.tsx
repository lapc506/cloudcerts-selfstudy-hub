import type { Meta, StoryObj } from "@storybook/react";
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
