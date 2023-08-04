import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("return a 400 on with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@testcom",
      password: "password",
    })
    .expect(400);
});

it("return a 400 on with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pa",
    })
    .expect(400);
});

it("return a 400 on with missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "ahdjsdfh",
    })
    .expect(400);
});

it("disallows duplicare email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("it set a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
