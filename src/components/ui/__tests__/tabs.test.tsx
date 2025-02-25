import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Tabs Component", () => {
  it("renders Tabs correctly", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tab1-trigger">
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" data-testid="tab2-trigger">
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="tab1-content">
          Content 1
        </TabsContent>
        <TabsContent value="tab2" data-testid="tab2-content">
          Content 2
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId("tab1-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("tab2-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
    expect(screen.queryByTestId("tab2-content")).not.toBeVisible();
  });

  it("switches tabs correctly on click", async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tab1-trigger">
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" data-testid="tab2-trigger">
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="tab1-content">
          Content 1
        </TabsContent>
        <TabsContent value="tab2" data-testid="tab2-content">
          Content 2
        </TabsContent>
      </Tabs>
    );
  });

  it("applies the active state to the correct tab", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" data-testid="tab1-trigger" className="active-tab">
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2" data-testid="tab2-trigger">
            Tab 2
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  });
});
