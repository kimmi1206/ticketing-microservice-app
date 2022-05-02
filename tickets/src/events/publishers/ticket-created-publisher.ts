import { Publisher, Subjects, TicketCreatedEvent } from '@khmtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
