import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Button Component", () => {
  it("renders the Button component with default variant and size", () => {
    render(<Button data-testid="button">Click me</Button>);
    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2");
  });

  it("renders the Button component with a secondary variant", () => {
    render(<Button variant="secondary" data-testid="button-secondary">Secondary</Button>);
    const button = screen.getByTestId("button-secondary");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Secondary");
    expect(button).toHaveClass("bg-secondary text-secondary-foreground hover:bg-secondary/80");
  });

  it("renders the Button component with a large size", () => {
    render(<Button size="lg" data-testid="button-large">Large</Button>);
    const button = screen.getByTestId("button-large");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Large");
    expect(button).toHaveClass("h-11 rounded-md px-8");
  });

  it("renders the Button component as a child element (Slot)", () => {
    render(
      <Button asChild>
        <a href="#" data-testid="button-link">Link Button</a>
      </Button>
    );
    const button = screen.getByTestId("button-link");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("A");
  });
});
