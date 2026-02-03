import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

async function extractRealTrends() {
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

    // Wait for page to fully load
    await setTimeout(10000);

    console.log('🔍 Extracting trending topics using multiple methods...\n');

    const trends = await page.evaluate(() => {
      const results = [];
      
      // Method 1: Look for div elements with numeric rankings
      const allDivs = Array.from(document.querySelectorAll('div'));
      
      for (const div of allDivs) {
        const text = div.textContent?.trim();
        
        // Look for patterns like "1. Topic Name" or just topic names
        // Filter out UI elements, navigation, and very short/long text
        if (text && 
            text.length > 3 && 
            text.length < 80 &&
            !text.includes('Sign in') &&
            !text.includes('Google') &&
            !text.includes('Privacy') &&
            !text.includes('Terms') &&
            !text.includes('Settings') &&
            !text.includes('Help') &&
            !text.includes('Menu') &&
            !text.includes('Search') &&
            !text.includes('Explore') &&
            !text.includes('Year in Search') &&
            !text.includes('Subscribe') &&
            !text.includes('Main') &&
            !/^[\d\s]+$/.test(text)) {
          
          // Extract trending topics (remove ranking numbers if present)
          let cleaned = text
            .replace(/^\d+\.\s*/, '')  // Remove "1. " prefix
            .replace(/\s*Search\s*$/, '')  // Remove "Search" suffix
            .replace(/\s*related searches.*$/i, '')  // Remove "related searches"
            .trim();
          
          // Only add if it's meaningful and not already in results
          if (cleaned && 
              cleaned.length > 3 && 
              cleaned.length < 70 &&
              !results.includes(cleaned) &&
              !/^icon$/i.test(cleaned) &&
              !/button|menu|help|settings|search|explore|sign|privacy|terms/i.test(cleaned)) {
            results.push(cleaned);
          }
        }
      }
      
      // Method 2: Look for specific trending keywords in page content
      const pageText = document.body.innerText;
      const lines = pageText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      
      for (const line of lines) {
        if (line.length > 3 && 
            line.length < 80 &&
            !line.includes('Sign in') &&
            !line.includes('Google') &&
            !line.includes('Privacy') &&
            !line.includes('Terms') &&
            !line.includes('Help') &&
            !line.includes('Menu') &&
            !/^\d+$/.test(line) &&
            !results.includes(line) &&
            !/button|icon|search|settings|explore|subscribe/i.test(line)) {
          
          if (!results.includes(line)) {
            results.push(line);
          }
        }
        
        if (results.length >= 20) break;
      }
      
      return results.slice(0, 15);
    });

    // Filter and display results
    const filteredTrends = trends.filter(t => 
      t.length > 3 && 
      t.length < 80 &&
      !/^(home|back|menu|help|search|settings|sign|privacy|terms|explore|main|subscribe|year|calendar)$/i.test(t)
    ).slice(0, 10);

    if (filteredTrends.length > 0) {
      console.log('✅ TRENDING NOW (United States) - Real Data:\n');
      filteredTrends.forEach((trend, i) => {
        console.log(`   ${i + 1}. ${trend}`);
      });
      
      console.log('\n📊 Searching Google News for top trend...\n');
      const topTrend = filteredTrends[0];
      
      await page.goto(`https://news.google.com/search?q=${encodeURIComponent(topTrend)}`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });

      await setTimeout(5000);
      console.log(`✅ Opened Google News for: "${topTrend}"`);
      console.log('\n⏳ Browser will stay open for 20 seconds for manual inspection...');
      await setTimeout(20000);
      
    } else {
      console.log('⚠️  Could not extract trending topics from page');
      console.log('💡 Using fallback trending topics based on current events:\n');
      
      const fallbackTrends = [
        'Super Bowl LX',
        'Donald Trump',
        'Election 2024',
        'Artificial Intelligence',
        'Climate Change',
        'Economy Update',
        'Sports News',
        'Technology',
        'Entertainment',
        'World News'
      ];
      
      fallbackTrends.forEach((trend, i) => {
        console.log(`${i + 1}. ${trend}`);
      });
      
      console.log('\n📊 Searching Google News for top trend...\n');
      await page.goto(`https://news.google.com/search?q=${encodeURIComponent(fallbackTrends[0])}`, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });
      
      await setTimeout(5000);
      console.log(`✅ Opened Google News for: "${fallbackTrends[0]}"`);
      console.log('\n⏳ Browser will stay open for 20 seconds for manual inspection...');
      await setTimeout(20000);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n👋 Browser closed.');
  }
}

extractRealTrends().catch(console.error);
