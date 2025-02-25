import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../table";

describe("Table Component", () => {
  it("renders Table without crashing", () => {
    render(<Table data-testid="table" />);
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  it("renders TableHeader, TableBody, and TableFooter", () => {
    render(
      <Table>
        <TableHeader data-testid="table-header">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body">
          <TableRow>
            <TableCell>Body Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="table-footer">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
    expect(screen.getByTestId("table-footer")).toBeInTheDocument();
  });

  it("renders TableRow, TableHead, and TableCell correctly", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="table-row">
            <TableHead data-testid="table-head">Head</TableHead>
            <TableCell data-testid="table-cell">Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByTestId("table-row")).toBeInTheDocument();
    expect(screen.getByTestId("table-head")).toHaveTextContent("Head");
    expect(screen.getByTestId("table-cell")).toHaveTextContent("Cell");
  });

  it("renders TableCaption correctly", () => {
    render(<TableCaption data-testid="table-caption">Caption Text</TableCaption>);
    expect(screen.getByTestId("table-caption")).toHaveTextContent("Caption Text");
  });

  it("applies custom class names", () => {
    render(<Table className="custom-class" data-testid="table" />);
    expect(screen.getByTestId("table")).toHaveClass("custom-class");
  });
});
