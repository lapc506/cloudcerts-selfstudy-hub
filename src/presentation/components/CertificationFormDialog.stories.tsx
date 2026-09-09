import type { Meta, StoryObj } from "@storybook/react";
import CertificationFormDialog from "./CertificationFormDialog";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";

const noop = () => false;

const meta = {
  title: "Plan/Organisms/CertificationFormDialog",
  component: CertificationFormDialog,
  args: {
    open: true,
    catalog: certificationRepository.list(),
    onClose: () => {},
    onSaveYamlText: noop,
    onSaved: () => {},
  },
} satisfies Meta<typeof CertificationFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
