import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Toast, ToastTitle, ToastDescription, ToastClose, ToastProvider, ToastViewport } from "../toast";

describe("Toast Component", () => {
  it("renders the toast with title and description", () => {
    render(
      <ToastProvider>
        <Toast data-testid="toast">
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>This is a success message</ToastDescription>
          <ToastClose data-testid="toast-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByTestId("toast");
    expect(toast).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("This is a success message")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    render(
      <ToastProvider>
        <Toast data-testid="toast">
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a test message</ToastDescription>
          <ToastClose data-testid="toast-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = screen.getByTestId("toast");
    const closeButton = screen.getByTestId("toast-close");

    expect(toast).toBeInTheDocument();

    fireEvent.click(closeButton);

    await waitFor(() => expect(toast).not.toBeInTheDocument());
  });
});
