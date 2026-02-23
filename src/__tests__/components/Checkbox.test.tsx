import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../../components/common/Water.Citizen/Checkbox";

describe("Checkbox Component", () => {
  it("renders with default props", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("toggles checked state on click", () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("applies the correct size classes", () => {
    render(<Checkbox size="lg" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("h-6 w-6");
  });

  it("applies the correct variant classes", () => {
    render(<Checkbox variant="outline" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("border-2 border-gray-500");
  });
});