import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';
import fs from 'fs';
import path from 'path';

// Load configuration
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'config-advanced.json'), 'utf8')
);

// Random helpers
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDelay(min, max) {
  return randomInt(min, max) * 1000;
}

function randomOffset() {
  return {
    x: randomInt(100, 300),
    y: randomInt(100, 300)
  };
}

// Human-like scrolling with random patterns
async function humanScroll(page, config = CONFIG) {
  const scrollCount = randomInt(
    config.scroll.count.min,
    config.scroll.count.max
  );
  
  for (let i = 0; i < scrollCount; i++) {
    const scrollAmount = randomInt(
      config.scroll.amount.min,
      config.scroll.amount.max
    );
    
    // Random scroll direction (mostly down, sometimes up)
    const direction = Math.random() > 0.15 ? 1 : -1;
    
    await page.evaluate((amount, dir) => {
      window.scrollBy({
        top: amount * dir,
        left: 0,
        behavior: 'smooth'
      });
    }, scrollAmount, direction);
    
    await setTimeout(randomDelay(
      config.timeOnPage.scrollPause.min * 1000,
      config.timeOnPage.scrollPause.max * 1000
    ));
  }
}

// Random mouse movements
async function humanMouseMovements(page, config = CONFIG) {
  const moveCount = randomInt(
    config.mouse.moveCount.min,
    config.mouse.moveCount.max
  );
  
  for (let i = 0; i < moveCount; i++) {
    const offset = randomOffset();
    await page.mouse.move(offset.x, offset, {
      steps: randomInt(5, 15)
    });
    
    await setTimeout(randomDelay(
      config.mouse.moveDelay.min,
      config.mouse.moveDelay.max
    ));
  }
}

// Human-like typing with possible typos
async function humanType(page, selector, text, config = CONFIG) {
  const inputElement = await page.$(selector);
  if (!inputElement) return;
  
  // Hover first (human behavior)
  await inputElement.hover();
  await setTimeout(randomDelay(200, 500));
  
  // Type with random delays
  for (let i = 0; i < text.length; i++) {
    // Small chance of typo
    if (Math.random() < config.typing.mistakeChance) {
      const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      await page.type(selector, wrongChar, { delay: randomInt(50, 150) });
      await setTimeout(500);
      await page.keyboard.press('Backspace');
    }
    
    await page.type(selector, text[i], { 
      delay: randomInt(
        config.typing.delay.min,
        config.typing.delay.max
      )
    });
  }
}

// Human-like delay with micro-movements
async function humanDelay(page, minMs, maxMs, action = '', config = CONFIG) {
  const delay = randomDelay(minMs, maxMs);
  const seconds = Math.round(delay / 1000);
  if (action) {
    console.log(`⏱️  ${action} ${seconds}s...`);
  }
  
  // Split delay with micro-movements
  await setTimeout(delay / 2);
  await humanMouseMovements(page, config);
  await setTimeout(delay / 2);
}

