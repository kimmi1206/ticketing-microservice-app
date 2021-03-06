import express, { Request, Response } from 'express';
import { requireAuth } from '@khmtickets/common';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  res.send({});
});

export { router as indexOrderRouter };
