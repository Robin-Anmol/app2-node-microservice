import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket.model";
import { OrderStatus, Orders } from "../../models/order.model";
import { natsClient } from "../../nats-client";


it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error status 400 if the ticket is already been reserved", async () => {
  const ticket = await Ticket.create({
    title: "developer meetup",
    price: 200,
  });

  const order = await Orders.create({
    ticket,
    userId: "robinanmol",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("returns an  reserved ticket", async () => {
  const ticket = await Ticket.create({
    title: "developer meetup",
    price: 200,
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("emits a order created event", async () => {
  const ticket = await Ticket.create({
    title: "developer meetup",
    price: 200,
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