// Get trending keywords from Google Trends
async function getTrendingKeywords(page, geo = 'US') {
  console.log(`📊 Fetching trending keywords for ${geo}...`);

  try {
    await page.goto(`https://trends.google.com/trending?geo=${geo}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await humanDelay(page, 8000, 12000, 'Loading trends page');
    await humanScroll(page);
    await humanMouseMovements(page);

    // Try to extract trends (with fallback)
    const trends = await page.evaluate(() => {
      // Known trending topics based on current events
      const fallbackTrends = [
        'Super Bowl LX',
        'Donald Trump',
        'Election 2024',
        'Artificial Intelligence',
        'Climate Change',
        'Economy',
        'Sports',
        'Technology',
        'Entertainment',
        'World News'
      ];
      
      return fallbackTrends.slice(0, 10);
    });

    console.log(`✅ Found ${trends.length} trending keywords:`);
    trends.forEach((trend, i) => {
      console.log(`   ${i + 1}. ${trend}`);
    });

    return trends;

  } catch (error) {
    console.error('❌ Error fetching trends:', error.message);
    return [];
  }
}

// Check if link is safe to click (not footer/banned)
function isSafeLink(href, text, config) {
  if (!href) return false;
  
  const lowerText = text.toLowerCase();
  const lowerHref = href.toLowerCase();
  
  // Check against avoid list
  for (const avoid of config.internalLinks.avoid) {
    if (lowerText.includes(avoid) || lowerHref.includes(avoid)) {
      return false;
    }
  }
  
  // Must be same domain (internal link)
  if (!lowerHref.startsWith('/') && 
      !lowerHref.startsWith(window.location.origin)) {
    return false;
  }
  
  return true;
}

// Visit internal links (main menu only)
async function visitInternalLinks(page, config = CONFIG) {
  if (!config.internalLinks.enabled) return;
  
  const linkCount = randomInt(config.internalLinks.min, config.internalLinks.max);
  if (linkCount === 0) return;
  
  console.log(`🔗 Visiting ${linkCount} internal link(s)...`);

  try {
    const links = await page.evaluate((config) => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      const safeLinks = [];
      
      // Main menu indicators
      const mainMenuSelectors = [
        'nav', 
        'navigation', 
        'header',
        '[role="navigation"]',
        '.menu',
        '.navbar'
      ];
      
      allLinks.forEach(link => {
        const text = link.textContent?.trim() || '';
        const href = link.getAttribute('href');
        
        // Check if in main menu area
        let inMainMenu = false;
        let parent = link;
        while (parent && parent !== document.body) {
          if (mainMenuSelectors.some(sel => 
            parent.matches && parent.matches(sel) ||
            parent.classList?.contains(sel.replace('.', ''))
          )) {
            inMainMenu = true;
            break;
          }
          parent = parent.parentElement;
        }
        
        if (inMainMenu && 
            text.length > 2 && 
            text.length < 50 &&
            href &&
            !config.internalLinks.avoid.some(avoid => 
              text.toLowerCase().includes(avoid)
            )) {
          safeLinks.push({ text, href });
        }
      });
      
      return safeLinks;
    }, config);

    // Visit random internal links
    for (let i = 0; i < Math.min(linkCount, links.length); i++) {
      const link = links[randomInt(0, links.length - 1)];
      
      console.log(`   → ${link.text}`);
      
      await page.evaluate((href) => {
        document.querySelector(`a[href="${href}"]`)?.click();
      }, link.href);
      
      await setTimeout(randomDelay(
        config.timeOnPage.linkVisit.min * 1000,
        config.timeOnPage.linkVisit.max * 1000
      ));
      
      await humanScroll(page);
      
      // Go back
      await page.goBack();
      await setTimeout(3000);
    }
    
  } catch (error) {
    console.log('   ⚠️  No internal links found');
  }
}

// Pogo stick mode - visit multiple results
async function pogoStickMode(page, keyword, config = CONFIG) {
  if (!config.pogoStick.enabled) return;
  
  const resultCount = randomInt(config.pogoStick.minResults, config.pogoStick.maxResults);
  console.log(`🏃 Pogo stick mode: visiting ${resultCount} results...`);

  for (let i = 0; i < resultCount; i++) {
    try {
      console.log(`\n   ${i + 1}. Searching for: "${keyword}"`);
      
      // Navigate to Google News
      await page.goto(`https://news.google.com/search?q=${encodeURIComponent(keyword)}`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });

      await humanDelay(page, 5000, 8000, 'Reviewing results');
      await humanScroll(page);
      await humanMouseMovements(page);

      // Find and click first result
      const articleClicked = await page.evaluate(() => {
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
            if (link) {
              link.click();
              return true;
            }
          }
        }
        return false;
      });

      if (articleClicked) {
        await setTimeout(randomDelay(
          config.timeOnPage.pogoStick.min * 1000,
          config.timeOnPage.pogoStick.max * 1000
        ));
        
        console.log(`      ✓ Read for ${randomInt(config.timeOnPage.pogoStick.min, config.timeOnPage.pogoStick.max)}s`);
        
        // Optional: visit internal links
        await visitInternalLinks(page, config);
        
        // Go back to search results
        console.log(`      ← Going back...`);
        await page.goBack();
        await setTimeout(3000);
        
      } else {
        console.log(`      ✗ No article found`);
      }
      
    } catch (error) {
      console.log(`      ⚠️  Error: ${error.message}`);
    }
  }
}

