import React from "react";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/Checkoutform";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);
const PaymentPage = () => {
  const router = useRouter();
  const orderId = router.query?.orderId as string | "";

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} />
    </Elements>
  );
};

export default PaymentPage;
