import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

// hook function that runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'mysecretkey_for-testing_in_dev-env';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// hook that runs before each test, (reset data before/between tests)
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// hook that runs after all the test are completed
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
