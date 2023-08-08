import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

jest.mock("../nats-client");

let mongo: any;
declare global {
  var signin: () => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = "sfdhgsjdfhj";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build jwt
  const userId = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: userId,
    email: "test@example.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = {
    jwt: token,
  };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
