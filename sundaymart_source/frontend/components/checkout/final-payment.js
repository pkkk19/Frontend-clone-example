import React, { useContext } from "react";
import InputText from "../form/form-item/InputText";
import SummaryProduct from "../products/summary-product";
import CheckoutStep from "./component/checkout-step";
import { batch, useDispatch, useSelector } from "react-redux";
import { getPrice } from "../../utils/getPrice";
import { toast } from "react-toastify";
import { OrderApi } from "../../api/main/order";
import { clearCart, setCartData } from "../../redux/slices/cart";
import { TransactionsApi } from "../../api/main/transactions";
import { MainContext } from "../../context/MainContext";
import { useRouter } from "next/router";
import { useState } from "react";
import Paystack from "../payment/paystack";
import MyRazorpay from "../payment/razorpay";
import { DrawerConfig } from "../../configs/drawer-config";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";
const FinalPayment = ({
  payment,
  setVisible,
  setData,
  setCreatedOrderData,
  calculated,
}) => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const dc = DrawerConfig;
  const { handleVisible, getUser } = useContext(MainContext);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [orderedData, setOrderedData] = useState({});
  const shop = useSelector((state) => state.stores.currentStore);
  const generalData = useSelector((state) => state.cart.generalData).filter(
    (item) => item.shop_id === shop.id
  )[0];
  const orderedProduct = useSelector((state) => state.cart.orderedProduct);
  const pay = ({ createdOrderData }) => {
    handleVisible(dc.create_payment);
    if (
      payment.payment.tag === "stripe" &&
      Object.keys(createdOrderData)?.length
    ) {
      axios
        .post("/api/create-stripe-session", {
          amount: createdOrderData.price,
          order_id: createdOrderData.id,
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const createOrder = () => {
    setLoader(true);
    OrderApi.create({
      ...generalData,
      note: comment,
    })
      .then((res) => {
        setOrderedData(res.data);
        setCreatedOrderData(res.data);
        if (
          payment.payment.tag === "cash" ||
          payment.payment.tag === "wallet"
        ) {
          TransactionsApi.create(res.data.id, {
            payment_sys_id: payment.id,
          })
            .then(() => {
              batch(() => {
                dispatch(clearCart(shop.id));
                dispatch(setCartData({}));
              });
              setVisible(false);
              toast.success("Order created successfully");
              router.push("/order-history");
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              if (payment.payment.tag === "wallet") getUser();
            });
        } else if (
          payment.payment.tag === "paypal" ||
          payment.payment.tag === "stripe"
        ) {
          pay({ createdOrderData: res.data });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  return (
    <div className="final-payment">
      <CheckoutStep name="final-payment" />
      <div className="form-box">
        <InputText
          label="Comment"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="your-order">
        <div className="title">{tl("Your Order")}</div>
        {calculated?.products?.map((data, key) => (
          <SummaryProduct key={key} data={data} />
        ))}
        {calculated.bonus_shop && (
          <SummaryProduct
            isBonus={calculated.bonus_shop}
            data={calculated.bonus_shop.shop_product}
            qty={calculated.bonus_shop.bonus_quantity}
          />
        )}
      </div>
      <div className="total-product-price">
        <div className="label">{tl("Total product price")}</div>
        <div className="value">
          {getPrice(calculated?.product_total + calculated?.total_discount)}
        </div>
      </div>
      <div className="expenses">
        <div className="item">
          <div className="label">{tl("Discount")}</div>
          <div className="value">{getPrice(calculated?.total_discount)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("Delivery")}</div>
          <div className="value">{getPrice(generalData?.delivery_fee)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("VAT price")}</div>
          <div className="value">{getPrice(calculated?.product_tax)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("Shop price")}</div>
          <div className="value">{getPrice(calculated?.order_tax)}</div>
        </div>
        {generalData?.coupon && (
          <div className="item coupon">
            <div className="label">{tl("Coupon")}</div>
            <div className="value">{getPrice(generalData?.coupon_price)}</div>
          </div>
        )}
      </div>
      <div className="total-price">
        <div className="label">{tl("Total Amount")}</div>
        <div className="value">
          {getPrice(calculated?.order_total + generalData?.delivery_fee)}
        </div>
      </div>
      <div className="to-checkout">
        <div className="total-amount">
          <div className="label">{tl("Total amount")}</div>
          <div className="count">
            {getPrice(calculated?.order_total + generalData?.delivery_fee)}
          </div>
        </div>
        {payment?.payment.tag === "paystack" ? (
          <Paystack
            createOrder={createOrder}
            payment={payment}
            orderedData={orderedData}
          />
        ) : payment?.payment.tag === "razorpay" ? (
          <MyRazorpay
            generalData={generalData}
            note={comment}
            products={orderedProduct}
            payment={payment}
          />
        ) : (
          <button onClick={createOrder} className="btn btn-success">
            {loader ? <Spinner /> : tl("Checkout")}
          </button>
        )}
      </div>
    </div>
  );
};

export default FinalPayment;
