import React, { useContext, useEffect, useState } from "react";
import CheckoutStep from "./component/checkout-step";
import TruckFillIcon from "remixicon-react/TruckFillIcon";
import RoadsterFillIcon from "remixicon-react/RoadsterFillIcon";
import CheckboxCircleFillIcon from "remixicon-react/CheckboxCircleFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import InputText from "../form/form-item/InputText";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { AuthContext } from "../../context/AuthContext";
import { ShopApi } from "../../api/main/shops";
import { useDispatch, useSelector } from "react-redux";
import { getPrice } from "../../utils/getPrice";
import DiscordLoader from "../loader/discord-loader";
import DateRangePopover from "../form/form-item/date-range-popover";
import CustomSelect from "../form/form-item/customSelect";
import { toast } from "react-toastify";
import { addToGeneralData } from "../../redux/slices/cart";
import { CheckCoupon } from "../../api/main/check-coupon";
import { useTranslation } from "react-i18next";
import { parseCookies } from "nookies";
import { OrderContext } from "../../context/OrderContext";
import { Card, Toast, ToastBody, Tooltip } from "reactstrap";

const Checkout = () => {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const shop = useSelector((state) => state.stores.currentStore);
  const user = useSelector((state) => state.user.data);
  const { handleVisible } = useContext(MainContext);
  const { userLocation } = useContext(AuthContext);
  const { orderedProduct } = useContext(OrderContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [deliveryTypes, setDeliveryTypes] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryTab, setDeliveryTab] = useState("delivery");
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState(null);
  const [currentShippingMethod, setCurrentShippingMethod] = useState(null);
  const targetLocation = userLocation?.split(",");
  const deliveryPickup = deliveryTypes?.filter(
    (item) => item.type === "pickup"
  )[0];
  const addressList = [];
  user?.addresses?.forEach((item) => {
    addressList.push({
      id: item.id,
      value: item.address,
      location: item.location,
    });
  });
  const selectedAddress = addressList.find(
    (item) => item.location.latitude === targetLocation[0]
  );
  const checkCoupon = (value) => {
    if (value) {
      CheckCoupon.create({
        coupon: value,
        user_id: user.id,
        shop_id: shop?.id,
      })
        .then((res) => {
          setPromoCode(res.data);
          setError(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setError(true);
        });
    } else setError(null);
  };
  const getDelivery = () => {
    ShopApi.getDelivery({ [`shops[0]`]: shop.id })
      .then((res) => {
        setDeliveryTypes(res.data[0]?.deliveries);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getDeliveryTime = () => {
    const timeArray = [];
    let start = parseInt(shop?.open_time?.slice(0, 2));
    let end = parseInt(shop?.close_time?.slice(0, 2));
    if (end === 0) end = 24;
    for (start; start < end; start++) {
      timeArray.push({
        id: `${start}:00-${start + 1}:00`,
        value: `${start}:00 - ${start + 1}:00`,
      });
    }
    return timeArray;
  };
  const handleShippingMethod = (delivery) => {
    setCurrentShippingMethod(delivery);
    setDeliveryDate("");
  };
  const handleDeliveryDate = (e) => {
    setDeliveryDate(e);
  };
  const handleDeliveryTime = (e) => {
    setDeliveryTime(e);
  };
  const handleSelectAddress = (e) => {
    setDeliveryAddress(e);
  };
  const handleCountinue = (e) => {
    e.preventDefault();
    if (!currentShippingMethod) {
      toast.error("Please select delivery shipping method");
    } else if (!deliveryAddress) {
      toast.error("Please select delivery address");
    } else if (!deliveryDate) {
      toast.error("Please select delivery date");
    } else if (!deliveryTime) {
      toast.error("Please select delivery time");
    } else {
      dispatch(
        addToGeneralData({
          currency_id: cookies?.currency_id,
          rate: cookies?.currency_rate,
          coupon: error ? "" : promoCode?.name,
          coupon_price: error ? "" : promoCode?.price,
          delivery_type_id: currentShippingMethod?.id,
          delivery_address_id: deliveryAddress?.id,
          delivery_fee: currentShippingMethod?.price,
          delivery_date: deliveryDate,
          delivery_time: deliveryTime?.id,
          cart_id: orderedProduct?.id,
          shop_id: shop?.id,
        })
      );
      handleVisible(dc.payment);
    }
  };
  const continuePickup = (e) => {
    e.preventDefault();
    if (!deliveryDate) {
      toast.error("Please select delivery date");
    } else if (!deliveryPickup) {
      toast.error("Pickup not defind. Please selcet delivery type");
    } else {
      dispatch(
        addToGeneralData({
          currency_id: cookies?.currency_id,
          rate: cookies?.currency_rate,
          coupon: error === "error" ? "" : promoCode,
          delivery_type_id: deliveryPickup?.id,
          delivery_date: deliveryDate,
          delivery_fee: 0,
          cart_id: orderedProduct?.id,
          shop_id: shop?.id,
        })
      );
      handleVisible(dc.payment);
    }
  };
  useEffect(() => {
    getDelivery();
    if (selectedAddress) handleSelectAddress(selectedAddress);
  }, []);

  return (
    <div className="checkout">
      <CheckoutStep name="checkout" />
      <div className="delivery-type">
        <div className="title">{tl("Delivery type")}</div>
        {deliveryTypes?.length !== 0 && (
          <div className="content">
            <button
              className={`item ${deliveryTab === "delivery" && "active"}`}
              onClick={() => setDeliveryTab("delivery")}
            >
              <div className="icon">
                <RoadsterFillIcon />
              </div>
              <div className="label">{tl("Delivery")}</div>
            </button>
            <button
              className={`item ${deliveryTab === "pickup" && "active"}`}
              onClick={() => setDeliveryTab("pickup")}
              disabled={!deliveryPickup}
            >
              <div className="icon">
                <TruckFillIcon />
              </div>
              <div className="label">{tl("Pickup")}</div>
            </button>
          </div>
        )}
        {deliveryTab === "delivery" ? (
          <>
            {deliveryTypes ? (
              deliveryTypes
                ?.filter((i) => i.type !== "pickup")
                ?.map((type, key) => (
                  <div
                    key={key}
                    className="type"
                    onClick={() => handleShippingMethod(type)}
                  >
                    <div className="left">
                      <div
                        className={`select-icon ${
                          currentShippingMethod?.id === type.id && "select"
                        }`}
                      >
                        {currentShippingMethod?.id === type.id ? (
                          <CheckboxCircleFillIcon />
                        ) : (
                          <CheckboxBlankCircleLineIcon />
                        )}
                      </div>
                      <div className="delivery-name">
                        <div className="name">{type.translation.title}</div>
                        <div className="price">{getPrice(type.price)}</div>
                      </div>
                    </div>
                    <div className="right">
                      {`${type.times[0]} - ${type.times[1]} ${"days"}`}
                    </div>
                  </div>
                ))
            ) : (
              <DiscordLoader />
            )}
            {deliveryTypes?.length === 0 && (
              <Toast className="bg-warning text-white">
                <ToastBody>{tl("delivery.method.not.found")}</ToastBody>
              </Toast>
            )}
            <div className="form-box">
              <CustomSelect
                options={addressList}
                label="Address"
                placeholder="Address"
                onChange={(e) => handleSelectAddress(e)}
                value={deliveryAddress?.id}
                name="delivery_address_id"
                required={true}
                type="address"
              />
              <DateRangePopover
                id="TooltipExample"
                disabled={currentShippingMethod ? false : true}
                label="Date"
                onChange={handleDeliveryDate}
                value={deliveryDate}
                extraDay={
                  currentShippingMethod
                    ? parseInt(currentShippingMethod?.times[0])
                    : 0
                }
              />
              <Tooltip
                isOpen={tooltipOpen}
                target="TooltipExample"
                toggle={toggle}
              >
                {tl(
                  "Date selection is not possible, you need to choose the type of delivery"
                )}
              </Tooltip>
              <CustomSelect
                options={getDeliveryTime()}
                label="Time"
                placeholder="--:-- --"
                onChange={(e) => handleDeliveryTime(e)}
                value={deliveryTime?.id}
                required={true}
              />
              <InputText
                label="Promo code"
                placeholder="Code"
                onBlur={(e) => {
                  checkCoupon(e.target.value);
                }}
                value={promoCode?.name}
                onChange={(e) => setPromoCode(e.target.value)}
                invalid={error}
                valid={
                  (typeof error === "string" || typeof error === "boolean") &&
                  true
                }
              />
              <div className="btn-group-box">
                <div
                  className="btn btn-default mr-1"
                  onClick={() => handleVisible(dc.order_list)}
                >
                  {tl("Cancel")}
                </div>
                <div className="btn btn-dark" onClick={handleCountinue}>
                  {tl("Continue")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="form-box">
            <DateRangePopover
              // disabled={currentShippingMethod ? false : true}
              label="Date"
              onChange={handleDeliveryDate}
              value={deliveryDate}
              extraDay={
                currentShippingMethod
                  ? parseInt(currentShippingMethod?.times[0])
                  : 0
              }
            />
            <InputText
              label="Promo code"
              placeholder="Code"
              onBlur={(e) => {
                checkCoupon(e.target.value);
              }}
              value={promoCode?.name}
              onChange={(e) => setPromoCode(e.target.value)}
              invalid={error}
              valid={
                (typeof error === "string" || typeof error === "boolean") &&
                true
              }
            />
            <div className="btn-group-box">
              <div
                className="btn btn-default"
                onClick={() => handleVisible(dc.order_list)}
              >
                {tl("Cancel")}
              </div>
              <div className="btn btn-dark" onClick={continuePickup}>
                {tl("Continue")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
