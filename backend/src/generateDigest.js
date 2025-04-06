require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const { generateDailyDigest } = require('./services/digestService');

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Generating daily digest...');
    const digest = await generateDailyDigest();
    console.log('\nDaily Digest:');
    console.log('Date:', digest.date);
    console.log('Total Tools:', digest.totalTools);
    console.log('New Tools Today:', digest.newToolsToday);
    console.log('\nSummary:');
    console.log(digest.summary);
    console.log('\nTop Entries:');
    console.log('GitHub:', digest.topEntries.github);
    console.log('HuggingFace:', digest.topEntries.huggingface);
    console.log('arXiv:', digest.topEntries.arxiv);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

main(); 