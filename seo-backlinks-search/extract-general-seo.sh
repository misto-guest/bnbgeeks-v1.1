#!/bin/bash
# Extract SEO/Backlink service search results using Serper.dev API
# General terms - excluding Dutch/coin specific content

set -e

API_KEY="e09ed258e1c8db784354868198bd915e1fb7181d"

# Use broad SEO/backlink search terms
QUERY="best backlinks service SEO indexing"

OUTPUT_DIR="/Users/northsea/clawd-dmitry/seo-backlinks-search"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to extract all paginated results
extract_all_pages() {
    local query="$1"
    local output_file="$2"
    local start=0
    local all_results="[]"
    local page=1
    local consecutive_empty=0
    
    echo "🔍 Fetching results for: $query"
    echo "---"
    
    while true; do
        # Fetch page of results
        local encoded_query=$(printf '%s' "$query" | jq -sRr '@uri')
        local url="https://google.serper.dev/search?q=${encoded_query}&start=${start}"
        
        echo "📄 Page $page (start=$start)..."
        
        local response=$(curl -s "$url" \
            -H "X-API-KEY: $API_KEY" \
            -H "Content-Type: application/json")
        
        # Extract organic search results (filter out ads)
        local page_results=$(echo "$response" | jq -r '
            if .organic == null then 
                []
            else 
                [.organic[] | select(.position != null) | select(.link != null)]
            end
        ')
        
        local count=$(echo "$page_results" | jq 'length')
        local current_total=$(echo "$all_results" | jq 'length')
        
        echo "  ✓ Found $count organic results (total so far: $current_total)"
        
        # Check if we got results
        if [ "$count" -eq 0 ]; then
            consecutive_empty=$((consecutive_empty + 1))
            echo "  ⚠️  No results on this page"
            
            # Stop if we get 2 consecutive empty pages
            if [ $consecutive_empty -ge 2 ]; then
                echo "  ⏹️  Stopping: consecutive empty pages"
                break
            fi
        else
            consecutive_empty=0
            
            # Append results to all_results
            all_results=$(echo "$all_results" "$page_results" | jq -s 'add')
        fi
        
        # Stop if we have enough results (target 50-100)
        current_total=$(echo "$all_results" | jq 'length')
        if [ "$current_total" -ge 80 ]; then
            echo "  ⏹️  Stopping: reached target of 80+ results"
            break
        fi
        
        # Stop if we've fetched enough pages (safety limit)
        if [ $page -ge 10 ]; then
            echo "  ⏹️  Stopping: reached max pages (10)"
            break
        fi
        
        # Move to next page (Serper uses start=0, 10, 20, 30...)
        start=$((start + 10))
        page=$((page + 1))
        
        # Small delay to avoid rate limiting
        sleep 0.5
    done
    
    # Save results with metadata
    local final_count=$(echo "$all_results" | jq 'length')
    echo "---"
    echo "✅ Total extracted: $final_count organic results"
    
    # Create final JSON with metadata
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
    
    echo "💾 Saved to: $output_file"
    echo ""
}

# Main execution
echo "=== SEO/Backlink Search Extraction ==="
echo ""

extract_all_pages "$QUERY" "$OUTPUT_DIR/seo-backlinks-results.json"

# Print summary
echo "=== EXTRACTION COMPLETE ==="
TOTAL=$(jq -r '.totalResults' "$OUTPUT_DIR/seo-backlinks-results.json")
echo "Query: $QUERY"
echo "Total results: $TOTAL"
echo "Output: $OUTPUT_DIR/seo-backlinks-results.json"
