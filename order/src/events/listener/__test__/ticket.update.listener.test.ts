import { TicketCreatedEvent, TicketUpdatedEvent } from "@robinanmol/common";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket.created.listener";
import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket.updated.listener";
import { Ticket } from "../../../models/ticket.model";

const setup = async () => {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsClient.client);

  const ticket = await Ticket.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ticket created listener test  title ",
    price: 20,
  });

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "updated the ticket with version 1 ",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, msg, listener, ticket };
};

it("finds, updates and save a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updateTicket = await Ticket.findById(ticket.id);
  expect(updateTicket!.title).toEqual(data.title);
  expect(updateTicket!.price).toEqual(data.price);
  expect(updateTicket!.version).toEqual(data.version);
});

//
it("it ack the updated event message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("should not execute the ack function if the ticket updated version are not in order ", async () => {
  const { listener, data, msg } = await setup();
  data.version = 5;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
