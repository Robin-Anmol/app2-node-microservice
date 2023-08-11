import {
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@robinanmol/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/order.model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly QueueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Orders.findById(data.orderId);
    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Completed });
    await order.save();
    msg.ack();
  }
}
