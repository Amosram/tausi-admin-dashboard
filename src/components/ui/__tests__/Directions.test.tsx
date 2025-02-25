import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Directions from "../maps/Directions";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

globalThis.google = {
  maps: {
    TravelMode: {
      DRIVING: "DRIVING",
    },
    DirectionsService: vi.fn(),
    DirectionsRenderer: vi.fn(),
  },
} as any;

// Mock the hooks
vi.mock("@vis.gl/react-google-maps", () => ({
  useMap: vi.fn(),
  useMapsLibrary: vi.fn(),
}));

describe("Directions Component", () => {
  let mockRoute = vi.fn();

  beforeEach(() => {
    localStorage.setItem("location_lat", "1.2345");
    localStorage.setItem("location_lon", "2.3456");

    vi.mock("@vis.gl/react-google-maps", () => ({
      useMap: vi.fn(() => ({})),
      useMapsLibrary: vi.fn(() => ({
        DirectionsService: google.maps.DirectionsService,
        DirectionsRenderer: google.maps.DirectionsRenderer,
      })),
    }));
    
    mockRoute = vi.fn(() =>
      Promise.resolve({
        routes: [{ legs: [{}] }],
      })
    );

    (google.maps.DirectionsService as any).mockImplementation(() => ({
      route: mockRoute,
    }));

    (google.maps.DirectionsRenderer as any).mockImplementation(() => ({
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

    await new Promise(setImmediate);

    expect(mockRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: { lat: 1.2345, lng: 2.3456 },
        destination: { lat: -1.286389, lng: 36.817223 },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
    );
  });
});

