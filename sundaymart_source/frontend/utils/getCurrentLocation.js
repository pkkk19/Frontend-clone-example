import { getLocationObj } from "./getLocation";

// Step 1: Get user coordinates
export function getCurrentLocation({ setAddress }) {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    let lat = crd.latitude.toString();
    let lng = crd.longitude.toString();
    getLocationObj({ location: { lat, lng }, setAddress });
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}
