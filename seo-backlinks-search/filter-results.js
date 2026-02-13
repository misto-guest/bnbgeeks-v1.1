const fs = require('fs');

// Read the results
const data = JSON.parse(fs.readFileSync('seo-backlinks-results.json', 'utf8'));

// Filter keywords
const excludeKeywords = [
  // Dutch sites
  'alkmaar', 'marktplaats', 'nl', '.nl/', 'dutch', 'netherlands',
  // Coin/crypto
  'coin', 'crypto', 'bitcoin', 'btc', 'ethereum',
  // Gambling/casino
  'casino', 'gambling', 'bet', 'poker', 'slots',
  // Price comparison
  'price comparison', 'compare prices', 'bestekoop',
  // Unwanted patterns
  'coinsnight'
];

function shouldExclude(result) {
  const text = `${result.title} ${result.snippet} ${result.link}`.toLowerCase();
  return excludeKeywords.some(keyword => text.includes(keyword));
}

// Filter results
const filteredResults = data.results.filter(result => !shouldExclude(result));

// Create filtered output
const output = {
  query: data.query,
  totalResults: filteredResults.length,
  results: filteredResults
};

// Save filtered results
fs.writeFileSync('seo-backlinks-filtered.json', JSON.stringify(output, null, 2));

console.log(`✅ Filtered ${data.totalResults} → ${filteredResults.length} results`);
console.log(`   Removed: ${data.totalResults - filteredResults.length} unwanted results`);
