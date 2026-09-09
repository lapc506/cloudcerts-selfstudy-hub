import type { Meta, StoryObj } from "@storybook/react";
import StudyGuide from "./StudyGuide";
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
  title: "Guides/Organisms/StudyGuide",
  component: StudyGuide,
  args: {
    state: baseState,
    catalog,
    focus: null,
    done: {},
    onTogglePoint: noop,
  },
} satisfies Meta<typeof StudyGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithProgress: Story = {
  args: {
    done: {
      "aws-sysops/w1/s0/p0": true,
      "aws-sysops/w1/s0/p1": true,
      "cncf-cka/w6/s0/p0": true,
      "cncf-cka/w6/s0/p1": true,
      "cncf-cka/w6/s0/p2": true,
    },
  },
};
