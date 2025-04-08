import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

interface AutocompleteAddressProps {
  onAddressSelect: (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => void;
  value: string;
  onChange: (value: string) => void;
}

export const AutocompleteAddress: React.FC<AutocompleteAddressProps> = ({
  onAddressSelect,
  value,
  onChange,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_components", "geometry"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry) {
          const { lat, lng } = place.geometry.location;

          let address = "";
          place.address_components.forEach((component) => {
            if (component.long_name) {
              address += component.long_name + ", ";
            }
          });

          address = address.trim().replace(/,$/, "");

          onAddressSelect(address, { lat: lat(), lng: lng() });
          onChange(address);
        }
      });
    }
  }, [isLoaded, onAddressSelect, onChange]);

  return (
    <div className="flex flex-col">
      <label className="font-semibold text-sm">Booth's Location</label>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="You can choose to type an address or select from the map below"
        className="border p-2 w-full bg-gray-100 rounded-sm"
      />
    </div>
  );
};
