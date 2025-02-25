import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../card";

// Mock className utility
vi.mock("@/lib/utils", () => ({
  cn: (...classes) => classes.filter(Boolean).join(" "),
}));

describe("Card Component", () => {
  it("renders the Card component", () => {
    render(<Card data-testid="card">Card Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Card Content");
  });

  it("renders CardHeader correctly", () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>);
    const header = screen.getByTestId("card-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header");
  });

  it("renders CardTitle correctly", () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    const title = screen.getByTestId("card-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Title");
  });

  it("renders CardDescription correctly", () => {
    render(<CardDescription data-testid="card-description">Description</CardDescription>);
    const description = screen.getByTestId("card-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Description");
  });

  it("renders CardContent correctly", () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);
    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Content");
  });

  it("renders CardFooter correctly", () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    const footer = screen.getByTestId("card-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Footer");
  });
});
