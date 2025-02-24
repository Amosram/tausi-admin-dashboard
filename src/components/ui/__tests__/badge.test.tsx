import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Badge } from "../badge";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Badge Component", () => {
  it("renders the Badge component with default variant", () => {
    render(<Badge data-testid="badge">Default Badge</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Default Badge");
    expect(badge).toHaveClass("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80");
  });

  it("renders the Badge component with secondary variant", () => {
    render(<Badge variant="secondary" data-testid="badge-secondary">Secondary Badge</Badge>);
    const badge = screen.getByTestId("badge-secondary");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Secondary Badge");
    expect(badge).toHaveClass("border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80");
  });

  it("renders the Badge component with destructive variant", () => {
    render(<Badge variant="destructive" data-testid="badge-destructive">Destructive Badge</Badge>);
    const badge = screen.getByTestId("badge-destructive");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Destructive Badge");
    expect(badge).toHaveClass("border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-red-600");
  });

  it("renders the Badge component with success variant", () => {
    render(<Badge variant="success" data-testid="badge-success">Success Badge</Badge>);
    const badge = screen.getByTestId("badge-success");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Success Badge");
    expect(badge).toHaveClass("border-transparent bg-green-500 text-white hover:bg-green-400");
  });
});
