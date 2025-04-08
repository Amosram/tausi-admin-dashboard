import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import Filters from "../Table/Filters";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

const mockFilters = [
  { label: "Category A", column: "category", value: "A", operator: "=" },
  { label: "Category B", column: "category", value: "B", operator: "=" },
];

describe("Filters Component", () => {
  it("renders filter buttons correctly", () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
    ] as any);

    render(
      <MemoryRouter>
        <Filters filters={mockFilters} onFilterSelect={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Category B")).toBeInTheDocument();
  });

  it("calls onFilterSelect when a filter is clicked", () => {
    const onFilterSelect = vi.fn();

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
    ] as any);

    render(
      <MemoryRouter>
        <Filters filters={mockFilters} onFilterSelect={onFilterSelect} />
      </MemoryRouter>
    );

    const filterButton = screen.getByText("Category A");
    fireEvent.click(filterButton);

    expect(onFilterSelect).toHaveBeenCalledWith(mockFilters[0]);
  });

  it("applies active styles when a filter is selected", () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        column: "category",
        q: "A",
        op: "=",
      }),
    ] as any);

    render(
      <MemoryRouter>
        <Filters filters={mockFilters} onFilterSelect={vi.fn()} />
      </MemoryRouter>
    );

    const activeFilter = screen.getByText("Category A");

    expect(activeFilter).toHaveClass("bg-primary");
  });
});
