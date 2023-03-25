import { useRouter } from "next/router";
import React from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { imgBaseUrl } from "../../constants";
import { clearUser } from "../../redux/slices/user";
import { clearCart } from "../../redux/slices/cart";
import { clearSavedStore } from "../../redux/slices/savedStore";
import { clearAddress } from "../../redux/slices/savedAddress";
import { clearList } from "../../redux/slices/savedProduct";
import { clearViewedList } from "../../redux/slices/viewed-product";
import UserSearchLineIcon from "remixicon-react/UserSearchLineIcon";
import FileListLineIcon from "remixicon-react/FileListLineIcon";
import Settings4LineIcon from "remixicon-react/Settings4LineIcon";
import LogoutCircleRLineIcon from "remixicon-react/LogoutCircleRLineIcon";
import StoreLineIcon from "remixicon-react/StoreLineIcon";
import LinksLineIcon from "remixicon-react/LinksLineIcon";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { parseCookies } from "nookies";

const UserAvatar = () => {
  const { t: tl } = useTranslation();
  const cookies = parseCookies();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const isEmpty = Object.keys(user ? user : {}).length === 0;
  const dropdownItems = [
    // {
    //   icon: <FileListLineIcon />,
    //   label: <a>{tl("Order History")}</a>,
    //   suffix: null,
    //   href: "/order-history",
    // },
    {
      icon: <UserSearchLineIcon />,
      label: <a>{tl("Profile Settings")}</a>,
      suffix: null,
      href: "/settings",
    },
    {
      icon: <Settings4LineIcon />,
      label: <a>{tl("Site Settings")}</a>,
      suffix: null,
      href: "/settings/site-settings",
    },
    {
      icon: <StoreLineIcon />,
      label: <a>{tl("Be seller")}</a>,
      suffix: null,
      href: "/be-seller",
    },
    {
      icon: <LinksLineIcon />,
      label: <a>{tl("Your invite")}</a>,
      suffix: null,
      href: "/invite",
    },
    {
      icon: <LogoutCircleRLineIcon />,
      label: <a onClick={logOut}>{tl("Log Out")}</a>,
      suffix: null,
      href: "/",
    },
  ];
  function logOut() {
    batch(() => {
      dispatch(clearUser());
      dispatch(clearCart());
      dispatch(clearSavedStore());
      dispatch(clearAddress());
      dispatch(clearList());
      dispatch(clearViewedList());
    });
    document.cookie =
      "access_token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "userLocation" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  }

  const findHTTPS = user?.img?.includes("https");
  return (
    <>
      {!isEmpty && cookies?.access_token && (
        <div className="user">
          {findHTTPS ? (
            <img src={user.img} alt="Avatar" />
          ) : user.img ? (
            <img src={imgBaseUrl + user.img} alt="Avatar" />
          ) : (
            <div className="square avatar">{user.firstname?.slice(0, 1)}</div>
          )}
          <div className="dropdown">
            <div className="dropdown-items">
              {dropdownItems.map((data, key) => {
                return (
                  <Link key={key} href={data.href}>
                    <div
                      className="dropdown-item"
                      onClick={data.href === "/" ? logOut : () => {}}
                    >
                      {data.icon}
                      <div className="label">{data.label}</div>
                      {data.suffix && (
                        <div className="suffix">{data.suffix}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAvatar;
