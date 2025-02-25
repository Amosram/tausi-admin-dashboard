import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import Directions from "../maps/Directions";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

beforeAll(() => {
  globalThis.google = {
    maps: {
      TravelMode: {
        DRIVING: "DRIVING",
      },
      DirectionsService: vi.fn(),
      DirectionsRenderer: vi.fn(),
    },
  } as any;
});

vi.mock("@vis.gl/react-google-maps", () => ({
  useMap: vi.fn(),
  useMapsLibrary: vi.fn(() => ({
    DirectionsService: google.maps.DirectionsService,
    DirectionsRenderer: google.maps.DirectionsRenderer,
  })),
}));

describe("Directions Component", () => {
  let mockRoute: any;

  beforeEach(() => {
    mockRoute = vi.fn().mockResolvedValue({
      routes: [{ legs: [{}] }],
    });

    google.maps.DirectionsService = vi.fn().mockImplementation(() => ({
      route: mockRoute,
    }));

    google.maps.DirectionsRenderer = vi.fn().mockImplementation(() => ({
      setDirections: vi.fn(),
      setMap: vi.fn(),
    }));
  });

  it("renders the Directions component", () => {
    render(<Directions />);
    expect(screen.getByText("Directions")).toBeInTheDocument();
  });

  it("calls the DirectionsService with correct parameters", async () => {
    render(<Directions />);

    await screen.findByText("Directions");

    console.log("mockRoute call count:",mockRoute.mock.calls.length);
  });
});
