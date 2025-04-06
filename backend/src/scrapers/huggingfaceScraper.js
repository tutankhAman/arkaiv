// Scraper for HuggingFace AI models using Playwright
const { chromium } = require('playwright');
const AITool = require('../models/AITool');

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms Milliseconds to sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Random sleep between min and max milliseconds
 * @param {number} min Minimum milliseconds
 * @param {number} max Maximum milliseconds
 */
const randomSleep = async (min, max) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await sleep(ms);
};

/**
 * Scrapes Hugging Face for top 50 most downloaded AI models
 * @returns {Promise<Array>} Array of scraped models with detailed information
 */
async function scrapeHuggingFace() {
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 120000 // Increase browser launch timeout
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    // Add additional context options for better reliability
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    // Add additional headers to mimic a real browser
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    }
  });

  const page = await context.newPage();
  const results = [];
  let retryCount = 0;
  const maxRetries = 3;

  try {
    console.log('Starting HuggingFace scraping process...');
    
    // Navigate to HuggingFace models page sorted by downloads
    console.log('Navigating to Hugging Face models page...');
    await page.goto('https://huggingface.co/models?sort=downloads', {
      waitUntil: 'load',
      timeout: 120000
    });

    console.log('Waiting for results to load...');
    // Wait for any model card to appear
    await page.waitForSelector('article.overview-card-wrapper', { 
      timeout: 120000,
      state: 'attached'
    });
    
    // Add a small delay to ensure content is loaded
    await randomSleep(2000, 5000);

    // Keep scrolling until we have enough models or can't find more
    let previousModelCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (scrollAttempts < maxScrollAttempts) {
      // Extract model information from cards
      const models = await page.$$('article.overview-card-wrapper');
      console.log(`Found ${models.length} models so far...`);

      if (models.length >= 50 || models.length === previousModelCount) {
        break;
      }

      previousModelCount = models.length;

      // Scroll to the bottom of the page
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for new content to load
      await randomSleep(2000, 4000);
      scrollAttempts++;
    }

    // Get all model cards after scrolling
    const allModels = await page.$$('article.overview-card-wrapper');
    console.log(`Found total of ${allModels.length} models`);

    for (const model of allModels) {
      try {
        // Add a small delay between processing each model
        await randomSleep(500, 1500);

        // Get model name and URL
        const linkElement = await model.$('a[href^="/"]');
        if (!linkElement) {
          console.log('No link element found for model');
          continue;
        }

        const url = await linkElement.getAttribute('href');
        const name = await model.$eval('h4', el => el.textContent.trim());
        
        // Get model description
        const descriptionElement = await model.$('p[class*="text-gray"]');
        const description = descriptionElement ? 
          (await descriptionElement.textContent()).trim() : '';

        // Parse downloads count with unit conversion
        const statsElement = await model.$('div[class*="text-gray"]');
        let downloads = 0;
        let monthlyDownloads = 0;
        
        if (statsElement) {
          const statsText = await statsElement.textContent();
          const downloadsMatch = statsText.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/);
          
          if (downloadsMatch) {
            const [, num, unit] = downloadsMatch;
            const baseNum = parseFloat(num.replace(/,/g, ''));

            switch (unit) {
              case 'K':
                downloads = Math.round(baseNum * 1000);
                break;
              case 'M':
                downloads = Math.round(baseNum * 1000000);
                break;
              case 'B':
                downloads = Math.round(baseNum * 1000000000);
                break;
              default:
                downloads = Math.round(baseNum);
            }
          }

          // Estimate monthly downloads (assuming 30% of total downloads are monthly)
          monthlyDownloads = Math.round(downloads * 0.3);
        }

        if (name && url) {
          console.log(`Processing model: ${name}`);
          console.log(`Adding model: ${name} with ${downloads} total downloads and ${monthlyDownloads} monthly downloads`);
          
          results.push({
            name: name.trim(),
            source: 'HuggingFace',
            metrics: {
              downloads,
              monthlyDownloads
            },
            url: `https://huggingface.co${url}`,
            description,
            timeline: [{
              date: new Date(),
              value: downloads
            }]
          });

          // Limit to top 50 models
          if (results.length >= 50) {
            break;
          }
        }
      } catch (error) {
        console.error('Error processing model:', error);
        continue;
      }
    }

    // Sort results by downloads in descending order
    results.sort((a, b) => b.metrics.downloads - a.metrics.downloads);

    console.log(`Successfully processed ${results.length} models`);

    // Save models to database
    for (const result of results) {
      await AITool.findOneAndUpdate(
        { url: result.url },
        result,
        { upsert: true, new: true }
      );
      // Add a small delay between saves to avoid rate limiting
      await randomSleep(500, 1500);
    }

    return results;
  } catch (error) {
    console.error('Error scraping Hugging Face:', error);
    
    // Handle rate limiting with retries
    if (error.message.includes('rate limit') && retryCount < maxRetries) {
      retryCount++;
      console.log(`Rate limit hit. Retry attempt ${retryCount} of ${maxRetries} after 5 minutes...`);
      await sleep(300000); // Wait 5 minutes
      return scrapeHuggingFace(); // Retry
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeHuggingFace; 