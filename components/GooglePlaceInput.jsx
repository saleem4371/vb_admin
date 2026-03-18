"use client";

import { useRef } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function GooglePlaceInput({ setVenue }) {
  const autoCompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    libraries,
  });

  const onLoad = (autocomplete) => {
    autoCompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();

    if (!place) return;

    let city = "";
    let state = "";

    place.address_components?.forEach((comp) => {
      if (comp.types.includes("locality")) {
        city = comp.long_name;
      }

      if (comp.types.includes("administrative_area_level_1")) {
        state = comp.long_name;
      }
    });

    setVenue((prev) => ({
      ...prev,
        name: place.name || "",
      city: city,
      address: place.formatted_address || "",
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
      place_id: place.place_id,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      reviews: place.reviews,
    }));
  };

  if (!isLoaded) return null;

  return (
    <div>
      <label className="text-sm font-medium">Search Venue Location</label>

      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search venue location"
          className="w-full border  border-gray-200 px-3 py-2 rounded-md mt-1"
        />
      </Autocomplete>
    </div>
  );
}
