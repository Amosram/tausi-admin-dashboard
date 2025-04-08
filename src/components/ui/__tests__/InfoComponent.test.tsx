import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import InfoComponent from "../maps/InfoComponent";

describe("InfoComponent", () => {
  const props = {
    imageSrc: "/test-image.jpg",
    name: "John Doe",
    moreInfo: "This is additional information.",
    link: "/more-info",
  };

  it("renders the component with provided data", () => {
    render(
      <MemoryRouter>
        <InfoComponent {...props} />
      </MemoryRouter>
    );

    // Check if the image is rendered
    const image = screen.getByAltText("Image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", props.imageSrc);

    // Check if the name is rendered
    expect(screen.getByText(/name:/i)).toBeInTheDocument();
    expect(screen.getByText(props.name)).toBeInTheDocument();

    // Check if additional info is displayed
    expect(screen.getByText(props.moreInfo)).toBeInTheDocument();

    // Check if the link is rendered and points to the correct URL
    const link = screen.getByRole("link", { name: /view more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", props.link);
  });

  it("handles missing optional props gracefully", () => {
    render(
      <MemoryRouter>
        <InfoComponent imageSrc="/test-image.jpg" name="John Doe" />
      </MemoryRouter>
    );

    // Ensure image and name are rendered
    expect(screen.getByAltText("Image")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Ensure the optional elements do not break the component
    expect(screen.queryByText(/this is additional information./i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /view more/i })).toBeInTheDocument();
  });
});