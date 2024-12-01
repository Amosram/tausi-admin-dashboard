"use client";
import React, { memo, useId } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Marker from "./Marker";
import { Coordinates } from './types';

const API_KEY =  import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || globalThis.VITE_GOOGLE_MAPS_API_KEY;

interface MapsProps {
    coordinates: Coordinates;
    setCoordinates: (coordinates: Coordinates) => void;
 }

const Maps: React.FC<MapsProps> = (props) => {
  const { coordinates, setCoordinates } = props;
  return (
    <APIProvider apiKey={API_KEY}
      libraries={['marker']}>
      <div suppressHydrationWarning>
        <Map
          mapId={useId()}
          className="w-full h-[500px] mt-3"
          defaultCenter={{ lat: -1.286389, lng: 36.817223 }}
          defaultZoom={14}
          reuseMaps
          gestureHandling={'greedy'}>
          <Marker coordinates={coordinates}
            setCoordinates={setCoordinates} />
          {/* <Directions/> */}
        </Map>
      </div>
    </APIProvider>
  );
};

export default memo(Maps);
