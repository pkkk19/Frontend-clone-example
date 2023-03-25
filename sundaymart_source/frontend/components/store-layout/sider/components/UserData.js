import React, { useContext, useState } from "react";
import Link from "next/link";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import Notification2LineIcon from "remixicon-react/Notification2LineIcon";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import SendPlaneFillIcon from "remixicon-react/SendPlaneFillIcon";
import { images } from "../../../../constants/images";
import { MainContext } from "../../../../context/MainContext";
import { DrawerConfig } from "../../../../configs/drawer-config";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getPrice } from "../../../../utils/getPrice";
import { imgBaseUrl } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { Tooltip } from "reactstrap";

function UserData({ closeNavbar = () => {} }) {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const router = useRouter();
  const { handleVisible } = useContext(MainContext);
  const user = useSelector((state) => state.user.data);
  const isEmpty = Object.keys(user).length === 0;
  const findHTTPS = user?.img?.includes("https");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      {!isEmpty ? (
        <div className="user-box">
          <div className="img-box">
            <Link href="/settings/site-settings">
              <a
                className={
                  router.pathname === "/settings/site-settings"
                    ? "setting active"
                    : "setting"
                }
              >
                <Settings3LineIcon onClick={() => closeNavbar(false)} />
              </a>
            </Link>
            <div className="avatar">
              {findHTTPS ? (
                <img src={user.img} alt="Avatar" />
              ) : user.img ? (
                <img src={imgBaseUrl + user.img} alt="Avatar" />
              ) : (
                <img src={images.Avatar} alt="Avatar" />
              )}
            </div>
            <div
              className="notification"
              onClick={() => handleVisible(dc.notification)}
            >
              <Notification2LineIcon />
            </div>
          </div>
          <div className="name-box">
            <div className="name">{`${user.firstname} ${user.lastname}`}</div>
            <div className="phone">{user.phone}</div>
          </div>
          <div className="wallet-balance">
            <div>
              <div className="title">{tl("Wallet balance")}</div>
              <div className="balance" id="TooltipExample">
                {getPrice(user.wallet.price)}
              </div>
              <Tooltip
                isOpen={tooltipOpen}
                target="TooltipExample"
                toggle={toggle}
              >
                {getPrice(user.wallet.price)}
              </Tooltip>
            </div>
            <div
              className="plus-icon"
              onClick={() => handleVisible(dc.add_wallet)}
            >
              <AddCircleFillIcon />
            </div>
          </div>
          <div
            className="share-wallet"
            onClick={() => handleVisible(dc.share_wallet)}
          >
            <div className="icon">
              <SendPlaneFillIcon />
            </div>
            <div className="name">{tl("Share wallet")}</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default UserData;
