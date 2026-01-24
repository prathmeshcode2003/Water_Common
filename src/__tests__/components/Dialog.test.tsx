import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/Water.Citizen/Dialog";

describe("Dialog", () => {
  it("renders children when open", () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <div data-testid="dialog-child">Dialog Content</div>
      </Dialog>
    );
    expect(screen.getByTestId("dialog-child")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(
      <Dialog open={false} onOpenChange={() => {}}>
        <div data-testid="dialog-child">Dialog Content</div>
      </Dialog>
    );
    expect(screen.queryByTestId("dialog-child")).not.toBeInTheDocument();
  });

  it("DialogTrigger calls onClick", () => {
    const onClick = vi.fn();
    render(<DialogTrigger onClick={onClick}><button>Open</button></DialogTrigger>);
    fireEvent.click(screen.getByText("Open"));
    expect(onClick).toHaveBeenCalled();
  });

  it("DialogContent renders children and calls onClose", () => {
    const onClose = vi.fn();
    render(
      <DialogContent onClose={onClose}>
        <div data-testid="dialog-content">Dialog Body</div>
      </DialogContent>
    );
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    // Overlay click
    fireEvent.click(document.querySelector(".fixed.inset-0")!);
    expect(onClose).toHaveBeenCalled();
    // Close button click
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("DialogContent supports className and maxWidth", () => {
    render(
      <DialogContent className="custom-class" maxWidth="max-w-2xl">
        <div data-testid="dialog-content">Dialog Body</div>
      </DialogContent>
    );
    const content = screen.getByTestId("dialog-content").parentElement!;
    expect(content).toHaveClass("custom-class");
    expect(content).toHaveClass("max-w-2xl");
  });

  it("DialogHeader, DialogTitle, DialogDescription render children and className", () => {
    render(
      <>
        <DialogHeader className="header-class">Header</DialogHeader>
        <DialogTitle className="title-class">Title</DialogTitle>
        <DialogDescription className="desc-class">Desc</DialogDescription>
      </>
    );
    expect(screen.getByText("Header")).toHaveClass("header-class");
    expect(screen.getByText("Title")).toHaveClass("title-class");
    expect(screen.getByText("Desc")).toHaveClass("desc-class");
  });
});
