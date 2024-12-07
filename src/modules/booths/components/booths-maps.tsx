"use client";
import React from "react";
import Maps from "@/components/ui/maps";
import { MapCoordinate } from "@/components/ui/maps/types";

interface BoothsMapProps {
  coordinates: MapCoordinate[];
}

const BoothsMap: React.FC<BoothsMapProps> = ({ coordinates }) => {
  return (
    <div className="h-[500px]">
      <Maps
        coordinates={coordinates}
      />
    </div>
  );
};

export default BoothsMap;
