import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "../form";

const TestForm = () => {
  const methods = useForm({
    defaultValues: {
      testInput: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <FormField
          name="testInput"
          control={methods.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Input</FormLabel>
              <FormControl>
                <input {...field} data-testid="test-input" />
              </FormControl>
              <FormDescription>Description here</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
};

describe("Form Component", () => {
  it("renders form fields correctly", () => {
    render(<TestForm />);

    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    expect(screen.getByText("Description here")).toBeInTheDocument();
  });

  it("shows an error message when input is invalid", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const input = screen.getByTestId("test-input");

    await user.type(input, "test");
    await user.clear(input); // Simulate invalid input

    expect(screen.getByTestId("test-input")).toHaveAttribute("aria-invalid", "false");
  });
});
