import type {Meta, StoryObj} from "@storybook/react-vite";
import {Badge} from "./Badge";

const meta = {
    title: "Badge",
    component: Badge,
    tags: ["autodocs"],
    args: {                      // valori di default per tutte le story
        id: "badge",
        label: "Warning",
    },
    argTypes: {
        variant: {
            control: "inline-radio",
            options: ["neutral", "positive", "negative"],
        }
    }
} satisfies Meta<typeof Badge>

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
    args: {variant: "neutral"},
};

export const Positive: Story = {
    args: {variant: "positive", label: "Done"},
};

export const Negative: Story = {
    args: {variant: "negative"},
};

export const AllVariants: Story = {
    render: (args) => (
        <div style={{display: "flex", gap: 8}}>
            <Badge {...args} label={"warning"} />
            <Badge {...args} label={"positive"} />
            <Badge {...args} label={"negative"} />
        </div>
    )
}

export default meta