import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { useTranslation } from "react-i18next";
import Search2LineIcon from "remixicon-react/Search2LineIcon";
import { parseCookies } from "nookies";
const GetPosition = ({ setAddress, value, setValue, className = "" }) => {
  const cookie = parseCookies();
  const { t: tl } = useTranslation();
  let config = null;
  if (cookie?.settings) {
    config = JSON.parse(cookie?.settings);
  }
  const { ref } = usePlacesWidget({
    apiKey: config?.google_map_key
      ? config.google_map_key
      : process.env.NEXT_PUBLIC_MAP_KEY,
    onPlaceSelected: (place) => {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setValue(place.formatted_address);
      setAddress({ address: place.formatted_address, location: { lat, lng } });
    },
  });

  return (
    <div className={`address-input ${className}`}>
      <Search2LineIcon size={20} />
      <div className="input">
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          ref={ref}
          placeholder={tl("Search")}
        />
      </div>
    </div>
  );
};

export default GetPosition;
