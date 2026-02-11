import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import fs from 'fs';

interface Portal {
  id: string;
  name: string;
  base_url: string;
  search_url: string;
  type: string;
  authority: string;
  country: string;
}

interface ImprovedSearchResult {
  portal_id: string;
  portal_name: string;
  query: string;
  found: boolean;
  snippet: string;
  result_url: string;
  screenshot: string;
  relevance_score: number;
  validated: boolean;
  consent_handled: boolean;
  consent_type: string;
  results_count: number;
  searched_at: string;
}

export class ImprovedSearchAutomation {
  private browser: Browser | null = null;

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async handleConsentWall(page: Page): Promise<{ handled: boolean; type: string }> {
    // Try to handle common Dutch consent wall patterns
    const consentSelectors = [
      // DPG Media (AD, Volkskrant, Trouw, Parool)
      'button:has-text("Akkoord")',
      'button[onclick*="accept"]',
      'button[data-consent="accept"]',
      'button.accept-consent',

      // Generic Dutch consent buttons
      'button:has-text("Akkoord")',
      'button:has-text("Accepteer")',
      'button:has-text("Ik ga akkoord")',
      'button:has-text("Accepteren")',

      // Cookiebot
      '#CybotCookiebotDialogBodyButtonAccept',
      '.cookie-btn-accept',

      // Generic
      'button[class*="accept"]',
      'button[id*="accept"]',
      'a[class*="accept"]'
    ];

    for (const selector of consentSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector);
        console.log(`✓ Clicked consent button: ${selector}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for modal to close
        return { handled: true, type: 'consent_wall' };
      } catch (e) {
        // Selector not found, try next
      }
    }

    return { handled: false, type: 'none' };
  }

  private async handleCloudflare(page: Page): Promise<boolean> {
    try {
      // Check for Cloudflare challenge
      const cloudflareSelectors = [
        '.cf-browser-verification',
        'iframe[src*="cloudflare"]',
        'title:has-text("Just a moment")'
      ];

      for (const selector of cloudflareSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          console.log('⚠ Cloudflare challenge detected - waiting...');
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for auto-solve
          return true;
        } catch (e) {
          // Not found
        }
      }
    } catch (e) {
      // Error checking
    }

    return false;
  }

  private async countSearchResults(page: Page, brand: string): Promise<number> {
    try {
      // Look for actual search results containing the brand
      const resultSelectors = [
        '.search-result',
        '.search-result-item',
        'article',
        '.result',
        '[class*="result"]',
        '[class*="search-item"]'
      ];

      for (const selector of resultSelectors) {
        try {
          const results = await page.$$(selector);
          let count = 0;

          for (const result of results) {
            const text = await result.evaluate(el => el.textContent || '');
            if (text.toLowerCase().includes(brand.toLowerCase())) {
              count++;
            }
          }

          if (count > 0) {
            return count;
          }
        } catch (e) {
          // Selector error, try next
        }
      }

      // Fallback: check if brand appears in page content multiple times
      // (indicates it's in results, not just search field)
      const pageContent = await page.content();
      const matches = pageContent.toLowerCase().match(new RegExp(brand.toLowerCase(), 'g'));
      const matchCount = matches ? matches.length : 0;

      // If appears more than 3 times, likely in results
      return matchCount > 3 ? matchCount : 0;
    } catch (e) {
      return 0;
    }
  }

  async searchPortal(portal: Portal, query: string): Promise<ImprovedSearchResult> {
    const browser = await this.init();
    const page = await browser.newPage();

    try {
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Navigate to search URL
      const searchUrl = portal.search_url.replace('{query}', encodeURIComponent(query));
      console.log(`\n🔍 Searching ${portal.name}`);
      console.log(`   URL: ${searchUrl}`);

      const response = await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      if (!response) {
        throw new Error('No response from server');
      }

      // Handle Cloudflare if present
      const hasCloudflare = await this.handleCloudflare(page);
      if (hasCloudflare) {
        console.log('⚠ Cloudflare detected - may have blocked search');
      }

      // Handle consent wall if present
      const consentResult = await this.handleConsentWall(page);
      if (consentResult.handled) {
        console.log(`✓ Handled consent wall (${consentResult.type})`);
      }

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Count actual search results
      const resultsCount = await this.countSearchResults(page, query);
      console.log(`   Results found: ${resultsCount}`);

      // Only consider "found" if there are actual results
      const found = resultsCount > 0;

      // Extract snippet from actual results
      let snippet = '';
      let resultUrl = '';

      if (found) {
        try {
          // Try to get a snippet from search results
          const snippetSelectors = [
            '.search-result p',
            '.result-description',
            '[class*="snippet"]',
            '[class*="description"]'
          ];

          for (const selector of snippetSelectors) {
            try {
              const element = await page.$(selector);
              if (element) {
                const text = await element.evaluate(el => el.textContent || '');
                if (text.toLowerCase().includes(query.toLowerCase()) && text.length > 20) {
                  snippet = text.substring(0, 200) + '...';
                  break;
                }
              }
            } catch (e) {
              // Continue
            }
          }

          // Try to find result URL
          const urlMatch = await page.evaluate(() => {
            // @ts-ignore - DOM access in browser context
            const links = Array.from(document.querySelectorAll('a[href]'));
            // @ts-ignore - DOM access in browser context
            const resultLink = links.find((link: any) =>
              link.href && link.href.includes('mrkortingscode')
            );
            return resultLink ? (resultLink as any).href : '';
          });
          resultUrl = urlMatch;
        } catch (e) {
          console.log('⚠ Could not extract snippet/URL');
        }
      }

      // Take screenshot AFTER consent is handled
      const timestamp = Date.now();
      const screenshotFilename = `improved-${portal.id}-${query.replace(/\s+/g, '-')}-${timestamp}.png`;
      const screenshotPath = path.join(__dirname, '../../screenshots', screenshotFilename);

      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✓ Screenshot saved: ${screenshotFilename}`);

      // Calculate relevance score
      const relevanceScore = this.calculateRelevance(found, resultsCount, snippet, portal);

      const result: ImprovedSearchResult = {
        portal_id: portal.id,
        portal_name: portal.name,
        query,
        found,
        snippet,
        result_url: resultUrl,
        screenshot: screenshotFilename,
        relevance_score: relevanceScore,
        validated: relevanceScore >= 7, // Higher threshold for validation
        consent_handled: consentResult.handled,
        consent_type: consentResult.type,
        results_count: resultsCount,
        searched_at: new Date().toISOString()
      };

      console.log(`   Status: ${found ? '✓ FOUND' : '✗ NOT FOUND'} (score: ${relevanceScore})`);

      return result;

    } catch (error) {
      console.error(`✗ Error searching ${portal.name}:`, error);
      return {
        portal_id: portal.id,
        portal_name: portal.name,
        query,
        found: false,
        snippet: '',
        result_url: '',
        screenshot: '',
        relevance_score: 0,
        validated: false,
        consent_handled: false,
        consent_type: 'error',
        results_count: 0,
        searched_at: new Date().toISOString()
      };
    } finally {
      await page.close();
    }
  }

  async batchSearch(portals: Portal[], queries: string[]): Promise<ImprovedSearchResult[]> {
    const results: ImprovedSearchResult[] = [];

    console.log(`\n🚀 Starting IMPROVED batch search:`);
    console.log(`   Portals: ${portals.length}`);
    console.log(`   Queries: ${queries.length}`);
    console.log(`   Total searches: ${portals.length * queries.length}\n`);

    for (const portal of portals) {
      for (const query of queries) {
        try {
          const result = await this.searchPortal(portal, query);
          results.push(result);

          // Delay between searches to be respectful
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Error in batch search for ${portal.name}:`, error);
        }
      }
    }

    await this.close();
    console.log(`\n✓ Batch search complete: ${results.length} results`);
    console.log(`   Found: ${results.filter(r => r.found).length} positive results`);

    return results;
  }

  private calculateRelevance(found: boolean, resultsCount: number, snippet: string, portal: Portal): number {
    if (!found || resultsCount === 0) return 0;

    let score = 6; // Base score for being found in results

    // Results count bonus
    score += Math.min(resultsCount * 0.5, 2);

    // Authority bonus
    if (portal.authority === 'very-high') score += 1.5;
    else if (portal.authority === 'high') score += 1;
    else if (portal.authority === 'medium') score += 0.5;

    // Snippet relevance
    if (snippet && snippet.length > 50) {
      const relevantTerms = ['kortingscode', 'actie', 'korting', 'besparen', 'code', 'aanbieding'];
      const snippetLower = snippet.toLowerCase();

      for (const term of relevantTerms) {
        if (snippetLower.includes(term)) {
          score += 0.3;
        }
      }
    }

    return Math.min(10, Math.round(score * 10) / 10);
  }
}

export default new ImprovedSearchAutomation();
