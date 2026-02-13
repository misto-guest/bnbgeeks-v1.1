const fs = require('fs');

// Read the filtered results
const data = JSON.parse(fs.readFileSync('seo-backlinks-filtered.json', 'utf8'));

// Deduplicate by link URL
const seen = new Set();
const uniqueResults = [];

for (const result of data.results) {
  if (!seen.has(result.link)) {
    seen.add(result.link);
    uniqueResults.push(result);
  }
}

// Sort by position
uniqueResults.sort((a, b) => a.position - b.position);

// Reassign positions 1-N
uniqueResults.forEach((result, index) => {
  result.position = index + 1;
});

const output = {
  query: data.query,
  totalResults: uniqueResults.length,
  results: uniqueResults
};

fs.writeFileSync('seo-backlinks-final.json', JSON.stringify(output, null, 2));

console.log(`✅ Deduplicated: ${data.totalResults} → ${uniqueResults.length} unique results`);
console.log(`   Removed: ${data.totalResults - uniqueResults.length} duplicates`);
