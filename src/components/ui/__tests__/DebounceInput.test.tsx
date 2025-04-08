import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { DebouncedInput } from "../DebounceInput";

describe("DebouncedInput", () => {
  it("renders correctly", () => {
    render(<DebouncedInput value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("updates value on user input", () => {
    render(<DebouncedInput value="" onChange={() => {}} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");
  });

  it("calls onChange after debounce time", async () => {
    const onChangeMock = vi.fn();
    const debounceTime = 300;

    render(<DebouncedInput value="" onChange={onChangeMock} debounceTime={debounceTime} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith("Test");
    }, { timeout: debounceTime + 100 });
  });

  it("updates input value when external value changes", () => {
    const { rerender } = render(<DebouncedInput value="Initial" onChange={() => {}} />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveValue("Initial");

    rerender(<DebouncedInput value="Updated" onChange={() => {}} />);
    expect(input).toHaveValue("Updated");
  });
});
