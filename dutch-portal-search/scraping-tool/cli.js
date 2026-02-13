#!/usr/bin/env node

/**
 * Dutch Portal Search Scraping Tool - CLI
 * Scrapes Google SERPs using Serper.dev API
 * 
 * Usage:
 *   node cli.js "your search query" [--pages 1] [--format copy|json]
 *   node cli.js --url "https://google.com/search?q=your+query" [--pages 1]
 */

const https = require('https');

// Configuration
const API_KEY = 'e09ed258e1c8db784354868198bd915e1fb7181d';
const API_ENDPOINT = 'google.serper.dev';
const RATE_LIMIT_DELAY = 100; // ms between requests (respects 2,500/month limit)

// State tracking
let totalResultsFound = 0;
let totalPagesFetched = 0;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    query: '',
    pages: 1,
    format: 'copy', // 'copy' or 'json'
    fromUrl: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--url' && args[i + 1]) {
      config.fromUrl = true;
      config.query = extractQueryFromURL(args[i + 1]);
      i++;
    } else if (arg === '--pages' && args[i + 1]) {
      config.pages = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--format' && args[i + 1]) {
      config.format = args[i + 1];
      i++;
    } else if (!arg.startsWith('--') && !config.query) {
      config.query = arg;
    }
  }

  if (!config.query) {
    console.error('❌ Error: No query provided\n');
    printUsage();
    process.exit(1);
  }

  return config;
}

/**
 * Extract search query from Google URL
 */
function extractQueryFromURL(url) {
  try {
    // Parse URL to extract 'q' parameter
    const urlObj = new URL(url);
    return urlObj.searchParams.get('q') || '';
  } catch (error) {
    console.error('❌ Invalid URL provided');
    process.exit(1);
  }
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
Dutch Portal Search Scraping Tool
=================================

Usage:
  node cli.js "your search query" [--pages N] [--format copy|json]
  node cli.js --url "https://google.com/search?q=your+query" [--pages N]

Options:
  --url        Extract query from Google URL
  --pages N    Number of pages to scrape (default: 1)
  --format     Output format: copy (default) or json

Examples:
  node cli.js "Coinsnight.com backlinks"
  node cli.js --url "https://google.com/search?q=best+crypto+site" --pages 3
  node cli.js "Dutch SEO" --pages 5 --format json

Output:
  Copy format: Human-readable, easy to paste
  JSON format: Machine-readable for further processing
  `);
}

/**
 * Make API request to Serper.dev
 */
function fetchPage(query, pageNum) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      q: query,
      page: pageNum.toString()
    });

    const options = {
      hostname: API_ENDPOINT,
      path: `/search?${params.toString()}`,
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    logProgress(`Fetching page ${pageNum}...`);

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });

    req.end();
  });
}

/**
 * Extract organic results from API response
 */
function extractOrganicResults(data) {
  if (!data.organic) {
    return [];
  }
  
  return data.organic.map(result => ({
    title: result.title || '',
    link: result.link || '',
    snippet: result.snippet || '',
    position: result.position || 0
  }));
}

/**
 * Format results for copy-paste
 */
function formatCopyOutput(query, results) {
  let output = `Query: ${query}\n`;
  output += `Total Results: ${totalResultsFound}\n`;
  output += `${'='.repeat(50)}\n\n`;

  results.forEach((pageResults, pageNum) => {
    if (pageResults.length > 0) {
      output += `[Page ${pageNum + 1}]\n\n`;
      
      pageResults.forEach((result, idx) => {
        output += `${idx + 1}. ${result.title}\n`;
        output += `   Link: ${result.link}\n`;
        output += `   Snippet: ${result.snippet}\n\n`;
      });
    }
  });

  return output;
}

/**
 * Format results as JSON
 */
function formatJsonOutput(query, allResults) {
  return JSON.stringify({
    query,
    totalResults: totalResultsFound,
    timestamp: new Date().toISOString(),
    results: allResults.flat()
  }, null, 2);
}

/**
 * Log progress to console
 */
function logProgress(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

/**
 * Sleep/delay for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main scraping function
 */
async function scrape(config) {
  const allResults = [];
  
  console.log('\n🔍 Starting search...');
  console.log(`   Query: "${config.query}"`);
  console.log(`   Pages: ${config.pages}\n`);

  try {
    for (let page = 1; page <= config.pages; page++) {
      // Rate limiting delay (except for first request)
      if (page > 1) {
        await sleep(RATE_LIMIT_DELAY);
      }

      const data = await fetchPage(config.query, page);
      const organicResults = extractOrganicResults(data);
      
      allResults.push(organicResults);
      totalPagesFetched++;
      totalResultsFound += organicResults.length;

      logProgress(`✓ Page ${page} complete (${organicResults.length} results)`);

      // Check if there are no more results
      if (organicResults.length === 0) {
        logProgress(`⚠ No more results found after page ${page}`);
        break;
      }
    }

    // Generate output
    console.log('\n📊 Results Summary:');
    console.log(`   Pages fetched: ${totalPagesFetched}`);
    console.log(`   Total results: ${totalResultsFound}\n`);

    if (config.format === 'json') {
      console.log(formatJsonOutput(config.query, allResults));
    } else {
      console.log(formatCopyOutput(config.query, allResults));
      console.log(`${'='.repeat(50)}`);
      console.log(`\n✅ Scraping complete! ${totalResultsFound} results ready to copy.\n`);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
function main() {
  const config = parseArgs();
  scrape(config);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scrape, extractOrganicResults, formatCopyOutput };
