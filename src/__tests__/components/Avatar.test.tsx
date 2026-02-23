
import { render, screen } from "@testing-library/react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/common/Water.Citizen/Avatar";

describe("Avatar", () => {
  it("renders children and className", () => {
    render(<Avatar className="avatar-class"><span>Pic</span></Avatar>);
    const avatar = screen.getByText("Pic").parentElement!;
    expect(avatar).toHaveClass("avatar-class");
    expect(avatar).toHaveClass("rounded-full");
  });

  it("AvatarFallback renders children and className", () => {
    render(<AvatarFallback className="fallback-class">Fallback</AvatarFallback>);
    const fallback = screen.getByText("Fallback");
    expect(fallback).toHaveClass("fallback-class");
    expect(fallback).toHaveClass("flex");
  });
});
