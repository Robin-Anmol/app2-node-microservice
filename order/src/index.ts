import mongoose from "mongoose";
import { app } from "./app";
import { natsClient } from "./nats-client";
import { TicketCreatedListener } from "./events/listener/ticket.created.listener";
import { TicketUpdatedListener } from "./events/listener/ticket.updated.listener";
import { ExpirationCompleteListener } from "./events/listener/expiration.complete.listener";
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

    new TicketCreatedListener(natsClient.client).listen();
    new TicketUpdatedListener(natsClient.client).listen();
    new ExpirationCompleteListener(natsClient.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("order service listening on port 3000");
  });
};

start();
