"use client";
import React from "react";
import Maps from "@/components/ui/maps";
import { MapCoordinate } from "@/components/ui/maps/types";

interface BoothsMapProps {
  coordinates: MapCoordinate[];
}

const BoothsMap: React.FC<BoothsMapProps> = ({ coordinates }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg uppercase text-center font-semibold">Map</p>
      <div className="h-[500px]">
        <Maps coordinates={coordinates} />
      </div>
    </div>
  );
};

export default BoothsMap;
