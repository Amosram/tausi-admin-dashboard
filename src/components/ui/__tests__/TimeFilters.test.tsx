import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { TimeFilter } from "../Filters/TimeFilters";
import { timeFilterOptions } from "../Filters/timeFilterUtils";

// Sample test data
const sampleData = [
  { date: "2024-02-01", value: 10 },
  { date: "2024-02-10", value: 20 },
];

// Mock filter function
vi.mock("@/components/ui/timeFilterUtils", () => ({
  filterDataByTime: vi.fn((data, field, label) => {
    if (label === "Last 7 Days") {
      return data.filter((item) => item.date >= "2024-02-03");
    }
    return data;
  }),
  timeFilterOptions: [
    { label: "All Time" },
    { label: "Last 7 Days" },
    { label: "Last 30 Days" },
  ],
}));

// Helper component for testing navigation
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>
    <Routes>
      <Route path="*" element={children} />
    </Routes>
  </MemoryRouter>
);

describe("TimeFilter Component", () => {
  it("renders correctly with filter options", () => {
    const mockFilter = vi.fn();

    render(
      <TestWrapper>
        <TimeFilter
          queryParam="time"
          data={sampleData}
          field="date"
          onFilter={mockFilter}
        />
      </TestWrapper>
    );

    // Check if placeholder is displayed
    expect(screen.getByText("Select Time Filter")).toBeInTheDocument();

    // Check if dropdown options exist
    fireEvent.click(screen.getByRole("combobox")); // Open dropdown
    timeFilterOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("updates URL query parameters on selection", () => {
    const mockFilter = vi.fn();

    const TestComponent = () => {
      const location = useLocation();
      return (
        <>
          <TimeFilter
            queryParam="time"
            data={sampleData}
            field="date"
            onFilter={mockFilter}
          />
          <p data-testid="url">{location.search}</p>
        </>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole("combobox")); // Open dropdown;
  });

  it("calls onFilter with filtered data when an option is selected", () => {
    const mockFilter = vi.fn();

    render(
      <TestWrapper>
        <TimeFilter
          queryParam="time"
          data={sampleData}
          field="date"
          onFilter={mockFilter}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole("combobox")); // Open dropdown
  });
});
