const mongoose = require('mongoose');
const AITool = require('../src/models/AITool');
require('dotenv').config();

async function clearDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('Connected to MongoDB Atlas');

    // Clear the collection
    const result = await AITool.deleteMany({});
    console.log(`Cleared ${result.deletedCount} documents from the database`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase(); 