// Scraper for arXiv AI research papers using Playwright
const { chromium } = require('playwright');
const AITool = require('../models/AITool');

/**
 * Scrapes arXiv for AI research papers
 * @returns {Promise<Array>} Array of scraped papers
 */
async function scrapeArXiv() {
  // Initialize browser with custom user agent
  const browser = await chromium.launch({ 
    headless: true,
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  const page = await context.newPage();
  const results = [];

  try {
    // Navigate to arXiv search page for AI papers
    console.log('Navigating to arXiv search page...');
    await page.goto('https://arxiv.org/search/cs?query=artificial+intelligence+machine+learning+deep+learning&searchtype=all&abstracts=show&order=-announced_date_first&size=50', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    console.log('Waiting for results to load...');
    await page.waitForSelector('li.arxiv-result', { timeout: 60000 });
    
    // Extract paper information from search results
    const papers = await page.evaluate(() => {
      const items = document.querySelectorAll('li.arxiv-result');
      const results = [];

      items.forEach(item => {
        const titleElement = item.querySelector('p.title');
        if (!titleElement) return;

        const title = titleElement.textContent.trim();
        const linkElement = item.querySelector('p.list-title a[href*="/abs/"]');
        if (!linkElement) return;

        const url = linkElement ? `https://arxiv.org${linkElement.getAttribute('href').replace('https://arxiv.org', '')}` : '';
        if (!url) return;

        // Parse citation count from text
        const citationsElement = item.querySelector('span.citation-count');
        const citations = citationsElement ? 
          parseInt(citationsElement.textContent.match(/(\d+)\s+citations?/)?.[1] || '0') : 0;

        // Extract paper abstract
        const abstractElement = item.querySelector('p.abstract');
        const description = abstractElement ? 
          abstractElement.textContent.trim().replace('Abstract:', '').trim() : '';

        if (title && url) {
          results.push({ title, url, citations, description });
        }
      });

      return results;
    });

    console.log(`Found ${papers.length} papers`);

    // Process and format paper data
    for (const paper of papers) {
      console.log(`Processing paper: ${paper.title}`);
      console.log(`Adding paper: ${paper.title} with ${paper.citations} citations`);
      
      // Ensure URL is properly formatted
      const cleanUrl = paper.url.startsWith('http') ? paper.url : `https://arxiv.org${paper.url}`;
      results.push({
        name: paper.title.trim(),
        source: 'arXiv',
        metrics: {
          citations: paper.citations
        },
        url: cleanUrl,
        description: paper.description,
        timeline: [{
          date: new Date(),
          value: paper.citations
        }]
      });
    }
    
    console.log(`Successfully processed ${results.length} papers`);
    
    // Save papers to database
    for (const result of results) {
      await AITool.findOneAndUpdate(
        { url: result.url },
        result,
        { upsert: true, new: true }
      );
    }
    
    return results;
  } catch (error) {
    console.error('Error scraping arXiv:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = scrapeArXiv; 