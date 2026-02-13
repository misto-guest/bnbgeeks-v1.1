#!/usr/bin/env ts-node

/**
 * Serper.dev Search Extraction Script
 * Extracts search results using Serper.dev API for Dutch portal queries
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Serper.dev API configuration
const SERPER_API_URL = 'https://google.serper.dev/search';

// Get API key from environment variable or prompt for it
const SERPER_API_KEY = process.env.SERPER_API_KEY || '';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface SerperResponse {
  query: string;
  searchResults: SearchResult[];
  totalResults: number;
  responseData?: any;
}

/**
 * Extract search results using Serper.dev API
 */
async function extractWithSerper(query: string, numResults: number = 100): Promise<SerperResponse> {
  console.log(`\n🔍 Extracting results for: "${query}"`);
  console.log(`   Target: ${numResults} results`);

  if (!SERPER_API_KEY) {
    throw new Error('SERPER_API_KEY environment variable not set. Please set it before running this script.');
  }

  const allResults: SearchResult[] = [];
  let page = 1;

  // Serper.dev typically returns 10-20 results per request
  // We'll make multiple requests to get 100+ results
  while (allResults.length < numResults) {
    try {
      console.log(`   Fetching page ${page}...`);

      const response = await axios.post(
        SERPER_API_URL,
        {
          q: query,
          num: 20, // Request 20 results per page
          page: page
        },
        {
          headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        console.log(`   No more results available`);
        break;
      }

      const data = response.data;

      // Extract organic results
      if (data.organic && Array.isArray(data.organic)) {
        const results: SearchResult[] = data.organic.map((item: any, index: number) => ({
          title: item.title || '',
          link: item.link || '',
          snippet: item.snippet || '',
          position: allResults.length + index + 1
        }));

        allResults.push(...results);
        console.log(`   ✓ Retrieved ${results.length} results (total: ${allResults.length})`);
      }

      // Check if there are more results
      if (!data.organic || data.organic.length === 0) {
        console.log(`   No more results on page ${page}`);
        break;
      }

      page++;

      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`   ✗ Error on page ${page}:`, error.response?.data || error.message);
      break;
    }
  }

  return {
    query,
    searchResults: allResults,
    totalResults: allResults.length,
    responseData: response => response.data
  };
}

/**
 * Main extraction function
 */
async function main() {
  console.log('🚀 Serper.dev Search Extraction for Dutch Portals');
  console.log('='.repeat(60));

  // Check for API key
  if (!SERPER_API_KEY) {
    console.error('\n❌ Error: SERPER_API_KEY environment variable not set!');
    console.error('\nTo set up Serper.dev API:');
    console.error('1. Get your API key from https://serper.dev/');
    console.error('2. Set environment variable: export SERPER_API_KEY=your_key_here');
    console.error('3. Or add it to your .env file\n');
    process.exit(1);
  }

  console.log(`✓ API key found (length: ${SERPER_API_KEY.length})\n`);

  // Define queries to extract
  const queries = [
    "【 Coinsnight.com The Best Backlinks Indexer 】【 30% OFF code:Link2023 】,instant index google,back",
    "Best FC coins Site: Coinsnight.com NO"
  ];

  const results: SerperResponse[] = [];
  const outputDir = path.join(__dirname, '../data');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Extract results for each query
  for (const query of queries) {
    try {
      const result = await extractWithSerper(query, 100);
      results.push(result);

      // Save individual query results
      const filename = query
        .replace(/[^a-z0-9]/gi, '_')
        .substring(0, 50);
      const filepath = path.join(outputDir, `${filename}.json`);

      fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
      console.log(`   💾 Saved to: ${filepath}`);

    } catch (error: any) {
      console.error(`\n❌ Error extracting query "${query}":`, error.message);
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
    console.log(`  First result: ${result.searchResults[0]?.title || 'N/A'}`);
    console.log(`  Last result: ${result.searchResults[result.searchResults.length - 1]?.title || 'N/A'}`);
  });

  console.log('\n✅ Extraction complete!');
  console.log('\nNext steps:');
  console.log('1. Review the JSON files in /backend/data/');
  console.log('2. Update web app to load from JSON');
  console.log('3. Deploy to production');

}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { extractWithSerper, SerperResponse };
