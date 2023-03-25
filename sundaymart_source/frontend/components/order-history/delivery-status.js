import React, { useContext, useEffect, useState } from "react";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import Message3FillIcon from "remixicon-react/Message3FillIcon";
import NavigationFillIcon from "remixicon-react/NavigationFillIcon";
import RadioButtonFillIcon from "remixicon-react/RadioButtonFillIcon";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import { images } from "../../constants/images";
import GoogleMap from "../map/only-show";
import { LocationFavourite } from "../../public/assets/images/svg";
import SummaryProduct from "../products/summary-product";
import { OrderApi } from "../../api/main/order";
import DiscordLoader from "../loader/discord-loader";
import { getImage } from "../../utils/getImage";
import Status from "./helper/status";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import { CartApi } from "../../api/main/cart";
import { useRouter } from "next/router";
import { MainContext } from "../../context/MainContext";
import { useDispatch } from "react-redux";
import { setRoleId } from "../../redux/slices/chat";

const DeliveryStatus = ({ currentOrderId, getOrderHistory, setVisible }) => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [orderDetail, setOrderDetail] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const { getUser, setOpenChat } = useContext(MainContext);
  const getOrderDetail = () => {
    OrderApi.getId(currentOrderId)
      .then((res) => {
        setOrderDetail(res.data);
        const id = res.data?.deliveryman?.id;
        if (id) dispatch(setRoleId(id));
        else dispatch(setRoleId("admin"));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getOrderDetail();
  }, []);
  const getPrice = (price) => {
    return `${
      orderDetail?.currency?.symbol ? orderDetail?.currency?.symbol : "$"
    }${price}`;
  };
  const cancelOrder = () => {
    setSpinner(true);
    OrderApi.statusChange(currentOrderId)
      .then(() => {
        toast.success("Status changed");
        getOrderHistory();
        setVisible(false);
        getUser();
      })
      .catch((error) => {
        console.log(error);
        toast.success(error?.response?.data.message);
      })
      .finally(() => {
        setSpinner(false);
      });
  };
  const insertProduct = () => {
    const productsList = orderDetail.details?.flatMap((item) => [
      {
        shop_product_id: item.shopProduct.id,
        quantity: parseInt(item.quantity),
      },
    ]);
    CartApi.insertProduct({
      shop_id: orderDetail?.shop.id,
      products: productsList,
    })
      .then((res) => {
        router.push(`/stores/${orderDetail?.shop.id}`);
        toast.success("Products added to cart successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  const handleChat = () => {
    setOpenChat((prev) => !prev);
  };

  return (
    <>
      {orderDetail ? (
        <div className="delivery-status">
          {/* <div className="courier-contact">
            <div className="contact-box">
              <div className="time">
                <span>01:23</span>
                <small>Next step</small>
              </div>
              <div className="contact">
                <div className="item phone">
                  <PhoneFillIcon />
                </div>
                <div className="item message">
                  <Message3FillIcon />
                </div>
              </div>
            </div>
            <div className="delivery-condition">
              <span></span>
            </div>
          </div> */}
          {orderDetail?.deliveryman && (
            <div className="delivery-boy">
              <div className="courier">
                <div className="avatar">
                  {orderDetail?.deliveryman.img ? (
                    getImage(orderDetail?.deliveryman.img)
                  ) : (
                    <img src={images.Avatar} />
                  )}
                </div>
                <div className="data">
                  <div className="name">{`${orderDetail?.deliveryman.firstname} ${orderDetail?.deliveryman.lastname}`}</div>
                  <div className="rate">
                    <span className="position">
                      {orderDetail?.deliveryman?.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="navigation" onClick={handleChat}>
                <Message3FillIcon />
              </div>
            </div>
          )}
          {orderDetail.status === "canceled" ? (
            <div className="delivery-step">
              <div className="step">
                <div className="data">
                  <div className="icon bg-danger">
                    <CloseFillIcon color="#fff" />
                  </div>
                  <div className="label">{tl("Canceled")}</div>
                </div>
              </div>
            </div>
          ) : (
            <Status orderDetail={orderDetail} />
          )}

          <div className="cross-address">
            <GoogleMap location={orderDetail?.shop?.location} />
            <div className="from-to-address">
              <div className="from">
                <div className="icon">
                  <RadioButtonFillIcon />
                </div>
                <div className="label">
                  {orderDetail?.shop?.translation?.address}
                </div>
                <span></span>
              </div>
              <div className="to">
                <div className="icon">
                  <LocationFavourite />
                </div>
                <div className="label">
                  {orderDetail?.delivery_address?.address}
                </div>
              </div>
            </div>
          </div>
          <div className="products">
            <div className="title">{tl("Products")}</div>
            {orderDetail?.details?.map((data, key) => (
              <SummaryProduct
                key={key}
                data={data.shopProduct}
                qty={data.quantity}
              />
            ))}
            {/* <div className="order-condition">
              <div className="replaced">
                <div className="icon">
                  <RadioButtonFillIcon />
                </div>
                <div className="label">Replaced product</div>
              </div>
              <div className="replacement">
                <div className="icon">
                  <RadioButtonFillIcon />
                </div>
                <div className="label">Replacement product</div>
              </div>
            </div> */}
          </div>
          <div className="total-price">
            <div className="label">{tl("Total product price")}</div>
            <div className="value">
              {getPrice(
                orderDetail?.price -
                  orderDetail?.total_discount -
                  orderDetail?.delivery_fee -
                  orderDetail?.tax
              )}
            </div>
          </div>
          <div className="expenses">
            <div className="item">
              <div className="label">{tl("Discount")}</div>
              <div className="value">
                {getPrice(orderDetail?.total_discount)}
              </div>
            </div>
            <div className="item">
              <div className="label">{tl("Delivery")}</div>
              <div className="value">{getPrice(orderDetail?.delivery_fee)}</div>
            </div>
            <div className="item">
              <div className="label">{tl("Tax price")}</div>
              <div className="value">{getPrice(orderDetail?.tax)}</div>
            </div>
            {orderDetail?.coupon && (
              <div className="item coupon">
                <div className="label">{tl("Coupon")}</div>
                <div className="value">
                  {getPrice(orderDetail?.coupon?.price)}
                </div>
              </div>
            )}
          </div>
          <div className="total-amount">
            <div className="label">{tl("Total Amount")}</div>
            <div className="value">
              {`${
                orderDetail?.currency?.symbol
                  ? orderDetail?.currency?.symbol
                  : "$"
              }${orderDetail?.price?.toFixed(2)}`}
            </div>
          </div>
        </div>
      ) : (
        <DiscordLoader />
      )}
      {orderDetail && (
        <div className="row">
          <div className="col-md-6">
            {(orderDetail?.status === "accepted" ||
              orderDetail?.status === "new") && (
              <button className="btn btn-danger" onClick={cancelOrder}>
                {spinner ? <Spinner /> : tl("Cancel order")}
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button className="btn btn-success" onClick={insertProduct}>
              {tl("Reorder")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryStatus;
