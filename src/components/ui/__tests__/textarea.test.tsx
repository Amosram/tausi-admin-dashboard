import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "../textarea";

describe("Textarea Component", () => {
  it("renders correctly", () => {
    render(<Textarea data-testid="textarea" placeholder="Type here..." />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Type here...");
  });

  it("accepts user input", () => {
    render(<Textarea data-testid="textarea" />);
    
    const textarea = screen.getByTestId("textarea");

    fireEvent.change(textarea, { target: { value: "Hello, world!" } });

    expect(textarea).toHaveValue("Hello, world!");
  });

  it("handles disabled state correctly", () => {
    render(<Textarea data-testid="textarea" disabled />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeDisabled();
  });
});
