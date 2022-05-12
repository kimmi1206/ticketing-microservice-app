import { Subjects, Publisher, PaymentCreatedEvent } from '@khmtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
