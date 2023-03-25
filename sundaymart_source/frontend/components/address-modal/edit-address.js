import React, { useContext, useEffect } from "react";
import GoogleMap from "../map";
import { shallowEqual, useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import AddressCard from "./helper/address-card";

const EditAddress = () => {
  const user = useSelector((state) => state.user.data, shallowEqual);
  const { setUserDefaultLocation, userLocation } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [value, setValue] = useState("");
  const newUserLocation = userLocation?.split(",");
  const currentLocation = user?.addresses?.find(
    (item) =>
      item.location.latitude === newUserLocation[0] ||
      item.location.longitude === newUserLocation[1]
  );
  useEffect(() => {
    setAddress({
      location: {
        lat: currentLocation?.location.latitude,
        lng: currentLocation?.location.longitude,
      },
      address: currentLocation?.address,
    });
  }, [currentLocation]);
  useEffect(() => {
    if (!user?.addresses?.length) {
      setAddress({
        location: {
          lat: newUserLocation[0],
          lng: newUserLocation[1],
        },
        address: "",
      });
    } else if (!currentLocation) {
      setUserDefaultLocation(user?.addresses[0]?.location);
    } else {
      setUserDefaultLocation(currentLocation.location);
    }
  }, []);
  return (
    <>
      <AddressCard />
      <GoogleMap
        address={address}
        setAddress={setAddress}
        value={value}
        setValue={setValue}
      />
    </>
  );
};

export default EditAddress;
