import { Publisher, Subjects, TicketCreatedEvent } from "@robinanmol/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
