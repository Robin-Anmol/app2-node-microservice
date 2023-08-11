import { PaymentCreatedEvent, Publisher, Subjects } from "@robinanmol/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
