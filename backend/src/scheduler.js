const cron = require('node-cron');
const scrapeGitHub = require('./scrapers/githubScraper');
const scrapeHuggingFace = require('./scrapers/huggingfaceScraper');
const scrapeArXiv = require('./scrapers/arxivScraper');
const generateDailyDigest = require('./digests/digestService');
const fs = require('fs');
const path = require('path');

/**
 * Schedules the scraping tasks to run daily at 3 AM IST
 */
function scheduleScrapingTasks() {
  // Schedule GitHub scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running GitHub scraper...');
    try {
      const results = await scrapeGitHub();
      console.log(`GitHub scraping completed successfully: ${results.length} repositories found`);
    } catch (error) {
      console.error('GitHub scraping failed:', error);
    }
  });

  // Schedule Hugging Face scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running Hugging Face scraper...');
    try {
      const results = await scrapeHuggingFace();
      console.log(`Hugging Face scraping completed successfully: ${results.length} models found`);
    } catch (error) {
      console.error('Hugging Face scraping failed:', error);
    }
  });

  // Schedule arXiv scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running arXiv scraper...');
    try {
      const results = await scrapeArXiv();
      console.log(`arXiv scraping completed successfully: ${results.length} papers found`);
    } catch (error) {
      console.error('arXiv scraping failed:', error);
    }
  });

  // Schedule daily digest generation at 4 AM IST (after all scrapers have run)
  cron.schedule('0 4 * * *', async () => {
    console.log('Generating daily digest...');
    try {
      const digest = await generateDailyDigest();
      
      // Save the formatted document to a file
      const digestsDir = path.join(__dirname, '..', 'digests');
      if (!fs.existsSync(digestsDir)) {
        fs.mkdirSync(digestsDir);
      }
      
      const filename = `digest_${digest.date.toISOString().split('T')[0]}.md`;
      const filepath = path.join(digestsDir, filename);
      fs.writeFileSync(filepath, digest.formattedDocument);
      
      console.log('Daily digest generated successfully:', digest.date);
      console.log(`Digest saved to: ${filepath}`);
    } catch (error) {
      console.error('Daily digest generation failed:', error);
    }
  });

  console.log('Scraping tasks scheduled to run daily at 3 AM IST');
  console.log('Daily digest generation scheduled at 4 AM IST');
}

// Function to run digest generation immediately (for testing)
const runDigestGenerationNow = async () => {
  try {
    console.log('Running digest generation now...');
    const digest = await generateDailyDigest();
    
    // Save the formatted document to a file
    const digestsDir = path.join(__dirname, '..', 'digests');
    if (!fs.existsSync(digestsDir)) {
      fs.mkdirSync(digestsDir);
    }
    
    const filename = `digest_${digest.date.toISOString().split('T')[0]}.md`;
    const filepath = path.join(digestsDir, filename);
    fs.writeFileSync(filepath, digest.formattedDocument);
    
    console.log(`Daily digest generated and saved to: ${filepath}`);
    return digest;
  } catch (error) {
    console.error('Error generating daily digest:', error);
    throw error;
  }
};

module.exports = {
  scheduleScrapingTasks,
  runDigestGenerationNow
}; 