import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders label without crashing", () => {
    render(<Badge data-testid={"badge-123"} label={"Warning"} />);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it.each(["neutral", "positive", "negative"] as const)("applies the %s variant", (variant) => {
    render(<Badge data-testid={"badge-123"} label={"Warning"} variant={variant} />);
    expect(screen.getByTestId("badge-123")).toHaveAttribute("data-variant", variant);
  });
});
