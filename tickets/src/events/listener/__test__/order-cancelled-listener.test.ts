import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@robinanmol/common";
import { Tickets } from "../../../models/tickets.model";
import { natsClient } from "../../../nats-client";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  //   create a ticket that need to be reserved

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = await Tickets.create({
    title: "developer community meetup",
    price: 400,
    userId: "robin",
  });

  ticket.set({
    orderId,
  });
  await ticket.save();
  // create a fake data
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, msg, ticket, listener, orderId };
};

it("update the ticket ,publishes the updated ticket event and ack the msg ", async () => {
  const { listener, data, ticket, msg, orderId } = await setup();
  await listener.onMessage(data, msg);

  const updateTicket = await Tickets.findById(ticket.id);

  expect(updateTicket!.orderId).toEqual(undefined);

  expect(msg.ack).toHaveBeenCalled();
  expect(natsClient.client.publish).toHaveBeenCalled();
});
