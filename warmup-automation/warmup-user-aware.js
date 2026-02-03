import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';
import UserManager from './lib/user-manager.js';

// Store running browsers for stop capability
const runningBrowsers = new Map();

// Helper: Random delay within range
function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay * 1000;
}

// Helper: Random integer
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Generate random viewport offset
function randomOffset() {
  return {
    x: Math.floor(Math.random() * 200) + 100,
    y: Math.floor(Math.random() * 200) + 100
  };
}

// Human-like random scrolling
async function humanScroll(page, config) {
  const scrollCount = randomInt(config.scroll.count.min, config.scroll.count.max);
  
  for (let i = 0; i < scrollCount; i++) {
    const scrollAmount = randomInt(config.scroll.amount.min, config.scroll.amount.max);
    await page.evaluate((amount) => {
      window.scrollBy({
        top: amount,
        left: 0,
        behavior: 'smooth'
      });
    }, scrollAmount);
    
    await setTimeout(randomDelay(
      config.timeOnPage.scrollPause.min * 1000,
      config.timeOnPage.scrollPause.max * 1000
    ));
  }
}

// Random mouse movements
async function humanMouseMovements(page, config) {
  const moveCount = randomInt(config.mouse.moveCount.min, config.mouse.moveCount.max);
  
  for (let i = 0; i < moveCount; i++) {
    const offset = randomOffset();
    await page.mouse.move(offset.x, offset, {
      steps: randomInt(5, 15)
    });
    await setTimeout(randomDelay(100, 500));
  }
}

// Human-like delay
async function humanDelay(page, config, minMs, maxMs, action) {
  const delay = randomDelay(minMs, maxMs);
  const seconds = Math.round(delay / 1000);
  console.log(`⏱️  ${action || 'Waiting'} ${seconds}s...`);
  
  await setTimeout(delay / 2);
  await humanMouseMovements(page, config);
  await setTimeout(delay / 2);
}

// Get trending keywords
async function getTrendingKeywords(page, config) {
  console.log('📊 Fetching top 10 trending keywords...');

  try {
    await page.goto('https://trends.google.com/trends/?geo=US', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await setTimeout(5000);
    await humanScroll(page, config);
    await humanMouseMovements(page, config);
    await humanDelay(
      page,
      config,
      config.timeOnPage.trends.min * 1000,
      config.timeOnPage.trends.max * 1000,
      'Analyzing trends page'
    );

    const trends = await page.evaluate(() => {
      let items = document.querySelectorAll('feed-item');
      
      if (items.length === 0) {
        items = document.querySelectorAll('[data-module="TrendingSearches"] div');
      }
      
      if (items.length === 0) {
        items = document.querySelectorAll('ul li');
      }
      
      if (items.length === 0) {
        items = document.querySelectorAll('[class*="ranking"], [class*="trend"]');
      }

      const results = [];
      
      for (let i = 0; i < Math.min(items.length, 15); i++) {
        const item = items[i];
        const text = item.textContent?.trim();
        
        if (text && 
            text.length > 2 && 
            text.length < 100 &&
            !text.includes('Sign in') &&
            !text.includes('Explore') &&
            !text.includes('Search') &&
            !/^\d+$/.test(text) &&
            !text.includes('Year in Search') &&
            !text.includes('Subscribe')) {
          
          let cleaned = text
            .replace(/^\d+\.\s*/, '')
            .replace(/\s*Search\s*$/, '')
            .replace(/\s*related searches.*$/i, '')
            .trim();
          
          if (cleaned && cleaned.length > 2 && !results.includes(cleaned)) {
            results.push(cleaned);
          }
        }
      }
      
      return results.slice(0, 10);
    });

    if (trends.length > 0) {
      console.log(`✅ Found ${trends.length} trending keywords:`);
      trends.forEach((trend, i) => {
        console.log(`   ${i + 1}. ${trend}`);
      });
    } else {
      console.log('⚠️  No trends extracted, using fallback keywords');
      return ['Election', 'Technology', 'Climate Change', 'Economy', 'Sports'];
    }

    return trends;

  } catch (error) {
    console.error('❌ Error fetching trends:', error.message);
    return ['Election', 'Technology', 'Climate Change', 'Economy', 'Sports'];
  }
}

// Search news and visit
async function searchNewsAndVisit(page, keyword, config) {
  console.log(`\n🔍 Searching for: "${keyword}"`);

  try {
    await page.goto('https://news.google.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await humanMouseMovements(page, config);
    await humanScroll(page, config);

    await page.waitForFunction(() => {
      const selectors = [
        'input[placeholder*="Search"]',
        'input[type="text"]',
        '[data-testid="search-input"]',
        'input[aria-label*="search" i]'
      ];
      return selectors.some(sel => document.querySelector(sel));
    }, { timeout: 10000 });

    console.log('⌨️  Typing search query...');
    const inputSelector = await page.evaluate(() => {
      const selectors = [
        'input[placeholder*="Search"]',
        'input[type="text"]',
        '[data-testid="search-input"]'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && !el.value) return sel;
      }
      return 'input[placeholder*="Search"]';
    });

    for (let i = 0; i < keyword.length; i++) {
      await page.type(inputSelector, keyword[i], {
        delay: Math.random() * (config.typing.delay.max - config.typing.delay.min) + config.typing.delay.min
      });
    }

    await setTimeout(randomDelay(500, 1500));
    await page.keyboard.press('Enter');
    await setTimeout(5000);

    await humanScroll(page, config);
    await humanMouseMovements(page, config);
    await humanDelay(
      page,
      config,
      config.timeOnPage.newsSearch.min * 1000,
      config.timeOnPage.newsSearch.max * 1000,
      'Reviewing search results'
    );

    console.log('📰 Clicking first article...');
    const firstArticle = await page.evaluate(() => {
      const selectors = [
        'article',
        '[data-testid="news-article"]',
        'div[class*="article"]',
        'a[href*="/articles"]'
      ];
      
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const link = sel === 'a[href*="/articles"]' ? el : el.querySelector('a');
          return link ? link.href : null;
        }
      }
      return null;
    });

    if (firstArticle) {
      console.log(`🔗 Opening: ${firstArticle.substring(0, 80)}...`);
      
      await page.goto(firstArticle, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });

      await humanScroll(page, config);
      await humanMouseMovements(page, config);
      
      const articleDelay = randomDelay(
        config.timeOnPage.article.min * 1000,
        config.timeOnPage.article.max * 1000
      );
      const seconds = Math.round(articleDelay / 1000);
      console.log(`📖 Reading article for ${seconds}s...`);
      
      const readingChunks = 4;
      for (let i = 0; i < readingChunks; i++) {
        await setTimeout(articleDelay / readingChunks);
        if (i < readingChunks - 1) {
          await humanScroll(page, config);
        }
      }

      return { success: true, url: firstArticle };
    }

    return { success: false };

  } catch (error) {
    console.error('❌ Error during news search:', error.message);
    return { success: false };
  }
}

