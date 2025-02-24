import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Calendar } from "../calendar";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Calendar Component", () => {
  it("renders the Calendar component", () => {
    render(<Calendar data-testid="calendar" />);
    const calendar = screen.getByTestId("calendar");
    expect(calendar).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Calendar data-testid="calendar" />);
    const prevButton = screen.getByRole("button", { name: /previous month/i });
    const nextButton = screen.getByRole("button", { name: /next month/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("allows navigation to the next month", () => {
    render(<Calendar />);
    const nextButton = screen.getByRole("button", { name: /next month/i });
    fireEvent.click(nextButton);
    expect(nextButton).toBeInTheDocument(); // Ensure the button is still present after navigation
  });

  it("highlights selected days correctly", () => {
    render(<Calendar mode="single" selected={new Date(2025, 1, 14)} />);
    const selectedDay = screen.getByText("14");
    expect(selectedDay).toHaveClass("bg-primary text-primary-foreground");
  });
});
