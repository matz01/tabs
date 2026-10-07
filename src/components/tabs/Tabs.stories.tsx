import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { variant: "pill" },
  argTypes: {
    variant: { control: "inline-radio", options: ["pill", "underline"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const renderTabs: Story["render"] = (args) => (
  <Tabs defaultValue="Emails" variant={args.variant}>
    <TabList>
      <Tab value="emails">Emails</Tab>
      <Tab value="passwords">Passwords</Tab>
      <Tab value="files" badge={{ label: "warning", variant: "negative" }}>
        Files
      </Tab>
    </TabList>
  </Tabs>
);

export const Pill: Story = { render: renderTabs };

export const Underline: Story = {
  args: { variant: "underline" },
  render: renderTabs,
};
