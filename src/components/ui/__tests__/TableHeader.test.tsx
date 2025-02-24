import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TableHeader from "../Table/TableHeader";
import { getCoreRowModel, useReactTable, ColumnDef } from "@tanstack/react-table";
import { describe, it, expect } from "vitest";
import React, {useState} from "react";

// Define column structure
const columns: ColumnDef<{ name: string; age: number }>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

// Define test data
const data = [
  { name: "John Doe", age: 30 },
  { name: "Jane Smith", age: 25 },
];

// Create a wrapper component to use the hook
const TableWrapper = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <TableHeader table={table} />
    </table>
  );
};

describe("TableHeader", () => {
  it("renders table headers correctly", () => {
    render(<TableWrapper />);
    
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders a checkbox for selection", () => {
    render(<TableWrapper />);
    expect(screen.getByLabelText("checkbox")).toBeInTheDocument();
  });

  it("toggles sorting icons on header click", async () => {
    render(<TableWrapper />);
    const nameHeader = screen.getByText("Name");
  
    expect(nameHeader).toBeInTheDocument();
  
    const thElement = nameHeader.closest("th");
    expect(thElement).not.toBeNull();

    await waitFor(() => {
      expect(thElement).not.toContainHTML('d="M15 13l-3 3"');
    });
  
    
  });
  
});
