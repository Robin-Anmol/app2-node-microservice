import { Listener, Subjects, TicketCreatedEvent } from "@robinanmol/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly QueueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;

    const ticket = await Ticket.create({
      title,
      price,
      _id: id,
    });

    if (ticket) {
      msg.ack();
    }
  }
}
