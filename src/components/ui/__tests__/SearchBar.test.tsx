import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {MemoryRouter} from "react-router-dom";
import SearchBar from "../Table/SearchBar";

describe("SearchBar Component", () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  const columns = ["name", "age", "location"];
  const columnLabels = { name: "Name", age: "Age", location: "Location" };
  
  const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it("renders search bar correctly", () => {
    renderWithRouter(<SearchBar columns={columns} columnLabels={columnLabels} onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText("Enter search value")).toBeInTheDocument();
    expect(screen.getByText("Select Column")).toBeInTheDocument();
    expect(screen.getByText("Select Time Range")).toBeInTheDocument();
  });

  it("allows user to type in search input", () => {
    renderWithRouter(<SearchBar columns={columns} columnLabels={columnLabels} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Enter search value");

    fireEvent.change(input, { target: { value: "Alice" } });
    expect(input).toHaveValue("Alice");
  });

  it("calls onSearch when search button is clicked", () => {
    renderWithRouter(<SearchBar columns={columns} columnLabels={columnLabels} onSearch={mockOnSearch} />);
    
    fireEvent.change(screen.getByPlaceholderText("Enter search value"), { target: { value: "Alice" } });
    fireEvent.click(screen.getByText("Search"));

    expect(mockOnSearch).toHaveBeenCalledWith(expect.any(String), "Alice", expect.any(String), undefined);
  });

  it("calls onClear when clear button is clicked", () => {
    renderWithRouter(<SearchBar columns={columns} columnLabels={columnLabels} onSearch={mockOnSearch} onClear={mockOnClear} />);
    
    fireEvent.click(screen.getByText("Clear"));
    expect(mockOnClear).toHaveBeenCalled();
  });
});
