import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import type { BadgeVariant } from "../badge/Badge";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";

type StoryArgs = {
  variant: "pill" | "underline";
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  onValueChange: (value: string) => void;
};

const items = [
  { value: "emails", label: "Emails" },
  { value: "files", label: "Files", badge: true },
  { value: "edits", label: "Edits" },
  { value: "dashboard", label: "Dashboard" },
  { value: "messages", label: "Messages" },
];

const meta = {
  title: "Components/Tabs",
  tags: ["autodocs"],
  args: {
    variant: "pill",
    badgeLabel: "Warning",
    badgeVariant: "negative",
    onValueChange: fn(),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["pill", "underline"] },
    badgeVariant: { control: "inline-radio", options: ["neutral", "positive", "negative"] },
  },
  render: ({ variant, badgeLabel, badgeVariant, onValueChange }) => (
    <Tabs defaultValue="emails" variant={variant} onValueChange={onValueChange}>
      <TabList aria-label="Inbox sections">
        {items.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            badge={item.badge ? { label: badgeLabel, variant: badgeVariant } : undefined}
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanel key={item.value} value={item.value}>
          {item.label} content
        </TabPanel>
      ))}
    </Tabs>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pill: Story = {};

export const Underline: Story = {
  args: { variant: "underline" },
};

export const BadgeVariants: Story = {
  render: ({ variant, onValueChange }) => (
    <Tabs defaultValue="neutral" variant={variant} onValueChange={onValueChange}>
      <TabList aria-label="Badge variants">
        <Tab value="neutral" badge={{ label: "Neutral", variant: "neutral" }}>
          Messages
        </Tab>
        <Tab value="positive" badge={{ label: "Done", variant: "positive" }}>
          Dashboard
        </Tab>
        <Tab value="negative" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
      </TabList>
      <TabPanel value="neutral">Neutral badge</TabPanel>
      <TabPanel value="positive">Positive badge</TabPanel>
      <TabPanel value="negative">Negative badge</TabPanel>
    </Tabs>
  ),
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

type ControlledArgs = StoryArgs & { value: string };

export const Controlled: StoryObj<ControlledArgs> = {
  args: { value: "files" },
  argTypes: {
    value: { control: "select", options: items.map((item) => item.value) },
  },
  render: function ControlledRender({ variant, value, onValueChange }) {
    const [, updateArgs] = useArgs<ControlledArgs>();

    return (
      <Tabs
        value={value}
        variant={variant}
        onValueChange={(next) => {
          onValueChange(next);
          updateArgs({ value: next });
        }}
      >
        <TabList aria-label="Inbox sections">
          {items.map((item) => (
            <Tab key={item.value} value={item.value}>
              {item.label}
            </Tab>
          ))}
        </TabList>
        {items.map((item) => (
          <TabPanel key={item.value} value={item.value}>
            {item.label} content
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};
