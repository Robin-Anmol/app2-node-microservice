import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@robinanmol/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly QueueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      totalPrice: data.ticket.price,
    });

    await order.save();
    msg.ack();
  }
}
