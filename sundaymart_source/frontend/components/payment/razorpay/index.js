import axios from "axios";
import React, { useContext } from "react";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { OrderApi } from "../../../api/main/order";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../redux/slices/cart";
import { TransactionsApi } from "../../../api/main/transactions";
import { MainContext } from "../../../context/MainContext";
import { useTranslation } from "react-i18next";
const MyRazorpay = ({ generalData, note, products, payment }) => {
  const { t: tl } = useTranslation();
  const user = useSelector((state) => state.user.data);
  const shop = useSelector((state) => state.stores.currentStore);
  const { setVisable } = useContext(MainContext);
  const dispatch = useDispatch();
  const address = user.addresses?.find(
    (item) => item.id == generalData?.delivery_address_id
  );
  const Razorpay = useRazorpay();
  const createOrder = () => {
    OrderApi.create({
      ...generalData,
      note,
      products,
    })
      .then((res) => {
        handlePayment(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePayment = useCallback(async (order) => {
    const { data } = await axios.post("/api/create-razorpay-session", {
      amount: order?.price,
    });
    const options = {
      key: payment?.client_id,
      amount: order?.price,
      currency: "INR",
      name: `${user?.firstname} ${user?.lastname}`,
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: data.order.id,
      handler: (res) => {
        console.log(res);
        TransactionsApi.create(order.id, {
          payment_sys_id: payment.id,
        })
          .then(() => {
            setVisable(false);
            dispatch(clearCart(shop.id));
          })
          .catch((error) => {
            console.log(error);
          });
      },
      prefill: {
        name: `${user?.firstname} ${user?.lastname}`,
        email: user.email,
        // contact: user.phone,
        contact: "9999999999",
      },
      notes: {
        address: address.address,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzpay = new Razorpay(options);
    rzpay.open();
  }, []);
  return (
    <button className="btn btn-dark" onClick={createOrder}>
      {tl("Razorpay")}
    </button>
  );
};

export default MyRazorpay;
