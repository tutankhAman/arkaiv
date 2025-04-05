const { chromium } = require('playwright');
const AITool = require('../models/AITool');

/**
 * Scrapes GitHub for AI-related repositories
 * @returns {Promise<Array>} Array of scraped repositories
 */
async function scrapeGitHub() {
  const browser = await chromium.launch({ 
    headless: true,
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  const page = await context.newPage();
  const results = new Map(); // Use Map to track unique repositories

  try {
    console.log('Navigating to GitHub search page...');
    await page.goto('https://github.com/search?q=artificial+intelligence+machine+learning+deep+learning&type=repositories&s=stars&o=desc&per_page=50', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('Waiting for results to load...');
    await page.waitForSelector('.Box-sc-g0xbh4-0', { timeout: 60000 });

    // Get repository items using page.evaluate for better performance
    const repos = await page.evaluate(() => {
      const items = document.querySelectorAll('.Box-sc-g0xbh4-0');
      const results = [];

      items.forEach(item => {
        const linkElement = item.querySelector('h3 a');
        if (!linkElement) return;

        const name = linkElement.textContent.trim();
        const url = linkElement.getAttribute('href');
        const starsElement = item.querySelector('a[href$="/stargazers"]');
        const stars = starsElement ? 
          parseInt(starsElement.textContent.trim().replace(/,/g, '')) || 0 : 0;
        const descriptionElement = item.querySelector('p[class*="mb-1"]');
        const description = descriptionElement ? 
          descriptionElement.textContent.trim() : '';

        if (name && url) {
          results.push({ name, url, stars, description });
        }
      });

      return results;
    });

    console.log(`Found ${repos.length} repositories`);

    // Process unique repositories
    for (const repo of repos) {
      const key = repo.url; // Use URL as unique key
      if (!results.has(key)) {
        console.log(`Adding repository: ${repo.name} with ${repo.stars} stars`);
        results.set(key, {
          name: repo.name.trim(),
          source: 'GitHub',
          metrics: {
            stars: repo.stars
          },
          url: `https://github.com${repo.url}`,
          description: repo.description,
          timeline: [{
            date: new Date(),
            value: repo.stars
          }]
        });
      }
    }

    const uniqueResults = Array.from(results.values());
    console.log(`Successfully processed ${uniqueResults.length} unique repositories`);

    // Save to database
    for (const result of uniqueResults) {
      await AITool.findOneAndUpdate(
        { url: result.url },
        result,
        { upsert: true, new: true }
      );
    }

    return uniqueResults;
  } catch (error) {
    console.error('Error scraping GitHub:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeGitHub; 