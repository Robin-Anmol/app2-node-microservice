import { OrderCancelledEvent, OrderStatus } from "@robinanmol/common";
import { natsClient } from "../../../nats-client";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order.model";
import { OrderCancelledListener } from "../order.cancelled.listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    totalPrice: 300,
  });

  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "sdhfsdhfj",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data, order };
};

it("cancelled the order ", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  const updateOrder = await Order.findById(data.id);
  expect(updateOrder?.id).toEqual(order.id);
  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(updateOrder?.version).toEqual(data.version);
});

it("give ack to message ", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
