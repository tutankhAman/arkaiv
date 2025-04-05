const cron = require('node-cron');
const scrapeGitHub = require('./scrapers/githubScraper');
const scrapeHuggingFace = require('./scrapers/huggingfaceScraper');
const scrapeArXiv = require('./scrapers/arxivScraper');

/**
 * Schedules the scraping tasks to run daily at 3 AM IST
 */
function scheduleScrapingTasks() {
  // Schedule GitHub scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running GitHub scraper...');
    try {
      await scrapeGitHub();
      console.log('GitHub scraping completed successfully');
    } catch (error) {
      console.error('GitHub scraping failed:', error);
    }
  });

  // Schedule Hugging Face scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running Hugging Face scraper...');
    try {
      await scrapeHuggingFace();
      console.log('Hugging Face scraping completed successfully');
    } catch (error) {
      console.error('Hugging Face scraping failed:', error);
    }
  });

  // Schedule arXiv scraper
  cron.schedule('0 3 * * *', async () => {
    console.log('Running arXiv scraper...');
    try {
      await scrapeArXiv();
      console.log('arXiv scraping completed successfully');
    } catch (error) {
      console.error('arXiv scraping failed:', error);
    }
  });

  console.log('Scraping tasks scheduled to run daily at 3 AM IST');
}

module.exports = scheduleScrapingTasks; 