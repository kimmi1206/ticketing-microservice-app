import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@khmtickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    // secure: false, // only for testing locally
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createChargeRouter);
app.use(errorHandler);

// app.all('*', async (req, res, next) => {
app.all('*', async (req, res) => {
  throw new NotFoundError();
  // next(new NotFoundError()); // alternative
});

export { app };
