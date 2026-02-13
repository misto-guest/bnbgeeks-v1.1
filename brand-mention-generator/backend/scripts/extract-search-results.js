#!/usr/bin/env node

/**
 * Real Web Scraping Script for Google Search Results
 * Extracts search results from Google when Serper.dev API is not available
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Extract search results using web scraping (Google search)
 */
async function extractViaWebScraping(query, numResults = 100) {
  console.log(`\n🔍 Extracting results for: "${query}"`);
  console.log(`   Method: Web scraping (Google)`);
  console.log(`   Target: ${numResults} results`);

  const allResults = [];
  let page = 0;

  // Google typically shows 10 results per page
  const resultsPerPage = 10;
  const maxPages = Math.ceil(numResults / resultsPerPage);

  while (page < maxPages) {
    try {
      const start = page * resultsPerPage;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${start}&num=${resultsPerPage}`;

      console.log(`   Fetching page ${page + 1} (start: ${start})...`);

      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 10000
      });

      // Parse HTML
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Extract search results
      const resultElements = document.querySelectorAll('.g, .tF2Cxc, div[data-hveid]');

      if (resultElements.length === 0) {
        console.log(`   No results found on page ${page + 1}`);
        break;
      }

      const pageResults = [];

      resultElements.forEach((element, index) => {
        try {
          const titleElement = element.querySelector('h3, .DKV0Md, .VwiC3b');
          const linkElement = element.querySelector('a');
          const snippetElement = element.querySelector('.VwiC3b, .s3v9rd, .yXK7lf');

          if (titleElement || linkElement) {
            const title = titleElement ? titleElement.textContent.trim() : '';
            const link = linkElement ? linkElement.href : '';
            const snippet = snippetElement ? snippetElement.textContent.trim() : '';

            if (title && link) {
              pageResults.push({
                title,
                link,
                snippet,
                position: allResults.length + pageResults.length + 1
              });
            }
          }
        } catch (e) {
          // Skip this element if there's an error
        }
      });

      if (pageResults.length > 0) {
        allResults.push(...pageResults);
        console.log(`   ✓ Retrieved ${pageResults.length} results (total: ${allResults.length})`);
      } else {
        console.log(`   No valid results extracted from page ${page + 1}`);
        break;
      }

      page++;

      // Add delay to avoid being blocked
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    } catch (error) {
      console.error(`   ✗ Error on page ${page + 1}:`, error.message);

      // If we got blocked, stop here
      if (error.response?.status === 429) {
        console.log('   ⚠️  Rate limited by Google. Waiting...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        continue;
      }

      break;
    }
  }

  return {
    query,
    searchResults: allResults,
    totalResults: allResults.length,
    extractedAt: new Date().toISOString(),
    method: 'web_scraping'
  };
}

/**
 * Main extraction function using web scraping
 */
async function main() {
  console.log('🚀 Google Search Web Scraping for Dutch Portals');
  console.log('='.repeat(60));
  console.log('⚠️  Note: Web scraping may be unreliable and can be blocked by Google.');
  console.log('   For production use, consider using Serper.dev API instead.\n');

  // Define queries to extract
  const queries = [
    "【 Coinsnight.com The Best Backlinks Indexer 】【 30% OFF code:Link2023 】,instant index google,back",
    "Best FC coins Site: Coinsnight.com NO"
  ];

  const results = [];
  const outputDir = path.join(__dirname, '../data');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if jsdom is installed
  try {
    require('jsdom');
  } catch (e) {
    console.error('❌ Error: jsdom is not installed!');
    console.error('Please install it with: npm install jsdom');
    process.exit(1);
  }

  // Extract results for each query
  for (const query of queries) {
    try {
      const result = await extractViaWebScraping(query, 100);
      results.push(result);

      // Save individual query results
      const filename = query
        .replace(/[^a-z0-9]/gi, '_')
        .substring(0, 50);
      const filepath = path.join(outputDir, `${filename}.json`);

      fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
      console.log(`   💾 Saved to: ${filepath}`);

    } catch (error) {
      console.error(`\n❌ Error extracting query "${query}":`, error.message);

      // Add error result
      results.push({
        query,
        searchResults: [],
        totalResults: 0,
        extractedAt: new Date().toISOString(),
        method: 'web_scraping',
        error: error.message
      });
    }
  }

  // Save combined results
  const combinedPath = path.join(outputDir, 'dutch-portals-search-results.json');
  fs.writeFileSync(combinedPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Combined results saved to: ${combinedPath}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 EXTRACTION SUMMARY');
  console.log('='.repeat(60));

  results.forEach((result, index) => {
    console.log(`\nQuery ${index + 1}: "${result.query}"`);
    console.log(`  Results extracted: ${result.totalResults}`);
    if (result.searchResults.length > 0) {
      console.log(`  First result: ${result.searchResults[0]?.title || 'N/A'}`);
      console.log(`  Last result: ${result.searchResults[result.searchResults.length - 1]?.title || 'N/A'}`);
    }
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  });

  const totalResults = results.reduce((sum, r) => sum + r.totalResults, 0);
  console.log(`\n📈 Total results extracted: ${totalResults}`);

  console.log('\n✅ Extraction complete!');
  console.log('\nRecommendations:');
  console.log('1. For production: Use Serper.dev API (more reliable)');
  console.log('2. Review the JSON files in /backend/data/');
  console.log('3. Update web app to load from JSON');
  console.log('4. Deploy to production');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { extractViaWebScraping };
