import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Spinner } from "reactstrap";
import { AddressApi } from "../../api/main/address";
import { MainContext } from "../../context/MainContext";
import {
  setEditAddress,
  setMapContent,
  setOpenModal,
} from "../../redux/slices/mainState";
import InputText from "../form/form-item/InputText";
import GoogleMap from "../map";
import GetPosition from "../map/get-position";

const EnterDeliveryAddress = () => {
  const dispatch = useDispatch();
  const editAddress = useSelector((state) => state.mainState.editAddress);
  const openModal = useSelector((state) => state.mainState.openModal);
  const { t: tl } = useTranslation();
  const [title, setTitle] = useState(null);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState(null);
  const [address, setAddress] = useState(null);
  const { getUser } = useContext(MainContext);

  useEffect(() => {
    if (!openModal) {
      setTitle("");
      batch(() => {
        dispatch(setEditAddress(null));
        dispatch(setMapContent(""));
      });
    }
  }, [openModal]);
  useEffect(() => {
    setTitle(editAddress?.title);
    setValue(editAddress?.address);
  }, [editAddress]);

  const addAddress = () => {
    if (!title) {
      toast.error(tl("Please enter address title"));
    } else {
      setLoader(true);
      AddressApi.create({
        title: `${title}`,
        address: address?.address,
        location: `${address?.location.lat},${address?.location.lng}`,
        active: 0,
      })
        .then(() => {
          dispatch(setOpenModal(false));
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response?.data?.message);
        })
        .finally(() => {
          getUser();
          setTitle("");
          setLoader(false);
        });
    }
  };
  const updateAddress = () => {
    setLoader(true);
    AddressApi.update(editAddress?.id, {
      title: `${title}`,
      address: value,
      location: `${editAddress.location.latitude},${editAddress.location.longitude}`,
      active: 0,
    })
      .then(() => {
        batch(() => {
          dispatch(setOpenModal(false));
          dispatch(setMapContent(""));
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        getUser();
        setTitle("");
        setValue("");
        setLoader(false);
      });
  };
  const handleAddressEvent = () => {
    if (editAddress) updateAddress();
    else addAddress();
  };

  return (
    <>
      <InputText
        label="Address"
        placeholder="Enter address"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="search-address">
        <GetPosition
          setValue={setValue}
          value={value}
          setAddress={setAddress}
        />
        <Button onClick={handleAddressEvent}>
          {loader ? <Spinner size="sm" /> : tl("Enter location")}
        </Button>
      </div>
      <GoogleMap
        address={address}
        setAddress={setAddress}
        setValue={setValue}
      />
    </>
  );
};

export default EnterDeliveryAddress;
