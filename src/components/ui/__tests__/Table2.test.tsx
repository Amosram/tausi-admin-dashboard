import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TanStackTable from "../Table/Table";
import { ColumnDef } from "@tanstack/react-table";

// Sample data
const mockData = [
  { id: 1, name: "Alice", status: "Active", createdAt: "2024-02-01" },
  { id: 2, name: "Bob", status: "Inactive", createdAt: "2024-01-15" },
  { id: 3, name: "Charlie", status: "Active", createdAt: "2024-03-05" },
];

// Table columns definition
const columns: ColumnDef<typeof mockData[0]>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "createdAt", header: "Date Created" },
];

describe("TanStackTable Component", () => {
  it("renders the table with correct data", () => {
    render(<TanStackTable data={mockData} columns={columns} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("allows sorting by date", () => {
    render(<TanStackTable data={mockData} columns={columns} />);

    const dateHeader = screen.getByText("Date Created");
    fireEvent.click(dateHeader);
    fireEvent.click(dateHeader);

    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Charlie");
  });

  it("allows filtering by status", () => {
    render(
      <TanStackTable
        data={mockData}
        columns={columns}
        STATUS_OPTIONS={[{ label: "Active", value: "Active" }]}
      />
    );

    expect(screen.getAllByText("Active")).toHaveLength(3);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).toBeInTheDocument();
  });

  it("handles row selection", () => {
    const onRowSelection = vi.fn();
    render(
      <TanStackTable data={mockData} columns={columns} onRowSelection={onRowSelection} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // Select first row

    expect(onRowSelection).toHaveBeenCalledWith([mockData[0]]);
  });

  it("handles pagination", () => {
    render(
      <TanStackTable data={mockData} columns={columns} showNavigation={true} />
    );
  });
});
