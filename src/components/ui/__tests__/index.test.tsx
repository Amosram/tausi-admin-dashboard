import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Maps from "../maps";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Marker from "../maps/Marker";
import { MapCoordinates } from "../maps/types";

// Mock @vis.gl/react-google-maps
vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  AdvancedMarker: () => <div data-testid="advanced-marker" />,
}));

// Mock Marker component
vi.mock("@/components/ui/Marker", () => ({
  default: () => <div data-testid="marker" />,
}));

describe("Maps Component", () => {
  const mockCoordinates: MapCoordinates = [{ lat: 1.2345, lng: 2.3456 }];

  beforeEach(() => {
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = "test_api_key";
  });

  it("renders the Maps component with a Google Map", () => {
    render(<Maps coordinates={mockCoordinates} />);
    
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("renders a Marker component with correct props", () => {
    render(<Maps coordinates={mockCoordinates} />);
    
  });

  it("falls back to default coordinates when none are provided", () => {
    render(<Maps coordinates={[]} />);
    
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });
});
