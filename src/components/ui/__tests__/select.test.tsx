import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../select";

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.Element.prototype, "hasPointerCapture", {
  writable: true,
  value: vi.fn(() => false),
});

describe("Select Component", () => {
  it("renders Select correctly", () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option">Option </SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
  });

  it("opens the select dropdown when clicked", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-option1">
            Option 1
          </SelectItem>
          <SelectItem value="option2" data-testid="select-option2">
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger");
    await userEvent.click(trigger);
  });

  it("selects an option and updates the value", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue data-testid="select-value" placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option" data-testid="select-option">
            Option
          </SelectItem>
        </SelectContent>
      </Select>
    );

    await userEvent.click(screen.getByTestId("select-trigger"));
  });

  it("does not allow selection if disabled", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger" disabled>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-option">
            Option
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger");
    expect(trigger).toBeDisabled();

    await userEvent.click(trigger);
    expect(screen.queryByTestId("select-option1")).not.toBeInTheDocument();
  });

  it("applies accessibility attributes", () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-option">
            Option
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
