import type { Meta, StoryObj } from "@storybook/react";
import YAMLGuideEditor from "./YAMLGuideEditor";
import { certificationRepository } from "../../infrastructure/yamlCertificationRepository";
import { mockExamRepository } from "../../infrastructure/mockExamRepository";

const meta = {
  title: "Editor/Organisms/YAMLGuideEditor",
  component: YAMLGuideEditor,
  args: {
    repository: certificationRepository,
    mockRepository: mockExamRepository,
  },
} satisfies Meta<typeof YAMLGuideEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
