// Scraper for GitHub AI repositories using Playwright
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
 * Scrapes GitHub for top 50 most starred AI repositories
 * @returns {Promise<Array>} Array of scraped repositories with detailed information
 */
async function scrapeGitHub() {
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 60000 // Increase browser launch timeout
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    // Add additional context options for better reliability
    ignoreHTTPSErrors: true,
    bypassCSP: true
  });

  const page = await context.newPage();
  const results = [];
  let retryCount = 0;
  const maxRetries = 3;

  try {
    console.log('Starting GitHub scraping process...');
    
    // Navigate to GitHub AI search results sorted by stars
    console.log('Navigating to GitHub search results...');
    await page.goto('https://github.com/search?q=artificial+intelligence+stars%3A>1000&type=repositories&s=stars&o=desc', {
      waitUntil: 'domcontentloaded', // Changed from networkidle to domcontentloaded
      timeout: 60000 // Increased timeout
    });

    console.log('Waiting for results to load...');
    // Wait for any repository element to appear
    await page.waitForSelector('div[data-testid="results-list"]', { 
      timeout: 60000,
      state: 'attached' // Changed from visible to attached
    });
    
    // Add a small delay to ensure content is loaded
    await randomSleep(2000, 5000);
    
    // Check for rate limit message
    const rateLimitSelector = 'p:has-text("rate limit")';
    const hasRateLimit = await page.isVisible(rateLimitSelector);
    
    if (hasRateLimit) {
      console.log('Rate limit detected. Waiting for 5 minutes before retrying...');
      await sleep(300000); // 5 minutes
      throw new Error('Rate limit hit - please retry after waiting');
    }

    // Get all repository containers using updated selectors
    const repos = await page.$$('div[data-testid="results-list"] > div');
    console.log(`Found ${repos.length} repository elements`);

    for (const repo of repos) {
      try {
        // Add a small delay between processing each repository
        await randomSleep(500, 1500);

        // Get repository name and URL using updated selectors
        const nameElement = await repo.$('a[data-testid="results-list-item-name"]');
        if (!nameElement) {
          console.log('No repository link found');
          continue;
        }

        const url = await nameElement.getAttribute('href');
        const name = await nameElement.textContent();
        
        // Get stars count using updated selector
        const starsElement = await repo.$('a[href$="/stargazers"]');
        let stars = 0;
        
        if (starsElement) {
          const starsText = await starsElement.textContent();
          const starsMatch = starsText.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/);
          
          if (starsMatch) {
            const [, num, unit] = starsMatch;
            const baseNum = parseFloat(num.replace(/,/g, ''));

            switch (unit) {
              case 'K':
                stars = Math.round(baseNum * 1000);
                break;
              case 'M':
                stars = Math.round(baseNum * 1000000);
                break;
              case 'B':
                stars = Math.round(baseNum * 1000000000);
                break;
              default:
                stars = Math.round(baseNum);
            }
          }
        }

        // Get forks count using updated selector
        const forksElement = await repo.$('a[href$="/network/members"]');
        let forks = 0;
        
        if (forksElement) {
          const forksText = await forksElement.textContent();
          const forksMatch = forksText.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([KMB]?)/);
          
          if (forksMatch) {
            const [, num, unit] = forksMatch;
            const baseNum = parseFloat(num.replace(/,/g, ''));

            switch (unit) {
              case 'K':
                forks = Math.round(baseNum * 1000);
                break;
              case 'M':
                forks = Math.round(baseNum * 1000000);
                break;
              case 'B':
                forks = Math.round(baseNum * 1000000000);
                break;
              default:
                forks = Math.round(baseNum);
            }
          }
        }

        // Get description using updated selector
        const descriptionElement = await repo.$('p[data-testid="results-list-item-description"]');
        const description = descriptionElement ? 
          (await descriptionElement.textContent()).trim() : '';

        if (name && url) {
          console.log(`Processing repository: ${name}`);
          console.log(`Adding repository: ${name} with ${stars} stars and ${forks} forks`);
          
          results.push({
            name: name.trim(),
            source: 'GitHub',
            metrics: {
              stars,
              forks
            },
            url: `https://github.com${url}`,
            description,
            timeline: [{
              date: new Date(),
              value: stars
            }]
          });

          // Limit to top 50 repositories
          if (results.length >= 50) {
            break;
          }
        }
      } catch (error) {
        console.error('Error processing repository:', error);
        continue;
      }
    }

    // Sort results by stars in descending order
    results.sort((a, b) => b.metrics.stars - a.metrics.stars);

    console.log(`Successfully processed ${results.length} repositories`);

    // Save repositories to database
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
    console.error('Error scraping GitHub:', error);
    
    // Handle rate limiting with retries
    if (error.message.includes('rate limit') && retryCount < maxRetries) {
      retryCount++;
      console.log(`Rate limit hit. Retry attempt ${retryCount} of ${maxRetries} after 5 minutes...`);
      await sleep(300000); // Wait 5 minutes
      return scrapeGitHub(); // Retry
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeGitHub;