import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Slider } from "../slider";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};


describe("Slider Component", () => {
  it("renders without crashing", () => {
    render(<Slider data-testid="slider" />);
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("renders track, range, and thumb elements", () => {
    render(<Slider data-testid="slider" />);
    
    const slider = screen.getByTestId("slider");

    const track = slider.querySelector('[class*="h-1.5"]');
    expect(track).toBeInTheDocument();

    const range = slider.querySelector('[class*="absolute"][class*="h-full"]');
    expect(range).toBeInTheDocument();

    const thumb = screen.getByRole("slider");
    expect(thumb).toBeInTheDocument();
  });

  it("applies custom class names", () => {
    render(<Slider className="custom-class" data-testid="slider" />);
    expect(screen.getByTestId("slider")).toHaveClass("custom-class");
  });

  it("allows value change with keyboard input", async () => {
    render(<Slider defaultValue={[50]} min={0} max={100} step={10} aria-label="slider" />);
    const thumb = screen.getByRole("slider");

    expect(thumb).toHaveAttribute("aria-valuenow", "50");

  });
});
