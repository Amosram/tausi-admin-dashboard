import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from "../dialog copy";

describe("Dialog Component", () => {
  it("renders the dialog trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </Dialog>
    );
    
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("opens the dialog when the trigger is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      expect(screen.getByText("Dialog Description")).toBeInTheDocument();
    });
  });

  it("closes the dialog when the close button is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));

    await waitFor(() => {
      expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Close")[0]);

    await waitFor(() => {
      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
    });
  });
});
