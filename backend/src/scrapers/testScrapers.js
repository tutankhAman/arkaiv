// Test script for verifying scraper functionality
const scrapeGitHub = require('./githubScraper');
const scrapeHuggingFace = require('./huggingfaceScraper');
const scrapeArXiv = require('./arxivScraper');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables with fallback paths
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

/**
 * Tests all scrapers and verifies their functionality
 */
async function testScrapers() {
  try {
    // Validate MongoDB connection settings
    if (!process.env.MONGODB_URI) {
      console.error('ERROR: MONGODB_URI environment variable is not set!');
      console.log('Available environment variables:', Object.keys(process.env)
        .filter(key => !key.includes('=') && !key.startsWith('npm_')));
      throw new Error('MONGODB_URI environment variable is not set. Check your .env file.');
    }
    
    // Log redacted MongoDB URI for security
    const redactedUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB: ${redactedUri}`);
    
    // Connect to MongoDB with optimized settings
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000
    });

    console.log('Connected to MongoDB successfully!');
    console.log('Starting scraper tests...\n');

    // Test and validate GitHub scraper
    console.log('Testing GitHub Scraper...');
    const githubResults = await scrapeGitHub();
    console.log(`GitHub Scraper Results: ${githubResults.length} repositories found`);
    if (githubResults.length > 0) {
      console.log('Sample GitHub Result:', JSON.stringify(githubResults[0], null, 2));
    }
    console.log('\n');

    // Test and validate HuggingFace scraper
    console.log('Testing Hugging Face Scraper...');
    const huggingfaceResults = await scrapeHuggingFace();
    console.log(`Hugging Face Scraper Results: ${huggingfaceResults.length} models found`);
    if (huggingfaceResults.length > 0) {
      console.log('Sample Hugging Face Result:', JSON.stringify(huggingfaceResults[0], null, 2));
    }
    console.log('\n');

    // Test and validate arXiv scraper
    console.log('Testing arXiv Scraper...');
    const arxivResults = await scrapeArXiv();
    console.log(`arXiv Scraper Results: ${arxivResults.length} papers found`);
    if (arxivResults.length > 0) {
      console.log('Sample arXiv Result:', JSON.stringify(arxivResults[0], null, 2));
    }
    console.log('\n');

    // Verify scraped data in database
    const AITool = mongoose.model('AITool');
    const totalTools = await AITool.countDocuments();
    console.log(`Total tools in database: ${totalTools}`);

    // Get sample entries from each source for verification
    const githubTools = await AITool.find({ source: 'GitHub' }).limit(1);
    const huggingfaceTools = await AITool.find({ source: 'HuggingFace' }).limit(1);
    const arxivTools = await AITool.find({ source: 'arXiv' }).limit(1);

    console.log('\nDatabase Verification:');
    if (githubTools.length > 0) {
      console.log('GitHub Tool Sample:', JSON.stringify(githubTools[0], null, 2));
    }
    if (huggingfaceTools.length > 0) {
      console.log('Hugging Face Tool Sample:', JSON.stringify(huggingfaceTools[0], null, 2));
    }
    if (arxivTools.length > 0) {
      console.log('arXiv Tool Sample:', JSON.stringify(arxivTools[0], null, 2));
    }

    console.log('\nAll scrapers tested successfully!');

  } catch (error) {
    console.error('Error during testing:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing MongoDB connection...');
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  }
}

// Execute the test suite
testScrapers();