import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Label } from "../label";

describe("Label Component", () => {
  it("renders correctly", () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("applies additional classes", () => {
    render(<Label className="custom-class">Styled Label</Label>);

    const label = screen.getByText("Styled Label");
    expect(label).toHaveClass("custom-class");
  });

  it("associates with input field", () => {
    render(
      <>
        <Label htmlFor="input-id">Label for Input</Label>
        <input id="input-id" type="text" />
      </>
    );

    const label = screen.getByText("Label for Input");
    expect(label).toHaveAttribute("for", "input-id");
  });
});
