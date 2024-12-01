"use client";
import React, { useState } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Coordinates } from "@/models";

interface MarkerProps {
  coordinates: Coordinates;
  setCoordinates: (coordinates: Coordinates) => void;
  onMarkerSelect?: () => void;
}

const DEFAULT_LOCATION = {
  x: -1.286389,
  y: 36.817223,
};

const Marker: React.FC<MarkerProps> = ({
  coordinates,
  setCoordinates,
  onMarkerSelect,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const markerPosition =
    coordinates.x && coordinates.y
      ? { lat: coordinates.x, lng: coordinates.y }
      : { lat: DEFAULT_LOCATION.x, lng: DEFAULT_LOCATION.y };

  return (
    <AdvancedMarker
      ref={markerRef}
      position={markerPosition}
      draggable
      onClick={() => setShowInfo(true)}
      onDragEnd={(e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setCoordinates({ x: lat, y: lng });
        onMarkerSelect?.();
      }}
    >
      {showInfo && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setShowInfo(false)}
        >
          <div>
            <p>Latitude: {coordinates.x.toFixed(6)}</p>
            <p>Longitude: {coordinates.y.toFixed(6)}</p>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default Marker;
