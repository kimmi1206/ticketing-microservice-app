import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../app';
import { signupRouter } from '../signup';

it('responds with details about the current user', async () => {
  const cookie = await global.signup();

  const response = await request(app) // validates if an user is logged in (current user)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null object if not authenticated', async () => {
  const response = await request(app) // current user null
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
