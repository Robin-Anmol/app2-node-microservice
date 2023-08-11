import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@robinanmol/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publisher/order.cancelled.publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly QueueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    console.log(`expiration data`, data);
    const order = await Orders.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found");
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    console.log(order.id, "hdsjhfsdjfhjk");
    const publisher = new OrderCancelledPublisher(this.client);
    await publisher.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
