import React from "react";
import Wallet3FillIcon from "remixicon-react/Wallet3FillIcon";
import MapPin2FillIcon from "remixicon-react/MapPin2FillIcon";
import ShieldCheckFillIcon from "remixicon-react/ShieldCheckFillIcon";
import { useTranslation } from "react-i18next";

const CheckoutStep = ({ name }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="checkout-step">
      <div className="title">{tl("Complate your order")}</div>
      <div className="step-content">
        <div className="steps">
          <div className={`step-item success`}>
            <MapPin2FillIcon size={22} />
          </div>
          <span className="success"></span>
          <div
            className={`step-item ${
              (name === "payment" || name === "final-payment") && "success"
            }`}
          >
            <Wallet3FillIcon size={22} />
          </div>
          <span
            className={`${
              (name === "payment" || name === "final-payment") && "success"
            }`}
          ></span>
          <div className={`step-item ${name === "final-payment" && "success"}`}>
            <ShieldCheckFillIcon size={22} />
          </div>
        </div>
        <div className="step-label ">
          <span className="">{tl("Shipping")}</span>
          <span className="">{tl("Payment")}</span>
          <span className="waiting">{tl("Verify")}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep;
