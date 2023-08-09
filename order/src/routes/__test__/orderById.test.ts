import request from "supertest";
import { Ticket } from "../../models/ticket.model";
import { Orders } from "../../models/order.model";
import { app } from "../../app";

it("it fetches a ticket by id ", async () => {
  // first make a ticket
  const ticket = await Ticket.create({
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

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it("returns an unauthorized error ", async () => {
  // first make a ticket
  const ticket = await Ticket.create({
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

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
