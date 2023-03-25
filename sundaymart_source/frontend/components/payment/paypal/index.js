import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransactionsApi } from "../../../api/main/transactions";
import { clearCart } from "../../../redux/slices/cart";
import { MainContext } from "../../../context/MainContext";

function PayPal({ createdOrderData, payment }) {
  const shop = useSelector((state) => state.stores.currentStore);
  const dispatch = useDispatch();
  const { setVisible } = useContext(MainContext);
  if (!createdOrderData?.price) return "Order price must not be 0";
  return (
    <PayPalScriptProvider
      options={{
        "client-id": payment?.client_id,
        currency: "USD",
      }}
    >
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: `${createdOrderData?.price}`,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            TransactionsApi.create(createdOrderData.id, {
              payment_sys_id: payment.id,
            })
              .then(() => {
                dispatch(clearCart(shop.id));
                setVisible(false);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPal;
