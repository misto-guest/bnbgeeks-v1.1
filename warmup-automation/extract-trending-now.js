import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

async function extractTrendingNow() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  try {
    console.log('📊 Loading Google Trends "Trending Now" for US...\n');
    
    await page.goto('https://trends.google.com/trending?geo=US', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for page to load
    await setTimeout(8000);

    console.log('🔍 Extracting trending topics...\n');

    // Try multiple strategies to find trending topics
    const trends = await page.evaluate(() => {
      const results = [];
      
      // Strategy 1: Look for specific trending elements
      const selectors = [
        'div[aria-label*="trending" i]',
        '[data-module="TrendingSearches"]',
        'feed-item',
        '.trending-search-item',
        '[class*="trending"]',
        'div[role="listitem"]',
        'a[href*="trends"]'
      ];

      for (const selector of selectors) {
        try {
          const items = document.querySelectorAll(selector);
          
          if (items.length > 0) {
            console.log(`Found ${items.length} items with selector: ${selector}`);
            
            for (const item of items) {
              const text = item.textContent?.trim();
              
              if (text && 
                  text.length > 2 && 
                  text.length < 100 &&
                  !text.includes('Sign in') &&
                  !text.includes('Google') &&
                  !text.includes('Search') &&
                  !text.includes('Explore') &&
                  !text.includes('Year in Search') &&
                  !/^\d+$/.test(text)) {
                
                let cleaned = text
                  .replace(/^\d+\.\s*/, '')
                  .replace(/\s*related searches.*$/i, '')
                  .replace(/\s*Search\s*$/, '')
                  .trim();
                
                if (cleaned && cleaned.length > 2 && !results.includes(cleaned)) {
                  results.push(cleaned);
                }
              }
            }
            
            if (results.length >= 10) break;
          }
        } catch (e) {
          // Selector failed, try next
        }
      }
      
      // Strategy 2: Look for any text that looks like a trending topic
      if (results.length < 5) {
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
          const href = link.getAttribute('href') || '';
          const text = link.textContent?.trim();
          
          // Look for links to trend pages
          if (href.includes('/trends') && 
              text && 
              text.length > 2 && 
              text.length < 80 &&
              !text.includes('Sign in') &&
              !text.includes('Explore')) {
            
            const cleaned = text.replace(/^\d+\.\s*/, '').trim();
            if (cleaned && !results.includes(cleaned)) {
              results.push(cleaned);
            }
          }
          
          if (results.length >= 10) break;
        }
      }
      
      return results.slice(0, 10);
    });

    if (trends.length > 0) {
      console.log('✅ TRENDING NOW (United States):\n');
      trends.forEach((trend, i) => {
        console.log(`   ${i + 1}. ${trend}`);
      });
      console.log('');
      console.log('📊 Opening Google News to search for top trend...');
      
      // Now search for the top trend on Google News
      const topTrend = trends[0];
      await page.goto(`https://news.google.com/search?q=${encodeURIComponent(topTrend)}`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });

      await setTimeout(5000);
      console.log(`\n✅ Searched for: "${topTrend}"`);
      console.log('📰 News page is now open in your browser');
      console.log('\n⏳ Browser will stay open for 30 seconds for manual inspection...');
      
      await setTimeout(30000);
      
    } else {
      console.log('⚠️  Could not extract trending topics');
      console.log('💡 Fallback - Using known trending topics:\n');
      const fallbackTrends = [
        'Super Bowl LX',
        'Donald Trump',
        'Election 2024',
        'Artificial Intelligence',
        'Climate Change',
        'Economy',
        'Sports News',
        'Technology',
        'Entertainment',
        'World News'
      ];
      fallbackTrends.forEach((trend, i) => {
        console.log(`${i + 1}. ${trend}`);
      });
      
      // Search for first fallback
      await page.goto(`https://news.google.com/search?q=${encodeURIComponent(fallbackTrends[0])}`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });
      console.log(`\n📰 Searching for: ${fallbackTrends[0]}`);
      await setTimeout(30000);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed.');
  }
}

extractTrendingNow().catch(console.error);
