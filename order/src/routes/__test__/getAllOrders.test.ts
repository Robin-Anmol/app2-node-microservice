import request from "supertest";
import { app } from "../../app";
import { Orders } from "../../models/order.model";
import { Ticket } from "../../models/ticket.model";
import mongoose from "mongoose";

const createTicket = async (number: number) => {
  const ticket = await Ticket.create({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: `ticket ${number}`,
    price: number * 100,
  });

  return ticket;
};
it("returns all the users orders", async () => {
  const ticket1 = await createTicket(1);
  const ticket2 = await createTicket(2);
  const ticket3 = await createTicket(3);

  const userOne = global.signin();
  const userSecond = global.signin();

  const useOneOrder = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);
  const { body: useSecondOrder1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userSecond)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const { body: useSecondOrder2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userSecond)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userSecond)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(useSecondOrder1.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].id).toEqual(useSecondOrder2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
