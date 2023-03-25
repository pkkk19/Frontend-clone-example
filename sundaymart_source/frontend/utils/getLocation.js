import axios from "axios";
import { parseCookies } from "nookies";
import QueryString from "qs";
import { setCookies } from "./setCookies";

export const getLocationObj = ({
  location,
  setAddress = () => {},
  setValue = () => {},
}) => {
  const cookie = parseCookies();
  let config = null;
  if (cookie?.settings) {
    config = JSON.parse(cookie?.settings);
  }
  let str = QueryString.stringify(
    {
      latlng: `${location?.lat},${location?.lng}`,
      key: config?.google_map_key
        ? config.google_map_key
        : process.env.NEXT_PUBLIC_MAP_KEY,
    },
    { addQueryPrefix: true }
  );
  axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json${str}`)
    .then((res) => {
      setValue(res.data.results[0]?.formatted_address);
      setAddress({
        address: res.data.results[0]?.formatted_address,
        location: res.data.results[0]?.geometry?.location,
      });
      setCookies({
        name: "formatted_address",
        value: res.data.results[0]?.formatted_address,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
