import React, { useContext } from "react";
import MenuItem from "./component/menu-item";
import Store2FillIcon from "remixicon-react/Store2LineIcon";
import FileList2FillIcon from "remixicon-react/FileList2LineIcon";
import Bookmark3LineIcon from "remixicon-react/Bookmark3LineIcon";
import Heart3LineIcon from "remixicon-react/Heart3LineIcon";
import EyeLineIcon from "remixicon-react/EyeLineIcon";
import Wallet3LineIcon from "remixicon-react/Wallet3LineIcon";
import User3LineIcon from "remixicon-react/User3LineIcon";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import LogoutCircleRLineIcon from "remixicon-react/LogoutCircleRLineIcon";
import LoginCircleLineIcon from "remixicon-react/LoginCircleLineIcon";
import ImageLineIcon from "remixicon-react/ImageLineIcon";
import Home2LineIcon from "remixicon-react/Home2LineIcon";
import BarChartGroupedLineIcon from "remixicon-react/BarChartGroupedLineIcon";
import Ticket2LineIcon from "remixicon-react/Ticket2LineIcon";
import { parseCookies } from "nookies";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../context/MainContext";
export const items = [
  {
    key: 0,
    icon: <Store2FillIcon />,
    label: "Stores",
    path: "/stores",
    store_id: false,
  },
  {
    key: 1,
    icon: <FileList2FillIcon />,
    label: "Order history",
    path: "/order-history",
    store_id: false,
  },
  {
    key: 2,
    icon: <Bookmark3LineIcon />,
    label: "Saved stores",
    path: "/saved-stores",
    store_id: false,
  },
  {
    key: 3,
    icon: <Heart3LineIcon />,
    label: "Liked products",
    path: "/liked-products",
    store_id: true,
  },
  {
    key: 4,
    icon: <EyeLineIcon />,
    label: "Viewed Products",
    path: "/viwed-products",
    store_id: true,
  },
  {
    key: 5,
    icon: <ImageLineIcon />,
    label: "Blog",
    path: "/blog",
    store_id: false,
  },
  {
    key: 6,
    icon: <Wallet3LineIcon />,
    label: "Wallet history",
    path: null,
    store_id: false,
  },
  {
    key: 7,
    icon: <User3LineIcon />,
    label: "Profile setting",
    path: "/settings",
    store_id: false,
  },
  {
    key: 8,
    icon: <Settings3LineIcon />,
    label: "Site setting",
    path: "/settings/site-settings",
    store_id: false,
  },
  // {
  //   key: 9,
  //   icon: <BarChartGroupedLineIcon />,
  //   label: "Statistics",
  //   path: "/statistics",
  //   store_id: false,
  // },
  // {
  //   key: 10,
  //   icon: <Ticket2LineIcon />,
  //   label: "Support Ticket",
  //   path: "/ticket",
  //   store_id: false,
  // },
  {
    key: 11,
    icon: <LogoutCircleRLineIcon />,
    label: "Logout",
    path: "/",
    store_id: false,
  },
];

function Menu({ setVisible = () => {} }) {
  const cookies = parseCookies();
  const { t: tl } = useTranslation();
  const { handleAuth } = useContext(MainContext);
  return (
    <div className="menu">
      <MenuItem
        data={{
          key: "home",
          icon: <Home2LineIcon />,
          label: "Home",
          path: "/",
          store_id: false,
        }}
      />
      {items.map((data, key) => {
        if (!cookies?.access_token) {
          if (
            data.path !== "/order-history" &&
            data.path !== null &&
            data.path !== "/" &&
            data.path !== "/settings"
          ) {
            return <MenuItem setVisible={setVisible} key={key} data={data} />;
          } else return null;
        } else
          return <MenuItem setVisible={setVisible} key={key} data={data} />;
      })}
      {!cookies?.access_token && (
        <div
          onClick={() => {
            handleAuth("login");
          }}
          className="menu-item"
        >
          <div className="icon">
            <LoginCircleLineIcon />
          </div>
          <div className="label">{tl("Log in")}</div>
        </div>
      )}
    </div>
  );
}

export default Menu;
