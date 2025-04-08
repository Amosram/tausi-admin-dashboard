import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion";
import "@testing-library/jest-dom";

describe("Accordion Component", () => {
  it("should render the accordion and toggle content visibility", async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: "Trigger 1"});
    expect(trigger).toBeInTheDocument();
    
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    
    fireEvent.click(trigger);

    const content = await screen.findByText("Content 1");
    expect(content).toBeVisible();

    fireEvent.click(trigger);

    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });
});
