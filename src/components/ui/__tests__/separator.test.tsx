import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Separator } from "../separator";

describe("Separator Component", () => {
  it("renders the Separator correctly", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("applies horizontal orientation by default", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("h-[1px] w-full");
  });

  it("applies vertical orientation when specified", () => {
    render(<Separator data-testid="separator" orientation="vertical" />);
    const separator = screen.getByTestId("separator");
    expect(separator).toHaveClass("h-full w-[1px]");
  });

  it("supports the decorative attribute", () => {
    render(<Separator data-testid="separator" decorative />);
  });

  it("accepts custom class names", () => {
    render(<Separator data-testid="separator" className="custom-class" />);
    expect(screen.getByTestId("separator")).toHaveClass("custom-class");
  });
});
