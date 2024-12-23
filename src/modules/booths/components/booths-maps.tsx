import React, { useState } from "react";
import Maps from "@/components/ui/maps";
import { MapCoordinate } from "@/components/ui/maps/types";
import InfoComponent from "@/components/ui/maps/InfoComponent";
import { Booth } from "@/models";

interface BoothsMapProps {
  coordinates: MapCoordinate[];
  booths: Booth[];
}

const BoothsMap: React.FC<BoothsMapProps> = ({ coordinates, booths }) => {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg uppercase text-center font-semibold">Map</p>
      <div className="h-[500px]">
        <Maps
          coordinates={coordinates}
          infoBody={(index) => {
            const booth = booths[index];
            return (
              booth && (
                <InfoComponent
                  imageSrc={booth.imageUrl || "/placeholder.jpg"}
                  name={booth.name}
                  moreInfo={`Occupancy Status: ${booth.occupancyStatus}`}
                  link={`${booth.id}`}
                />
              )
            );
          }}
          onMarkerClick={(index) => setSelectedBooth(booths[index])}
        />
      </div>
    </div>
  );
};

export default BoothsMap;
