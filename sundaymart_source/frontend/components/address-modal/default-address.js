import React, { useContext, useState } from "react";
import GetPosition from "../map/get-position";
import { Button, Modal, ModalHeader } from "reactstrap";
import { useTranslation } from "react-i18next";
import GoogleMap from "../map";
import { AuthContext } from "../../context/AuthContext";
import { setCookies } from "../../utils/setCookies";

function DefaultAddress({ openModal, setOpenModal, setIsConfirm }) {
  const { t: tl } = useTranslation();
  const [value, setValue] = useState(null);
  const [address, setAddress] = useState(null);
  const { setUserDefaultLocation } = useContext(AuthContext);
  const toggle = () => {
    setOpenModal((prev) => !prev);
    setCookies({ name: "set_location", value: true });
    setIsConfirm(true);
  };
  const handleClick = () => {
    setUserDefaultLocation({
      latitude: address.location.lat,
      longitude: address.location.lng,
    });
    toggle();
  };
  return (
    <div className="address">
      <Modal
        isOpen={openModal}
        toggle={toggle}
        className="address-modal"
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggle}>
          {tl("Enter default location")}
        </ModalHeader>
        <div className="search-address">
          <GetPosition
            setValue={setValue}
            value={value}
            setAddress={setAddress}
          />
          <Button onClick={handleClick}>{tl("Save")}</Button>
        </div>
        <GoogleMap
          address={address}
          setAddress={setAddress}
          setValue={setValue}
        />
      </Modal>
    </div>
  );
}

export default DefaultAddress;
