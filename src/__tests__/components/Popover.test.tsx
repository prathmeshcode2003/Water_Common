import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest"; // <-- Add this import
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/common/Water.Citizen/Popover";

describe("Popover", () => {
  it("renders children", () => {
    render(<Popover><div data-testid="popover-child">Popover Content</div></Popover>);
    expect(screen.getByTestId("popover-child")).toBeInTheDocument();
  });

  it("PopoverTrigger calls onClick", () => {
    const onClick = vi.fn(); // <-- Use vi.fn()
    render(<PopoverTrigger onClick={onClick}><button>Trigger</button></PopoverTrigger>);
    fireEvent.click(screen.getByText("Trigger"));
    expect(onClick).toHaveBeenCalled();
  });

  it("PopoverContent renders when open, not when closed", () => {
    const { rerender } = render(
      <PopoverContent open={true}><div data-testid="popover-content">Content</div></PopoverContent>
    );
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    rerender(<PopoverContent open={false}><div>Content</div></PopoverContent>);
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  it("PopoverContent calls onClose on outside click", () => {
    const onClose = vi.fn(); // <-- Use vi.fn()
    render(
      <div>
        <PopoverContent open={true} onClose={onClose}>
          <div data-testid="popover-content">Popover</div>
        </PopoverContent>
        <button data-testid="outside">Outside</button>
      </div>
    );
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onClose).toHaveBeenCalled();
  });

  it("PopoverContent supports className, width, padding, style", () => {
    render(
      <PopoverContent
        open={true}
        className="custom-class"
        width="w-96"
        padding="p-8"
        style={{ background: "red" }}
      >
        <div data-testid="popover-content">Popover</div>
      </PopoverContent>
    );
    const content = screen.getByTestId("popover-content").parentElement!;
    expect(content).toHaveClass("custom-class");
    expect(content).toHaveClass("w-96");
    expect(content).toHaveClass("p-8");
    expect(content).toHaveStyle({ background: "red" });
  });
});
