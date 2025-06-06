// Main script to run all scrapers sequentially
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const scrapeGitHub = require('./scrapers/githubScraper');
const scrapeHuggingFace = require('./scrapers/huggingfaceScraper');
const scrapeArXiv = require('./scrapers/arxivScraper');

// Run all scrapers and save results to MongoDB
async function runAllScrapers() {
  try {
    // Connect to MongoDB with optimized settings
    console.log('Connecting to MongoDB...');
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

    // Run GitHub scraper
    console.log('\n=== Running GitHub Scraper ===');
    const githubResults = await scrapeGitHub();
    console.log(`GitHub scraping completed: ${githubResults.length} repositories found`);

    // Run HuggingFace scraper
    console.log('\n=== Running HuggingFace Scraper ===');
    const huggingFaceResults = await scrapeHuggingFace();
    console.log(`HuggingFace scraping completed: ${huggingFaceResults.length} models found`);

    // Run arXiv scraper
    console.log('\n=== Running arXiv Scraper ===');
    const arxivResults = await scrapeArXiv();
    console.log(`arXiv scraping completed: ${arxivResults.length} papers found`);

    // Log final results
    console.log('\n=== All Scrapers Completed Successfully ===');
    console.log(`Total items collected: ${githubResults.length + huggingFaceResults.length + arxivResults.length}`);

  } catch (error) {
    console.error('Error running scrapers:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the scraper runner
runAllScrapers();