// Main warmup routine for a user
async function runWarmup(userId) {
  let browser = null;
  let logData = {
    userId,
    startTime: new Date().toISOString(),
    status: 'running'
  };

  try {
    // Get user configuration
    const user = await UserManager.getUser(userId);
    
    if (!user.enabled) {
      console.log(`⚠️  User ${user.name} is disabled. Skipping.`);
      return;
    }

    if (user.status === 'running') {
      console.log(`⚠️  User ${user.name} is already running. Skipping.`);
      return;
    }

    console.log(`\n🚀 Starting warmup for user: ${user.name}`);
    console.log(`📋 Configuration:`, JSON.stringify(user.config, null, 2));

    // Update status
    await UserManager.updateUserStatus(userId, 'running');
    logData.userName = user.name;
    logData.config = user.config;

    const browser = await puppeteer.launch({
      headless: user.config.browser.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    // Store browser for stop capability
    runningBrowsers.set(userId, browser);

    const page = await browser.newPage();
    await page.setViewport(user.config.browser.viewport);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

    // Anti-detection
    if (user.config.antiDetection.hideWebdriver) {
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      });
    }

    if (user.config.antiDetection.fakePlugins) {
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      });
    }

    if (user.config.antiDetection.fakeLanguages) {
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      });
    }

    // Get trends
    const trends = await getTrendingKeywords(page, user.config);
    logData.trendsFound = trends.length;

    if (trends.length === 0) {
      console.log('⚠️  No trends found. Exiting.');
      await UserManager.updateUserStatus(userId, 'idle');
      return;
    }

    // Process trends
    const numToProcess = Math.min(user.config.automation.numTrendsToProcess, trends.length);
    logData.trendsProcessed = 0;

    for (let i = 0; i < numToProcess; i++) {
      if (runningBrowsers.get(userId) === 'stopped') {
        console.log('⏸️  Warmup stopped by user');
        logData.stopped = true;
        break;
      }

      const trend = trends[i];
      console.log(`\n📌 Processing trend ${i + 1}/${numToProcess}: ${trend}`);

      const result = await searchNewsAndVisit(page, trend, user.config);

      if (result.success) {
        console.log(`✅ Completed warm-up for: ${trend}`);
        logData.trendsProcessed++;
      } else {
        console.log(`❌ Failed to process: ${trend}`);
      }

      if (i < numToProcess - 1) {
        await page.goto('https://news.google.com', { waitUntil: 'networkidle2' });
        await setTimeout(2000);
      }
    }

    logData.status = 'success';
    console.log('\n✅ Warm-up completed successfully!');
    console.log(`📊 Summary: ${logData.trendsProcessed}/${numToProcess} trends processed`);

  } catch (error) {
    console.error('\n❌ Fatal error during warmup:', error.message);
    logData.status = 'error';
    logData.error = error.message;
  } finally {
    if (browser) {
      await browser.close();
      runningBrowsers.delete(userId);
    }
    
    logData.endTime = new Date().toISOString();
    await UserManager.updateUserStatus(userId, 'idle');
    await UserManager.updateLastRun(userId, logData.status === 'success', logData.error);
    await UserManager.logExecution(userId, logData);
    
    console.log('\n👋 Browser closed.');
  }
}

// Wrapper function to run warmup for a user
export default function runWarmupForUser(userId) {
  runWarmup(userId).catch(console.error);
}

// Export stop function
export function stopWarmup(userId) {
  runningBrowsers.set(userId, 'stopped');
}
