import { OrderCancelledEvent, Publisher, Subjects } from "@robinanmol/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
