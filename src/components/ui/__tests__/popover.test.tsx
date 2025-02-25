import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";

describe("Popover Component", () => {
  it("renders PopoverTrigger correctly", async () => {
    render(
      <Popover>
        <PopoverTrigger data-testid="popover-trigger">Open</PopoverTrigger>
      </Popover>
    );

    const trigger = screen.getByTestId("popover-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Open");
  });

  it("opens and closes the Popover content", async () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText("Toggle");
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    expect(screen.getByText("Popover Content")).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
  });

  it("applies alignment and offset properties", async () => {
    render(
      <Popover>
        <PopoverTrigger>Align Test</PopoverTrigger>
        <PopoverContent align="start" sideOffset={10}>
          Aligned Content
        </PopoverContent>
      </Popover>
    );

    await userEvent.click(screen.getByText("Align Test"));
    const content = screen.getByText("Aligned Content");

    expect(content).toBeInTheDocument();
  });
});
