import type { Meta, StoryObj } from "@storybook/react";
import CodelabsView from "./CodelabsView";

const meta = {
  title: "Codelabs/Organisms/CodelabsView",
  component: CodelabsView,
} satisfies Meta<typeof CodelabsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
