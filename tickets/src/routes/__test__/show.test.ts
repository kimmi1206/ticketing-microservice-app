import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`) // Route /api/tickets/:id
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is not found', async () => {
  // another option for this test:
  // Ticket.build({}thisticketexist)
  // ticket.save()

  const title = 'validtitle';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`) // Route /api/tickets/:id
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
