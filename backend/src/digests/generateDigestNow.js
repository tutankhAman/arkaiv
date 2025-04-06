const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const DailyDigest = require('../models/DailyDigest');

// Improved environment loading
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from: ${envPath}`);
  require('dotenv').config({ path: envPath });
} else {
  console.warn(`No .env file found at ${envPath}`);
  // Try loading from parent directory as fallback
  const rootEnvPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(rootEnvPath)) {
    console.log(`Loading environment from: ${rootEnvPath}`);
    require('dotenv').config({ path: rootEnvPath });
  } else {
    console.warn('No .env file found in parent directory either');
    require('dotenv').config();
  }
}

const generateDailyDigest = require('./digestService');

async function main() {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('ERROR: MONGODB_URI environment variable is not set!');
      console.log('Available environment variables:', Object.keys(process.env)
        .filter(key => !key.includes('=') && !key.startsWith('npm_')));
      throw new Error('MONGODB_URI environment variable is not set. Check your .env file.');
    }
    
    // Log a redacted version of the URI for debugging
    const redactedUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB: ${redactedUri}`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log('Connected to MongoDB');

    console.log('Generating daily digest...');
    const digest = await generateDailyDigest();
    
    // Check if a digest already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingDigest = await DailyDigest.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingDigest) {
      console.log('A digest already exists for today. Updating it...');
      // Update existing digest
      existingDigest.totalTools = digest.totalTools;
      existingDigest.newTools = digest.newTools;
      existingDigest.topEntries = digest.topEntries;
      existingDigest.summary = digest.summary;
      existingDigest.formattedDocument = digest.formattedDocument;
      await existingDigest.save();
      console.log('Updated existing digest in database');
    } else {
      // Create new digest
      const newDigest = new DailyDigest({
        date: digest.date,
        totalTools: digest.totalTools,
        newTools: digest.newTools,
        topEntries: digest.topEntries,
        summary: digest.summary,
        formattedDocument: digest.formattedDocument
      });
      await newDigest.save();
      console.log('Saved new digest to database');
    }
    
    console.log('\nDaily Digest Generated:');
    console.log('Date:', digest.date);
    console.log('Total Tools:', digest.totalTools);
    console.log('New Tools Today:', digest.newTools);
    console.log('\nSummary:');
    console.log(digest.summary);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\nDisconnected from MongoDB');
    }
  }
}

main();