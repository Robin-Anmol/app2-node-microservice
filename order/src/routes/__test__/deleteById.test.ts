import request from "supertest";
import { Ticket } from "../../models/ticket.model";
import { OrderStatus, Orders } from "../../models/order.model";
import { app } from "../../app";
import { natsClient } from "../../nats-client";
import mongoose from "mongoose";

it("delete the order", async () => {
  const ticket = await Ticket.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: `ticket 1`,
    price: 100,
  });

  const cookie = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(204);

  const deletedOrder = await Orders.findById(order.id);
  expect(deletedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits the order cancelled event ", async () => {
  const ticket = await Ticket.create({
    title: `ticket 1`,
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
  });

  const cookie = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(204);

  const deletedOrder = await Orders.findById(order.id);
  expect(deletedOrder?.version).not.toEqual(order.version);
  expect(deletedOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(natsClient.client.publish).toHaveBeenCalled();
});
