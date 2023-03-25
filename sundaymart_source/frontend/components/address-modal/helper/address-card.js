import React, { useContext, useState } from "react";
import { AddressApi } from "../../../api/main/address";
import { MainContext } from "../../../context/MainContext";
import MapPinAddFillIcon from "remixicon-react/MapPinAddFillIcon";
import More2FillIcon from "remixicon-react/More2FillIcon";
import NavigationFillIcon from "remixicon-react/NavigationFillIcon";
import { UncontrolledPopover, PopoverBody, Spinner } from "reactstrap";
import EditLineIcon from "remixicon-react/EditLineIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { batch, useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  setEditAddress,
  setMapContent,
  setOpenModal,
} from "../../../redux/slices/mainState";

const AddressCard = ({ title = false }) => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const { getUser } = useContext(MainContext);
  const [isDelete, setIsDelete] = useState(null);
  const user = useSelector((state) => state.user.data);
  const { setUserDefaultLocation, userLocation } = useContext(AuthContext);
  const newUserLocation = userLocation?.split(",");
  const currentLocation = user?.addresses?.find(
    (item) =>
      item.location.latitude === newUserLocation[0] ||
      item.location.longitude === newUserLocation[1]
  );
  const handleAddress = (e, item) => {
    e.stopPropagation();
    setUserDefaultLocation(item.location);
  };
  const deleteAddress = (id) => {
    setIsDelete(true);
    AddressApi.delete(id)
      .then(() => {
        getUser();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsDelete(false);
      });
  };
  const handleAddLocation = () => {
    batch(() => {
      dispatch(setOpenModal(true));
      dispatch(setMapContent("add-address"));
    });
  };
  const handleEdit = (address) => {
    batch(() => {
      dispatch(setOpenModal(true));
      dispatch(setEditAddress(address));
      dispatch(setMapContent("add-address"));
    });
  };

  return (
    <div className="site-settings edit-address">
      {title && <div className="title">{tl("Saved location")}</div>}
      <div className="settings-content">
        <div className="add-address" onClick={handleAddLocation}>
          <MapPinAddFillIcon size={28} />
          <div className="label">{tl("Add location")}</div>
        </div>
        {user?.addresses?.map((address, key) => (
          <div key={key}>
            <div
              className={
                currentLocation?.id === address.id
                  ? "saved-address active"
                  : "saved-address"
              }
            >
              <div className="suffix">
                <NavigationFillIcon size={20} />
              </div>
              <div
                className="address"
                onClick={(e) => handleAddress(e, address)}
              >
                <div className="home-name">{address?.title}</div>
                <div className="address-name">{address?.address}</div>
              </div>
              <div id={`edit${key}`} type="button" className="edit-btn">
                <More2FillIcon />
              </div>
            </div>
            <UncontrolledPopover
              trigger="legacy"
              placement="bottom"
              target={`edit${key}`}
            >
              <PopoverBody>
                <div className="action" onClick={() => handleEdit(address)}>
                  <div className="icon">
                    <EditLineIcon size={16} />
                  </div>
                  <div className="label">{tl("Edit")}</div>
                </div>
                <div
                  className="action"
                  onClick={() => deleteAddress(address?.id)}
                >
                  <div className="icon">
                    {isDelete ? (
                      <Spinner size="sm" />
                    ) : (
                      <DeleteBinLineIcon size={16} />
                    )}
                  </div>
                  <div className="label">{tl("Delete")}</div>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressCard;
