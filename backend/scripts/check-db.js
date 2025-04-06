require('dotenv').config();
const mongoose = require('mongoose');
const AITool = require('../src/models/AITool');
const DailyDigest = require('../src/models/DailyDigest');

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check AITool collection
    const toolCount = await AITool.countDocuments();
    console.log(`\nTotal AI Tools in database: ${toolCount}`);

    // Check DailyDigest collection
    const latestDigest = await DailyDigest.findOne().sort({ date: -1 });
    if (latestDigest) {
      console.log('\nLatest Digest:');
      console.log(`Date: ${latestDigest.date}`);
      console.log(`Total Tools: ${latestDigest.totalTools}`);
      console.log(`New Tools: ${latestDigest.newTools}`);
    } else {
      console.log('\nNo digests found in database');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkDatabase(); 