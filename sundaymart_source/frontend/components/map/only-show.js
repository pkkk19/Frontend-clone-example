import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import { parseCookies } from "nookies";

const cookies = parseCookies();
let config = null;
if (cookies?.settings) {
  config = JSON.parse(cookies?.settings);
}
const MapOnlyShow = (props) => {
  const initialCenter = {
    lat: props.location.latitude,
    lng: props.location.longitude,
  };
  return (
    <div className="map-wrapper">
      <Map
        google={props.google}
        zoom={10}
        initialCenter={initialCenter}
        center={initialCenter}
        className="container map"
      >
        <Marker
          position={initialCenter}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/32/64/64113.png",
          }}
        />
      </Map>
    </div>
  );
};
export default GoogleApiWrapper({
  apiKey: config?.google_map_key
    ? config.google_map_key
    : process.env.NEXT_PUBLIC_MAP_KEY,
  libraries: ["places"],
})(MapOnlyShow);
