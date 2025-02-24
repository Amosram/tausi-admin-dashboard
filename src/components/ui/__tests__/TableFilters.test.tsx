import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect} from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { TableFilters } from "../Filters/TableFilters";

// Helper component to test navigation
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </MemoryRouter>
  );
};

describe("TableFilters Component", () => {
  it("renders filter buttons correctly", () => {
    render(
      <Wrapper>
        <TableFilters
          filters={[
            { label: "All", value: null },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          queryParam="status"
        />
      </Wrapper>
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("updates the URL query parameters when a filter is clicked", () => {
    const TestComponent = () => {
      const location = useLocation();
      return (
        <>
          <TableFilters
            filters={[
              { label: "All", value: null },
              { label: "Active", value: "active" },
            ]}
            queryParam="status"
          />
          <p data-testid="url">{location.search}</p>
        </>
      );
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    const activeFilter = screen.getByText("Active");
    fireEvent.click(activeFilter);

    expect(screen.getByTestId("url").textContent).toBe("?status=active");

    const allFilter = screen.getByText("All");
    fireEvent.click(allFilter);

    expect(screen.getByTestId("url").textContent).toBe("");
  });

  it("applies active styles correctly", () => {
    render(
      <Wrapper>
        <TableFilters
          filters={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          queryParam="status"
          activeClassName="active-style"
          inactiveClassName="inactive-style"
        />
      </Wrapper>
    );

    const activeFilter = screen.getByText("Active");
    fireEvent.click(activeFilter);

    expect(activeFilter).toHaveClass("active-style");
    expect(screen.getByText("Inactive")).toHaveClass("inactive-style");
  });
});
