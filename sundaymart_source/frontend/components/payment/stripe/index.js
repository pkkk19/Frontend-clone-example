import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { TransactionsApi } from "../../../api/main/transactions";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../redux/slices/cart";
import { useContext } from "react";
import { MainContext } from "../../../context/MainContext";
import { useTranslation } from "react-i18next";
const CheckoutForm = ({ paymentIntent, payment }) => {
  const shop = useSelector((state) => state.stores.currentStore);
  const { t: tl } = useTranslation();
  const { setVisible } = useContext(MainContext);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-result",
      },
      redirect: "if_required",
    });
    if (result.paymentIntent?.status === "succeeded") {
      TransactionsApi.create(parseInt(paymentIntent?.metadata?.order_id), {
        payment_sys_id: payment.id,
      })
        .then((res) => {
          console.log(res);
          dispatch(clearCart(shop.id));
          setVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      toast.error(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="row">
        <button className="btn btn-success mt-4" disabled={!stripe}>
          {tl("Submit")}
        </button>
        <button type="button" className="btn btn-dark mt-4">
          {tl("Pay later")}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
