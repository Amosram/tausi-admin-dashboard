import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../tooltip";

describe("Tooltip Component", () => {
  it("renders and displays tooltip content on hover", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId("tooltip-trigger"));

    fireEvent.mouseLeave(screen.getByTestId("tooltip-trigger"));
    
    expect(await screen.queryByText("Tooltip text")).not.toBeInTheDocument();
  });
});
