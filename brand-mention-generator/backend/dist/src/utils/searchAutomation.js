"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchAutomation = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
class SearchAutomation {
    constructor() {
        this.browser = null;
    }
    async init() {
        if (!this.browser) {
            this.browser = await puppeteer_1.default.launch({
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
    async searchPortal(portal, query) {
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
            const screenshotPath = path_1.default.join(__dirname, '../../screenshots', screenshotFilename);
            await page.screenshot({ path: screenshotPath, fullPage: false });
            // Calculate relevance score
            const relevanceScore = this.calculateRelevance(found, snippet, portal);
            const result = {
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
        }
        catch (error) {
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
        }
        finally {
            await page.close();
        }
    }
    async batchSearch(portals, queries) {
        const results = [];
        const browser = await this.init();
        console.log(`Starting batch search: ${portals.length} portals × ${queries.length} queries`);
        for (const portal of portals) {
            for (const query of queries) {
                try {
                    const result = await this.searchPortal(portal, query);
                    results.push(result);
                    // Small delay between searches to be respectful
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                catch (error) {
                    console.error(`Error in batch search for ${portal.name} with query "${query}":`, error);
                }
            }
        }
        await this.close();
        console.log(`Batch search complete: ${results.length} results`);
        return results;
    }
    calculateRelevance(found, snippet, portal) {
        if (!found)
            return 0;
        let score = 5; // Base score for being found
        // Authority bonus
        if (portal.authority === 'very-high')
            score += 3;
        else if (portal.authority === 'high')
            score += 2;
        else if (portal.authority === 'medium')
            score += 1;
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
exports.SearchAutomation = SearchAutomation;
exports.default = new SearchAutomation();
