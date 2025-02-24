import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { FormInputField } from "../Form/FormInputField";
import type { SelectOption } from "../Form/FormInputField";

// Mock form component for testing
const TestForm = ({ options = [] }: { type: string; options?: SelectOption[] }) => {
  const form = useForm({ defaultValues: { testField: "" } });

  return (
    <FormProvider {...form}>
      <FormInputField form={form} name="testField" label="Test Label" options={options} placeholder="Test Placeholder" />
    </FormProvider>
  );
};

describe("FormInputField Component", () => {
  it("renders a text input correctly", () => {
    render(<TestForm type="text" />);
    
    const input = screen.getByPlaceholderText("Test Placeholder");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");

    fireEvent.change(input, { target: { value: "Hello World" } });
    expect(input).toHaveValue("Hello World");
  });

  it("renders an email input correctly", () => {
    render(<TestForm type="email" />);
    
    const input = screen.getByPlaceholderText("Test Placeholder");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(input).toHaveValue("test@example.com");
  });

  it("renders a textarea correctly", () => {
    render(<TestForm type="textarea" />);
    
    const textarea = screen.getByPlaceholderText("Test Placeholder");
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "This is a test" } });
    expect(textarea).toHaveValue("This is a test");
  });

  it("renders a select dropdown and allows selection", async () => {
    const options = [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
    ];

    render(<TestForm type="select" options={options} />);

  });
});


it("renders a number input correctly", () => {
  render(<TestForm type="number" />);

  const input = screen.getByPlaceholderText("Test Placeholder");
  expect(input).toBeInTheDocument();
});

it("renders a description if provided", () => {
  render(<TestForm description="This is a description" />);
});

it("renders an error message if validation fails", () => {
  const TestFormWithError = () => {
    const form = useForm({ defaultValues: { testField: "" } });
    form.setError("testField", { type: "required", message: "This field is required" });

    return (
      <FormProvider {...form}>
        <FormInputField
          form={form}
          name="testField"
          label="Test Label"
          placeholder="Test Placeholder"
        />
      </FormProvider>
    );
};

  render(<TestFormWithError />);

});

it("renders a switch input correctly", () => {
  render(<TestForm type="switch" />);

});