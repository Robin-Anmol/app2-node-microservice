import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order.model";
import { OrderStatus } from "@robinanmol/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment.model";

it("returns 404 if order does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      payment_method_id: "pm_card_visa",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns 401 if the unauthorized user try to make payment for order or does not belong to order ", async () => {
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    totalPrice: 400,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      payment_method_id: "pm_card_visa",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 if the purchasing order is already cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Cancelled,
    totalPrice: 400,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      payment_method_id: "pm_card_visa",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 200 with valid inputs and generate the payment_intent and wait for confirmation", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    totalPrice: 2,
  });

  await order.save();

  const { body: payment_intent } = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      payment_method_id: "pm_card_visa",
      orderId: order.id,
    })
    .expect(200);

  expect(payment_intent.requires_action).toEqual(true);

  const { data } = await stripe.paymentIntents.list({ limit: 1 });
  expect(data[0].metadata.orderId).toEqual(order.id);
  expect(data[0].metadata.userId).toEqual(userId);
});

it("save payment to db ", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    userId,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    totalPrice: 2,
  });

  await order.save();

  const { body: payment_intent } = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      payment_method_id: "pm_card_visa",
      orderId: order.id,
    })
    .expect(200);

  console.log(payment_intent);
  expect(payment_intent.requires_action).toEqual(true);

  const { data } = await stripe.paymentIntents.list({ limit: 1 });
  expect(data[0].metadata.orderId).toEqual(order.id);
  expect(data[0].metadata.userId).toEqual(userId);

  const payment = await Payment.findOne({
    stripeId: data[0].id,
    orderId: order.id,
  });
  // console.log(payment);
  expect(payment?.stripeId).toEqual(data[0].id);
  expect(payment?.orderId).toEqual(order.id);
});
