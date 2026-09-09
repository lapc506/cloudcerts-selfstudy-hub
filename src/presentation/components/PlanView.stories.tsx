import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "storybook/test";
import PlanView from "./PlanView";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";
import type { UserState } from "../../domain";

const catalog = certificationRepository.list();

const baseState: UserState = {
  interested: Object.fromEntries(catalog.map((c) => [c.id, true])),
  priority: Object.fromEntries(catalog.map((c) => [c.id, c.defaultPriority])),
  selectedGuides: ["aws-sysops", "cncf-cka", "gcp-ace"],
};

const meta = {
  title: "Plan/Organisms/PlanView",
  component: PlanView,
  args: {
    state: baseState,
    catalog,
    done: {
      "aws-sysops/w1/s0/p0": true,
      "aws-sysops/w1/s0/p1": true,
    },
    onOpenGuide: () => {},
    onChangePriority: fn(),
  },
} satisfies Meta<typeof PlanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    state: { ...baseState, selectedGuides: [] },
  },
};

export const ChangePriority: Story = {
  args: { onChangePriority: fn() },
  play: async ({ args, canvas, userEvent }) => {
    // Espacio sobre el radio enfocado = comportamiento nativo (sin MUI hacks).
    const five = canvas.getAllByRole("radio", { name: /5 Stars$/ })[0];
    five.focus();
    await userEvent.keyboard(" ");
    await expect(args.onChangePriority).toHaveBeenCalledWith("aws-sysops", 5);
  },
};
