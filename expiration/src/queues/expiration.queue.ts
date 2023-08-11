import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration.complete.publisher";
import { natsClient } from "../nats-client";

interface payload {
  orderId: string;
}
const expirationQueue = new Queue<payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    `want to process the expiration complete event for orderId: ${job.data.orderId}`
  );

  const publisher = new ExpirationCompletePublisher(natsClient.client);
  await publisher.publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
