import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import type { Meta, StoryObj } from "@storybook/react";
import KpiCard from "./KpiCard";

const meta: Meta<typeof KpiCard> = {
  title: "Dashboard/Molecules/KpiCard",
  component: KpiCard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveCertifications: Story = {
  args: {
    icon: <WorkspacePremiumIcon />,
    color: "primary.main",
    label: "Certificaciones activas",
    value: 5,
  },
};

export const StudyStreak: Story = {
  args: {
    icon: <EmojiEventsIcon />,
    color: "secondary.main",
    label: "Racha de estudio (días)",
    value: 12,
  },
};
