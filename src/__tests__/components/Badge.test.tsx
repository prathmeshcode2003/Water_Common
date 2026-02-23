import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/common/Water.Citizen/Badge";

describe("Badge Component", () => {
  it("renders with default props", () => {
    render(<Badge>Default Badge</Badge>);
    expect(screen.getByText("Default Badge")).toBeInTheDocument();
  });

  it("applies the correct variant classes", () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toHaveClass("bg-emerald-100 text-emerald-800 border-emerald-200");
  });

  it("applies the correct size classes", () => {
    render(<Badge size="lg">Large Badge</Badge>);
    const badge = screen.getByText("Large Badge");
    expect(badge).toHaveClass("px-4 py-2 text-base");
  });
});