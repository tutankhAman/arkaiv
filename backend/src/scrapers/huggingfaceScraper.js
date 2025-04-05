const { chromium } = require('playwright');
const AITool = require('../models/AITool');

/**
 * Scrapes Hugging Face for AI models
 * @returns {Promise<Array>} Array of scraped models
 */
async function scrapeHuggingFace() {
  const browser = await chromium.launch({ 
    headless: true,
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  const page = await context.newPage();
  const results = [];

  try {
    console.log('Navigating to Hugging Face models page...');
    await page.goto('https://huggingface.co/models?pipeline_tag=text-classification&sort=downloads', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('Waiting for results to load...');
    await page.waitForSelector('article.overview-card-wrapper', { timeout: 60000 });

    // Get model cards
    const models = await page.$$('article.overview-card-wrapper');
    console.log(`Found ${models.length} models`);

    for (const model of models) {
      try {
        // Get model name and URL
        const linkElement = await model.$('a[href^="/"]');
        if (!linkElement) {
          console.log('No link element found for model');
          continue;
        }

        const url = await linkElement.getAttribute('href');
        const name = await model.$eval('h4', el => el.textContent.trim());
        
        // Get downloads count - using a more generic selector
        const statsElement = await model.$('div[class*="text-gray"]');
        let downloads = 0;
        
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
        }

        // Get description
        const descriptionElement = await model.$('p[class*="text-gray"]');
        const description = descriptionElement ? 
          (await descriptionElement.textContent()).trim() : '';

        if (name && url) {
          console.log(`Processing model: ${name}`);
          console.log(`Adding model: ${name} with ${downloads} downloads`);
          results.push({
            name: name.trim(),
            source: 'HuggingFace',
            metrics: {
              downloads
            },
            url: `https://huggingface.co${url}`,
            description,
            timeline: [{
              date: new Date(),
              value: downloads
            }]
          });

          // Stop after getting 50 models
          if (results.length >= 50) {
            break;
          }
        }
      } catch (error) {
        console.error('Error processing model:', error);
        continue;
      }
    }

    console.log(`Successfully processed ${results.length} models`);

    // Save to database
    for (const result of results) {
      await AITool.findOneAndUpdate(
        { url: result.url },
        result,
        { upsert: true, new: true }
      );
    }

    return results;
  } catch (error) {
    console.error('Error scraping Hugging Face:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeHuggingFace; 