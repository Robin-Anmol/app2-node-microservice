import { Listener, OrderCancelledEvent, Subjects } from "@robinanmol/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Tickets } from "../../models/tickets.model";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly QueueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // find the ticket the order is reserving

    const ticket = await Tickets.findById(data.ticket.id);
    // if not ticket  throw an error

    if (!ticket) {
      throw new Error(`Ticket is not found `);
    }
    // mark the ticket as unlocked by setting up the orderId  property to null

    ticket.set({ orderId: undefined });

    // save the ticket
    await ticket.save();

    // we need to publish an update event here
    const publisher = new TicketUpdatedPublisher(this.client);
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
    msg.ack();
    // ack
  }
}
