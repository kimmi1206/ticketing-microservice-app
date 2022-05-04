import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a router handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title: 'valid title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title: '',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const title = 'validtitle';
  const price = 20;

  let tickets = await Ticket.find({}); // gets all the tickets in the collection
  expect(tickets.length).toEqual(0); // collection is empty, new instance of mongodb in dev env

  await request(app)
    .post('/api/tickets')
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({}); // should return 1 record that just was created
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
  const title = 'validtitle';
  const price = 20;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
