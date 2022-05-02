import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchemma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchemma.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchemma.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  // Find orders that have not been cancelled and that include this ticket
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder; // !! converts to boolean, if there is an order, return true
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchemma);

export { Ticket };
