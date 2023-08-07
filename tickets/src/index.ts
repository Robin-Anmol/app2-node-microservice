import mongoose from "mongoose";
import { app } from "./app";
import { natsClient } from "./nats-client";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is  required");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is  required");
  }
  try {
    await natsClient.connect("tickets", "http://nats-srv:4222");
    natsClient.close();
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("tickets service listening on port 3000");
  });
};

start();
