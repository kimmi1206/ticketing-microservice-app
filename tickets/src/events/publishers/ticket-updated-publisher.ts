import { Publisher, Subjects, TicketUpdatedEvent } from '@khmtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
