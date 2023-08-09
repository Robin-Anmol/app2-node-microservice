import { TicketCreatedEvent } from "@robinanmol/common";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket.created.listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";

const setup = async () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsClient.client);
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ticket created listener test  title ",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener };
};

it("create and save a ticket ", async () => {
  const { listener, data, msg } = await setup();
  listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("make sure the ack function got called if the ticket is created  ", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
