import mongoose from "mongoose";
import { app } from "./app";
import { natsClient } from "./nats-client";
import { OrderCancelledListener } from "./events/listener/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is  required");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is  required");
  }
  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI is  required");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is  required");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is  required");
  }
  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsClient.close();
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
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
