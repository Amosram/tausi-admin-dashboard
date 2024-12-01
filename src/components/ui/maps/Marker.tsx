"use client";
import React, { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { Coordinates } from "./types";
import {DEFAULT_LOCATION} from '@/Utils/constants';

interface MarkerProps {
    coordinates: Coordinates;
    setCoordinates: (coordinates: Coordinates) => void;
}

const Marker: React.FC<MarkerProps> = (props) => {
  const { coordinates, setCoordinates } = props;
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const defaultLocation = {
    lat: DEFAULT_LOCATION.x,
    lng: DEFAULT_LOCATION.y
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={Object.keys(coordinates).length === 0 ? defaultLocation  : coordinates}
        onClick={() => setShowInfo(true)}
        title={'Marker'}
        draggable
        clickable
        onDragEnd={(e) => {
          setCoordinates({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          });
        }}
      />

      {showInfo && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => {
            setShowInfo(false);
          }}
        >
          <div>Info Window</div>
        </InfoWindow>
      )}
    </>
  );
};

export default Marker;
