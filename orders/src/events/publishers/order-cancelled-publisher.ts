import { Publisher, Subjects, OrderCancelledEvent } from '@khmtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