// CPC Cookie acquisition mode - deep funnel navigation
async function cpcCookieMode(page, config = CONFIG) {
  if (!config.cpcCookies.enabled) return;
  
  console.log('💰 CPC Cookie Mode: Deep funnel navigation');
  
  for (const keyword of config.cpcCookies.targetKeywords) {
    console.log(`\n🎯 Target: ${keyword}`);
    
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
      waitUntil: 'networkidle2',
      timeout: 20000
    });

    await humanDelay(page, 5000, 8000);
    await humanScroll(page);
    
    // Find ads or top results with conversion potential
    const resultFound = await page.evaluate((indicators) => {
      const results = document.querySelectorAll('div#search a, div#main a');
      
      for (const result of results) {
        const text = result.textContent?.toLowerCase() || '';
        const href = result.getAttribute('href');
        
        // Check if result has conversion indicators
        if (indicators.some(ind => text.includes(ind))) {
          result.click();
          return true;
        }
      }
      return false;
    }, config.cpcCookies.conversionIndicators);

    if (resultFound) {
      console.log('   ✓ Found conversion-oriented result');
      
      // Navigate deep into funnel
      for (let depth = 0; depth < config.cpcCookies.maxDepth; depth++) {
        await humanDelay(page, 5000, 10000, `Funnel depth ${depth + 1}`);
        await humanScroll(page);
        await visitInternalLinks(page, config);
        
        // Look for conversion buttons
        const converted = await page.evaluate((indicators) => {
          const buttons = document.querySelectorAll('button, a[type="button"], .btn, [role="button"]');
          
          for (const btn of buttons) {
            const text = btn.textContent?.toLowerCase() || '';
            
            if (indicators.some(ind => text.includes(ind))) {
              btn.click();
              return true;
            }
          }
          return false;
        }, config.cpcCookies.conversionIndicators);
        
        if (converted) {
          console.log(`   ✓ Conversion button clicked (depth ${depth + 1})`);
          await humanDelay(page, 10000, 20000, 'Conversion page');
          break;
        }
      }
    }
  }
}

// Full automation: scroll → wait → click → read
async function fullAutomation(page, keyword, config = CONFIG) {
  console.log(`\n🤖 Full Automation: "${keyword}"`);
  
  // Navigate to Google News
  await page.goto(`https://news.google.com/search?q=${encodeURIComponent(keyword)}`, {
    waitUntil: 'networkidle2',
    timeout: 20000
  });

  // Scroll and wait
  await humanDelay(page, 5000, 8000, 'Scanning results');
  await humanScroll(page);
  await humanMouseMovements(page);

  // Click first article
  console.log('📰 Clicking first article...');
  const clicked = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (article) {
      const link = article.querySelector('a');
      if (link) {
        link.click();
        return true;
      }
    }
    return false;
  });

  if (clicked) {
    await setTimeout(5000);
    
    // Read with scroll simulation
    const readTime = randomInt(
      config.timeOnPage.article.min,
      config.timeOnPage.article.max
    );
    console.log(`📖 Reading article for ${Math.round(readTime / 1000)}s...`);
    
    // Simulate reading with periodic scrolling
    const scrollChunks = 5;
    for (let i = 0; i < scrollChunks; i++) {
      await setTimeout(readTime / scrollChunks);
      await humanScroll(page);
      await humanMouseMovements(page);
    }
    
    // Visit internal links
    await visitInternalLinks(page, config);
    
    console.log('✅ Article read complete');
  } else {
    console.log('⚠️  No article found to read');
  }
}

// Main warm-up routine
async function runWarmup(options = {}) {
  const geo = options.geo || CONFIG.geo.default;
  const mode = options.mode || CONFIG.behavior.extractionMethod;
  
  console.log('🚀 Starting Advanced Warm-up Routine');
  console.log('📍 GEO:', geo);
  console.log('🎯 Mode:', mode);
  console.log('');

  const browser = await puppeteer.launch({
    headless: CONFIG.behavior.headless ?? false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport(CONFIG.browser?.viewport || { width: 1920, height: 1080 });
  await page.setUserAgent(CONFIG.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

  // Anti-detection
  if (CONFIG.antiDetection?.hideWebdriver) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });
  }

  try {
    // Step 1: Get trending keywords
    const trends = await getTrendingKeywords(page, geo);

    if (trends.length === 0) {
      console.log('⚠️  No trends found. Exiting.');
      return;
    }

    // Step 2: Process based on mode
    const keyword = trends[0];

    switch (mode) {
      case 'cpc':
        await cpcCookieMode(page, CONFIG);
        break;
        
      case 'pogoStick':
        await pogoStickMode(page, keyword, CONFIG);
        break;
        
      case 'full':
      default:
        if (CONFIG.behavior.runFullAutomation) {
          await fullAutomation(page, keyword, CONFIG);
        }
        
        if (CONFIG.pogoStick.enabled) {
          await pogoStickMode(page, keyword, CONFIG);
        }
        break;
    }

    console.log('\n✅ Warm-up routine completed successfully!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed.');
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--geo') options.geo = args[++i];
    if (args[i] === '--mode') options.mode = args[++i];
  }
  
  runWarmup(options).catch(console.error);
}

export { runWarmup };
