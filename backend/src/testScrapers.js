const scrapeGitHub = require('./scrapers/githubScraper');
const scrapeHuggingFace = require('./scrapers/huggingfaceScraper');
const scrapeArXiv = require('./scrapers/arxivScraper');
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Tests all scrapers and verifies their functionality
 */
async function testScrapers() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tools', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Starting scraper tests...\n');

  try {
    // Test GitHub Scraper
    console.log('Testing GitHub Scraper...');
    const githubResults = await scrapeGitHub();
    console.log(`GitHub Scraper Results: ${githubResults.length} repositories found`);
    console.log('Sample GitHub Result:', JSON.stringify(githubResults[0], null, 2));
    console.log('\n');

    // Test Hugging Face Scraper
    console.log('Testing Hugging Face Scraper...');
    const huggingfaceResults = await scrapeHuggingFace();
    console.log(`Hugging Face Scraper Results: ${huggingfaceResults.length} models found`);
    console.log('Sample Hugging Face Result:', JSON.stringify(huggingfaceResults[0], null, 2));
    console.log('\n');

    // Test arXiv Scraper
    console.log('Testing arXiv Scraper...');
    const arxivResults = await scrapeArXiv();
    console.log(`arXiv Scraper Results: ${arxivResults.length} papers found`);
    console.log('Sample arXiv Result:', JSON.stringify(arxivResults[0], null, 2));
    console.log('\n');

    // Verify data in database
    const totalTools = await mongoose.model('AITool').countDocuments();
    console.log(`Total tools in database: ${totalTools}`);

    // Get sample tools from each source
    const githubTools = await mongoose.model('AITool').find({ source: 'GitHub' }).limit(1);
    const huggingfaceTools = await mongoose.model('AITool').find({ source: 'HuggingFace' }).limit(1);
    const arxivTools = await mongoose.model('AITool').find({ source: 'arXiv' }).limit(1);

    console.log('\nDatabase Verification:');
    console.log('GitHub Tool Sample:', JSON.stringify(githubTools[0], null, 2));
    console.log('Hugging Face Tool Sample:', JSON.stringify(huggingfaceTools[0], null, 2));
    console.log('arXiv Tool Sample:', JSON.stringify(arxivTools[0], null, 2));

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the tests
testScrapers(); 