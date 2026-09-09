import type { Meta, StoryObj } from "@storybook/react";
import Ribbon from "./Ribbon";

const noop = () => {};

const meta = {
  title: "Shell/Organisms/Ribbon",
  component: Ribbon,
  args: {
    view: "home",
    onViewChange: noop,
    groupBy: "entity",
    onGroupByChange: noop,
    onSelectAll: noop,
    onClearAll: noop,
    onOpenTheme: noop,
    onCopyResponse: noop,
    onSaveYaml: noop,
    onSavePlan: noop,
    canCopy: true,
  },
} satisfies Meta<typeof Ribbon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeTab: Story = {};

export const ProgressTab: Story = {
  args: { view: "progress" },
};

export const GuidesTab: Story = {
  args: { view: "guides" },
};

export const EditorTab: Story = {
  args: { view: "editor" },
};

export const MocksTab: Story = {
  args: { view: "mocks" },
};

export const GroupByPriority: Story = {
  args: { groupBy: "priority" },
};
