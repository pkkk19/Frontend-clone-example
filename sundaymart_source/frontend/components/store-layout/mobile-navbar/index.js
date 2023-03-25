import React, { useContext, useState } from "react";
import MenuLineIcon from "remixicon-react/MenuLineIcon";
import MapPinRangeFillIcon from "remixicon-react/MapPinRangeFillIcon";
import Notification2FillIcon from "remixicon-react/Notification2FillIcon";
import ShoppingBag3FillIcon from "remixicon-react/ShoppingBag3FillIcon";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import Menu from "../menu";
import UserData from "../sider/components/UserData";
import { MainContext } from "../../../context/MainContext";
import { DrawerConfig } from "../../../configs/drawer-config";
import UserAvatar from "../../header/avatar";
import SearchFilter from "../../search-filter";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { batch, useDispatch } from "react-redux";
import { setMapContent, setOpenModal } from "../../../redux/slices/mainState";

function MobileNav() {
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { handleVisible, handleAuth } = useContext(MainContext);
  const dc = DrawerConfig;

  const handleAddress = () => {
    batch(() => {
      dispatch(setOpenModal(true));
      dispatch(setMapContent(""));
    });
  };
  const handleCart = () => {
    if (cookies?.access_token || cookies?.cart_id) handleVisible(dc.order_list);
    else {
      handleAuth("login");
      toast.error("Please login first");
    }
  };
  return (
    <>
      <div className="container mobile-nav">
        <div className="left">
          <div className="burger-btn">
            <MenuLineIcon onClick={() => setVisible(true)} />
          </div>
          <SearchFilter />
        </div>
        <div className="right">
          <div className="address" onClick={handleAddress}>
            <MapPinRangeFillIcon />
          </div>
          <div
            className="notification"
            onClick={() => handleVisible(dc.notification)}
          >
            <Notification2FillIcon />
          </div>
          <div className="balance active" onClick={handleCart}>
            <ShoppingBag3FillIcon />
          </div>
          <UserAvatar />
        </div>
      </div>
      <Offcanvas
        className="mobile-menu sider"
        isOpen={visible}
        toggle={() => setVisible(false)}
      >
        <OffcanvasHeader toggle={() => setVisible(false)} />
        <OffcanvasBody>
          <UserData closeNavbar={setVisible} />
          <Menu setVisible={setVisible} />
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
}

export default MobileNav;
