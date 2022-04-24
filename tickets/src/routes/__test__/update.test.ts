import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

let title = 'validtitle';
let price = 20;

it('returns a 404 if the provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup().toString())
    .send({
      title,
      price,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup().toString())
    .send({
      title: 'ti',
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup().toString()) // generates a new cookie, different user
    .send({
      title,
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signup().toString();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'anothertitle',
      price: 120,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) // uses the same cookie, same user
    .send({
      title: '', // invalid title
      price: 1000,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) // uses the same cookie, same user
    .send({
      title: 'newtitle',
      price: -1000, // invalid price
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signup().toString();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'anothertitle',
      price: 120,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) // uses the same cookie, same user
    .send({
      title: 'new title', // valid title
      price: 1500, // valid price
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.title).toEqual(1500);
});
