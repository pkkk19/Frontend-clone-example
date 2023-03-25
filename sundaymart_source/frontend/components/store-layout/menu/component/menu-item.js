import React, { useContext } from "react";
import { useRouter } from "next/router";
import { DrawerConfig } from "../../../../configs/drawer-config";
import { MainContext } from "../../../../context/MainContext";
import { batch, useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../../redux/slices/user";
import { clearAllCart } from "../../../../redux/slices/cart";
import { clearSavedStore } from "../../../../redux/slices/savedStore";
import { clearAddress } from "../../../../redux/slices/savedAddress";
import { clearList } from "../../../../redux/slices/savedProduct";
import { clearViewedList } from "../../../../redux/slices/viewed-product";
import { useTranslation } from "react-i18next";

function MenuItem({ data, setVisible }) {
  const { t: tl } = useTranslation();
  const { handleVisible } = useContext(MainContext);
  const shop = useSelector((state) => state.stores.currentStore);
  const dc = DrawerConfig;
  const router = useRouter();
  const pnList = router?.pathname.split("/");
  const dispatch = useDispatch();

  const logOut = () => {
    batch(() => {
      dispatch(clearUser());
      dispatch(clearAllCart());
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
  };
  const handleClick = (path) => {
    if (data.path) {
      if (data.store_id) {
        router.push(`/stores/${shop?.id}${path}`);
      } else if (data.path === "/" && data.key !== "home") {
        logOut();
      } else {
        router.push(path);
      }
    } else {
      handleVisible(dc.wallet_history);
    }
    if (setVisible) {
      setVisible(false);
    }
  };

  return (
    <div
      onClick={() => handleClick(data.path)}
      className={
        `/${pnList[pnList.length - 1]}` == data.path
          ? "menu-item active"
          : "menu-item"
      }
    >
      <div className="icon">{data.icon}</div>
      <div className="label">{tl(data.label)}</div>
    </div>
  );
}

export default MenuItem;
