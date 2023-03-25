import React from "react";
import { useSelector } from "react-redux";
import MapPin2FillIcon from "remixicon-react/MapPin2FillIcon";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import MoneyDollarCircleFillIcon from "remixicon-react/MoneyDollarCircleFillIcon";
import ServiceFillIcon from "remixicon-react/ServiceFillIcon";
import RoadMapFillIcon from "remixicon-react/RoadMapFillIcon";
import { useTranslation } from "react-i18next";
function StoreInfo() {
  const { t: tl } = useTranslation();
  const shop = useSelector((state) => state.stores.currentStore);
  return (
    <div className="store-info">
      <div className="info-item">
        <div className="icon">
          <MapPin2FillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{shop?.translation?.title}</div>
          <div className="description">{shop?.translation?.address}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <TimeFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{`${shop.open_time} — ${shop.close_time}`}</div>
          <div className="description">{tl("Working hours")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <MoneyDollarCircleFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">$ 17.00</div>
          <div className="description">{tl("Delivery fee")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <ServiceFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{tl("Delivery — Pick up")}</div>
          <div className="description">{tl("Delivery type")}</div>
        </div>
      </div>
      <div className="info-item">
        <div className="icon">
          <RoadMapFillIcon size={20} />
        </div>
        <div className="text">
          <div className="title">{`${shop?.delivery_range} km`}</div>
          <div className="description">{tl("Delivery range")}</div>
        </div>
      </div>
    </div>
  );
}

export default StoreInfo;
