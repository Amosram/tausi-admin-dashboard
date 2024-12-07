import React, { memo, useId } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import { MapCoordinates, MapCoordinate } from "./types";

const API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  globalThis.VITE_GOOGLE_MAPS_API_KEY;

interface MapsProps {
  coordinates: MapCoordinates;
  setCoordinates?: (coordinates: MapCoordinate) => void;
}

const Maps: React.FC<MapsProps> = ({ coordinates, setCoordinates }) => {
  const markerCoordinates = Array.isArray(coordinates)
    ? coordinates
    : [coordinates];

  return (
    <APIProvider apiKey={API_KEY} libraries={["marker"]}>
      <div suppressHydrationWarning>
        <Map
          mapId={useId()}
          className="w-full h-[500px] mt-3"
          defaultCenter={{
            lat: markerCoordinates[0]?.lat ?? -1.286389,
            lng: markerCoordinates[0]?.lng ?? 36.817223,
          }}
          defaultZoom={14}
          center={{
            lat: markerCoordinates[0]?.lat ?? -1.286389,
            lng: markerCoordinates[0]?.lng ?? 36.817223,
          }}
          reuseMaps
          gestureHandling={"greedy"}
        >
          <Marker
            coordinates={markerCoordinates}
            setCoordinates={setCoordinates}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default memo(Maps);
