import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

// Configuration
const CONFIG = {
  // Time on page settings (in seconds)
  timeOnPage: {
    trends: {
      min: 5,
      max: 10
    },
    newsSearch: {
      min: 3,
      max: 7
    },
    article: {
      min: 10,
      max: 30
    }
  },
  // Browser settings
  headless: false, // Set to true for headless mode
  viewport: {
    width: 1920,
    height: 1080
  },
  // Number of top trends to process
  numTrendsToProcess: 1, // Set to higher number to process multiple trends
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
};

// Helper: Random delay within range
function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay * 1000; // Convert to milliseconds
}

// Helper: Random human-like delay
async function humanDelay(page, minMs, maxMs) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  console.log(`⏱️  Waiting ${Math.round(delay / 1000)}s...`);
  await setTimeout(delay);
}

// Extract top 10 trending keywords from Google Trends
async function getTrendingKeywords(page) {
  console.log('📊 Fetching top 10 trending keywords...');

  try {
    await page.goto('https://trends.google.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for trends to load
    await page.waitForSelector('feed-item', { timeout: 10000 });

    // Extract trending keywords
    const trends = await page.evaluate(() => {
      const items = document.querySelectorAll('feed-item');
      return Array.from(items)
        .slice(0, 10)
        .map(item => ({
          title: item.querySelector('[title]')?.getAttribute('title') || item.textContent?.trim(),
          index: 0
        }))
        .filter(t => t.title && t.title.length > 0);
    });

    console.log(`✅ Found ${trends.length} trending keywords:`);
    trends.forEach((trend, i) => {
      console.log(`   ${i + 1}. ${trend.title}`);
    });

    return trends;

  } catch (error) {
    console.error('❌ Error fetching trends:', error.message);
    return [];
  }
}

// Search on Google News and click first result
async function searchNewsAndVisit(page, keyword) {
  console.log(`\n🔍 Searching for: "${keyword}"`);

  try {
    // Navigate to Google News
    await page.goto('https://news.google.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for search input
    await page.waitForSelector('input[placeholder="Search for news"]', { timeout: 10000 });

    // Type keyword with human-like typing
    console.log('⌨️  Typing search query...');
    await page.type('input[placeholder="Search for news"]', keyword, {
      delay: Math.random() * 100 + 50 // Human-like typing delay
    });

    // Submit search
    await page.keyboard.press('Enter');

    // Wait for results
    await page.waitForSelector('article', { timeout: 15000 });

    // Random time on search results page
    await humanDelay(
      page,
      CONFIG.timeOnPage.newsSearch.min * 1000,
      CONFIG.timeOnPage.newsSearch.max * 1000
    );

    // Click first article
    console.log('📰 Clicking first article...');
    const firstArticle = await page.$('article');
    if (firstArticle) {
      // Get the article link before clicking
      const articleUrl = await page.evaluate(el => {
        const link = el.querySelector('a');
        return link ? link.href : null;
      }, firstArticle);

      if (articleUrl) {
        console.log(`🔗 Opening: ${articleUrl}`);

        // Click the article
        await firstArticle.click();

        // Wait for navigation
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {
          console.log('⚠️  Navigation timed out or article opened in new tab');
        });

        // Random time on article page
        const articleDelay = randomDelay(
          CONFIG.timeOnPage.article.min,
          CONFIG.timeOnPage.article.max
        );
        console.log(`📖 Reading article for ${Math.round(articleDelay / 1000)}s...`);
        await setTimeout(articleDelay);

        return { success: true, url: articleUrl };
      }
    }

    return { success: false };

  } catch (error) {
    console.error('❌ Error during news search:', error.message);
    return { success: false };
  }
}

// Main warm-up routine
async function runWarmup() {
  console.log('🚀 Starting warm-up routine...\n');

  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();

  // Set viewport and user agent
  await page.setViewport(CONFIG.viewport);
  await page.setUserAgent(CONFIG.userAgent);

  // Hide webdriver flag
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    });
  });

  try {
    // Step 1: Get trending keywords
    await page.goto('https://trends.google.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Random time on trends page
    await humanDelay(
      page,
      CONFIG.timeOnPage.trends.min * 1000,
      CONFIG.timeOnPage.trends.max * 1000
    );

    const trends = await getTrendingKeywords(page);

    if (trends.length === 0) {
      console.log('⚠️  No trends found. Exiting.');
      return;
    }

    // Step 2: Process top keyword(s)
    const numToProcess = Math.min(CONFIG.numTrendsToProcess, trends.length);

    for (let i = 0; i < numToProcess; i++) {
      const trend = trends[i];
      console.log(`\n📌 Processing trend ${i + 1}/${numToProcess}: ${trend.title}`);

      const result = await searchNewsAndVisit(page, trend.title);

      if (result.success) {
        console.log(`✅ Completed warm-up for: ${trend.title}`);
      } else {
        console.log(`❌ Failed to process: ${trend.title}`);
      }

      // Go back to news for next iteration if processing multiple
      if (i < numToProcess - 1) {
        await page.goto('https://news.google.com', { waitUntil: 'networkidle2' });
        await setTimeout(2000);
      }
    }

    console.log('\n✅ Warm-up routine completed successfully!');

  } catch (error) {
    console.error('\n❌ Fatal error during warm-up:', error.message);
  } finally {
    await browser.close();
    console.log('👋 Browser closed.');
  }
}

// Run the script
runWarmup().catch(console.error);
