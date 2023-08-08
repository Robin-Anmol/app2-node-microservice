import { Publisher, Subjects, TicketUpdatedEvent } from "@robinanmol/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
