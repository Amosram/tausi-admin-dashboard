import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input Component", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("supports different input types", () => {
    render(<Input type="password" data-testid="password-input" />);
    
    const input = screen.getByTestId("password-input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="text-input" />);
    
    const input = screen.getByTestId("text-input");
    await user.type(input, "Hello, world!");
    
    expect(input).toHaveValue("Hello, world!");
  });

  it("disables input when disabled prop is passed", () => {
    render(<Input disabled data-testid="disabled-input" />);
    
    const input = screen.getByTestId("disabled-input");
    expect(input).toBeDisabled();
  });

  it("shows the correct placeholder", () => {
    render(<Input placeholder="Type here..." />);
    
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });
});
