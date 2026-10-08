import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs, type TabsProps } from "./Tabs";

type FixtureProps = Partial<Pick<TabsProps, "variant" | "onValueChange">> &
  ({ value: string } | { defaultValue?: string });

const Fixture = ({ variant, onValueChange, ...selection }: FixtureProps) => {
  const selectionProps =
    "value" in selection
      ? { value: selection.value }
      : { defaultValue: selection.defaultValue ?? "emails" };

  return (
    <Tabs {...selectionProps} variant={variant} onValueChange={onValueChange}>
      <TabList aria-label="Inbox sections">
        <Tab value="emails">Emails</Tab>
        <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
      </TabList>
      <TabPanel value="emails">Emails content</TabPanel>
      <TabPanel value="files">Files content</TabPanel>
      <TabPanel value="edits">Edits content</TabPanel>
    </Tabs>
  );
};

const getTab = (name: string | RegExp) => screen.getByRole("tab", { name });

describe("Tabs", () => {
  describe("structure and ARIA", () => {
    it("renders a tablist with tabs and the selected panel", () => {
      render(<Fixture />);
      expect(screen.getByRole("tablist", { name: "Inbox sections" })).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Emails content");
    });

    it("marks only the selected tab with aria-selected", () => {
      render(<Fixture defaultValue="files" />);
      expect(getTab(/Files/)).toHaveAttribute("aria-selected", "true");
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "false");
      expect(getTab("Edits")).toHaveAttribute("aria-selected", "false");
    });

    it("links each tab to its panel and back", () => {
      render(<Fixture />);
      const tab = getTab("Emails");
      const panel = screen.getByRole("tabpanel");
      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      expect(panel).toHaveAccessibleName("Emails");
    });

    it("keeps inactive panels in the DOM but hidden", () => {
      const { container } = render(<Fixture />);
      const panels = container.querySelectorAll('[role="tabpanel"]');
      expect(panels).toHaveLength(3);
      expect(screen.getByText("Files content")).not.toBeVisible();
      for (const tab of screen.getAllByRole("tab")) {
        expect(document.getElementById(tab.getAttribute("aria-controls") ?? "")).not.toBeNull();
      }
    });

    it("generates unique ids across instances", () => {
      render(
        <>
          <Fixture />
          <Fixture />
        </>,
      );
      const ids = screen.getAllByRole("tab").map((tab) => tab.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("renders tabs as non-submitting buttons", () => {
      render(<Fixture />);
      for (const tab of screen.getAllByRole("tab")) {
        expect(tab.tagName).toBe("BUTTON");
        expect(tab).toHaveAttribute("type", "button");
      }
    });

    it("makes the selected panel focusable", () => {
      render(<Fixture />);
      expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
    });
  });

  describe("roving tabindex", () => {
    it("puts only the selected tab in the tab sequence", () => {
      render(<Fixture defaultValue="files" />);
      expect(getTab(/Files/)).toHaveAttribute("tabindex", "0");
      expect(getTab("Emails")).toHaveAttribute("tabindex", "-1");
      expect(getTab("Edits")).toHaveAttribute("tabindex", "-1");
    });

    it("moves focus from the tablist to the panel with Tab", async () => {
      const user = userEvent.setup();
      render(<Fixture />);
      await user.tab();
      expect(getTab("Emails")).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("tabpanel")).toHaveFocus();
    });
  });

  describe("mouse interaction", () => {
    it("selects a tab on click and shows its panel", async () => {
      const user = userEvent.setup();
      render(<Fixture />);
      await user.click(getTab("Edits"));
      expect(getTab("Edits")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Edits content");
    });

    it("calls the consumer onClick and respects preventDefault", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="List">
            <Tab value="a">A</Tab>
            <Tab value="b" onClick={onClick} onFocus={(event) => event.preventDefault()}>
              B
            </Tab>
          </TabList>
        </Tabs>,
      );
      await user.click(getTab("B"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("keyboard interaction", () => {
    it("moves to the next tab with ArrowRight and activates it", async () => {
      const user = userEvent.setup();
      render(<Fixture />);
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(getTab(/Files/)).toHaveFocus();
      expect(getTab(/Files/)).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Files content");
    });

    it("moves to the previous tab with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(<Fixture defaultValue="files" />);
      await user.tab();
      await user.keyboard("{ArrowLeft}");
      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("wraps from the last tab to the first and vice versa", async () => {
      const user = userEvent.setup();
      render(<Fixture defaultValue="edits" />);
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(getTab("Emails")).toHaveFocus();
      await user.keyboard("{ArrowLeft}");
      expect(getTab("Edits")).toHaveFocus();
    });

    it("jumps to the first and last tab with Home and End", async () => {
      const user = userEvent.setup();
      render(<Fixture defaultValue="files" />);
      await user.tab();
      await user.keyboard("{End}");
      expect(getTab("Edits")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(getTab("Emails")).toHaveFocus();
    });

    it("ignores unrelated keys", async () => {
      const user = userEvent.setup();
      render(<Fixture />);
      await user.tab();
      await user.keyboard("{ArrowDown}a");
      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("lets the consumer onKeyDown cancel the navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="List" onKeyDown={(event) => event.preventDefault()}>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
        </Tabs>,
      );
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(getTab("A")).toHaveFocus();
    });
  });

  describe("uncontrolled mode", () => {
    it("starts from defaultValue", () => {
      render(<Fixture defaultValue="edits" />);
      expect(getTab("Edits")).toHaveAttribute("aria-selected", "true");
    });

    it("notifies onValueChange only when the value changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fixture onValueChange={onValueChange} />);
      await user.click(getTab("Emails"));
      expect(onValueChange).not.toHaveBeenCalled();
      await user.click(getTab("Edits"));
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("edits");
    });
  });

  describe("controlled mode", () => {
    it("does not change selection without the parent updating value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fixture value="emails" onValueChange={onValueChange} />);
      await user.click(getTab("Edits"));
      expect(onValueChange).toHaveBeenCalledWith("edits");
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Emails content");
    });

    it("follows the value owned by the parent", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [value, setValue] = useState("emails");
        return (
          <>
            <Fixture value={value} onValueChange={setValue} />
            <button type="button" onClick={() => setValue("edits")}>
              External
            </button>
          </>
        );
      };
      render(<Controlled />);
      await user.click(getTab(/Files/));
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Files content");
      await user.click(screen.getByRole("button", { name: "External" }));
      expect(getTab("Edits")).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("variants", () => {
    it("defaults to the pill variant", () => {
      render(<Fixture />);
      expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "pill");
      for (const tab of screen.getAllByRole("tab")) {
        expect(tab).toHaveAttribute("data-variant", "pill");
      }
    });

    it.each(["pill", "underline"] as const)("applies the %s variant to every tab", (variant) => {
      render(<Fixture variant={variant} />);
      expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", variant);
      for (const tab of screen.getAllByRole("tab")) {
        expect(tab).toHaveAttribute("data-variant", variant);
      }
    });
  });

  describe("badge", () => {
    it("renders the badge inside the tab and includes it in the accessible name", () => {
      render(<Fixture />);
      const tab = getTab("Files Warning");
      expect(tab).toContainElement(screen.getByText("Warning"));
    });

    it.each(["neutral", "positive", "negative"] as const)("supports the %s badge", (variant) => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="List">
            <Tab value="a" badge={{ label: "Info", variant }}>
              A
            </Tab>
          </TabList>
        </Tabs>,
      );
      expect(screen.getByText("Info")).toHaveAttribute("data-variant", variant);
    });

    it("renders no badge when the prop is omitted", () => {
      render(<Fixture />);
      expect(getTab("Emails").children).toHaveLength(1);
    });
  });

  describe("native attributes", () => {
    it("forwards attributes and merges className on every part", () => {
      render(
        <Tabs defaultValue="a" className="root" data-testid="root">
          <TabList aria-label="List" className="list">
            <Tab value="a" className="tab" data-testid="tab">
              A
            </Tab>
          </TabList>
          <TabPanel value="a" className="panel" data-testid="panel">
            Content
          </TabPanel>
        </Tabs>,
      );
      expect(screen.getByTestId("root")).toHaveClass("root");
      expect(screen.getByRole("tablist")).toHaveClass("list");
      expect(screen.getByTestId("tab")).toHaveClass("tab");
      expect(screen.getByTestId("panel")).toHaveClass("panel");
    });

    it("lets the panel opt out of the tab sequence", () => {
      render(
        <Tabs defaultValue="a">
          <TabList aria-label="List">
            <Tab value="a">A</Tab>
          </TabList>
          <TabPanel value="a" tabIndex={-1}>
            <button type="button">Inside</button>
          </TabPanel>
        </Tabs>,
      );
      expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("composition errors", () => {
    it.each([
      ["TabList", () => <TabList aria-label="List" />],
      ["Tab", () => <Tab value="a">A</Tab>],
      ["TabPanel", () => <TabPanel value="a">A</TabPanel>],
    ])("throws when <%s> is used outside <Tabs>", (name, Component) => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<Component />)).toThrow(`<${name}> must be used within <Tabs>`);
      vi.restoreAllMocks();
    });
  });
});
