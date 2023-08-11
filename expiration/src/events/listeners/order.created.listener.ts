import { Listener, Subjects, OrderCreatedEvent } from "@robinanmol/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration.queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly QueueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(data);
    console.log(delay, "delay period");

    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: delay,
      }
    );

    msg.ack();
  }
}
