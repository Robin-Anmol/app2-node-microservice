import { NextFunction, Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@robinanmol/common";
import { stripe } from "../stripe";

import Stripe from "stripe";
import { Payment } from "../models/payment.model";
import { natsClient } from "../nats-client";
import { PaymentCreatedPublisher } from "../events/publishers/payment.created.publisher";
async function createPaymentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { payment_method_id, payment_intent_id, orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.user?.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("order is already cancelled");
    }

    let intent: Stripe.PaymentIntent | null = null;

    if (payment_method_id) {
      intent = await stripe.paymentIntents.create({
        payment_method: payment_method_id,
        currency: "INR",
        amount: order.totalPrice * 100,
        confirmation_method: "manual",
        confirm: true,
        metadata: {
          orderId: order.id,
          userId: req.user.id,
        },
      });

      const payment = Payment.build({
        orderId,
        userId: req.user.id,
        stripeId: intent.id,
        payment_status: intent.status,
      });
      await payment.save();
    } else if (payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(payment_intent_id);

      const payment = await Payment.findOneAndUpdate(
        {
          orderId: order.id,
          stripeId: intent.id,
        },
        {
          $set: {
            payment_status: intent.status,
          },

          $inc: {
            version: 1,
          },
        },
        {
          new: true,
          returnDocument: "after",
        }
      );
      console.log(payment);
    }

    await generateResponse(res, intent!);
  } catch (err) {
    next(err);
  }
}

const generateResponse = async (
  res: Response,
  intent: Stripe.PaymentIntent
) => {
  if (
    intent.status === "requires_action" &&
    intent.next_action?.type === "use_stripe_sdk"
  ) {
    res.status(200).json({
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    });
  } else if (intent.status === "succeeded") {
    // payment is successful completed
    // publish payment event  to mark order completed
    const payment = await Payment.findOne({
      stripeId: intent.id,
      orderId: intent.metadata.orderId,
    });
    const publisher = new PaymentCreatedPublisher(natsClient.client);
    await publisher.publish({
      id: payment!.id,
      stripeId: payment!.stripeId,
      orderId: payment!.orderId,
    });
    res.status(201).json({
      success: true,
      id: payment!.id,
    });
  } else {
    const payment = await Payment.findOneAndUpdate(
      {
        stripeId: intent.id,
      },
      {
        $set: {
          payment_status: intent.status,
        },

        $inc: {
          version: 1,
        },
      },
      {
        new: true,
        returnDocument: "after",
      }
    );
    console.log(payment);
    throw new BadRequestError("Invalid PaymentIntent status");
  }
};

export { createPaymentController };
