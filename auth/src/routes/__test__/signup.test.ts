import request from 'supertest';
import { app } from '../../app';

it('returns a 201 http response code on successful signup', async () => {
  return request(app) // successful, 201 response
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('returns a 400 http response code with an invalid email', async () => {
  return request(app) // invalid email
    .post('/api/users/signup')
    .send({ email: 'test@test', password: 'password' })
    .expect(400);
});

it('returns a 400 http response code with an invalid password', async () => {
  return request(app) // invalid password
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'pas' })
    .expect(400);
});

it('returns a 400 http response code with missing email and/or password', async () => {
  await request(app) // missing password
    .post('/api/users/signup')
    .send({ email: 'test@test' })
    .expect(400);

  await request(app) // missing email
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app) // successful request, response 201
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  await request(app) // bad request, duplicate email
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('sets a cookie after a successful signup', async () => {
  const response = await request(app) // successful request, response 201
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
