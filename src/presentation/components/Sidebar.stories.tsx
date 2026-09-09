import { Box } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "storybook/test";
import Sidebar from "./Sidebar";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";
import type { UserState } from "../../domain";

const catalog = certificationRepository.list();

const baseState: UserState = {
  interested: Object.fromEntries(catalog.map((c) => [c.id, true])),
  priority: Object.fromEntries(catalog.map((c) => [c.id, c.defaultPriority])),
  selectedGuides: ["aws-sysops", "cncf-cka"],
};

const noop = () => {};

const meta = {
  title: "Plan/Organisms/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <Box sx={{ height: 800, display: "flex" }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    state: baseState,
    catalog,
    groupBy: "entity",
    onToggleInterest: noop,
    onChangePriority: noop,
    onToggleGuide: noop,
    onNavigateWeek: noop,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntityGroups: Story = {};

export const PriorityGroups: Story = {
  args: { groupBy: "priority" },
};

export const DifficultyGroups: Story = {
  args: { groupBy: "difficulty" },
};

export const InterestToggle: Story = {
  args: { onToggleInterest: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const boxes = canvas.getAllByRole("checkbox");
    await userEvent.click(boxes[0]);
    // catalog[0] (aws-clf) no está en selectedGuides → el clic lo marca (true).
    await expect(args.onToggleInterest).toHaveBeenCalledWith(
      catalog[0].id,
      true
    );
  },
};
