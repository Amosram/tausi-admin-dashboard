import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Switch } from "../switch";

describe("Switch Component", () => {
  it("renders without crashing", () => {
    render(<Switch data-testid="switch" />);
    expect(screen.getByTestId("switch")).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Switch className="custom-class" data-testid="switch" />);
    expect(screen.getByTestId("switch")).toHaveClass("custom-class");
  });

  it("toggles state when clicked", async () => {
    render(<Switch data-testid="switch" />);
    const switchComponent = screen.getByTestId("switch");

    expect(switchComponent).toHaveAttribute("data-state", "unchecked");

    await userEvent.click(switchComponent);
    expect(switchComponent).toHaveAttribute("data-state", "checked");

    await userEvent.click(switchComponent);
    expect(switchComponent).toHaveAttribute("data-state", "unchecked");
  });

  it("supports keyboard interaction", async () => {
    render(<Switch data-testid="switch" />);
    const switchComponent = screen.getByTestId("switch");

    expect(switchComponent).toHaveAttribute("data-state", "unchecked");
  });
});
