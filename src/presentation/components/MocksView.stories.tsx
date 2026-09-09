import type { Meta, StoryObj } from "@storybook/react";
import MocksView from "./MocksView";
import QuizRunner from "./QuizRunner";
import { mockExamRepository, resolveMockQuestions } from "../../infrastructure/mockExamRepository";

const mocks = mockExamRepository.listMocks();
const banks = mockExamRepository.listBanks();

const meta = {
  title: "Mocks/Organisms/MocksView",
  component: MocksView,
  args: {
    mocks,
    banks,
    resolveQuestions: resolveMockQuestions,
    practice: [
      {
        code: "SOA-C02",
        title: "AWS Certified SysOps Administrator - Associate (SOA-C02)",
        url: "https://www.examtopics.com/exams/amazon/aws-certified-sysops-administrator-associate/",
        questions: 478,
      },
    ],
  },
} satisfies Meta<typeof MocksView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RunnerOpen: Story = {
  render: () => {
    const mock = mocks[0];
    return <QuizRunner mock={mock} questions={resolveMockQuestions(mock)} onExit={() => {}} />;
  },
};
