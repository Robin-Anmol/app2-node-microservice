import request from "supertest";

import { app } from "../../app";
import mongoose from "mongoose";
it("returns 404  if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "developer community meetup";
  const price = 100;
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
  const response = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
