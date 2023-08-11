import { OrderCreatedEvent, OrderStatus } from "@robinanmol/common";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order.created.listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "sdfjskdfjk",
    version: 0,
    ticket: {
      id: "sdhfsdhfj",
      price: 30,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("it replicates the order data ", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order?.totalPrice).toEqual(data.ticket.price);
  expect(order?.status).toEqual(data.status);
});

it("give ack to message ", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
