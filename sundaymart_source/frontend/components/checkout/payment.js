import React, { useContext, useEffect, useState } from "react";
import CheckoutStep from "./component/checkout-step";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { PaymentApi } from "../../api/main/payment";
import DiscordLoader from "../loader/discord-loader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
const Payment = ({ setPayment }) => {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const { handleVisible } = useContext(MainContext);
  const [paymentType, setPaymentType] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const shop = useSelector((state) => state.stores.currentStore);
  const getPayment = () => {
    PaymentApi.get({ shop_id: shop?.id })
      .then((res) => {
        setPaymentType(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePayment = (e) => {
    setSelectedPayment(e.payment);
    setPayment(e);
  };
  const handleContinue = () => {
    if (selectedPayment) handleVisible(dc.final_payment);
    else toast.error("Please select payment type!");
  };

  useEffect(() => {
    getPayment();
  }, []);
  return (
    <div className="payment">
      <CheckoutStep name="payment" />
      <div className="method">
        <div className="title">{tl("Payment method")}</div>
        <div className="method-items">
          {paymentType ? (
            paymentType?.map((type, key) => (
              <div
                key={key}
                className="method-item"
                onClick={() => handlePayment(type)}
              >
                <div
                  className={`icon ${
                    selectedPayment?.id === type.payment.id && "select"
                  }`}
                >
                  {selectedPayment?.id === type.payment.id ? (
                    <CheckboxCircleFillIcon />
                  ) : (
                    <CheckboxBlankCircleLineIcon />
                  )}
                </div>
                <div className="label">{type.payment.translation.title}</div>
              </div>
            ))
          ) : (
            <DiscordLoader />
          )}
        </div>
      </div>
      <div className="btn-group-box">
        <div
          className="btn btn-default"
          onClick={() => handleVisible(dc.order_list)}
        >
          {tl("Cancel")}
        </div>
        <div className="btn btn-dark" onClick={handleContinue}>
          {tl("Continue")}
        </div>
      </div>
    </div>
  );
};

export default Payment;
