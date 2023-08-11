import { OrderCreatedListener } from "./events/listeners/order.created.listener";
import { natsClient } from "./nats-client";

const start = async () => {
  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI is  required");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is  required");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is  required");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST is  required");
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
  } catch (err) {
    console.log(err);
  }
};

start();
