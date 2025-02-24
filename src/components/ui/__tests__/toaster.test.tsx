import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toaster } from "../toaster";
import { useToast } from "@/hooks/use-toast";

// Mock the `useToast` hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("Toaster Component", () => {
  it("renders multiple toasts correctly", () => {
    useToast.mockReturnValue({
      toasts: [
        { id: "1", title: "Toast 1", description: "This is toast 1" },
        { id: "2", title: "Toast 2", description: "This is toast 2" },
      ],
    });

    render(<Toaster />);

    expect(screen.getByText("Toast 1")).toBeInTheDocument();
    expect(screen.getByText("This is toast 1")).toBeInTheDocument();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("This is toast 2")).toBeInTheDocument();
  });

  it("closes a toast when the close button is clicked", async () => {
    useToast.mockReturnValue({
      toasts: [
        { id: "1", title: "Toast 1", description: "This is toast 1" },
      ],
    });

    render(<Toaster />);

    const closeButton = screen.getByRole("button");

    expect(screen.getByText("Toast 1")).toBeInTheDocument();

    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByText("Toast 1")).not.toBeInTheDocument());
  });
});
