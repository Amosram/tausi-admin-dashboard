import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetHeader, SheetDescription, SheetFooter } from "../sheet";

describe("Sheet Component", () => {
  it("renders the Sheet trigger", () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open Sheet</SheetTrigger>
      </Sheet>
    );
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });

  it("opens the Sheet when triggered", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Open Sheet"));

    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByText("Sheet Title")).toBeInTheDocument();
  });

  it("closes the Sheet when the close button is clicked", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetClose data-testid="sheet-close" />
        </SheetContent>
      </Sheet>
    );

    await userEvent.click(screen.getByText("Open Sheet"));
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("sheet-close"));
    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
  });

  it("applies the correct side variant (right by default)", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content" side="right">
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await userEvent.click(screen.getByText("Open Sheet"));
    const content = screen.getByTestId("sheet-content");

    expect(content).toHaveClass("inset-y-0 right-0");
  });

  it("applies custom class names", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content" className="custom-class">
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await userEvent.click(screen.getByText("Open Sheet"));
    expect(screen.getByTestId("sheet-content")).toHaveClass("custom-class");
  });
});

it("renders the SheetHeader and SheetFooter correctly", async () => {
  render(
    <Sheet>
      <SheetTrigger>Open Sheet</SheetTrigger>
      <SheetContent data-testid="sheet-content">
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
        </SheetHeader>
        <SheetFooter>Sheet Footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );

  await userEvent.click(screen.getByText("Open Sheet"));
  expect(screen.getByText("Sheet Title")).toBeInTheDocument();
  expect(screen.getByText("Sheet Description")).toBeInTheDocument();
  expect(screen.getByText("Sheet Footer")).toBeInTheDocument();
});


