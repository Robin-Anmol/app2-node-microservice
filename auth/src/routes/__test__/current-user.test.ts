import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user ", async () => {
  //   const authresponse = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "user@example.com",
  //       password: "password",
  //     })
  //     .expect(201);

  const cookie = await global.signin();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);
  expect(response.body.currentUser.email).toEqual("user@example.com");
});

it("responds of unauthorized request ", async () => {
  await request(app).get("/api/users/currentuser").send().expect(401);
});
