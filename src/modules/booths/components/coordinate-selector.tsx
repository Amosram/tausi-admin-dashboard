import React, { memo, useId, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Coordinates } from "@/models";
import Marker from "./coordinate-marker";

const DEFAULT_LOCATION = {
  x: -1.286389,
  y: 36.817223,
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface CoordinateSelectorProps {
  initialCoordinates?: Coordinates;
  onCoordinatesSelect: (coordinates: Coordinates) => void;
  onClose?: () => void;
}

const CoordinateSelectorMap: React.FC<CoordinateSelectorProps> = ({
  initialCoordinates = DEFAULT_LOCATION,
  onCoordinatesSelect,
  onClose,
}) => {
  const [coordinates, setCoordinates] =
    useState<Coordinates>(initialCoordinates);

  const handleCoordinatesSelect = () => {
    onCoordinatesSelect(coordinates);
    onClose?.();
  };

  return (
    <div className="w-full">
      <APIProvider apiKey={API_KEY} libraries={["marker"]}>
        <div suppressHydrationWarning>
          <Map
            mapId={useId()}
            className="w-full h-[500px] mt-3"
            defaultCenter={{
              lat: coordinates.x,
              lng: coordinates.y,
            }}
            defaultZoom={14}
            reuseMaps
            gestureHandling={"greedy"}
          >
            <Marker
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              onMarkerSelect={handleCoordinatesSelect}
            />
          </Map>
        </div>
      </APIProvider>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCoordinatesSelect}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Select Coordinates
        </button>
      </div>
    </div>
  );
};

export default memo(CoordinateSelectorMap);