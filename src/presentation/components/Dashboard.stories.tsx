import type { Meta, StoryObj } from "@storybook/react";
import Dashboard from "./Dashboard";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";
import type { UserState } from "../../domain";

const catalog = certificationRepository.list();

const baseState: UserState = {
  interested: Object.fromEntries(catalog.map((c) => [c.id, true])),
  priority: Object.fromEntries(catalog.map((c) => [c.id, c.defaultPriority])),
  selectedGuides: ["aws-sysops", "cncf-cka", "gcp-ace"],
};

const meta = {
  title: "Dashboard/Organisms/Dashboard",
  component: Dashboard,
  args: {
    state: baseState,
    catalog,
    done: {},
  },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
