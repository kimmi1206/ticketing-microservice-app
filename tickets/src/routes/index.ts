import express, { Request, Response } from 'express';
// import { body } from 'express-validator';
// import { requireAuth, validateRequest } from '@khmtickets/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = Ticket.find({}); // empty object can be used for filtering

  res.send(tickets);
});

export { router as indexTicketRouter };
