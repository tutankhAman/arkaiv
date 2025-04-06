const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from main .env file
dotenv.config();

// Increase timeout for MongoDB operations
jest.setTimeout(30000);

// Disconnect from any existing connections
beforeAll(async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
});

// Connect to test database before all tests
beforeAll(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
});

// Clear all collections before each test
beforeEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
    throw error;
  }
});

// Close connection after all tests
afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}); 