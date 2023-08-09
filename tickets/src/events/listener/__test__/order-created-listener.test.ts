import { OrderCreatedEvent, OrderStatus } from "@robinanmol/common";
import { Tickets } from "../../../models/tickets.model";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  //   create a ticket that need to be reserved
  const ticket = await Tickets.create({
    title: "developer community meetup",
    price: 400,
    userId: "robin",
  });

  await ticket.save();
  // create a fake data
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "shdfjksdhfj",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, msg, ticket, listener };
};

it("sets the order id to the ticket which is reserving the ticket ", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  const updateTicket = await Tickets.findById(ticket.id);

  expect(updateTicket!.orderId).toEqual(data.id);
});

it("ack the message ", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  const updateTicket = await Tickets.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
