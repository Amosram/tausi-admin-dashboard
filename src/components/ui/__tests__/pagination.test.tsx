import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../pagination";

describe("Pagination Component", () => {
  it("renders the pagination container", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const navElement = screen.getByRole("navigation", { name: "pagination" });
    expect(navElement).toBeInTheDocument();
  });

  it("renders active pagination link correctly", () => {
    render(
      <PaginationLink href="#" isActive>
        1
      </PaginationLink>
    );

    const linkElement = screen.getByText("1");
    expect(linkElement).toHaveAttribute("aria-current", "page");
  });

  it("renders previous and next buttons with correct labels", () => {
    render(
      <>
        <PaginationPrevious href="#" />
        <PaginationNext href="#" />
      </>
    );

    const prevButton = screen.getByLabelText("Go to previous page");
    const nextButton = screen.getByLabelText("Go to next page");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("renders pagination ellipsis", () => {
    render(<PaginationEllipsis />);

    const ellipsis = screen.getByText("More pages");
    expect(ellipsis).toBeInTheDocument();
  });
});
