import request from "supertest";
import { app } from "../../app";

it("returns all the tickets with status 200", async () => {
  const title = "developer community meetup";
  const price = 100;

  const ticketList = [
    { title: "developer community meetup", price: 100 },
    { title: "developer community meetup 2", price: 200 },
    { title: "developer community meetup 3", price: 300 },
    { title: "developer community meetup 6", price: 400 },
  ];

  const createdList = ticketList.map(async (ticket) => {
    return request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send(ticket)
      .expect(201);
  });

  await Promise.allSettled(createdList);
  await request(app).get("/api/tickets").expect(200);
});
