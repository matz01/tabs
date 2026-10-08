import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders the label", () => {
    render(<Badge label="Warning" />);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("defaults to the neutral variant", () => {
    render(<Badge label="Warning" />);
    expect(screen.getByText("Warning")).toHaveAttribute("data-variant", "neutral");
  });

  it.each(["neutral", "positive", "negative"] as const)("applies the %s variant", (variant) => {
    render(<Badge label="Warning" variant={variant} />);
    expect(screen.getByText("Warning")).toHaveAttribute("data-variant", variant);
  });

  it("forwards native attributes", () => {
    render(<Badge label="Warning" data-testid="badge" title="Needs attention" />);
    expect(screen.getByTestId("badge")).toHaveAttribute("title", "Needs attention");
  });

  it("merges className instead of replacing it", () => {
    render(<Badge label="Warning" className="custom" />);
    const badge = screen.getByText("Warning");
    expect(badge).toHaveClass("custom");
    expect(badge.classList.length).toBeGreaterThan(1);
  });

  it("does not let consumer props override the variant", () => {
    render(<Badge label="Warning" variant="positive" {...{ "data-variant": "negative" }} />);
    expect(screen.getByText("Warning")).toHaveAttribute("data-variant", "positive");
  });

  it("is not interactive", () => {
    render(<Badge label="Warning" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Warning").tagName).toBe("SPAN");
  });

  it("rejects unknown variants at type level", () => {
    // @ts-expect-error
    render(<Badge label="Warning" variant="warning" />);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });
});
