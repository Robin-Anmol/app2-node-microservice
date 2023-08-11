import { ExpirationCompleteEvent, OrderStatus } from "@robinanmol/common";
import { natsClient } from "../../../nats-client";
import { ExpirationCompleteListener } from "../expiration.complete.listener";
import { Ticket } from "../../../models/ticket.model";
import mongoose from "mongoose";
import { Orders } from "../../../models/order.model";

const setup = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "thie title",
    price: 34954,
  });
  await ticket.save();
  const order = await Orders.build({
    userId: "jskfdj",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();
  // create an instance of listener
  const listener = new ExpirationCompleteListener(natsClient.client);
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener, ticket, order };
};

it("it updates the order status to cancelled ", async () => {
  const { listener, data, msg, ticket, order } = await setup();

  await listener.onMessage(data, msg);

  const updateOrder = await Orders.findById(order.id);
  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
});
it("emit the order cancelled event ", async () => {
  const { listener, data, msg, ticket, order } = await setup();

  await listener.onMessage(data, msg);
  expect(natsClient.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});
it("ack the message ", async () => {
  const { listener, data, msg, ticket, order } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
