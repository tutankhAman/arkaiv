const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from the right path
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from: ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`No .env file found at ${envPath}`);
  // Try loading from parent directory as fallback
  const rootEnvPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(rootEnvPath)) {
    console.log(`Loading environment from: ${rootEnvPath}`);
    dotenv.config({ path: rootEnvPath });
  }
}

// Dynamically import models after environment is configured
const AITool = require('../src/models/AITool');
const DailyDigest = require('../src/models/DailyDigest');

async function clearDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set.');
      console.log('Available environment variables:', Object.keys(process.env).filter(key => !key.includes('=')));
      throw new Error('MONGODB_URI environment variable is not set. Please check your .env file.');
    }

    console.log(`Attempting to connect to MongoDB with URI: ${process.env.MONGODB_URI.substring(0, 20)}...`);
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });

    console.log('Connected to MongoDB Atlas');

    // Clear the AITool collection
    const toolsResult = await AITool.deleteMany({});
    console.log(`Cleared ${toolsResult.deletedCount} documents from AITools collection`);
    
    // Clear the DailyDigest collection
    const digestResult = await DailyDigest.deleteMany({});
    console.log(`Cleared ${digestResult.deletedCount} documents from DailyDigest collection`);

    console.log('Database cleared successfully!');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

// Run the function
clearDatabase();