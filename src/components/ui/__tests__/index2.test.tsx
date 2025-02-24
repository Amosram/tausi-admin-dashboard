import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TanStackTable from "../Table/Table";

const mockData = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
];

const mockColumns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Age",
    accessorKey: "age",
  },
];

describe("TanStackTable Component", () => {
  it("renders table correctly", () => {
    render(<TanStackTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders the correct number of rows", () => {
    render(<TanStackTable data={mockData} columns={mockColumns} />);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(mockData.length + 1); // +1 for the header row
  });
});
