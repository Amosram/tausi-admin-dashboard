"use client";
import React, { useState, useEffect } from 'react';
import {
  useMapsLibrary,
  useMap
} from '@vis.gl/react-google-maps';

const LOCATION_KEY_LAT = 'location_lat';
const LOCATION_KEY_LON = 'location_lon';

const Directions = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex,] = useState(0);
  const _selected = routes[routeIndex];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    const userLat = localStorage.getItem(LOCATION_KEY_LAT);
    const userLong = localStorage.getItem(LOCATION_KEY_LON);
    if (!directionsService || !directionsRenderer || !userLat || !userLong) return;
    directionsService
      .route({
        origin: { lat: Number(userLat) , lng: Number(userLong)},
        destination: {lat : -1.286389, lng: 36.817223 },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      .then(response => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer]);


  return (
    <div>Directions</div>
  );
};

export default Directions;
