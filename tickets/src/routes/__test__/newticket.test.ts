import request from "supertest";
import { app } from "../../app";
import { Tickets } from "../../models/tickets.model";

it(" has a route handler listening to /api/tickets for creating new tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is authenticated", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return a status of 401 unauthorized", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns an  error if an invalid title is provided ", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 100,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 100,
    })
    .expect(400);
});

it("returns an  error if an invalid price is provided ", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "developer community meetup",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "developer community meetup",
    })
    .expect(400);
});

it(" create a ticket with valid input ", async () => {
  let ticket = await Tickets.find({});

  expect(ticket.length).toEqual(0);
  const title = "developer community meetup";
  const price = 100;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  ticket = await Tickets.find({});

  expect(ticket.length).toEqual(1);
  expect(ticket[0].title).toEqual(title);
  expect(ticket[0].price).toEqual(price);
});
