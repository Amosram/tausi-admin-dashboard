import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "../checkbox";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Checkbox Component", () => {
  it("renders the Checkbox component", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("toggles the checked state when clicked", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    
    expect(checkbox).not.toHaveAttribute("data-state", "checked");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
    fireEvent.click(checkbox);
    expect(checkbox).not.toHaveAttribute("data-state", "checked");
  });

  it("renders the check icon when checked", () => {
    render(<Checkbox data-testid="checkbox" checked />);
    const checkIcon = screen.getByRole("checkbox", { hidden: true });
    expect(checkIcon).toBeInTheDocument();
  });

  it("applies disabled styles when disabled", () => {
    render(<Checkbox data-testid="checkbox" disabled />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox).toHaveAttribute("disabled");
    expect(checkbox).toHaveClass("disabled:cursor-not-allowed disabled:opacity-50");
  });
});
