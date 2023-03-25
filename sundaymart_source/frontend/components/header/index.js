import Link from "next/link";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ArrowDown, LocationOutline } from "../../public/assets/images/svg";
import { AuthContext } from "../../context/AuthContext";
import { MainContext } from "../../context/MainContext";
import SearchFilter from "../search-filter";
import UserAvatar from "./avatar";
import { setOpenModal } from "../../redux/slices/mainState";
import { Button } from "reactstrap";
import { parseCookies } from "nookies";
import { setCookies } from "../../utils/setCookies";
import { getAddress } from "../../utils/getAddress";
const DefaultAddress = dynamic(() =>
  import("../address-modal/default-address")
);

const Header = () => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const { handleAuth } = useContext(MainContext);
  const { userLocation } = useContext(AuthContext);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [openModal, setModal] = useState(null);
  const [isConfirm, setIsConfirm] = useState(true);
  const user = useSelector((state) => state.user.data, shallowEqual);
  const settings = useSelector((state) => state.settings.data, shallowEqual);
  const isEmpty = Object.keys(user ? user : {}).length === 0;

  useEffect(() => {
    getAddress({ setDefaultAddress, userLocation, user });
  }, [userLocation]);

  const handleOk = (e) => {
    e.stopPropagation();
    setCookies({ name: "set_location", value: true });
    setIsConfirm(true);
  };
  const handleAnother = (e) => {
    e.stopPropagation();
    setModal((prev) => !prev);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfirm(cookies.set_location);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <Link href="/">
          <a className="logo">{settings?.title || "Company logo"}</a>
        </Link>
        <div className="header-content">
          <div className="address" onClick={() => dispatch(setOpenModal(true))}>
            <div className="suffix location">
              <LocationOutline />
            </div>
            <span>{defaultAddress?.address || "Default address"}</span>
            <div className="suffix arrow">
              <ArrowDown />
            </div>
            {!isConfirm && (
              <div className="confirm-address">
                <div className="label">Order to the address</div>
                <div className="name">
                  {defaultAddress?.address || "Default address"}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Button onClick={(e) => handleAnother(e)}>Another</Button>
                  </div>
                  <div className="col-md-6" onClick={(e) => handleOk(e)}>
                    <Button color="success" className="submit">
                      Yes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <SearchFilter />
          <UserAvatar />
          {isEmpty && (
            <div className="btn login_btn" onClick={() => handleAuth("login")}>
              {tl("login")}
            </div>
          )}
        </div>
      </div>
      <DefaultAddress
        openModal={openModal}
        setOpenModal={setModal}
        setIsConfirm={setIsConfirm}
      />
    </div>
  );
};

export default Header;
