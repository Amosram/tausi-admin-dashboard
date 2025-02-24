import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { RadioGroup, RadioGroupItem } from "../radioGroup";

describe("RadioGroup Component", () => {
  it("renders RadioGroup and RadioGroupItem correctly", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" data-testid="radio-option1" />
        <RadioGroupItem value="option2" data-testid="radio-option2" />
      </RadioGroup>
    );

    expect(screen.getByTestId("radio-option1")).toBeInTheDocument();
    expect(screen.getByTestId("radio-option2")).toBeInTheDocument();
  });

  it("allows selecting a radio item", async () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" data-testid="radio-option1" />
        <RadioGroupItem value="option2" data-testid="radio-option2" />
      </RadioGroup>
    );

    const radio1 = screen.getByTestId("radio-option1");
    const radio2 = screen.getByTestId("radio-option2");

    await userEvent.click(radio1);
    expect(radio1).toHaveAttribute("data-state", "checked");

    await userEvent.click(radio2);
    expect(radio2).toHaveAttribute("data-state", "checked");
    expect(radio1).not.toHaveAttribute("data-state", "checked");
  });

  it("applies accessibility attributes", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" data-testid="radio-option1" />
      </RadioGroup>
    );

    const radio1 = screen.getByTestId("radio-option1");

    expect(radio1).toHaveAttribute("role", "radio");
    expect(radio1).toHaveAttribute("aria-checked", "false");
  });

  it("handles disabled state", async () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" data-testid="radio-option1" disabled />
      </RadioGroup>
    );

    const radio1 = screen.getByTestId("radio-option1");

    expect(radio1).toBeDisabled();
    await userEvent.click(radio1);
    expect(radio1).not.toHaveAttribute("data-state", "checked");
  });
});
