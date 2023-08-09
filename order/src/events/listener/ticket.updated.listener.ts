import { Listener, Subjects, TicketUpdatedEvent } from "@robinanmol/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { version } from "mongoose";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  readonly QueueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // console.log(data, "event received");
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error(`Ticket not found`);
    }
    // we need to change wheather the ticket is reserved by order
    // if yes then we did' ack the event

    const { title, price, version } = data;
    ticket.set({
      title,
      price,
      version,
    });

    await ticket.save();

    console.log(ticket);
    msg.ack();
  }
}
