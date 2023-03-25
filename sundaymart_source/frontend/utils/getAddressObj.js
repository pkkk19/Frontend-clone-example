import { getLocationObj } from "./getLocation";

export const getAddressObj = ({
  cookies,
  defaultAddress,
  setDefaultAddress,
}) => {
  const loc = cookies?.userLocation
    ? cookies?.userLocation
    : process.env.NEXT_PUBLIC_DEFAULT_LOCATION.split(",");
  if (!defaultAddress && loc[0]) {
    getLocationObj({
      location: { lat: loc[0], lng: loc[1] },
      setAddress: setDefaultAddress,
    });
  }

  return defaultAddress;
};
