import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./stripe";
import PayPal from "./paypal";

export default function CreatePayment({ payment, data, createdOrderData }) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  const options = {
    clientSecret: `${data?.paymentIntent.client_secret}`,
  };
  return (
    <>
      {payment?.payment?.tag === "paypal" && (
        <PayPal payment={payment} createdOrderData={createdOrderData} />
      )}
      {payment?.payment?.tag === "stripe" && data && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm payment={payment} paymentIntent={data?.paymentIntent} />
        </Elements>
      )}
    </>
  );
}
