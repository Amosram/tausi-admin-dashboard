import React, { useRef, useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { MapCoordinate } from "./types";

interface MarkerProps {
  coordinates: MapCoordinate[];
  setCoordinates?: (coordinates: MapCoordinate) => void;
  infoBody?: React.ReactNode | JSX.Element;
  onMarkerClick?: (index: number) => void;
}

const Marker: React.FC<MarkerProps> = ({ coordinates, setCoordinates, infoBody, onMarkerClick }) => {
  const [infoIndex, setInfoIndex] = useState<number | null>(null);
  const markerRefs = useRef<(google.maps.marker.AdvancedMarkerElement | null)[]>(
    []
  );

  return (
    <>
      {coordinates.map((coord, index) => (
        <React.Fragment key={`${coord.lat}-${coord.lng}`}>
          <AdvancedMarker
            ref={(el) => (markerRefs.current[index] = el)}
            position={coord}
            onClick={() => {
              setInfoIndex(index);
              if (onMarkerClick) onMarkerClick(index);
            }}
            title={`Marker ${index + 1}`}
            draggable={!!setCoordinates}
            clickable
            onDragEnd={(e) => {
              if (setCoordinates) {
                setCoordinates({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }
            }}
          />

          {infoIndex === index && markerRefs.current[index] && (
            <InfoWindow
              anchor={markerRefs.current[index]}
              maxWidth={200}
              onCloseClick={() => setInfoIndex(null)}
            >
              {infoBody? infoBody : <div>Info Window</div> }
            </InfoWindow>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Marker;
