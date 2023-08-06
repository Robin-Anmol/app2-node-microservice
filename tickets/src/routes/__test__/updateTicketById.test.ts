import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket id does not exist", async () => {
  const title = "developer community meetup";
  const price = 100;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const title = "developer community meetup";
  const price = 100;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns a 401 if the authenticated user does not own the ticket ", async () => {
  const title = "developer community meetup";
  const price = 100;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const updatedResponse = await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "update by",
      price: 400,
    })
    .expect(401);

  //   const getTicket = await request(app)
  //     .get(`/api/tickets/${response.body.id}`)
  //     .expect(200);
  //   expect(getTicket.body.title).toEqual(title);

  expect(updatedResponse.body.title).not.toEqual(title);
  expect(updatedResponse.body.price).not.toEqual(price);
  //   expect(getTicket.body.price).toEqual(price);
});

it("returns a 400 if user provides an invalid title or price ", async () => {
  const cookie = global.signin();
  const title = "developer community meetup";
  const price = 100;
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: 239,
    })
    .expect(400);

  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: -100,
    })
    .expect(400);
  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
    })
    .expect(400);
});

it("returns  a 200  if the user provides an valid title or price ", async () => {
  const cookie = global.signin();
  let title = "developer community meetup";
  let price = 100;
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  // by title
  title = "new update title";

  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
    })
    .expect(200);

  let getTicket = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .expect(200);
  expect(getTicket.body.title).toEqual(title);

  //   by price
  price = 900;

  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      price,
    })
    .expect(200);

  getTicket = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .expect(200);
  expect(getTicket.body.price).toEqual(price);

  //   update by both
  title = "this is valid title";
  price = 20000;

  await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  getTicket = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .expect(200);

  expect(getTicket.body.title).toEqual(title);
  expect(getTicket.body.price).toEqual(price);
});
