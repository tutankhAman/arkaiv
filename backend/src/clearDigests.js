const mongoose = require('mongoose');
const DailyDigest = require('./models/DailyDigest');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the correct path
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

async function clearDigests() {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the most recent digest
    const mostRecentDigest = await DailyDigest.findOne()
      .sort({ date: -1 })
      .limit(1);

    if (!mostRecentDigest) {
      console.log('No digests found in the database');
      return;
    }

    console.log(`Keeping digest from ${mostRecentDigest.date}`);

    // Delete all digests except the most recent one
    const result = await DailyDigest.deleteMany({
      _id: { $ne: mostRecentDigest._id }
    });

    console.log(`Deleted ${result.deletedCount} digests`);
    console.log('Only the most recent digest remains in the database');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

clearDigests(); 