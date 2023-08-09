import { OrderCreatedEvent, Publisher, Subjects } from "@robinanmol/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
