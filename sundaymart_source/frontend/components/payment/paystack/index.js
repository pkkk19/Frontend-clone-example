import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PaystackConsumer } from "react-paystack";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TransactionsApi } from "../../../api/main/transactions";
import { clearCart } from "../../../redux/slices/cart";
import { MainContext } from "../../../context/MainContext";

function Paystack({ orderedData, createOrder, payment }) {
  const { t: tl } = useTranslation();
  const { setVisible } = useContext(MainContext);
  const user = useSelector((state) => state.user.data);
  const shop = useSelector((state) => state.stores.currentStore);
  const dispatch = useDispatch();
  const handleSuccess = (reference) => {
    TransactionsApi.create(orderedData.id, {
      payment_sys_id: payment.id,
    })
      .then(() => {
        dispatch(clearCart(shop.id));
        setVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClose = () => {
    dispatch(clearCart(shop.id));
    toast.success(
      "Your order created successfully! You can pay later on the order history page"
    );
  };
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: parseFloat(orderedData?.price) * 100,
    publicKey: payment?.client_id,
    currency: "ZAR",
    order_id: orderedData?.id,
  };
  const componentProps = {
    ...config,
    text: "Paystack Button Implementation",
    onSuccess: (reference) => handleSuccess(reference),
    onClose: handleClose,
  };
  return (
    <>
      {Object.keys(orderedData).length ? (
        <PaystackConsumer {...componentProps}>
          {({ initializePayment }) => (
            <button
              className="btn btn-dark"
              onClick={() => initializePayment(handleSuccess, handleClose)}
            >
              {tl("Paystack")}
            </button>
          )}
        </PaystackConsumer>
      ) : (
        <button className="btn btn-dark" onClick={createOrder}>
          {tl("Pay")}
        </button>
      )}
    </>
  );
}

export default Paystack;
