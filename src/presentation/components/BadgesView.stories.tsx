import type { Meta, StoryObj } from "@storybook/react";
import BadgesView from "./BadgesView";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";
import type { UserState } from "../../domain";

const catalog = certificationRepository.list();

const baseState: UserState = {
  interested: Object.fromEntries(catalog.map((c) => [c.id, true])),
  priority: Object.fromEntries(catalog.map((c) => [c.id, c.defaultPriority])),
  selectedGuides: ["aws-saa", "ms-az104", "cncf-cka"],
};

const meta = {
  title: "Badges/Organisms/BadgesView",
  component: BadgesView,
  args: {
    state: baseState,
    catalog,
  },
} satisfies Meta<typeof BadgesView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    state: { ...baseState, selectedGuides: [] },
  },
};
