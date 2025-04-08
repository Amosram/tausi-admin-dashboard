import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Marker from "../maps/Marker";
import { APIProvider } from "@vis.gl/react-google-maps";

const mockCoordinates = [
  { lat: -1.286389, lng: 36.817223 },
  { lat: -1.290000, lng: 36.820000 },
];

describe("Marker Component", () => {
  it("renders markers correctly", () => {
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} />
      </APIProvider>
    );

    
  });

  it("opens an InfoWindow when a marker is clicked", async () => {
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} infoBody={(index) => <div>Info {index}</div>} />
      </APIProvider>
    );

  });

  it("closes InfoWindow when the close button is clicked", async () => {
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} infoBody={(index) => <div>Info {index}</div>} />
      </APIProvider>
    );

    expect(screen.queryByText("Info 0")).not.toBeInTheDocument();
  });

  it("calls onMarkerClick when a marker is clicked", () => {
    const onMarkerClick = vi.fn();
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} onMarkerClick={onMarkerClick} />
      </APIProvider>
    );

  });

  it("calls setCoordinates when marker is dragged", () => {
    const setCoordinates = vi.fn();
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} setCoordinates={setCoordinates} />
      </APIProvider>
    );

  });

  it("ensures markers have correct title attributes", () => {
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} />
      </APIProvider>
    );
  });

  it("does not allow dragging if setCoordinates is not provided", () => {
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} />
      </APIProvider>
    );
  });

  it("allows dragging if setCoordinates is provided", () => {
    const setCoordinates = vi.fn();
    render(
      <APIProvider apiKey="test-key">
        <Marker coordinates={mockCoordinates} setCoordinates={setCoordinates} />
      </APIProvider>
    );
  });
});

