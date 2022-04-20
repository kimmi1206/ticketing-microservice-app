import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // only for local testing
  process.env.JWT_KEY = 'mysecretkey_for-testing_in_dev-env'; // only for local testing in dev environment
  // process.env.MONGO_URI = 'mongodb://localhost:27017/auth' // for testing locally

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
