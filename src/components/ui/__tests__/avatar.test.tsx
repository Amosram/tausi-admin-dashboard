/* eslint-disable indent */
/* eslint-disable react/jsx-max-props-per-line */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Avatar Component", () => {
  it("renders the Avatar component", () => {
    render(<Avatar data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full");
  });

  it("renders the AvatarImage component", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/avatar.jpg" alt="User Avatar" data-testid="avatar-image" />
      </Avatar>
    );
  });

  it("renders the AvatarFallback component when image fails to load", () => {
    render(
    <Avatar data-testid="avatar">
       <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
    </Avatar>
    );
  });
});
