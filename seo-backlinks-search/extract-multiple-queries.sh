#!/bin/bash
# Extract SEO/Backlink service search results with multiple queries

set -e

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"
OUTPUT_DIR="/Users/northsea/clawd-dmitry/seo-backlinks-search"

# Multiple search queries for variety
QUERIES=(
  "seo link building services"
  "backlink indexer tools"
  "guest posting services SEO"
  "blogger outreach link building"
  "white hat backlinks service"
)

mkdir -p "$OUTPUT_DIR"

# Function to extract paginated results for a single query
extract_query() {
    local query="$1"
    local output_file="$2"
    local start=0
    local all_results="[]"
    local page=1
    
    echo "🔍 Query: $query"
    
    while [ $page -le 5 ]; do
        local encoded_query=$(printf '%s' "$query" | jq -sRr '@uri')
        local url="https://google.serper.dev/search?q=${encoded_query}&start=${start}"
        
        echo "  Page $page..."
        
        local response=$(curl -s "$url" \
            -H "X-API-KEY: $API_KEY" \
            -H "Content-Type: application/json")
        
        local page_results=$(echo "$response" | jq -r '
            if .organic == null then 
                []
            else 
                [.organic[] | select(.position != null) | select(.link != null)]
            end
        ')
        
        local count=$(echo "$page_results" | jq 'length')
        
        if [ "$count" -eq 0 ]; then
            echo "  No more results"
            break
        fi
        
        all_results=$(echo "$all_results" "$page_results" | jq -s 'add')
        
        start=$((start + 10))
        page=$((page + 1))
        sleep 0.5
    done
    
    # Save with metadata
    local final_count=$(echo "$all_results" | jq 'length')
    jq -n \
        --arg query "$query" \
        --argjson results "$all_results" \
        --argjson total "$final_count" \
        '{
            query: $query,
            totalResults: $total,
            results: [$results[] | {
                position: .position,
                title: .title,
                link: .link,
                snippet: .snippet,
                url: .link,
                domain: (.link | match("^https?://([^/]+)") | .captures[0].string // .link)
            }]
        }' > "$output_file"
    
    echo "  ✓ Total: $final_count results"
}

echo "=== SEO/Backlink Multi-Query Extraction ==="
echo ""

# Extract each query
for i in "${!QUERIES[@]}"; do
    extract_query "${QUERIES[$i]}" "$OUTPUT_DIR/query-$((i+1)).json"
    echo ""
done

# Merge all results
echo "=== Merging Results ==="
node << 'EOF'
const fs = require('fs');
const path = require('path');

const outputDir = '/Users/northsea/clawd-dmitry/seo-backlinks-search';
const allResults = [];
const seen = new Set();

// Read all query files
for (let i = 1; i <= 5; i++) {
  const file = path.join(outputDir, `query-${i}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.results.forEach(result => {
      if (!seen.has(result.link)) {
        seen.add(result.link);
        allResults.push(result);
      }
    });
  }
}

// Sort by position and reassign
allResults.sort((a, b) => a.position - b.position);
allResults.forEach((result, index) => {
  result.position = index + 1;
});

const final = {
  query: "Multiple SEO/Backlink Queries",
  totalResults: allResults.length,
  queries: [
    "seo link building services",
    "backlink indexer tools",
    "guest posting services SEO",
    "blogger outreach link building",
    "white hat backlinks service"
  ],
  results: allResults
};

fs.writeFileSync(path.join(outputDir, 'all-results.json'), JSON.stringify(final, null, 2));
console.log(`✅ Merged: ${allResults.length} unique results`);
EOF

echo ""
echo "=== COMPLETE ==="
echo "All results saved to: $OUTPUT_DIR/all-results.json"
