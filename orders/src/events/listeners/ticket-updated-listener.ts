import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@khmtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price } = data;
    // const { title, price, version } = data;
    const ticket = await Ticket.findByEvent(data); // static function to find ticket by id and version number

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    // ticket.set({ title, price, version });
    await ticket.save();

    msg.ack();
  }
}
