import puppeteer, { Browser, Page } from 'puppeteer';
import { Portal, SearchResult } from '../types';
import path from 'path';
import fs from 'fs';

export class SearchAutomation {
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

  async searchPortal(portal: Portal, query: string): Promise<SearchResult> {
    const browser = await this.init();
    const page = await browser.newPage();

    try {
      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Navigate to search URL
      const searchUrl = portal.search_url.replace('{query}', encodeURIComponent(query));
      console.log(`Searching ${portal.name}: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for brand mentions
      const pageContent = await page.content();
      const lowerContent = pageContent.toLowerCase();

      // Look for various forms of the brand name
      const brandVariations = [
        'mrkortingscode',
        'mr kortingscode',
        'mrkortingscode.nl',
        'mr-kortingscode'
      ];

      let found = false;
      let snippet = '';
      let resultUrl = '';

      for (const variation of brandVariations) {
        if (lowerContent.includes(variation.toLowerCase())) {
          found = true;
          break;
        }
      }

      // Extract snippet if found
      if (found) {
        const snippetMatch = pageContent.match(/.{0,200}(mrkortingscode|mr kortingscode).{0,200}/is);
        if (snippetMatch) {
          snippet = snippetMatch[0].replace(/\s+/g, ' ').trim();
          if (snippet.length > 150) {
            snippet = snippet.substring(0, 150) + '...';
          }
        }

        // Try to find result URL
        const urlMatch = pageContent.match(/href=["']([^"']*mrkortingscode[^"']*)["']/i);
        if (urlMatch) {
          resultUrl = urlMatch[1];
        }
      }

      // Take screenshot
      const timestamp = Date.now();
      const screenshotFilename = `${portal.id}-${query.replace(/\s+/g, '-')}-${timestamp}.png`;
      const screenshotPath = path.join(__dirname, '../../screenshots', screenshotFilename);

      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Calculate relevance score
      const relevanceScore = this.calculateRelevance(found, snippet, portal);

      const result: SearchResult = {
        portal_id: portal.id,
        portal_name: portal.name,
        query,
        found,
        snippet,
        result_url: resultUrl,
        screenshot: screenshotFilename,
        relevance_score: relevanceScore,
        validated: relevanceScore >= 5,
        searched_at: new Date().toISOString()
      };

      console.log(`✓ ${portal.name}: ${found ? 'FOUND' : 'NOT FOUND'} (score: ${relevanceScore})`);

      return result;

    } catch (error) {
      console.error(`Error searching ${portal.name}:`, error);
      return {
        portal_id: portal.id,
        portal_name: portal.name,
        query,
        found: false,
        relevance_score: 0,
        validated: false,
        searched_at: new Date().toISOString()
      };
    } finally {
      await page.close();
    }
  }

  async batchSearch(portals: Portal[], queries: string[]): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const browser = await this.init();

    console.log(`Starting batch search: ${portals.length} portals × ${queries.length} queries`);

    for (const portal of portals) {
      for (const query of queries) {
        try {
          const result = await this.searchPortal(portal, query);
          results.push(result);

          // Small delay between searches to be respectful
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error in batch search for ${portal.name} with query "${query}":`, error);
        }
      }
    }

    await this.close();
    console.log(`Batch search complete: ${results.length} results`);
    return results;
  }

  private calculateRelevance(found: boolean, snippet: string, portal: Portal): number {
    if (!found) return 0;

    let score = 5; // Base score for being found

    // Authority bonus
    if (portal.authority === 'very-high') score += 3;
    else if (portal.authority === 'high') score += 2;
    else if (portal.authority === 'medium') score += 1;

    // Snippet relevance
    if (snippet) {
      const relevantTerms = ['kortingscode', 'actie', 'korting', 'besparen', 'code', 'aanbieding'];
      const snippetLower = snippet.toLowerCase();

      for (const term of relevantTerms) {
        if (snippetLower.includes(term)) {
          score += 0.5;
        }
      }
    }

    // Portal type relevance
    if (['news', 'library', 'government', 'education'].includes(portal.type)) {
      score += 1;
    }

    return Math.min(10, Math.round(score * 10) / 10);
  }
}

export default new SearchAutomation();
