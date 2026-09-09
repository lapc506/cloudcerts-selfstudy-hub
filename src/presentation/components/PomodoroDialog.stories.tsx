import type { Meta, StoryObj } from "@storybook/react";
import PomodoroDialog from "./PomodoroDialog";

const meta = {
  title: "Plan/Organisms/PomodoroDialog",
  component: PomodoroDialog,
  args: {
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof PomodoroDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
