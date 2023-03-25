import { parseCookies } from "nookies";
import { getLocationObj } from "./getLocation";

export const getAddress = async ({ setDefaultAddress, user, userLocation }) => {
  const cookieAddress = userLocation?.split(",");
  const address = await user.addresses?.find(
    (item) => item.location.latitude == cookieAddress[0]
  );
  if (address) {
    setDefaultAddress(address);
  } else if (parseCookies().formatted_address) {
    setDefaultAddress({ address: parseCookies().formatted_address });
  } else if (cookieAddress[0])
    getLocationObj({
      location: { lat: cookieAddress[0], lng: cookieAddress[1] },
      setAddress: setDefaultAddress,
    });
};
