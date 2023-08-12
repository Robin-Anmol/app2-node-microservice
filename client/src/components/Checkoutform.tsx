import React, { useReducer } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CardSection from "./CardSection/CardSection";
import { PaymentService } from "@/services/payment";
import { PaymentMethodResult, StripeCardElement } from "@stripe/stripe-js";
import { useRouter } from "next/router";

interface CheckoutFormProps {
  orderId: string;
}
export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  if (!stripe) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement) as StripeCardElement,
      billing_details: {
        name: "Ticket payment",
      },
    });

    stripePaymentMethodHandler(result);
  };

  const stripePaymentMethodHandler = async (result: PaymentMethodResult) => {
    if (result.error) {
      // Show error in payment form
      alert(result.error.message);
    } else {
      const { response, errors: error } = await PaymentService.createPayment({
        orderId,
        payment_method_id: result.paymentMethod.id,
      });
      const paymentResponse = { error, ...response?.data };

      handleServerResponse(paymentResponse);
    }
  };
  const handleServerResponse = async (response: {
    error: any;
    requires_action: any;
    payment_intent_client_secret: string;
  }) => {
    if (response.error) {
      // Show error in payment form

      alert(response.error[0].message);
    } else if (response.requires_action) {
      const { error: errorAction, paymentIntent } =
        await stripe.handleCardAction(response.payment_intent_client_secret);

      if (errorAction) {
        alert(errorAction.message);
      } else {
        const { response, errors: error } = await PaymentService.confirmPayment(
          {
            orderId,
            payment_intent_id: paymentIntent.id,
          }
        );
        const paymentResponse = { error, ...response?.data };
        handleServerResponse(paymentResponse);
      }
    } else {
      alert("payment success redirect to /orders page");
      router.push("/orders");
    }
  };
  return (
    <div className="flex h-[70dvh] w-full   items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] lg:w-[40%]  relative border flex flex-col rounded-lg shadow-xl gap-4   p-7  border-grey-500"
      >
        <CardSection />
        <button
          type="submit"
          disabled={!stripe}
          className="px-5 text-lg font-medium py-3 hover:bg-purple-700 bg-purple-500 rounded-lg text-white "
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
