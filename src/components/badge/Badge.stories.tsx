import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    label: "Warning",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["neutral", "positive", "negative"],
    },
  },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: { variant: "neutral" },
};

export const Positive: Story = {
  args: { variant: "positive", label: "Done" },
};

export const Negative: Story = {
  args: { variant: "negative" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge {...args} variant="neutral" label="neutral" />
      <Badge {...args} variant="positive" label="positive" />
      <Badge {...args} variant="negative" label="negative" />
    </div>
  ),
};

export default meta;
