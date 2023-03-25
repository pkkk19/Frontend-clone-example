import NextCors from "nextjs-cors";

const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

async function CreateStripeSession(req, res) {
  let { amount, order_id } = req.body;
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      order_id: order_id,
    },
  });

  res.json({ paymentIntent: paymentIntent });
}

export default CreateStripeSession;
